import StdUtil from "./StdUtil";
import LogUtil from "./LogUtil";

declare var SkyWay: any;
interface OnGetMediaStream { (stream: MediaStream): void }

export enum MobileCam {
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
    private static GetMediaStream(msc: MediaStreamConstraints, callback: OnGetMediaStream, retryCount: number = 0) {

        navigator.getUserMedia(msc,
            (stream) => {
                callback(stream);
            }, (err: MediaStreamError) => {

                if (err.name === "TrackStartError" && retryCount < 5) {
                    retryCount = retryCount + 1;
                    LogUtil.Warning(null, err.name + " : retry " + retryCount.toString());
                    //  １秒待ってからリトライ ※5回迄
                    setTimeout(() => {
                        this.GetMediaStream(msc, callback, retryCount);
                    }, 1000);
                }
                else {
                    LogUtil.Error(null, err.name + " : " + err.message);
                    callback(null);
                }
            }
        );
    }


    /**
     * 
     * @param videoSource 
     * @param audioSource 
     */
    public static GetMediaStreamConstraints(videoSource: string, audioSource: string): MediaStreamConstraints {

        let result: MediaStreamConstraints = {
            video: (videoSource ? { advanced: ([{ deviceId: videoSource }]) } : false),
            audio: (audioSource ? { advanced: ([{ deviceId: audioSource }]) } : false),
        };

        return result;
    }


    /**
     * デフォルトデバイスの取得
     */
    public static GetMediaStreamConstraints_DefaultDevice(): MediaStreamConstraints {
        return { audio: true, video: true };
    }


    /**
     * モバイル端末のMediaStreamConstraints取得
     */
    public static GetMediaStreamConstraints_Mobile(cam: MobileCam, useAudio: boolean): MediaStreamConstraints {

        switch (cam) {
            case MobileCam.FRONT:
                return { audio: useAudio, video: { facingMode: "user" } };
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
            let tracks = stream.getTracks();
            let count = tracks.length;
            if (count > 0) {
                for (let i = count - 1; i >= 0; i--) {
                    let track: MediaStreamTrack = tracks[i];
                    track.stop();
                    stream.removeTrack(track);
                }
            }
        }
    }


    /**
     * 指定ストリームをミュートします
     * @param stream 
     * @param value 
     */
    public static SetMute(stream: MediaStream, value: boolean) {
        let tracks = stream.getAudioTracks();
        if (tracks.length > 0) {
            let track = tracks[0];
            track.enabled = !value;
        }
    }

}