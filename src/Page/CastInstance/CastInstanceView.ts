import AbstractServiceView, { OnViewLoad } from "../../Base/Common/AbstractServiceView";
import GMapsUtil, { MapPos } from "../../Base/Util/GMapsUtil";
import StdUtil from "../../Base/Util/StdUtil";
import StreamUtil, { MobileCam } from "../../Base/Util/StreamUtil";

import CastInstanceController from "./CastInstanceController";
import { MapLocationSender } from "../HomeInstance/HomeInstanceContainer";
import SWRoomController from "../../Base/Common/Connect/SWRoomController";
import LinkUtil from "../../Base/Util/LinkUtil";
import SWPeer from "../../Base/Common/Connect/SWPeer";

export default class CastInstanceView extends AbstractServiceView<CastInstanceController> {

    private _isAudioInit = false;
    private _preVolumeValue: string = "70";
    private static _mediaStream: MediaStream = null;
    private _audioContext: AudioContext = null;
    private _mediaStreamNode: MediaStreamAudioSourceNode = null;
    private _gainNode: GainNode = null;

    /**
     * 初期化処理
     */
    public Initialize(callback: OnViewLoad) {

        (window as any).AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
        StdUtil.StopPropagation();
        StdUtil.StopTouchmove();

        let audioElement = document.getElementById('audio') as HTMLAudioElement;
        let startBotton = document.getElementById('sbj-cast-instance-start') as HTMLInputElement;
        let stopBotton = document.getElementById('sbj-cast-instance-stop');
        let camchangeBotton = document.getElementById('sbj-camchange') as HTMLInputElement;
        let volumeOn = document.getElementById("sbj-volume-button-on");
        let volumeOff = document.getElementById("sbj-volume-button-off");
        let sliderDiv = document.getElementById("sbj-volume");
        let volumeSlider = document.getElementById("sbj-volume-slider") as HTMLInputElement;

        //  ストリーミング開始ボタン
        startBotton.onclick = (e) => {
            this.Controller.StartStreaming();
            this.LocationPolling();
            startBotton.hidden = true;
            stopBotton.hidden = false;
            camchangeBotton.hidden = true;
            volumeOff.hidden = false;
            sliderDiv.hidden = false;
        }

        //  ストリーミング停止ボタン
        stopBotton.onclick = (e) => {

            this.Controller.StopStreaming();
            //  ページごと閉じてしまう。
            this.PageClose();
        };

        let isSafari = StdUtil.IsSafari();
        let isInit = false;

        //  ミュート状態解除
        volumeOff.onclick = (e) => {
            volumeOn.hidden = false;
            volumeOff.hidden = true;
            this.SetMute(false, isSafari);
        }

        //  ミュートにする
        volumeOn.onclick = (e) => {
            volumeOn.hidden = true;
            volumeOff.hidden = false;
            this.SetMute(true, isSafari);
        }

        //  音量調整
        volumeSlider.oninput = (e) => {
            let volumeStr = volumeSlider.value;

            let isMute = (volumeStr === "0");
            volumeOn.hidden = isMute;
            volumeOff.hidden = !isMute;

            this.SetVolume(volumeStr, isSafari);
        }

        let cam = MobileCam.REAR;

        //  プレビュー表示処理
        let startPreviewFunc = (cam: MobileCam) => {
            setTimeout(() => {
                this.SetStreamPreview(cam, () => {
                    camchangeBotton.disabled = false;
                    startBotton.disabled = false;
                });
            }, 200);
        }

        //  カメラ変更ボタン
        camchangeBotton.onclick = (e) => {
            camchangeBotton.disabled = true;
            startBotton.disabled = true;
            setTimeout(() => {
                this.StopStreamPreview();
                //  リアとフロントのカメラを切替えプレビュー表示
                cam = (cam === MobileCam.REAR ? MobileCam.FRONT : MobileCam.REAR);
                startPreviewFunc(cam);
            }, 200);
        };

        //  起動時はリアカメラでプレビュー表示する
        startPreviewFunc(MobileCam.REAR);

        callback();
    }


    /**
     * ページごと閉じる
     */
    public PageClose() {
        window.open('about:blank', '_self').close();
    }


    /**
     * ボリューム設定
     * @param volume 
     * @param isSafari 
     */
    private SetVolume(volumeStr: string, isSafari: boolean) {

        let volume = (Number.parseInt(volumeStr) / 100.0);

        if (!this._isAudioInit && volume > 0) {
            this.InitilizeAudio(isSafari);
            this._isAudioInit = true;
        }

        if (isSafari) {
            this._gainNode.gain.value = volume;
        }
        else {
            (document.getElementById('audio') as HTMLAudioElement).volume = volume;
        }
    }


