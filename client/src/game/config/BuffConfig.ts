/*
* name;
*/

class BuffConfig {

    private mBehaviorDict={};
    private mMoveDict={};
    private mHurtDict={};
    private mControlDict={};

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
            this.mBehaviorDict[arr[i].id] = arr[i];
        }

        Laya.loader.clearRes(url);
    }

    public loadMoveBuff(url: string) {
        let arr = Laya.loader.getRes(url);

        for (let i = 0; i < arr.length; ++i) {
            this.mMoveDict[arr[i].id] = arr[i];
        }

        Laya.loader.clearRes(url);
    }

    public loadHurtBuff(url: string) {
        let arr = Laya.loader.getRes(url);

        for (let i = 0; i < arr.length; ++i) {
           this.mHurtDict[arr[i].id] = arr[i];
        }

        Laya.loader.clearRes(url);
    }

    public loadControlBuff(url: string) {
        let arr = Laya.loader.getRes(url);

        for (let i = 0; i < arr.length; ++i) {
            this.mControlDict[arr[i].id] = arr[i];
        }

        Laya.loader.clearRes(url);
    }

    public getBehaviorBuff(typeId: number): Behaviorbuffcfg {
        return this.mBehaviorDict[typeId];
    }

    public getMoveBuff(typeId: number): Movebuffcfg {
        return this.mMoveDict[typeId];
    }

    public getHurtBuff(typeId: number): Hurtbuffcfg {
        return this.mHurtDict[typeId];
    }

    public getControlBuff(typeId: number): Controlbuffcfg {
        return this.mControlDict[typeId];
    }
}