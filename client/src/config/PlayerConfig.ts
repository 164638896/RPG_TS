/*
* name;
*/
class PlayerConfig {

    private mPlayerDict: laya.utils.Dictionary = new laya.utils.Dictionary;

    private static _instance = null;
    public static getInstance(): PlayerConfig {
        if (PlayerConfig._instance == null) {
            PlayerConfig._instance = new PlayerConfig();
        }
        return PlayerConfig._instance;
    }

    public load(url:string) {
        let arr = Laya.loader.getRes(url);

        for (let i = 0; i < arr.length; ++i) {
            this.mPlayerDict.set(arr[i].id, arr[i]);
        }

        Laya.loader.clearRes(url, true);
    }

    public getPlayerInfo(typeId: number): Playercfg {
        return this.mPlayerDict.get(typeId);
    }
}