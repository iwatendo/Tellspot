


declare var GMaps: any;

interface OnGetLocate { (latitude:number, longitude:number ): void }

/**
 * 
 */
export default class GMapsUtil {

    /**
     * 位置情報を取得します
     * @param callback 
     */
    public static GetLocate(callback: OnGetLocate){

        GMaps.geolocate({
            success: (position)=> {
                callback(position.coords.latitude, position.coords.longitude);
            },
            error: (error)=> {
                alert('位置情報の取得に失敗しました : ' + error.message);
            },
            not_supported: ()=> {
                alert("位置情報の取得に対応していないブラウザまたは端末です");
            },
            always: ()=> {
            }
        });    
    }

}