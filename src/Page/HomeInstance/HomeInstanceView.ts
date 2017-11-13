import * as JQuery from "jquery";
import StdUtil from "../../Base/Util/StdUtil";
import LinkUtil from "../../Base/Util/LinkUtil";
import AbstractServiceView, { OnViewLoad } from "../../Base/Common/AbstractServiceView";

import HomeInstanceController, { ServentLocation } from "./HomeInstanceController";
import GMapsUtil, { MapPos } from "../../Base/Util/GMapsUtil";


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

        var qrcode: any = $('#qrcode');
        qrcode.qrcode(linkUrl);

        let clipcopybtn = document.getElementById('sbj-linkcopy') as HTMLInputElement;
        clipcopybtn.onclick = (e) => {
            clipcopybtn.textContent = " 接続URLをクリップボードにコピーしました ";
            StdUtil.ClipBoardCopy(linkUrl);
            clipcopybtn.disabled = true;
            window.setTimeout(() => {
                clipcopybtn.textContent = " 接続URLをクリップボードにコピー ";
                clipcopybtn.disabled = false;
            }, 2000);
        };
    }

    public SetMapLiveHidden(ishidden: boolean){
        document.getElementById('livecast-cell').hidden = ishidden;
        document.getElementById('map-cell').hidden = ishidden; 
    }

    /**
     * 
     * @param sl 
     */
    public NotifyServent(sl: ServentLocation) {

        GMapsUtil.GetAddress(sl.Locate, (name) => {
            this.SetMapLiveHidden(false);
            GMapsUtil.CreateMap('#map', sl.Locate);
            let frame = document.getElementById('livecast') as HTMLIFrameElement;
            frame.src = sl.Servent.clientUrl;
            this.SetLocation(sl.Locate);
        });
    }


    /**
     * 
     * @param locate 
     */
    public SetLocation(locate : MapPos){
        GMapsUtil.DrawOverlay(locate, '<div class="overlay">中継現場<div class="overlay_arrow above"></div></div>');
    }

    /**
     * 
     */
    public NotifyCloseServent(){
        this.SetMapLiveHidden(true);
        let frame = document.getElementById('livecast') as HTMLIFrameElement;
        frame.src = "";
    }

}
