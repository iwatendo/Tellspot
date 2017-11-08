
import WebRTCService from "../../Base/Common/WebRTCService";

import * as HIContainer from "./HomeInstanceContainer";
import HomeInstanceController from "./HomeInstanceController";

export default class InstanceManager {

    private _controller: HomeInstanceController;
    private _peerServentMap = new Map<string, Array<HIContainer.ServentSender>>();    /* MAP : PeerID / Array<ServentSender> */


    public get Controller(): HomeInstanceController {
        return this._controller;
    }


    /**
     * コンストラクタ
     * @param controller 
     * @param roomManager 
     */
    constructor(controller: HomeInstanceController) {
        this._controller = controller;
    }


    /**
     * サーバントの起動/変更通知
     * @param servent 
     */
    public SetServent(servent: HIContainer.ServentSender) {

        let peerid = servent.ownerPeerid;

        if (!this._peerServentMap.has(peerid)) {
            this._peerServentMap.set(peerid, new Array<HIContainer.ServentSender>());
        }

        let preList = this._peerServentMap.get(servent.ownerPeerid);
        let newList = preList.filter((pre) => pre.serventPeerId !== servent.serventPeerId);
        newList.push(servent);

        this._peerServentMap.set(peerid, newList);
    }


    /**
     * サーバントの終了通知
     * @param servent 
     */
    public CloseServent(servent: HIContainer.ServentCloseSender) {

        let peerid = servent.ownerPeerid;

        if (!this._peerServentMap.has(peerid)) {
            return;
        }

        let preList = this._peerServentMap.get(servent.ownerPeerid);
        let newList = new Array<HIContainer.ServentSender>();
        let removeServent: HIContainer.ServentSender = null;

        this._peerServentMap.get(servent.ownerPeerid).forEach(pre => {
            if (pre.serventPeerId === servent.serventPeerId) {
                removeServent = pre;
            }
            else {
                newList.push(pre);
            }
        });

        if (removeServent !== null) {
            this._peerServentMap.set(peerid, newList);
        }

    }


    /**
     * サーバントの親サーバーントが終了した場合、
     * その親が保持していた子サーバントを全て削除
     * @param ownerPeerId 
     */
    public CloseServentOwner(peerid: string) {

        if (!this._peerServentMap.has(peerid)) {
            return;
        }

        let preList = this._peerServentMap.get(peerid);

        if (preList.length === 0) {
            return;
        }

        this._peerServentMap.set(peerid, new Array<HIContainer.ServentSender>());

    }

}