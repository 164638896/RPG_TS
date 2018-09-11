/*
* name;
*/

class BuffConfig {

    private mBehaviorDict: laya.utils.Dictionary = new laya.utils.Dictionary;
    private mMoveDict: laya.utils.Dictionary = new laya.utils.Dictionary;
    private mHurtDict: laya.utils.Dictionary = new laya.utils.Dictionary;
    private mControlDict: laya.utils.Dictionary = new laya.utils.Dictionary;

    private static _instance = null;
    public static getInstance(): BuffConfig {
        if (BuffConfig._instance == null) {
            BuffConfig._instance = new BuffConfig();
        }
        return BuffConfig._instance;
    }

    public loadBehaviorBuff(url: string) {
        let arr = Laya.loader.getRes(url);

        for (let i = 0; i < arr.length; ++i) {
            this.mBehaviorDict.set(arr[i].id, arr[i]);
        }

        Laya.loader.clearRes(url, true);
    }

    public loadMoveBuff(url: string) {
        let arr = Laya.loader.getRes(url);

        for (let i = 0; i < arr.length; ++i) {
            this.mMoveDict.set(arr[i].id, arr[i]);
        }

        Laya.loader.clearRes(url, true);
    }

    public loadHurtBuff(url: string) {
        let arr = Laya.loader.getRes(url);

        for (let i = 0; i < arr.length; ++i) {
            this.mHurtDict.set(arr[i].id, arr[i]);
        }

        Laya.loader.clearRes(url, true);
    }

    public loadControlBuff(url: string) {
        let arr = Laya.loader.getRes(url);

        for (let i = 0; i < arr.length; ++i) {
            this.mControlDict.set(arr[i].id, arr[i]);
        }

        Laya.loader.clearRes(url, true);
    }

    public getBehaviorBuff(typeId: number): Behaviorbuffcfg {
        return this.mBehaviorDict.get(typeId);
    }

    public getMoveBuff(typeId: number): Movebuffcfg {
        return this.mMoveDict.get(typeId);
    }

    public getHurtBuff(typeId: number): Hurtbuffcfg {
        return this.mHurtDict.get(typeId);
    }

    public getControlBuff(typeId: number): Controlbuffcfg {
        return this.mControlDict.get(typeId);
    }
}