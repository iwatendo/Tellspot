import StdUtil from "../../Base/Util/StdUtil";
import HomeInstanceController from "./CopyLinkController";

let controller : HomeInstanceController;

if (StdUtil.IsExecute()) {
    controller = new HomeInstanceController();
}