import StdUtil from "../../Base/Util/StdUtil";
import LinkUtil from "../../Base/Util/LinkUtil";
import WebRTCService from "../../Base/Common/WebRTCService";
import AbstractServiceView, { OnViewLoad } from "../../Base/Common/AbstractServiceView";

import HomeInstanceController from "./HomeInstanceController";


export default class HomeInstanceView extends AbstractServiceView<HomeInstanceController> {


    /**
     * 初期化処理
     * @param callback 
     */
    protected Initialize(callback: OnViewLoad) {
        StdUtil.StopPropagation();
    }


    /**
     * 
     * @param peerid ホームインスタンスのPeerID
     */
    public SetCastInstanceUrl(peerid: string) {

        let linkUrl = LinkUtil.CreateLink("../CastInstance/",peerid);

        let element: HTMLInputElement = document.getElementById('sbj-cast-instance-url') as HTMLInputElement;
        element.textContent = linkUrl;

        let frame: HTMLFrameElement = document.getElementById('sbj-cast-instance-qrcode') as HTMLFrameElement;
        frame.src = LinkUtil.CreateLink("../QrCode/") + "?linkurl=" + encodeURIComponent(linkUrl);
    }

}
