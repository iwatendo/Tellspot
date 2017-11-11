import AbstractServiceView, { OnViewLoad } from "../../Base/Common/AbstractServiceView";
import WebRTCService from "../../Base/Common/WebRTCService";
import GMapsUtil, { MapPos } from "../../Base/Util/GMapsUtil";
import StdUtil from "../../Base/Util/StdUtil";
import StreamUtil from "../../Base/Util/StreamUtil";

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

        //  ストリーミング開始ボタン
        startBotton.onclick = (e) => {
            this.Controller.StartStreaming();
            this.LocationPolling();
            startBotton.hidden = true;
            stopBotton.hidden = false;
        }

        //  ストリーミング停止ボタン
        stopBotton.onclick = (e) => {
            this.Controller.StopStreaming();
            stopBotton.hidden = true;
            startBotton.hidden = false;
        };
        
        this.SetMediaDevice();

        callback();
    }


    /**
     * Video/Audioソースの取得とリストへのセット
     */
    public SetMediaDevice() {
        let controller = this.Controller;
        //  let msc = StreamUtil.GetMediaTrackConstraintsMobile_RearCamera(false);
        let msc = StreamUtil.GetMediaTrackConstraintsMobile_FrontCamera(false);
        let previewElement = document.getElementById('video') as HTMLVideoElement;

        StreamUtil.GetStreaming(msc, (stream) => {
            controller.Stream = stream;
            StreamUtil.StartPreview(previewElement, stream);
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
