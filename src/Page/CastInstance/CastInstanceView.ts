import AbstractServiceView, { OnViewLoad } from "../../Base/Common/AbstractServiceView";
import WebRTCService from "../../Base/Common/WebRTCService";
import LocalCache from "../../Base/Common/LocalCache";
import StdUtil from "../../Base/Util/StdUtil";
import DeviceUtil, { DeviceKind } from "../../Base/Util/DeviceUtil";
import LogUtil from "../../Base/Util/LogUtil";
import StreamUtil from "../../Base/Util/StreamUtil";

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

        let videoElement = document.getElementById('video') as HTMLVideoElement;
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

        startButton.hidden = isLiveCasting;
        stopButton.hidden = !isLiveCasting;
        //  videoElement.hidden = isLiveCasting;

    }


    /**
     * Video/Audioソースの取得とリストへのセット
     */
    public SetMediaDevice() {
        let controller = this.Controller;
        let previewElement = document.getElementById('video') as HTMLVideoElement;

        let msc = StreamUtil.GetMediaTrackConstraintsMobile_RearCamera(false);
        StreamUtil.SetPreview(previewElement,msc);
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
     * 放送状況を表示する
     * @param url 
     */
    public SetLiveCast(url:string){
        let frame = document.getElementById('livecast') as HTMLIFrameElement;
        frame.src = url;
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
