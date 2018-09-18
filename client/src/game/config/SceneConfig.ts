/*
* name;
*/

class SceneConfig {

    private mSceneDict={};

    private static _instance = null;
    public static getInstance(): SceneConfig {
        if (SceneConfig._instance == null) {
            SceneConfig._instance = new SceneConfig();
        }
        return SceneConfig._instance;
    }

    public load(url:string) {
        let arr = Laya.loader.getRes(url);

        for (let i = 0; i < arr.length; ++i) {
            this.mSceneDict[arr[i].id] = arr[i];
        }

        Laya.loader.clearRes(url);
    }

    public getSceneInfo(typeId: number): Scenecfg {
        return this.mSceneDict[typeId];
    }
}