import Sender from "../../Base/Container/Sender";


/**
 * ライブキャストの設定要求
 * キャスト表示クライアント(CastVisitor)起動時に、キャスト元(CastInstance)へ設定を要求する為のSender
 */
export class GetCastSettingSedner extends Sender {

    public static ID = "GetCastInfo";

    constructor() {
        super(GetCastSettingSedner.ID);
    }
}