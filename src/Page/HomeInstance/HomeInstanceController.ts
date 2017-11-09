
import AbstractServiceController from "../../Base/Common/AbstractServiceController";
import LocalCache from "../../Base/Common/LocalCache";
import WebRTCService from "../../Base/Common/WebRTCService";
import LogUtil from "../../Base/Util/LogUtil";

import * as HIContainer from "./HomeInstanceContainer";
import HomeInstanceReceiver from "./HomeInstanceReceiver";
import HomeInstanceView from "./HomeInstanceView";
import HomeInstanceModel from "./HomeInstanceModel";
import { MapPos } from "../../Base/Util/GMapsUtil";
import CastInstanceSender from "../../Base/Container/CastInstanceSender";


/**
 * 
 */
export class ServentLocation {
    public Servent: CastInstanceSender;
    public Locate: MapPos;
    public IsNotify: boolean;
}


/**
 * 
 */
export default class HomeInstanceController extends AbstractServiceController<HomeInstanceView, HomeInstanceModel> {

    public ControllerName(): string { return "HomeInstance"; }

    public PeerID: string;
    private _serventMap = new Map<string, ServentLocation>();


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
    }


    /**
     * 
     * @param peerid 
     * @param servent 
     * @param pos 
     */
    public SetServentLocation(peerid: string, servent: CastInstanceSender, pos: MapPos) {

        let sl: ServentLocation;

        if (this._serventMap.has(peerid)) {
            sl = this._serventMap.get(peerid);
        }
        else {
            sl = new ServentLocation();
            sl.IsNotify = false;
            this._serventMap.set(peerid, sl);
        }

        if (servent) sl.Servent = servent;
        if (pos) sl.Locate = pos;

        if (sl.Servent && sl.Locate && !sl.IsNotify) {
            //  サーバーント情報と位置情報の両方が揃ったら通知する
            sl.IsNotify = true;
            this.View.NotifyServent(sl);
        }

    }

};
