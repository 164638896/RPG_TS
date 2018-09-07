/*
* name;
*/
class NpcConfig {

    private mNpcDict: laya.utils.Dictionary = new laya.utils.Dictionary;

    private static _instance = null;
    public static getInstance(): NpcConfig {
        if (NpcConfig._instance == null) {
            NpcConfig._instance = new NpcConfig();
        }
        return NpcConfig._instance;
    }

    public load(url:string) {
        let arr = Laya.loader.getRes(url);

        for (let i = 0; i < arr.length; ++i) {
            this.mNpcDict.set(arr[i].id, arr[i]);
        }

        Laya.loader.clearRes(url, true);
    }

    public getNpc(typeId: number): Npccfg {
        return this.mNpcDict.get(typeId);
    }
}