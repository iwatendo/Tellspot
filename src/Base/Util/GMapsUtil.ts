
declare var google: any;
declare var GMaps: any;

export class MapPos {
    latitude: number;
    longitude: number;
}

export interface OnGetLocate { (mapPos: MapPos): void }
export interface OnGetAddress { (address: string): void }

/**
 * 
 */
export default class GMapsUtil {


    private static _map : any;

    /**
     * 地図を生成します
     * @param div 
     * @param pos 
     */
    public static CreateMap(elementId:string , pos : MapPos){
        this._map = new GMaps({
            div: elementId,
            lat: pos.latitude,
            lng: pos.longitude,
            zoom: 16
        })
    }


    /**
     * 
     * @param pos 
     * @param content 
     */
    public static DrawOverlay(pos: MapPos, content: string){
        this._map.drawOverlay({
            lat: pos.latitude,
            lng: pos.longitude,
            content: content,
            verticalAlign: 'top',
            horizontalAlign: 'center'
        });
    }


    /**
     * 位置情報を取得します
     * @param callback 
     */
    public static GetLocate(callback: OnGetLocate) {

        GMaps.geolocate({
            success: (position) => {
                let result = new MapPos();
                result.latitude = position.coords.latitude;
                result.longitude = position.coords.longitude;
                callback(result);
            },
            error: (error) => { this.Error('位置情報の取得に失敗しました : ' + error.message); },
            not_supported: () => { this.Error("位置情報の取得に対応していないブラウザまたは端末です"); },
            always: () => {
            }
        });
    }


    /**
     * 位置から住所文字列を取得します
     * @param mpos 
     * @param callback 
     */
    public static GetAddress(mpos: MapPos, callback: OnGetAddress) {

        GMaps.geocode({
            lat: mpos.latitude,
            lng: mpos.longitude,
            callback: (results, status) => {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0].geometry) {
                        var address = results[0].formatted_address.replace(/^日本, /, '');
                        callback(address);
                    }
                } else if (status == google.maps.GeocoderStatus.ERROR) {
                    this.Error("通信エラーが発生しました");
                } else if (status == google.maps.GeocoderStatus.INVALID_REQUEST) {
                    this.Error("INVALID_REQUEST");
                } else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                    this.Error("OVER_QUERY_LIMIT");
                } else if (status == google.maps.GeocoderStatus.REQUEST_DENIED) {
                    this.Error("REQUEST_DENIED");
                } else if (status == google.maps.GeocoderStatus.UNKNOWN_ERROR) {
                    this.Error("UNKNOWN_ERROR");
                } else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
                    this.Error("ZERO_RESULTS");
                } else {
                    this.Error("UNKNOWN_ERROR");
                }
            }
        });
    }


    /**
     * 
     * @param message 
     */
    private static Error(message: string) {
        alert('GoogleMap\n' + message);
    }

}