import WebRTCService from "../../Base/Common/WebRTCService";
import StdUtil from "../../Base/Util/StdUtil";
import LinkUtil from "../../Base/Util/LinkUtil";
import CastVisitorController from "./CastVisitorController";
import StreamUtil from "../../Base/Util/StreamUtil";

if (StdUtil.IsExecute()) {
    let videoElement = document.getElementById('sbj-video') as HTMLVideoElement;
    let ownerId = LinkUtil.GetPeerID();
    WebRTCService.Start(new CastVisitorController(), ownerId, () => {

        let msc = StreamUtil.GetMediaStreamConstraints_DefaultMic();
        StreamUtil.GetStreaming(msc, (stream) => {
            WebRTCService.RoomJoin(ownerId, null, videoElement);
        });
    });
}
