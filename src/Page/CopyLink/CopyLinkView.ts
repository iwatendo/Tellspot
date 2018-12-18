import * as JQuery from "jquery";
import StdUtil from "../../Base/Util/StdUtil";
import LinkUtil from "../../Base/Util/LinkUtil";
import AbstractServiceView, { OnViewLoad } from "../../Base/Common/AbstractServiceView";
import CopyLinkController from "./CopyLinkController";

export default class CopyLinkView extends AbstractServiceView<CopyLinkController> {

    /**
     * 初期化処理
     * @param callback 
     */
    protected Initialize(callback: OnViewLoad) {
        StdUtil.StopPropagation();
        let peerid = LinkUtil.GetPeerID();
        this.SetCastInstanceUrl(peerid);
    }


    /**
     * 
     */
    public SetCastInstanceUrl(peerid: string) {

        //  URL短縮の為にトップページでCastInstanceにリダイレクトします
        //  let linkUrl = LinkUtil.CreateLink("../CastInstance/", peerid);
        let linkUrl = LinkUtil.CreateLink("../", peerid);

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

}
