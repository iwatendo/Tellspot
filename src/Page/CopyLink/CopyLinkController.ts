
import AbstractServiceController from "../../Base/Common/AbstractServiceController";
import LocalCache from "../../Base/Common/LocalCache";
import LogUtil from "../../Base/Util/LogUtil";

import CopyLinkView from "./CopyLinkView";
import CopyLinkModel from "./CopyLinkModel";


/**
 * 
 */
export default class CopyLinkController extends AbstractServiceController<CopyLinkView, CopyLinkModel> {

    public ControllerName(): string { return "CopyLink"; }

    /**
     *
     */
    constructor() {
        super();
        this.View = new CopyLinkView(this, () => { });
    };

};
