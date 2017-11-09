import Sender from "../../Base/Container/Sender";
import AbstractServiceReceiver from "../../Base/Common/AbstractServiceReceiver";
import WebRTCService from "../../Base/Common/WebRTCService";
import * as HIContainer from "./HomeInstanceContainer";

import HomeInstanceController from "./HomeInstanceController";
import CastInstanceSender from "../../Base/Container/CastInstanceSender";

export default class HomeInstanceReceiver extends AbstractServiceReceiver<HomeInstanceController> {

    /**
     * 
     */
    public Receive(conn: PeerJs.DataConnection, sender: Sender) {

        //  サーバントの起動/更新通知
        if (sender.type === CastInstanceSender.ID) {
            this.Controller.SetServentLocation(conn.peer, sender as CastInstanceSender, null);
        }

        //  位置情報の通知
        if (sender.type === HIContainer.MapLocationSender.ID) {
            this.Controller.SetServentLocation(conn.peer, null, (sender as HIContainer.MapLocationSender).Location);
        }

    }

}