    /**
     * 
     * @param isMute 
     * @param isSafari 
     */
    private SetMute(isMute: boolean, isSafari: boolean) {
        let slider = document.getElementById("sbj-volume-slider") as HTMLInputElement;
        if (isMute) {
            this._preVolumeValue = slider.value;
            slider.value = "0";
        }
        else {
            slider.value = this._preVolumeValue;
        }
        this.SetVolume(slider.value, isSafari);
    }


    /**
     * 
     * @param isSafari 
     */
    private InitilizeAudio(isSafari: boolean) {
        if (isSafari) {
            this.SetStream_WebAudio();
        }
        else {
            let audioElement = document.getElementById('audio') as HTMLAudioElement;
            this.SetStream_AudioElement(audioElement);
        }
    }

    /**
     * 
     * @param audioElement 
     */
    private SetStream_AudioElement(audioElement: HTMLAudioElement) {
        audioElement.volume = 0;
        audioElement.srcObject = CastInstanceView._mediaStream;
        audioElement.play();
    }


    /**
     * 
     * @param isMute 
     */
    private SetStream_WebAudio() {

        if (CastInstanceView._mediaStream) {
            this._audioContext = new AudioContext();
            this._mediaStreamNode = this._audioContext.createMediaStreamSource(CastInstanceView._mediaStream);
            this._gainNode = this._audioContext.createGain();
            this._mediaStreamNode.connect(this._gainNode);
            this._gainNode.gain.value = 0;
            this._gainNode.connect(this._audioContext.destination);
        }
    }



    public StopStreamPreview() {

        let videoElement = document.getElementById('video-preview') as HTMLVideoElement;
        if (videoElement) videoElement.srcObject = null;

        if (this.Controller.Stream) {
            StreamUtil.Stop(this.Controller.Stream);
        }
    }


    /**
     * Video/Audioソースの取得とリストへのセット
     */
    public SetStreamPreview(cam: MobileCam, callback) {

        let controller = this.Controller;
        let videoElement = document.getElementById('video-preview') as HTMLVideoElement;
        let msc = StreamUtil.GetMediaStreamConstraints_Mobile(cam, true);

        StreamUtil.GetStreaming(msc, (stream) => {

            controller.Stream = stream;

            if (stream === null) {
                this.StreamErrorClose();
                return;
            }

            //  ストリームの取得に成功した後にPeer接続を開始する
            controller.InitilizePeer(() => {
                if (stream && videoElement) {
                    videoElement.onplaying = (e) => { callback(); }
                    StreamUtil.StartPreview(videoElement, stream);
                }
                else {
                    callback();
                }
            });

        });
    }


    /**
     * 他のユーザーからのストリーム接続時イベント
     * @param peerid 
     */
    public SetMediaStream(peerid: string, stream: MediaStream, isAlive: boolean) {
        CastInstanceView._mediaStream = stream;

        let videoRecv = document.getElementById('video-receiver') as HTMLVideoElement;
        videoRecv.srcObject = stream;

        (document.getElementById("sbj-volume-button-on") as HTMLInputElement).disabled = false;
        (document.getElementById("sbj-volume-button-off") as HTMLInputElement).disabled = false;
        (document.getElementById("sbj-volume-slider") as HTMLInputElement).disabled = false;
    }


    /**
     * 位置情報を1秒毎に送る。
     */
    public LocationPolling() {

        let controller = this.Controller;
        let pre = new MapPos();

        //  1秒毎に緯度経度を取得し、差異があれば送信
        setInterval(() => {
            GMapsUtil.GetLocate((gpos) => {
                if (pre.latitude !== gpos.latitude || pre.longitude !== gpos.longitude) {
                    let sender = new MapLocationSender();
                    sender.Location = gpos;
                    controller.SwPeer.SendToOwner(sender);
                    pre = gpos;
                }
            });
        }, 1000);
    }


    /**
     * エラーメッセージを表示します
     * @param message 
     */
    public SetError(message: string) {

        document.getElementById('sbj-cast-instance-main').hidden = true;

        let disconnect = document.getElementById('sbj-cast-instance-disconnect');

        if (disconnect) {
            disconnect.hidden = false;
            let errorEelement = document.getElementById('error-message');
            errorEelement.innerText = message;
        }

    }


    /**
     * ストリームが取得できなかった場合、メッセージ表示して終了する
     */
    public StreamErrorClose() {
        document.getElementById('video-preview').hidden = true;
        document.getElementById('video-receiver').hidden = true;
        document.getElementById('sbj-cast-instance-stream-error').hidden = false;
        this.Controller.SwPeer.Close();
    }


    /**
     * フレームを閉じる
     */
    public Close() {
        this.Controller.CastInstance.isClose = true;
        this.Controller.SendCastInfo();
    }

}
