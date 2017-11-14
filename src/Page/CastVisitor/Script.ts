import StdUtil from "../../Base/Util/StdUtil";
import LinkUtil from "../../Base/Util/LinkUtil";
import StreamUtil from "../../Base/Util/StreamUtil";
import SWPeer from "../../Base/Common/Connect/SWPeer";
import SWRoomController from "../../Base/Common/Connect/SWRoomController";
import { SWRoomMode } from "../../Base/Common/Connect/SWRoom";

import CastVisitorController from "./CastVisitorController";

if (StdUtil.IsExecute()) {

    let ownerId = LinkUtil.GetPeerID();

    let controler = new CastVisitorController();

    controler.SwPeer = new SWPeer(controler, ownerId, () => {

        let audioDeivceId = "";
        if (window.parent) {
            let audioDeivceElement = window.parent.document.getElementById('select-audio-device') as HTMLInputElement;
            if (audioDeivceElement) {
                audioDeivceId = audioDeivceElement.value;
            }
        }

        let msc = StreamUtil.GetMediaStreamConstraints_AudioDevice(audioDeivceId);

        StreamUtil.GetStreaming(msc, (stream) => {
            controler.SwRoomController = new SWRoomController(controler.SwPeer, ownerId, SWRoomMode.Mesh, (peerid, stream, isAlive) => {
                if (peerid === ownerId) {
                    let videoElement = document.getElementById('sbj-video') as HTMLVideoElement;

                    if (videoElement) {
                        if (isAlive) {
                            videoElement.srcObject = stream;
                            videoElement.play();
                        }
                        else {
                            videoElement.pause();
                        }
                    }
                }
            });
            controler.SwRoomController.SetStream(stream);
        });

    });

}
