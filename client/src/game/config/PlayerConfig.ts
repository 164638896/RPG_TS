/*
* name;
*/
class PlayerConfig {

    private mPlayerDict={};

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
            this.mPlayerDict[arr[i].id] = arr[i];
        }

        Laya.loader.clearRes(url);
    }

    public getPlayer(typeId: number): Playercfg {
        return this.mPlayerDict[typeId];
    }
}