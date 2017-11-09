import StdUtil from "../../Base/Util/StdUtil";
import LinkUtil from "../../Base/Util/LinkUtil";
import WebRTCService from "../../Base/Common/WebRTCService";
import AbstractServiceView, { OnViewLoad } from "../../Base/Common/AbstractServiceView";

import HomeInstanceController, { ServentLocation } from "./HomeInstanceController";
import GMapsUtil from "../../Base/Util/GMapsUtil";


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

        let linkUrl = LinkUtil.CreateLink("../CastInstance/", peerid);

        let element: HTMLInputElement = document.getElementById('sbj-cast-instance-url') as HTMLInputElement;
        element.textContent = linkUrl;

        let frame: HTMLFrameElement = document.getElementById('sbj-cast-instance-qrcode') as HTMLFrameElement;
        frame.src = LinkUtil.CreateLink("../QrCode/") + "?linkurl=" + encodeURIComponent(linkUrl);
    }


    /**
     * 
     * @param sl 
     */
    public NotifyServent(sl: ServentLocation) {

        GMapsUtil.GetAddress(sl.Locate, (name) => {
            GMapsUtil.CreateMap('#map', sl.Locate);
            //  GMapsUtil.DrawOverlay(sl.Locate,'<div class="overlay">Test<div class="overlay_arrow above"></div></div>');
        });

    }

}
