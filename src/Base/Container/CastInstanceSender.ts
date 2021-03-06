import Sender from "../../Base/Container/Sender";


/**
 * 配信する種類
 */
export enum CastTypeEnum {
    None = 0,
    LiveCast = 1,
    ScreenShare = 2,
    Gadget = 3,
}


/**
 *  ライブキャストの起動通知 及び 設定変更通知
 *  CastInstance の起動元クライアント (HomeVisitor) へ通知
 */
export default class CastInstanceSender extends Sender {

    public static ID = "CastInstance";

    constructor(type: CastTypeEnum) {
        super(CastInstanceSender.ID)
        this.castType = type;
        this.isCasting = false;
        this.isClose = false;
    }

    /**
     * 配信している種類
     */
    castType: CastTypeEnum;

    /**
     * 配信元のURL
     */
    instanceUrl: string;

    /**
     * 配信元に接続する為のクライアントURL
     */
    clientUrl: string;

    /**
     * 配信有無（クライアントの起動可否）
     * ※False時、配信元インスタンスは起動状態ですが、クライアントは接続されません。
     */
    isCasting: boolean;

    /**
     * 終了通知
     */
    isClose: boolean;

}


