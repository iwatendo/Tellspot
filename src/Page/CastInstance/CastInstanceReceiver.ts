
import * as Personal from "../../Base/IndexedDB/Personal";

import AbstractServiceReceiver from "../../Base/Common/AbstractServiceReceiver";
import WebRTCService from "../../Base/Common/WebRTCService";
import Sender from "../../Base/Container/Sender";
import IconCursorSender from "../../Base/Container/IconCursorSender";

import CastInstanceController from "./CastInstanceController";
import { GetCastSettingSedner } from "./CastInstanceContainer";
import CastInstanceView from "./CastInstanceView";
import { ConnectionErrorSender } from "../HomeInstance/HomeInstanceContainer";


export class CastInstanceReceiver extends AbstractServiceReceiver<CastInstanceController> {


    /**
     * 
     */
    public Receive(conn: PeerJs.DataConnection, sender: Sender) {

        //  カーソル表示
        if (sender.type === IconCursorSender.ID) {
            let cursor = sender as IconCursorSender;
            this.Controller.CursorCache.Set(cursor);
            WebRTCService.SendAll(sender);
        }

        //  エラー表示
        if (sender.type === ConnectionErrorSender.ID) {
            let error = sender as ConnectionErrorSender;
            this.Controller.View.SetError(error.Message);
        }

    }

}