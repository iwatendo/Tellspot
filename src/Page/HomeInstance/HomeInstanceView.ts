import * as JQuery from "jquery";
import StdUtil from "../../Base/Util/StdUtil";
import LinkUtil from "../../Base/Util/LinkUtil";
import AbstractServiceView, { OnViewLoad } from "../../Base/Common/AbstractServiceView";

import HomeInstanceController, { ServentLocation } from "./HomeInstanceController";
import GMapsUtil, { MapPos } from "../../Base/Util/GMapsUtil";
import DeviceUtil, { DeviceKind } from "../../Base/Util/DeviceUtil";
import { DeviceView } from "../DeviceView/DeviceVew";


export default class HomeInstanceView extends AbstractServiceView<HomeInstanceController> {

    /**
     * 初期化処理
     * @param callback 
     */
    protected Initialize(callback: OnViewLoad) {
        StdUtil.StopPropagation();
        this.SetMediaDevice();
    }


    /**
     * 
     * @param peerid ホームインスタンスのPeerID
     */
    public SetCastInstanceUrl(peerid: string) {

        //  URL短縮の為にトップページでCastInstanceにリダイレクトします
        //  let linkUrl = LinkUtil.CreateLink("../CastInstance/", peerid);
        let linkUrl = LinkUtil.CreateLink("../", peerid);

        var qrcode: any = $('#qrcode');
        qrcode.qrcode(linkUrl);

        let clipcopybtn = document.getElementById('sbj-linkcopy') as HTMLInputElement;
        clipcopybtn.onclick = (e) => {
            clipcopybtn.textContent = " 接続URLをクリップボードにコピーしました ";
            StdUtil.ClipBoardCopy(linkUrl);
            clipcopybtn.disabled = true;
            window.setTimeout(() => {
                clipcopybtn.textContent = " 接続URLをクリップボードにコピー ";
                clipcopybtn.disabled = false;
            }, 2000);
        };
    }



    public ChnageDisplayMode(isLive: boolean) {
        document.getElementById('top-cell').hidden = isLive;
        document.getElementById('setting-cell').hidden = isLive;
        document.getElementById('livecast-cell').hidden = !isLive;
        document.getElementById('map-cell').hidden = !isLive;
    }


    /**
     * Audioソースの取得とリストへのセット
     */
    public SetMediaDevice() {

        DeviceUtil.GetVideoDevice((devices) => {

            let textElement = document.getElementById('camera-select') as HTMLInputElement;
            var listElement = document.getElementById('camera-list') as HTMLElement;

            var view = new DeviceView(DeviceKind.Video, textElement, listElement, devices, (deviceId, deviceName) => {
                (document.getElementById('select-video-device') as HTMLInputElement).value = deviceId;
            });

            view.SelectFirstDevice();

            document.getElementById("camera-select-div").classList.add("is-dirty");
        });


        DeviceUtil.GetAudioDevice((devices) => {

            let textElement = document.getElementById('mic-select') as HTMLInputElement;
            var listElement = document.getElementById('mic-list') as HTMLElement;

            var view = new DeviceView(DeviceKind.Audio, textElement, listElement, devices, (deviceId, deviceName) => {
                (document.getElementById('select-audio-device') as HTMLInputElement).value = deviceId;
            });

            view.SelectFirstDevice();

            document.getElementById("mic-select-div").classList.add("is-dirty");
        });

    }


    /**
     * 
     * @param sl 
     */
    public NotifyServent(sl: ServentLocation) {

        let frame = document.getElementById('livecast') as HTMLIFrameElement;
        
        if(sl.Locate.permission){
            GMapsUtil.GetAddress(sl.Locate, (name) => {
                this.ChnageDisplayMode(true);
                GMapsUtil.CreateMap('#map', sl.Locate);
                frame.src = sl.Servent.clientUrl;
                this.SetLocation(sl.Locate);
            });       
        }
        else{
            this.ChnageDisplayMode(true);
            frame.src = sl.Servent.clientUrl;
        }
    }


    /**
     * 
     * @param locate 
     */
    public SetLocation(locate: MapPos) {
        if (locate.permission) {
            GMapsUtil.DrawOverlay(locate, '<div class="overlay">中継現場<div class="overlay_arrow above"></div></div>');
        }
    }

    /**
     * 
     */
    public NotifyCloseServent() {
        this.ChnageDisplayMode(false);
        let frame = document.getElementById('livecast') as HTMLIFrameElement;
        frame.src = "";
    }

}
