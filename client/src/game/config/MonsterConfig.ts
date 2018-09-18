/*
* name;
*/
class MonsterConfig {

    private mMonsterDict = {};

    private static _instance = null;
    public static getInstance(): MonsterConfig {
        if (MonsterConfig._instance == null) {
            MonsterConfig._instance = new MonsterConfig();
        }
        return MonsterConfig._instance;
    }

    public load(url: string) {
        let arr = Laya.loader.getRes(url);

        for (let i = 0; i < arr.length; ++i) {
            this.mMonsterDict[arr[i].id] = arr[i];
        }

        Laya.loader.clearRes(url);
    }

    public getMonster(typeId: number): Monstercfg {
        return this.mMonsterDict[typeId];
    }
}