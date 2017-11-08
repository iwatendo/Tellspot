import AbstractServiceView, { OnViewLoad } from "../../Base/Common/AbstractServiceView";
import WebRTCService from "../../Base/Common/WebRTCService";
import LocalCache from "../../Base/Common/LocalCache";
import StdUtil from "../../Base/Util/StdUtil";
import DeviceUtil, { DeviceKind } from "../../Base/Util/DeviceUtil";
import LogUtil from "../../Base/Util/LogUtil";
import StreamUtil from "../../Base/Util/StreamUtil";

import { DeviceView } from "../DeviceView/DeviceVew";
import CastInstanceController from "./CastInstanceController";
import LinkUtil from "../../Base/Util/LinkUtil";
import { DialogMode } from "../../Base/Common/AbstractDialogController";

export default class CastInstanceView extends AbstractServiceView<CastInstanceController> {

    private _micDeviceView: DeviceView;
    private _camDeviceView: DeviceView;


    /**
     * 初期化処理
     */
    public Initialize(callback: OnViewLoad) {

        StdUtil.StopPropagation();
        StdUtil.StopTouchmove();

        let startButton = document.getElementById('sbj-cast-instance-start');
        let stopButton = document.getElementById('sbj-cast-instance-stop');
        let settingButton = document.getElementById('sbj-cast-instance-settings');
        let micElement = document.getElementById('mic-select-div');
        let camElement = document.getElementById('webcam-select-div');

        //  ストリーミング開始ボタン
        startButton.onclick = (e) => {
            this.Controller.SetStreaming();
            this.ChangeDisplayMode(true);
        }

        //  ストリーミング停止ボタン
        stopButton.onclick = (e) => {
            this.Controller.ServerSend(false, false);
            this.ChangeDisplayMode(false);
        };

        this.SetMediaDevice();

        callback();
    }


    /**
     * 
     * @param isLiveCasting 
     */
    public ChangeDisplayMode(isLiveCasting: boolean) {

        let videoElement = document.getElementById('video');
        let startButton = document.getElementById('sbj-cast-instance-start');
        let stopButton = document.getElementById('sbj-cast-instance-stop');
        let micElement = document.getElementById('mic-select-div');
        let camElement = document.getElementById('webcam-select-div');

        startButton.hidden = isLiveCasting;
        stopButton.hidden = !isLiveCasting;
        micElement.hidden = isLiveCasting;
        camElement.hidden = isLiveCasting;
        //  videoElement.hidden = isLiveCasting;

    }


    /**
     * Video/Audioソースの取得とリストへのセット
     */
    public SetMediaDevice() {

        let controller = this.Controller;

        let preMic = LocalCache.LiveCastOptions.SelectMic;
        let preCam = LocalCache.LiveCastOptions.SelectCam;
        let isInit = (!preMic && !preCam);

        DeviceUtil.GetAudioDevice((devices) => {

            let textElement = document.getElementById('mic-select') as HTMLInputElement;
            var listElement = document.getElementById('mic-list') as HTMLElement;

            var view = new DeviceView(DeviceKind.Audio, textElement, listElement, devices, (deviceId, deviceName) => {
                controller.AudioSource = deviceId;
                LocalCache.SetLiveCastOptions((opt) => opt.SelectMic = deviceId);
                this.ChnageDevice();
            });

            if (isInit) {
                view.SelectFirstDevice();
            } else {
                view.SelectDeivce(preMic);
            }

            this._micDeviceView = view;
            document.getElementById("mic-select-div").classList.add("is-dirty");
            this.ChnageDevice();
        });

        DeviceUtil.GetVideoDevice((devices) => {

            let previewElement = document.getElementById('video') as HTMLVideoElement;
            let textElement = document.getElementById('webcam-select') as HTMLInputElement;
            var listElement = document.getElementById('webcam-list') as HTMLElement;

            var view = new DeviceView(DeviceKind.Video, textElement, listElement, devices, (deviceId, deviceName) => {

                controller.VideoSource = deviceId;
                LocalCache.SetLiveCastOptions((opt) => opt.SelectCam = deviceId);
                this.ChnageDevice();

                if (deviceId) {
                    StreamUtil.SetPreview(previewElement, deviceId);
                }
                else {
                    StreamUtil.StopPreview(previewElement);
                }
            });

            if (isInit) {
                view.SelectFirstDevice();
            } else {
                view.SelectDeivce(preCam);
            }

            this._camDeviceView = view;
            document.getElementById("webcam-select-div").classList.add("is-dirty");
            this.ChnageDevice();
        });

    }


    /**
     * デバイス変更時の共通処理
     */
    public ChnageDevice() {
        let startButton = document.getElementById('sbj-cast-instance-start') as HTMLButtonElement;
        let options = LocalCache.LiveCastOptions;
        startButton.disabled = !((options.SelectCam ? true : false) || (options.SelectMic ? true : false));
    }


    /**
     * 
     * @param hidden 
     */
    public SetControllHidden() {
        document.getElementById('sbj-cast-instance-main').hidden = true;

        let disconnect = document.getElementById('sbj-cast-instance-disconnect');
        if (disconnect)
            disconnect.hidden = false;
    }


    /**
     * フレームを閉じる
     */
    public Close() {
        this.Controller.CastInstance.isClose = true;
        this.Controller.SendCastInfo();
    }

}
