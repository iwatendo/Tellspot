import Sender from "../../Base/Container/Sender";
import AbstractServiceReceiver from "../../Base/Common/AbstractServiceReceiver";
import WebRTCService from "../../Base/Common/WebRTCService";
import * as HIContainer from "./HomeInstanceContainer";

import HomeInstanceController from "./HomeInstanceController";
import CastInstanceSender from "../../Base/Container/CastInstanceSender";
import { MapPos } from "../../Base/Util/GMapsUtil";

export default class HomeInstanceReceiver extends AbstractServiceReceiver<HomeInstanceController> {


    /**
     * 
     */
    public Receive(conn: PeerJs.DataConnection, sender: Sender) {

        //  サーバントの起動/更新通知
        if (sender.type === CastInstanceSender.ID) {
            this.SetServentLocation(conn, sender as CastInstanceSender, null);
        }

        //  位置情報の通知
        if (sender.type === HIContainer.MapLocationSender.ID) {
            this.SetServentLocation(conn, null, (sender as HIContainer.MapLocationSender).Location);
        }

    }


    /**
     * 
     * @param peerid 
     * @param servent 
     * @param pos 
     */
    public SetServentLocation(conn: PeerJs.DataConnection, servent: CastInstanceSender, pos: MapPos) {

        let result = this.Controller.SetServentLocation(conn.peer, servent, pos);

        if (!result) {
            let sender = new HIContainer.ConnectionErrorSender("他のユーザーが接続している為、接続できません。");
            WebRTCService.SendTo(conn, sender);
        }
    }

}
