
import AbstractServiceView, { OnViewLoad } from "../../Base/Common/AbstractServiceView";
import LogUtil from "../../Base/Util/LogUtil";
import LinkUtil from "../../Base/Util/LinkUtil";
import StdUtil from "../../Base/Util/StdUtil";
import CastVisitorController from "./CastVisitorController";
import IconCursorSender from "../../Base/Container/IconCursorSender";
import { CastCursor, CursorController } from "./Cursor/CurosrController";
import { Icon } from "../../Base/IndexedDB/Personal";
import { SubTitlesController } from "./SubTitles/SubTitlesController";


/**
 * 
 */
export class CastVisitorView extends AbstractServiceView<CastVisitorController> {

    public Cursor: CursorController;
    public SubTitles: SubTitlesController;


    //
    public Initialize(callback: OnViewLoad) {

        this.SubTitles = new SubTitlesController();

        StdUtil.StopPropagation();

        let submenuMain = document.getElementById('sbj-cast-visitor-submenu');
        submenuMain.onmouseover = (e) => {
            submenuMain.style.opacity = "1.0";
        }

        submenuMain.onmouseout = (e) => {
            submenuMain.style.opacity = "0.0";
        }

        //  Video
        let video = document.getElementById('sbj-video') as HTMLVideoElement;

        //  ミュート設定
        let mute = LinkUtil.GetArgs("mute");
        if (mute != null && mute.length > 0) {
            video.muted = true;
            this.ChangeDispMuteButton(true);
        }

        //  ミュートボタン押下時処理
        document.getElementById('sbj-cact-visitor-volume').onclick = (e) => {
            video.muted = !video.muted;
            this.ChangeDispMuteButton(video.muted);
        };

        //  ボリューム設定処理
        let valumeRange = document.getElementById('sbj-cast-visitor-volume-value') as HTMLInputElement;
        valumeRange.onchange = (e) => {
            let value = Number.parseInt(valumeRange.value);
            video.volume = (value / 100);
        };

        video.oncanplay = (ev) => {
            this.Cursor.DisplayAll();
        };

        callback();
    }


    /**
     * ミュートボタンの設定
     * @param isMute 
     */
    public ChangeDispMuteButton(isMute: boolean) {
        document.getElementById('sbj-cact-visitor-volume-on').hidden = isMute;
        document.getElementById('sbj-cact-visitor-volume-off').hidden = !isMute;
    }


    /**
     * カーソル表示設定
     */
    public InitializeCursor() {

        let video = document.getElementById('sbj-video') as HTMLVideoElement;
        let itemport = document.getElementById('sbj-cact-visitor-item-port') as HTMLElement;
        let curport = document.getElementById('sbj-cact-visitor-cursor-port') as HTMLElement;
        this.Cursor = new CursorController(this.Controller, video, itemport, curport);
        this.Cursor.DisplayAll();

        //  クライアント側の発言アイコン通知
        let lastChatAidElement = document.getElementById('lastChatAid') as HTMLInputElement;
        let lastChatIidElement = document.getElementById('lastChatIid') as HTMLInputElement;

        let chnageLastChatActor = (e) => {
            let aid = lastChatAidElement.textContent;
            let iid = lastChatIidElement.textContent;

            this.Cursor.SetLastChatActor(aid, iid);
        }

        if (lastChatAidElement) lastChatAidElement.onclick = chnageLastChatActor;
        if (lastChatIidElement) lastChatIidElement.onclick = chnageLastChatActor;
    }

}