/*
* name;
*/
class SkillConfig {

    private mSkillDict={};

    private static _instance = null;
    public static getInstance(): SkillConfig {
        if (SkillConfig._instance == null) {
            SkillConfig._instance = new SkillConfig();
        }
        return SkillConfig._instance;
    }

    public load(url:string) {
        let arr = Laya.loader.getRes(url);

        for (let i = 0; i < arr.length; ++i) {
            this.mSkillDict[arr[i].id] = arr[i];
        }

        Laya.loader.clearRes(url);
    }

    public getSkillInfo(typeId: number): Skillcfg {
        return this.mSkillDict[typeId];
    }
}