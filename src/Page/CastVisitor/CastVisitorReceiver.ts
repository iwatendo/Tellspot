
import AbstractServiceReceiver from "../../Base/Common/AbstractServiceReceiver";
import Sender from "../../Base/Container/Sender";
import LogUtil from "../../Base/Util/LogUtil";
import IconCursorSender  from "../../Base/Container/IconCursorSender";
import CastVisitorController from "./CastVisitorController";
import { CastVisitorView } from "./CastVisitorView";
import * as HIContainer from "../HomeInstance/HomeInstanceContainer";
import * as CIContainer from "../CastInstance/CastInstanceContainer";



export class CastVisitorReceiver extends AbstractServiceReceiver<CastVisitorController> {


    /**
     * 
     */
    public Receive(conn: PeerJs.DataConnection, sender: Sender){

        //  カーソル表示
        if (sender.type === IconCursorSender.ID) {
            this.Controller.View.Cursor.SetCursor(sender as IconCursorSender);
        }
    }

}