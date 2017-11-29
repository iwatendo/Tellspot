import StdUtil from "../Util/StdUtil";
import LogUtil from "../Util/LogUtil";
import { IServiceController } from "../Common/IServiceController";
import SWPeer from "./SWPeer";
import SWRoom, { ISWRoom, SWRoomMode } from "./SWRoom";


interface OnRoomStream { (peerid: string, stream: MediaStream, isAlive: boolean): void }

/**
 * ストリームが送られて来た時のHTMLMediaElementの生成イベント
 */
interface OnRoomStreamMediaElement { (peerid: string): HTMLMediaElement }

export default class SWRoomController implements ISWRoom {

    public Room: SWRoom;

    private _onRoomStream: OnRoomStream;

    /**
     * コンストラクタ
     * @param swPeer 
     * @param roomName 
     * @param mode 
     * @param stream 
     */
    constructor(swPeer: SWPeer, roomName: string, mode: SWRoomMode, onRoomStream: OnRoomStream, stream: MediaStream = null) {
        this._onRoomStream = onRoomStream;
        this.Room = new SWRoom(this, swPeer.Service, swPeer.Peer, roomName, mode, stream);
    }


    /**
     * 
     * @param stream 
     */
    public SetStream(stream: MediaStream) {
        this.Room.SetStream(stream);
    }


    /**
     * ストリームのリフレッシュ
     */
    public Reflash() {
        this.Room.Refresh();
    }


    /**
     * 接続している部屋から離脱します
     */
    public LeaveRoom() {
        if (this.Room) {
            this.Room.Close();
        }
    }


    /**
     * スリープ関数
     * @param milliseconds 
     */
    private Sleep(milliseconds: number) {
        return new Promise<void>(resolve => { setTimeout(() => resolve(), milliseconds); });
    }


    /**
     * 
     */
    public OnRoomOpen() {
    }


    /**
     * 
     * @param err 
     */
    public OnRoomError(err: any) {
    }


    /**
     * 
     */
    public OnRoomClose() {
    }


    /**
     * 
     * @param peerid 
     */
    public OnRoomPeerJoin(peerid: string) {
    }


    /**
     * 
     * @param peerid 
     */
    public OnRoomPeerLeave(peerid: string) {
    }


    /**
     * 
     * @param peerid 
     * @param recv 
     */
    public OnRoomRecv(peerid: string, recv: any) {
    }


    /**
     * 
     * @param peerid 
     * @param stream 
     */
    public OnRoomStream(peerid: string, stream: MediaStream) {
        this._onRoomStream(peerid,stream,true);
    }


    /**
     * 
     * @param peerid 
     * @param stream 
     */
    public OnRoomRemoveStream(peerid: string, stream: MediaStream) {
        this._onRoomStream(peerid,stream,false);
    }

}