import Sender from "../../Base/Container/Sender";
import { MapPos } from "../../Base/Util/GMapsUtil";


export class MapLocationSender extends Sender {

    public static ID = "MapLocation";

    constructor() {
        super(MapLocationSender.ID);
        this.Location = null;
    }

    public Location: MapPos;

}


export class ConnectionErrorSender extends Sender {
    public static ID = "ConnectionError";

    constructor(msg: string) {
        super(ConnectionErrorSender.ID);
        this.Message = msg;
    }

    public Message: string;

}