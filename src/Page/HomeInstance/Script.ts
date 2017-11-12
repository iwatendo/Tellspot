import StdUtil from "../../Base/Util/StdUtil";

import HomeInstanceController from "./HomeInstanceController";
import HomeInstanceReceiver from "./HomeInstanceReceiver";
import SWPeer from "../../Base/Common/Connect/SWPeer";

if (StdUtil.IsExecute()) {
    let controller = new HomeInstanceController();
    controller.SwPeer = new SWPeer(controller, null, () => {});
}
