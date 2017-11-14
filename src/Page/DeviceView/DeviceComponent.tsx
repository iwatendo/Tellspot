import * as React from 'react';
import * as ReactDOM from 'react-dom';

import DeviceItemComponent from "./DeviceItemComponent";
import { DeviceView } from "./DeviceVew";
import DeviceUtil from '../../Base/Util/DeviceUtil';


/**
 * プロパティ
 */
export interface DeviceProp {
    owner: DeviceView;
    deviceList: Array<any>;
}


export default class DeviceComponent extends React.Component<DeviceProp, any> {

    /**
     * コンストラクタ
     * @param props
     * @param context
     */
    constructor(props?: DeviceProp, context?: any) {
        super(props, context);
    }


    /**
     * 
     */
    public render() {

        let deviceTable = this.props.deviceList.map((device, index, array) => {
            let name = DeviceUtil.Set(device);
            return (<DeviceItemComponent key={name} owner={this.props.owner} deviceId={device.deviceId} deviceName={name} />);
        });

        return (
            <div>
                {deviceTable}
            </div>
        );
    }

}
