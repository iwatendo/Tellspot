
import LinkUtil from "../../Base/Util/LinkUtil";
import StdUtil from "../../Base/Util/StdUtil";
import AbstractServiceModel, { OnModelLoad, OnRead, OnWrite } from "../../Base/Common/AbstractServiceModel";

import HomeInstanceController from "./HomeInstanceController";


export default class HomeInstanceModel extends AbstractServiceModel<HomeInstanceController> {

    /**
     * 初期化処理
     * @param callback 
     */
    protected Initialize(callback: OnModelLoad) {
    }

}
