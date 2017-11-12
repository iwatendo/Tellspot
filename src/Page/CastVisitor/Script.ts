import StdUtil from "../../Base/Util/StdUtil";
import LinkUtil from "../../Base/Util/LinkUtil";
import StreamUtil from "../../Base/Util/StreamUtil";
import SWPeer from "../../Base/Common/Connect/SWPeer";
import SWRoomController from "../../Base/Common/Connect/SWRoomController";
import { SWRoomMode } from "../../Base/Common/Connect/SWRoom";

import CastVisitorController from "./CastVisitorController";

if (StdUtil.IsExecute()) {

    let videoElement = document.getElementById('sbj-video') as HTMLVideoElement;
    let ownerId = LinkUtil.GetPeerID();

    let controler = new CastVisitorController();

    controler.SwPeer = new SWPeer(controler, ownerId, () => {

        let msc = StreamUtil.GetMediaStreamConstraints_DefaultDevice();

        StreamUtil.GetStreaming(msc, (stream) => {
            controler.SwRoomController = new SWRoomController(controler.SwPeer, ownerId, SWRoomMode.Mesh);
            controler.SwRoomController.SetMediaElement(ownerId, videoElement);
            controler.SwRoomController.SetStream(stream);
        });

    });

}
