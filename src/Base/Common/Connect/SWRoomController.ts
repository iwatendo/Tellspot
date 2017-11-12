import StdUtil from "../../Util/StdUtil";
import LogUtil from "../../Util/LogUtil";
import { IServiceController } from "../IServiceController";
import SWPeer from "./SWPeer";
import SWRoom, { ISWRoom, SWRoomMode } from "./SWRoom";


interface OnGetMediaStream { (stream: MediaStream): void }

/**
 * ストリームが送られて来た時のHTMLMediaElementの生成イベント
 */
interface OnRoomStreamMediaElement { (peerid: string): HTMLMediaElement }

declare var SkyWay: any;

export default class SWRoomController implements ISWRoom {

    private _elementMap = new Map<string, HTMLMediaElement>();

    public Room: SWRoom;

    public OnRoomStreamMediaElement: OnRoomStreamMediaElement;

    /**
     * コンストラクタ
     * @param swPeer 
     * @param roomName 
     * @param mode 
     * @param stream 
     */
    constructor(swPeer: SWPeer, roomName: string, mode: SWRoomMode, stream: MediaStream = null) {
        this.Room = new SWRoom(this, swPeer.Service, swPeer.Peer, roomName, mode, stream);
    }


    /**
     * 
     * @param peerid 
     * @param videoElement 
     */
    public SetMediaElement(peerid: string, videoElement: HTMLMediaElement) {
        if (this._elementMap.has(peerid)) {
            let preElement = this._elementMap.get(peerid);
        }
        else {
            this._elementMap.set(peerid, videoElement);
        }
    }


    /**
     * 
     * @param stream 
     */
    public SetStream(stream: any) {
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

        let map = this._elementMap;
        let element: HTMLMediaElement;

        if (map.has(peerid)) {
            element = map.get(peerid);
        }
        else if (this.OnRoomStreamMediaElement) {
            element = this.OnRoomStreamMediaElement(peerid)
            map.set(peerid, element);
        }

        if (element) {
            element.srcObject = stream;
            element.play();
        }
    }


    /**
     * 
     * @param peerid 
     * @param stream 
     */
    public OnRoomRemoveStream(peerid: string, stream: MediaStream) {

        if (this._elementMap.has(peerid)) {
            let element = this._elementMap.get(peerid);
            element.pause();
        }
    }

}