
import StdUtil from "../Util/StdUtil";

export interface OnSetVoiceChatOptions { (option: VoiceChatOptions): void };
export interface OnSetLiveCastOptions { (option: LiveCastOptions): void };
export interface OnSetScreenShareOptions { (option: ScreenShareOptions): void };
export interface OnSetGadgetCastOptions { (option: GadgetCastOptions): void };

/**
 * ローカルストレージに対するデータ操作を行います。
 * このクラスを経由しないローカルストレージの使用は禁止します
 */
export default class LocalCache {

    /**
     * ローカルストレージを全てクリアした場合
     * InitializedTellspotもクリアされ、起動時にIndexedDBも全て初期化される事に注意してください。
     */
    public static Clear() {
        localStorage.clear();
    }

    /**
     *  ユーザーID / 初回起動時にランダムで設定されます
     */
    public static set UserID(val: string) { localStorage.setItem('user-id', val); }
    public static get UserID(): string {
        let uid = localStorage.getItem('user-id');
        if (!uid) {
            uid = StdUtil.CreateUuid();
            this.UserID = uid;
        }
        return uid;
    }


    /**
     *  IndexedDBの初期化済みフラグ
     * 
     *  初回起動時 及び 「データの初期化」実行時にIndexedDBを初期化するか判定するフラグです。
     *  この値がTrueに設定されていない場合、起動時に初期化処理が実行されます。
     */
    public static set InitializedTellspot(val: boolean) { localStorage.setItem('initialized-tellspot', (val ? "True" : "")) }
    public static get InitializedTellspot(): boolean { return localStorage.getItem('initialized-tellspot') === "True" }


    /**
     *  初回のデバイスチェック有無
     */
    public static set IsCheckDevicePermision(val: boolean) { localStorage.setItem('checked-device-permision', (val ? "True" : "")); }
    public static get IsCheckDevicePermision(): boolean { return localStorage.getItem('checked-device-permision') === "True" }
    

    /**
     *  ボイスチャットのオプション設定
     */
    public static get VoiceChatOptions(): VoiceChatOptions {
        let value = localStorage.getItem('voice-chat-options');
        return (value ? JSON.parse(value) as VoiceChatOptions : new VoiceChatOptions());
    }
    public static SetVoiceChatOptions(setoptions: OnSetVoiceChatOptions) {
        let options = this.VoiceChatOptions;
        setoptions(options);
        localStorage.setItem('voice-chat-options', JSON.stringify(options));
    }


    /**
     *  ライブキャストのオプション設定
     */
    public static get LiveCastOptions(): LiveCastOptions {
        let value = localStorage.getItem('live-cast-options');
        return (value ? JSON.parse(value) as LiveCastOptions : new LiveCastOptions());
    }
    public static SetLiveCastOptions(setoptions: OnSetLiveCastOptions) {
        let options = this.LiveCastOptions;
        setoptions(options);
        localStorage.setItem('live-cast-options', JSON.stringify(options));
    }




    /**
     * チャット時のEnterの振舞い設定
     */
    public static set ChatEnterMode(val: number) {
        localStorage.setItem('enter-mode', val.toString());
    }
    public static get ChatEnterMode(): number {
        let value = localStorage.getItem('enter-mode');
        return (value ? Number.parseInt(value) : 0);
    }


    /**
     * アクター変更のショートカットキーのモード
     */
    public static set ActorChangeKeyMode(val: number) {
        localStorage.setItem('actor-change-keymode', val.toString());
    }
    public static get ActorChangeKeyMode(): number {
        let value = localStorage.getItem('actor-change-keymode');
        return (value ? Number.parseInt(value) : 0);
    }

    //  音声認識時の振舞い設定
    public static set VoiceRecognitionMode(val: number) {
        localStorage.setItem('voice-recognition-mode', val.toString());
    }
    public static get VoiceRecognitionMode(): number {
        let value = localStorage.getItem('voice-recognition-mode');
        return (value ? Number.parseInt(value) : 0);
    }

    //  音声認識時の振舞い設定
    public static set ChatMessageCopyMode(val: number) {
        localStorage.setItem('chat-message-copy-mode', val.toString());
    }
    public static get ChatMessageCopyMode(): number {
        let value = localStorage.getItem('chat-message-copy-mode');
        return (value ? Number.parseInt(value) : 0);
    }

}


/**
 * オプション設定の保持：ボイスチャット
 */
export class VoiceChatOptions {
    SelectMic: string;
}


/**
 * オプション設定の保持：ライブキャスト
 */
export class LiveCastOptions {
    SelectMic: string;
    SelectCam: string;
    IsSpeechRecognition: boolean;
    IsIconCursor: boolean;
}


/**
 * オプション設定の保持：スクリーンシェア
 */
export class ScreenShareOptions {
    constructor() {
        this.FrameRage = 15;
        this.Resolution = 1;
        this.IsIconCursor = false;
    }
    Resolution: number;
    FrameRage: number;
    IsIconCursor: boolean;
}


/**
 * ガジェットキャスト時のオプション設定
 */
export class GadgetCastOptions {
    IsIconCursor: boolean;
}

