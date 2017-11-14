
import AbstractServiceController from "../../Base/Common/AbstractServiceController";
import StdUtil from "../../Base/Util/StdUtil";
import LinkUtil from "../../Base/Util/LinkUtil";
import LogUtil from "../../Base/Util/LogUtil";
import CursorCache from "../../Base/Common/CursorCache";
import CastInstanceSender, { CastTypeEnum } from "../../Base/Container/CastInstanceSender";

import IconCursorSender from "../../Base/Container/IconCursorSender";
import CastInstanceModel from "./CastInstanceModel";
import CastInstanceView from "./CastInstanceView";
import { CastInstanceReceiver } from "./CastInstanceReceiver";
import StreamUtil from "../../Base/Util/StreamUtil";
import SWRoomController from "../../Base/Common/Connect/SWRoomController";
import { SWRoomMode } from "../../Base/Common/Connect/SWRoom";


export default class CastInstanceController extends AbstractServiceController<CastInstanceView, CastInstanceModel> {

    public ControllerName(): string { return "CastInstance"; }

    public View: CastInstanceView;
    public Stream: MediaStream;

    public CastInstance = new CastInstanceSender(CastTypeEnum.LiveCast);
    public CursorCache: CursorCache;

    /**
     *
     */
    constructor() {
        super();
        this.Receiver = new CastInstanceReceiver(this);
        this.View = new CastInstanceView(this, () => { });
        this.CursorCache = new CursorCache();
    };


    private _peerid: string = null;


    /**
     * 自身のPeer生成時イベント
     * @param peer
     */
    public OnPeerOpen(peer: PeerJs.Peer) {
        this._peerid = peer.id;
    }

    /**
     * 切断時処理
     */
    public OnPeerClose() {
        if (this.IsOpen) {
            this.ServerSend(false, true);
        }
    }


    /**
     * オーナー接続時イベント
     */
    public OnOwnerConnection() {
        this.CastInstance = new CastInstanceSender(CastTypeEnum.LiveCast);
        this.CastInstance.instanceUrl = location.href;
        this.CastInstance.clientUrl = LinkUtil.CreateLink('../CastVisitor/index.html', this._peerid);
        this.SwPeer.SendToOwner(this.CastInstance);
    }


    /**
     * オーナー側が切断した場合
     */
    public OnOwnerClose() {
        //  全てのクライアントとの接続を終了します
        this.SwPeer.Close();
        let msg = "接続先のブラウザが閉じられました。\nまたはネットワークが切断されました。\n";
        this.View.SetError(msg);
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
        this.CursorCache.Remove(conn.peer);
    }


    /**
     * ストリーミングの開始
     */
    public StartStreaming() {
        this.SwRoomController = new SWRoomController(this.SwPeer, this.SwPeer.PeerId, SWRoomMode.Mesh, this.View.SetMediaStream);
        this.SwRoomController.SetStream(this.Stream);

        this.ServerSend(true, false);
    }


    /**
     * ストリーミングの停止
     */
    public StopStreaming() {
        StreamUtil.Stop(this.Stream);
        this.ServerSend(false, false);
    }


    /**
     * ストリーミングの開始/停止の通知
     * @param isStreaming 
     */
    public ServerSend(isStreaming: boolean, isClose: boolean) {

        if (!isClose && this.CastInstance.isCasting == isStreaming)
            return;

        this.CastInstance.isCasting = isStreaming;
        this.CastInstance.isClose = isClose;
        this.SendCastInfo();
    }


    /**
     * ストリーミングの開始/停止の通知
     */
    public SendCastInfo() {

        //  オーナー側への通知
        if (this.CastInstance) {
            this.SwPeer.SendToOwner(this.CastInstance);
        }
    }

};
