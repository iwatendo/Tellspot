import StdUtil from "./StdUtil";
import LogUtil from "./LogUtil";

declare var SkyWay: any;
interface OnGetMediaStream { (stream: MediaStream): void }

export enum MobileCam{
    FRONT = 0,
    REAR = 1,
}

export default class StreamUtil {

    /**
     * プレビュー開始
     * @param element 
     * @param stream メディアストリーム
     */
    public static StartPreview(element: HTMLVideoElement, stream: MediaStream) {
        element.src = null;

        if (StdUtil.IsSafari()) {
            element.srcObject = stream;
        }
        else {
            element.src = URL.createObjectURL(stream);
        }
    }


    /**
     * メディア
     * @param videoSource 
     * @param audioSource 
     * @param callback 
     */
    private static GetMediaStream(msc: MediaStreamConstraints, callback: OnGetMediaStream) {

        navigator.getUserMedia(msc,
            (stream) => {
                callback(stream);
            }, (err: MediaStreamError) => {
                LogUtil.Error(null, err.name);
                LogUtil.Error(null, err.message);
            }
        );
    }


    /**
     * 
     * @param videoSource 
     * @param audioSource 
     */
    public static GetMediaTrackConstraints(videoSource: string, audioSource: string): MediaStreamConstraints {

        let result: MediaStreamConstraints = {
            video: (videoSource ? { advanced: ([{ deviceId: videoSource }]) } : false),
            audio: (audioSource ? { advanced: ([{ deviceId: audioSource }]) } : false),
        };

        return result;
    }


    /**
     * モバイル端末のMediaStreamConstraints取得
     */
    public static GetMediaTrackConstraintsMobile(cam: MobileCam,useAudio : boolean ): MediaStreamConstraints {

        switch(cam){
            case MobileCam.FRONT:
                return { audio: useAudio, video: { facingMode: "user" }};
            case MobileCam.REAR: 
                return { audio: useAudio, video: { facingMode: { exact: "environment" } } };
        }
    }
    

    /**
     * 
     * @param audioSource 
     * @param videoSource 
     * @param callback 
     */
    public static GetStreaming(msc: MediaStreamConstraints, callback: OnGetMediaStream) {

        if (msc) {
            this.GetMediaStream(msc, (stream) => {
                callback(stream);
            });
        }
    }


    /**
     * 指定ストリームを停止します
     * @param stream 
     */
    public static Stop(stream: MediaStream) {
        if (stream) {
            if (stream.getVideoTracks().length > 0) {
                stream.getVideoTracks()[0].stop();
            }
            if (stream.getAudioTracks().length > 0) {
                stream.getAudioTracks()[0].stop();
            }
        }
    }

    
    /**
     * 指定ストリームをミュートします
     * @param stream 
     * @param value 
     */
    public static SetMute(stream : MediaStream, value : boolean) {
        let tracks = stream.getAudioTracks();
        if (tracks.length > 0) {
            let track = tracks[0];
            track.enabled = !value;
        }
    }

}