import Sender from "../../Base/Container/Sender";
import ActorInfo from "../../Base/Container/ActorInfo";
import { CastTypeEnum } from "../../Base/Container/CastInstanceSender";


/**
 * 接続情報
 */
export class ConnInfoSender extends Sender {
    public static ID = "ConnInfo";

    constructor() {
        super(ConnInfoSender.ID);
        this.starttime = Date.now();
        this.isBootCheck = false;
        this.isMultiBoot = false;
    }

    starttime: number;
    isBootCheck: boolean;
    isMultiBoot: boolean;
}


/**
 * 強制終了通知
 */
export class ForcedTerminationSender extends Sender {

    public static ID = "ForcedTermination";

    constructor() {
        super(ForcedTerminationSender.ID);
    }
}


/**
 * サーバントの起動通知
 */
export class ServentSender extends Sender {

    public static ID = "Servent";

    constructor() {
        super(ServentSender.ID);

        this.serventPeerId = "";
        this.ownerPeerid = "";
        this.ownerAid = "";
        this.ownerIid = "";
        this.hid = "";
        this.clientUrl = "";
        this.instanceUrl = "";
        this.castType = CastTypeEnum.None;
        this.isCasting = false;
    }

    public serventPeerId: string;

    public ownerPeerid: string;

    public ownerAid: string;

    public ownerIid: string;

    public hid: string;

    public clientUrl: string;

    public instanceUrl: string;

    public castType: CastTypeEnum;

    /**
     * 配信有無
     * インスタンスが起動していても、以下のフラグがTrueになっていない場合配信されない事に注意
     */
    public isCasting: boolean;
}


/**
 * サーバントの終了通知
 */
export class ServentCloseSender extends Sender {

    public static ID = "ServentClose";

    constructor() {
        super(ServentCloseSender.ID);

        this.serventPeerId = "";
        this.ownerPeerid = "";
    }

    public serventPeerId: string;

    public ownerPeerid: string;
}



