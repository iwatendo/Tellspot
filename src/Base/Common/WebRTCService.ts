import { IServiceController } from "./IServiceController";
import Sender from "../Container/Sender";
import LocalCache from "./LocalCache";
import SWPeer from "./Connect/SWPeer";
import SWRoomController from "./Connect/SWRoomController";
import { SWRoomMode } from "./Connect/SWRoom";


export default class WebRTCService {

    private static _swPeer: SWPeer;
    private static _swRoomController: SWRoomController;


    /**
     * 
     */
    public static get SwPeer(): SWPeer {
        return this._swPeer;
    }


    /**
     * サービス開始
     * @param service 
     * @param ownerid 
     */
    public static Start(service: IServiceController, ownerid: string, callback = null) {

        Sender.Uid = LocalCache.UserID;

        this._swPeer = new SWPeer(service, ownerid, () => {
            if (callback) {
                callback();
            }
        });
    }


    /**
     * ストリーミング開始
     * CastInstance等の、配信オーナーが呼ぶ処理
     * @param stream 
     */
    public static StartStreaming(stream: MediaStream) {
        //  自身のPeerIDでRoom生成
        this._swRoomController = new SWRoomController(this._swPeer, this._swPeer.PeerId, SWRoomMode.Mesh);
        this._swRoomController.SetStream(stream);
    }


    /**
     * ルームに接続します
     * @param ownerid 
     * @param stream 
     * @param videoElement 
     */
    public static RoomJoin(ownerid: string, stream: MediaStream = null, videoElement: HTMLVideoElement = null) {

        this._swRoomController = new SWRoomController(this._swPeer, ownerid, SWRoomMode.Mesh, stream);
        if (videoElement) {
            this._swRoomController.SetVideoElement(ownerid, videoElement);
        }

    }


    /**
     * ストリームのリフレッシュ
     */
    public static Reflash() {
        this._swRoomController.Reflash();
    }


    //  SWPeer Wrapper
    public static PeerId(): string { return (this._swPeer ? this._swPeer.PeerId : ""); }
    public static OwnerPeerId(): string { return (this._swPeer ? this._swPeer.OwnerPeerId : ""); }
    public static GetAliveConnectionCount(): number { return this._swPeer.GetAliveConnectionCount(); }
    public static Close() { this._swPeer.Close(); }
    public static SendToOwner(data: Sender) { this._swPeer.SendToOwner(data); }
    public static SendTo(peer: string | PeerJs.DataConnection, data: Sender) { this._swPeer.SendTo(peer, data); }
    public static SendAll(data: Sender) { this._swPeer.SendAll(data); }

}