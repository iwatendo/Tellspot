
import AbstractServiceController from "../../Base/Common/AbstractServiceController";
import LocalCache from "../../Base/Common/LocalCache";
import WebRTCService from "../../Base/Common/WebRTCService";
import LogUtil from "../../Base/Util/LogUtil";

import * as HIContainer from "./HomeInstanceContainer";
import HomeInstanceReceiver from "./HomeInstanceReceiver";
import HomeInstanceView from "./HomeInstanceView";
import HomeInstanceModel from "./HomeInstanceModel";
import InstanceManager from "./InstanceManager";

/**
 * 
 */
export default class HomeInstanceController extends AbstractServiceController<HomeInstanceView, HomeInstanceModel> {

    public ControllerName(): string { return "HomeInstance"; }

    public PeerID: string;
    public InstanceManager: InstanceManager;


    /**
     *
     */
    constructor() {
        super();
        this.Receiver = new HomeInstanceReceiver(this);
    };


    /**
     * オーナー接続時イベント
     */
    public OnOwnerConnection() {

        //  通常は呼ばれない。
        //  多重起動が検出されたケースで呼ばれる為、終了通知を出す。
        WebRTCService.SendToOwner(new HIContainer.ForcedTerminationSender());

    }


    /**
     *  オーナ切断時イベント
     */
    public OnOwnerClose() {
    }


    /**
     * 自身のPeer生成時イベント
     * ※サーバー用のPeerID取得時イベント
     * @param peer
     */
    public OnPeerOpen(peer: PeerJs.Peer) {

        this.PeerID = peer.id;

        this.InstanceManager = new InstanceManager(this);
        this.Model = new HomeInstanceModel(this, null);
        this.View = new HomeInstanceView(this, null);
        this.View.SetCastInstanceUrl(this.PeerID);
    }


    /**
     * Peerエラー
     * @param err
     */
    public OnPeerError(err: Error) {

        LogUtil.Error(this, err.name);
        LogUtil.Error(this, err.message);
    }


    /**
     * 
     */
    public OnPeerClose() {
    }


    /**
     * 他クライアントからの接続時イベント
     * @param conn
     */
    public OnChildConnection(conn: PeerJs.DataConnection) {
        super.OnChildConnection(conn);
    }


    /**
     * 切断時イベント
     * @param conn
     */
    public OnChildClose(conn: PeerJs.DataConnection) {
        super.OnChildClose(conn);
        this.InstanceManager.CloseServentOwner(conn.peer);
    }

};
