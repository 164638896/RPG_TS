/*
* name;
*/

class SceneConfig {

    private mSceneDict: laya.utils.Dictionary = new laya.utils.Dictionary;

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
            this.mSceneDict.set(arr[i].id, arr[i]);
        }

        Laya.loader.clearRes(url, true);
    }

    public getSceneInfo(typeId: number): Scenecfg {
        return this.mSceneDict.get(typeId);
    }
}