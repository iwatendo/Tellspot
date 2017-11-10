
import StdUtil from "../Util/StdUtil";

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

}
