import Sender from "../../Base/Container/Sender";
import AbstractServiceReceiver from "../../Base/Common/AbstractServiceReceiver";
import WebRTCService from "../../Base/Common/WebRTCService";
import * as HIContainer from "./HomeInstanceContainer";
import HomeInstanceController from "./HomeInstanceController";


export default class HomeInstanceReceiver extends AbstractServiceReceiver<HomeInstanceController> {

    /**
     * 
     */
    public Receive(conn: PeerJs.DataConnection, sender: Sender) {


        //  サーバントの起動/更新通知
        if (sender.type === HIContainer.ServentSender.ID) {
            this.Controller.InstanceManager.SetServent(sender as HIContainer.ServentSender);
        }

        //  サーバントの終了通知
        if (sender.type === HIContainer.ServentCloseSender.ID) {
            this.Controller.InstanceManager.CloseServent(sender as HIContainer.ServentCloseSender);
        }

        //  強制終了処理
        if (sender.type === HIContainer.ForcedTerminationSender.ID) {
            WebRTCService.Close();
        }

    }

}
