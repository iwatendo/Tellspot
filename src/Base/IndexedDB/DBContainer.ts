
import * as Personal from "../../Base/IndexedDB/Personal";
import { OnModelLoad } from "../Common/AbstractServiceModel";

export default class DBContainer {

    public PersonalDB: Personal.DB;

    /**
     * 
     */
    public constructor() {
        this.PersonalDB = new Personal.DB();
    }


    /**
     * 初期化処理
     * @param callback 
     */
    public RemoveAll(callback: OnModelLoad) {

        this.PersonalDB.Remove(() => {
                callback();
        });
    }


    /**
     * IndexedDBへの接続
     * @param callback 
     * @param isBootInit 
     */
    public ConnectAll(callback: OnModelLoad) {

        this.PersonalDB.Connect(() => {        });
    }
}
