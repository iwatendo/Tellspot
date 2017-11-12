import StdUtil from "../../Util/StdUtil";
import LogUtil from "../../Util/LogUtil";
import { IServiceController } from "../IServiceController";
import SWPeer from "./SWPeer";
import SWRoom, { ISWRoom, SWRoomMode } from "./SWRoom";


interface OnGetMediaStream { (stream: MediaStream): void }
declare var SkyWay: any;

export default class SWRoomController implements ISWRoom {

    private _elementMap = new Map<string, HTMLVideoElement>();

    public Room: SWRoom;

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
    public SetVideoElement(peerid: string, videoElement: HTMLVideoElement) {
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
    public Reflash(){
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
     * 
     * @param peerid 
     */
    public GetVideoElement(peerid : string): HTMLVideoElement {

        if (this._elementMap.has(peerid)) {
            return this._elementMap.get(peerid);
        }
        else {
            let newElement = document.createElement('video_' + peerid) as HTMLVideoElement;
            newElement.id = peerid;
            this._elementMap.set(peerid, newElement);
            return newElement;
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

        let element = this.GetVideoElement(peerid);

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
        let element = this.GetVideoElement(peerid);

        if (element) {
            element.pause();
        }
    }

}