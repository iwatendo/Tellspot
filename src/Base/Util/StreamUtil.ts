import StdUtil from "./StdUtil";
import LogUtil from "./LogUtil";
import { IServiceController } from "../Common/IServiceController";

interface OnGetMediaStream { (stream: MediaStream): void }
declare var SkyWay: any;

export default class StreamUtil {

    public static Service: IServiceController;
    public static LocalStream: MediaStream;

    private static _previewStream: MediaStream;
    private static _screenShare = null;
    private static _existingCallList: Array<PeerJs.MediaConnection>;


    /**
     * プレビュー設定
     * @param element 
     * @param videoSource 
     */
    public static SetPreview(element: HTMLVideoElement, videoSource: string) {
        if (element) {
            this.GetMediaStream(videoSource, "", (stream) => {
                this.StartPreview(element, stream);
            });
        }
    }


    /**
     * プレビュー開始
     * @param element 
     * @param stream メディアストリーム
     */
    public static StartPreview(element: HTMLVideoElement, stream: MediaStream) {
        this._previewStream = stream;
        element.src = null;

        if (StdUtil.IsSafari()) {
            element.srcObject = stream;
        }
        else {
            element.src = URL.createObjectURL(stream);
        }
    }


    /**
     * プレビュー停止
     * @param element 
     */
    public static StopPreview(element: HTMLVideoElement) {
        if (this._previewStream) {
            if (this._previewStream.getVideoTracks().length > 0) {
                this._previewStream.getVideoTracks()[0].stop();
            }
        }
        element.src = null;
    }


    /**
     * メディア
     * @param videoSource 
     * @param audioSource 
     * @param callback 
     */
    private static GetMediaStream(videoSource: string, audioSource: string, callback: OnGetMediaStream) {

        let constraints = this.GetMediaTrackConstraints(videoSource, audioSource);

        navigator.getUserMedia(constraints,
            (stream) => {
                callback(stream);
            }, (err: MediaStreamError) => {
                LogUtil.Error(this.Service, err.name);
                LogUtil.Error(this.Service, err.message);
            }
        );
    }


    /**
     * 
     * @param videoSource 
     * @param audioSource 
     */
    private static GetMediaTrackConstraints(videoSource: string, audioSource: string): MediaStreamConstraints {

        let result: MediaStreamConstraints = {
            video: (videoSource ? { advanced: ([{ deviceId: videoSource }]) } : false),
            audio: (audioSource ? { advanced: ([{ deviceId: audioSource }]) } : false),
        };

        return result;
    }


    /**
     * デフォルトのマイクを取得します
     * @param callback 
     */
    public static GetDefaultMic(callback: OnGetMediaStream) {

        if (!StdUtil.IsSafari()) {
            this.Stop();
        }


        navigator.getUserMedia({ audio: true, video: false }, (stream) => {
            this.LocalStream = stream;
            callback(stream);
        }, (err: MediaStreamError) => {
            LogUtil.Error(this.Service, err.name);
            LogUtil.Error(this.Service, err.message);
        });
    }


    /**
     * 
     * @param audioSource 
     * @param videoSource 
     * @param callback 
     */
    public static GetStreaming(audioSource: string, videoSource: string, callback: OnGetMediaStream) {

        if (!StdUtil.IsSafari()) {
            this.Stop();
        }

        if (videoSource || audioSource) {
            this.GetMediaStream(videoSource, audioSource, (stream) => {
                this.LocalStream = stream;
                callback(stream);
            });
        }
        else {
            this.ClearStreaming();
        }
    }

    /**
     * 
     */
    private static ClearStreaming() {
        this.LocalStream = null;

        if (this._existingCallList) {
            this._existingCallList.forEach(exc => {
                exc.close();
            });
            this._existingCallList = null;
        }
    }


    /**
     * 動画配信処理の停止
     */
    public static Stop() {
        if (this.LocalStream) {
            if (this.LocalStream.getVideoTracks().length > 0) {
                this.LocalStream.getVideoTracks()[0].stop();
            }
            if (this.LocalStream.getAudioTracks().length > 0) {
                this.LocalStream.getAudioTracks()[0].stop();
            }
        }
    }


    /**
     *  音声配信のミュート
     */
    public static set Mute(value) {
        if (this.LocalStream) {
            this.SetMute(this.LocalStream, value);
        }
    }


    /**
     * 指定ストリームをミュート状態にします
     * @param stream 
     */
    private static SetMute(stream: any, value) {
        let tracks = stream.getAudioTracks();
        if (tracks.length > 0) {
            let track = tracks[0];
            track.enabled = !value;
        }
    }


    /**
     * 一時停止 / 再開
     */
    public static set Puase(value: boolean) {
        if (this.LocalStream) {
            if (this.LocalStream.getVideoTracks().length > 0) {
                this.LocalStream.getVideoTracks()[0].enabled = !value;
            }
            if (this.LocalStream.getAudioTracks().length > 0) {
                this.LocalStream.getAudioTracks()[0].enabled = !value;
            }
        }
    }

}