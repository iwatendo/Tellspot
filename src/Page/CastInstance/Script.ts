import StdUtil from "../../Base/Util/StdUtil";
import LinkUtil from "../../Base/Util/LinkUtil";
import LocalCache from "../../Base/Common/LocalCache";
import CastInstanceController from "./CastInstanceController";
import SWPeer from "../../Base/Common/Connect/SWPeer";

if (StdUtil.IsExecute(true)) {

    if (!LocalCache.IsCheckDevicePermision) {
        let reload = () => {
            LocalCache.IsCheckDevicePermision = true;
            location.reload();
        };
        navigator.getUserMedia = navigator.getUserMedia || (navigator as any).webkitGetUserMedia || (navigator as any).mozGetUserMedia;
        navigator.getUserMedia({ video: true, audio: true }, (stream) => { reload(); }, (err) => { reload(); });
    }

    let controller = new CastInstanceController();
    controller.SwPeer = new SWPeer(controller,LinkUtil.GetPeerID(),()=>{});
}