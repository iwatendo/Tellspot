import WebRTCService from "../../Base/Common/WebRTCService";
import StdUtil from "../../Base/Util/StdUtil";

import HomeInstanceController from "./HomeInstanceController";
import HomeInstanceReceiver from "./HomeInstanceReceiver";

if (StdUtil.IsExecute()) {

    let server = new HomeInstanceController();
    WebRTCService.Start(server, null);

}
