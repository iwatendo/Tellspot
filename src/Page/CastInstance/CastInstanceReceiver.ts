﻿
import * as Personal from "../../Base/IndexedDB/Personal";

import AbstractServiceReceiver from "../../Base/Common/AbstractServiceReceiver";
import WebRTCService from "../../Base/Common/WebRTCService";
import Sender from "../../Base/Container/Sender";
import IconCursorSender from "../../Base/Container/IconCursorSender";

import CastInstanceController from "./CastInstanceController";
import { GetCastSettingSedner } from "./CastInstanceContainer";
import CastInstanceView from "./CastInstanceView";


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

    }

}