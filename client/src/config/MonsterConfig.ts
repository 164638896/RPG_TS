/*
* name;
*/
class MonsterConfig {

    private mMonsterDict: laya.utils.Dictionary = new laya.utils.Dictionary;

    private static _instance = null;
    public static getInstance(): MonsterConfig {
        if (MonsterConfig._instance == null) {
            MonsterConfig._instance = new MonsterConfig();
        }
        return MonsterConfig._instance;
    }

    public load(url:string) {
        let arr = Laya.loader.getRes(url);

        for (let i = 0; i < arr.length; ++i) {
            this.mMonsterDict.set(arr[i].id, arr[i]);
        }

        Laya.loader.clearRes(url, true);
    }

    public getMonster(typeId: number): Monstercfg {
        return this.mMonsterDict.get(typeId);
    }
}