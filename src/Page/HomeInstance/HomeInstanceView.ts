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

        let frame: HTMLFrameElement = document.getElementById('sbj-cast-instance-qrcode') as HTMLFrameElement;
        frame.src = LinkUtil.CreateLink("../QrCode/") + "?linkurl=" + encodeURIComponent(linkUrl);

        let clipcopybtn = document.getElementById('sbj-linkcopy') as HTMLInputElement;
        clipcopybtn.onclick = (e) => {
            clipcopybtn.textContent = " 接続URLをクリップボードにコピーしました ";
            StdUtil.ClipBoardCopy(linkUrl);
            clipcopybtn.disabled = true;
            window.setTimeout(()=>{
                clipcopybtn.textContent = " 接続URLをクリップボードにコピー ";
                clipcopybtn.disabled = false;
            },2000);
        };
    }


    /**
     * 
     * @param sl 
     */
    public NotifyServent(sl: ServentLocation) {

        GMapsUtil.GetAddress(sl.Locate, (name) => {
            GMapsUtil.CreateMap('#map', sl.Locate);
            GMapsUtil.DrawOverlay(sl.Locate,'<div class="overlay">中継現場<div class="overlay_arrow above"></div></div>');
            let frame = document.getElementById('livecast') as HTMLIFrameElement;
            frame.src = sl.Servent.clientUrl;
        });

    }

}
