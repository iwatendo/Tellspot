﻿
import AbstractServiceController from "../../Base/Common/AbstractServiceController";
import WebRTCService from "../../Base/Common/WebRTCService";
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


export default class CastInstanceController extends AbstractServiceController<CastInstanceView, CastInstanceModel> {

    public ControllerName(): string { return "CastInstance"; }

    public View: CastInstanceView;

    public CastInstance = new CastInstanceSender(CastTypeEnum.LiveCast);

    public AudioSource: string = null;
    public VideoSource: string = null;

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
        WebRTCService.SendToOwner(this.CastInstance);
    }


    /**
     * オーナー側が切断した場合
     */
    public OnOwnerClose() {
        //  全てのクライアントとの接続を終了します
        WebRTCService.Close();
        this.View.SetControllHidden();
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
    public SetStreaming() {

        StreamUtil.GetStreaming(this.AudioSource, this.VideoSource, (stream) => {
            WebRTCService.StartStreaming(stream);
        });

        //  オーナー 及び 接続クライアントに通知
        this.ServerSend((this.AudioSource !== "" || this.VideoSource !== ""), false);
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
            WebRTCService.SendToOwner(this.CastInstance);
        }
    }

};