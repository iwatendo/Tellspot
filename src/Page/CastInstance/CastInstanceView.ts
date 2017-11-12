import AbstractServiceView, { OnViewLoad } from "../../Base/Common/AbstractServiceView";
import WebRTCService from "../../Base/Common/WebRTCService";
import GMapsUtil, { MapPos } from "../../Base/Util/GMapsUtil";
import StdUtil from "../../Base/Util/StdUtil";
import StreamUtil, { MobileCam } from "../../Base/Util/StreamUtil";

import CastInstanceController from "./CastInstanceController";
import { MapLocationSender } from "../HomeInstance/HomeInstanceContainer";

export default class CastInstanceView extends AbstractServiceView<CastInstanceController> {

    /**
     * 初期化処理
     */
    public Initialize(callback: OnViewLoad) {

        StdUtil.StopPropagation();
        StdUtil.StopTouchmove();

        let startBotton = document.getElementById('sbj-cast-instance-start');
        let stopBotton = document.getElementById('sbj-cast-instance-stop');
        let camchangeBotton = document.getElementById('sbj-camchange');

        //  ストリーミング開始ボタン
        startBotton.onclick = (e) => {
            this.Controller.StartStreaming();
            this.LocationPolling();
            startBotton.hidden = true;
            stopBotton.hidden = false;
            camchangeBotton.hidden = true;
        }

        //  ストリーミング停止ボタン
        stopBotton.onclick = (e) => {
            this.Controller.StopStreaming();
            stopBotton.hidden = true;
            startBotton.hidden = false;
            camchangeBotton.hidden = false;
            location.reload();
        };

        let cam = MobileCam.REAR;

        camchangeBotton.onclick = (e) => {
            cam = (cam === MobileCam.REAR ? MobileCam.FRONT : MobileCam.REAR);
            this.SetStreamPreview(cam);
        };

        this.SetStreamPreview(MobileCam.REAR);

        callback();
    }


    /**
     * Video/Audioソースの取得とリストへのセット
     */
    public SetStreamPreview(cam: MobileCam) {

        let controller = this.Controller;

        if (controller.Stream) {
            StreamUtil.Stop(controller.Stream);
        }

        let msc = StreamUtil.GetMediaStreamConstraints_Mobile(cam, true);

        let videoElement = document.getElementById('video') as HTMLVideoElement;

        StreamUtil.GetStreaming(msc, (stream) => {
            controller.Stream = stream;
            StreamUtil.StartPreview(videoElement, stream);
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
