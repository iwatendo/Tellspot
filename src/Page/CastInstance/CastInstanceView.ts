import AbstractServiceView, { OnViewLoad } from "../../Base/Common/AbstractServiceView";
import WebRTCService from "../../Base/Common/WebRTCService";
import LocalCache from "../../Base/Common/LocalCache";
import StdUtil from "../../Base/Util/StdUtil";
import DeviceUtil, { DeviceKind } from "../../Base/Util/DeviceUtil";
import LogUtil from "../../Base/Util/LogUtil";
import StreamUtil from "../../Base/Util/StreamUtil";

import { DeviceView } from "../DeviceView/DeviceVew";
import CastInstanceController from "./CastInstanceController";
import LinkUtil from "../../Base/Util/LinkUtil";
import GMapsUtil, { MapPos } from "../../Base/Util/GMapsUtil";
import { MapLocationSender } from "../HomeInstance/HomeInstanceContainer";

export default class CastInstanceView extends AbstractServiceView<CastInstanceController> {

    /**
     * 初期化処理
     */
    public Initialize(callback: OnViewLoad) {

        StdUtil.StopPropagation();
        StdUtil.StopTouchmove();

        let startButton = document.getElementById('sbj-cast-instance-start');
        let stopButton = document.getElementById('sbj-cast-instance-stop');
        let settingButton = document.getElementById('sbj-cast-instance-settings');
        let micElement = document.getElementById('mic-select-div');
        let camElement = document.getElementById('webcam-select-div');

        //  ストリーミング開始ボタン
        startButton.onclick = (e) => {
            this.Controller.SetStreaming();
            this.ChangeDisplayMode(true);
            this.LocationPolling();
        }

        //  ストリーミング停止ボタン
        stopButton.onclick = (e) => {
            this.Controller.ServerSend(false, false);
            this.ChangeDisplayMode(false);
            location.reload();
        };

        this.SetMediaDevice();

        callback();
    }


    /**
     * 
     * @param isLiveCasting 
     */
    public ChangeDisplayMode(isLiveCasting: boolean) {

        let videoElement = document.getElementById('video');
        let startButton = document.getElementById('sbj-cast-instance-start');
        let stopButton = document.getElementById('sbj-cast-instance-stop');
        let micElement = document.getElementById('mic-select-div');
        let camElement = document.getElementById('webcam-select-div');

        startButton.hidden = isLiveCasting;
        stopButton.hidden = !isLiveCasting;
        micElement.hidden = isLiveCasting;
        camElement.hidden = isLiveCasting;
        //  videoElement.hidden = isLiveCasting;

    }


    /**
     * Video/Audioソースの取得とリストへのセット
     */
    public SetMediaDevice() {

        let controller = this.Controller;

        let previewElement = document.getElementById('video') as HTMLVideoElement;
        let camSelectElement = document.getElementById('webcam-select') as HTMLInputElement;
        var camListElement = document.getElementById('webcam-list') as HTMLElement;
        let micSelectElement = document.getElementById('mic-select') as HTMLInputElement;
        var micListElement = document.getElementById('mic-list') as HTMLElement;

        DeviceUtil.GetAudioDevice((devices) => {

            var view = new DeviceView(DeviceKind.Audio, micSelectElement, micListElement, devices,
                (deviceId) => {
                    controller.AudioSource = deviceId;
                }
            );

            view.SelectDefaultDevice();
            document.getElementById("mic-select-div").classList.add("is-dirty");
        });

        DeviceUtil.GetVideoDevice((devices) => {

            var view = new DeviceView(DeviceKind.Video, camSelectElement, camListElement, devices,
                (deviceId) => {
                    controller.VideoSource = deviceId;
                    if (deviceId) {
                        //  StreamUtil.SetPreview(previewElement, deviceId);
                    }
                    else {
                        //  StreamUtil.StopPreview(previewElement);
                    }
                }
            );

            view.SelectDefaultDevice();
            document.getElementById("webcam-select-div").classList.add("is-dirty");
        });

    }


    /**
     * 位置情報を1秒毎に送る。
     */
    public LocationPolling() {

        let pre = new MapPos();

        //  1秒毎に緯度経度を取得し、差異があれば送信
        setInterval(() => {
            GMapsUtil.GetLocate((gpos) => {
                if (pre.latitude !== gpos.latitude || pre.longitude !== gpos.longitude) {
                    let sender = new MapLocationSender();
                    sender.Location = gpos;
                    WebRTCService.SendToOwner(sender);
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
     * フレームを閉じる
     */
    public Close() {
        this.Controller.CastInstance.isClose = true;
        this.Controller.SendCastInfo();
    }

}
