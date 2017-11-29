import StdUtil from "../../Base/Util/StdUtil";
import LinkUtil from "../../Base/Util/LinkUtil";
import StreamUtil from "../../Base/Util/StreamUtil";
import SWPeer from "../../Base/WebRTC/SWPeer";
import SWRoomController from "../../Base/WebRTC/SWRoomController";
import { SWRoomMode } from "../../Base/WebRTC/SWRoom";

import CastVisitorController from "./CastVisitorController";

if (StdUtil.IsExecute()) {

    let ownerId = LinkUtil.GetPeerID();

    let controler = new CastVisitorController();

    controler.SwPeer = new SWPeer(controler, ownerId, () => {

        let videoElement = document.getElementById('sbj-video') as HTMLVideoElement;

        let audioDeviceId = controler.GetDeviceId('select-audio-device');
        let videoDeviceId = controler.GetDeviceId('select-video-device');
        let msc = StreamUtil.GetMediaStreamConstraints(videoDeviceId, audioDeviceId);

        StreamUtil.GetStreaming(msc, (stream) => {
            controler.SwRoomController = new SWRoomController(controler.SwPeer, ownerId, SWRoomMode.Mesh, (peerid, stream, isAlive) => {

                if (peerid !== ownerId || !videoElement) return;

                if (isAlive) {
                    videoElement.srcObject = stream;
                    videoElement.play();
                }
                else {
                    videoElement.pause();
                }
            }, stream);
        });
    });
}
