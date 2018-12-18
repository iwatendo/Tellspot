import * as JQuery from "jquery";
import StdUtil from "../../Base/Util/StdUtil";
import LinkUtil from "../../Base/Util/LinkUtil";
import AbstractServiceView, { OnViewLoad } from "../../Base/Common/AbstractServiceView";
import CopyLinkController from "./CopyLinkController";

declare var ons: any;

export default class CopyLinkView extends AbstractServiceView<CopyLinkController> {

    /**
     * 初期化処理
     * @param callback 
     */
    protected Initialize(callback: OnViewLoad) {

        StdUtil.StopPropagation();
        StdUtil.StopTouchmove();
        StdUtil.StopTouchZoom();

        const self = this;

        document.addEventListener('show', (e) => {

            document.getElementById('copy').onclick = (e) => {
                this.ShwoDialog(self);
            };

            document.getElementById('close').onclick = (e) => {
                window.open('about:blank', '_self').close();
            };

        }, false);

        callback();
    }

    /**
     *
     * @param self
     */
    public ShwoDialog(self) {
        const dialog = document.getElementById('alert-dialog') as any;

        if (dialog) {
            self.SetDialogEvent();
        } else {
            ons.createElement('alert-dialog.html', { append: true })
                .then((dialog) => { self.SetDialogEvent(); });
        }
    }

    public LinkCopy() {
        let peerid = LinkUtil.GetPeerID();
        let linkUrl = LinkUtil.CreateLink("../", peerid);
        StdUtil.ClipBoardCopy(linkUrl);
    }

    /**
     *
     */
    public SetDialogEvent() {

        const dialog = document.getElementById('alert-dialog') as any;

        document.getElementById('dialog-ok').onclick = (e) => {
            window.open('about:blank', '_self').close();
        };

        dialog.show();
    }


    /**
     *
     * @param message
     */
    public ShowToast(message: string) {
        (ons as any).notification.toast(message, {
            timeout: 2000,
        });
    }

}
