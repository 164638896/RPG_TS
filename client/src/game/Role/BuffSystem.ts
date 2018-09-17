/*
* name;
*/
class BuffSystem {
    public mRole: Role;
    private mCurrBuffList = {};
    private mDeathBuffList = new Array<IBuff>();
    private static mInstId: number;

    constructor(role: Role) {
        this.mRole = role;
        this.mCurrBuffList[BuffType.Behavior] = new Array<IBuff>();
        this.mCurrBuffList[BuffType.Move] = new Array<IBuff>();
        this.mCurrBuffList[BuffType.Hurt] = new Array<IBuff>();
        this.mCurrBuffList[BuffType.Control] = new Array<IBuff>();
    }

    public clear() {
        this.mCurrBuffList = {};
    }

    public addBuff(sendRole: Role, type: BuffType, typeId: number): number {
        let buff: IBuff = null;
        if (type == BuffType.Behavior) {
            if (this.enableBehaviorBuff()) {
                buff = this.getSameBuff(type, typeId);
                if (buff == null) {
                    buff = Laya.Pool.getItemByClass(this.getPoolKey(BuffType.Behavior), BehaviorBuff);
                }
                else {
                    console.log("");
                }
                buff.init(sendRole, this.mRole, BuffConfig.getInstance().getBehaviorBuff(typeId), 0);
            }
        }
        else if (type == BuffType.Move) {
            if (this.enableMoveBuff()) {
                buff = this.getSameBuff(type, typeId);
                if (buff == null) {
                    buff = Laya.Pool.getItemByClass(this.getPoolKey(BuffType.Move), MoveBuff);
                }
                else {
                    console.log("");
                }

                buff.init(sendRole, this.mRole, BuffConfig.getInstance().getMoveBuff(typeId), 0);
            }
        }
        else if (type == BuffType.Hurt) {
            if (this.enableHurtBuff()) {
                buff = this.getSameBuff(type, typeId);
                if (buff == null) {
                    buff = Laya.Pool.getItemByClass(this.getPoolKey(BuffType.Hurt), HurtBuff);
                }
                else {
                    console.log("");
                }

                buff.init(sendRole, this.mRole, BuffConfig.getInstance().getHurtBuff(typeId), 0);
            }
        }
        else if (type == BuffType.Control) {
            buff = this.getSameBuff(type, typeId);
            if (buff == null) {
                buff = Laya.Pool.getItemByClass(this.getPoolKey(BuffType.Control), ControlBuff);
            }
            else {
                console.log("");
            }

            buff.init(sendRole, this.mRole, BuffConfig.getInstance().getControlBuff(typeId), 0);
        }

        if (buff != null) {
            buff.onEnter();
            this.mCurrBuffList[type].push(buff);
            //return this.mInstId;
        }
        else {
            return -1;
        }
    }

    public update() {
        while (this.mDeathBuffList.length > 0) {
            let buff: IBuff = this.mDeathBuffList.shift();
            Laya.Pool.recover(this.getPoolKey(buff.mType), buff);

            let arr: Array<any> = this.mCurrBuffList[buff.mType];
            let index = arr.indexOf(buff);
            if(index > -1) {
                arr.splice(index,1);
            }
        }

        for(let i in this.mCurrBuffList)
        {
            let buffArray = this.mCurrBuffList[i];
            for (let y = 0; y < buffArray.length; ++y) {
                buffArray[y].onUpdate();
            }
        }
    }

    public clearAllBuff() // 先全部删除buff.后面在支持只删除debuff
    {
        for(let i in this.mCurrBuffList)
        {
            let buffArray = this.mCurrBuffList[i];
            for (let y = 0; y < buffArray.length; ++y) {
                 this.removeBuff(buffArray[y]);
            }
        }
    }

    public removeBuff(buff: IBuff) {
        this.mDeathBuffList.push(buff);
    }

    public canMove(): boolean {
        let move: boolean = true;
        let buffArray = this.mCurrBuffList[BuffType.Control];
        for (let i = 0; i < buffArray.length; ++i) {
            if (buffArray[i].mBehaviorBuffConfig.mCanMove == false) {
                move = false;
                break;
            }
        }
        return move;
    }

    public canAtk(): boolean {
        let atk: boolean = true;
        let buffArray = this.mCurrBuffList[BuffType.Control];
        for (let i = 0; i < buffArray.length; ++i) {
            if (buffArray[i].mBehaviorBuffConfig.mCanAtk == false) {
                atk = false;
                break;
            }
        }

        return atk;
    }

    public enableBehaviorBuff(): boolean {
        let enable: boolean = true;
        let buffArray = this.mCurrBuffList[BuffType.Control];
        for (let i = 0; i < buffArray.length; ++i) {
            if (buffArray[i].mControlBuffConfig.mEnableBehavior == false) {
                enable = false;
                break;
            }
        }
        return enable;
    }

    public enableMoveBuff(): boolean {
        let enable: boolean = true;
        let buffArray = this.mCurrBuffList[BuffType.Control];
        for (let i = 0; i < buffArray.length; ++i) {
            if (buffArray[i].mControlBuffConfig.mEnableMove == false) {
                enable = false;
                break;
            }
        }
        return enable;
    }

    public enableHurtBuff(): boolean {
        let enable: boolean = true;
        let buffArray = this.mCurrBuffList[BuffType.Control];
        for (let i = 0; i < buffArray.length; ++i) {
            if (buffArray[i].mControlBuffConfig.mEnableHurt == false) {
                enable = false;
                break;
            }
        }
        return enable;
    }

    public enableSelect(): boolean {
        let enable: boolean = true;
        let buffArray = this.mCurrBuffList[BuffType.Control];
        for (let i = 0; i < buffArray.length; ++i) {
            if (buffArray[i].mControlBuffConfig.mEnableSelect == false) {
                enable = false;
                break;
            }
        }
        return enable;
    }

    public getSameBuff(type: BuffType, typeId: number): IBuff {
        let buffArray = this.mCurrBuffList[type];
        for (let i = 0; i < buffArray.length; ++i) {
            if (buffArray[i].mBuffConfig.mTypeId == typeId) {
                return buffArray[i];
            }
        }

        return null;
    }

    public hasSameBuff(type: BuffType, typeId: number): boolean {
        let buffArray = this.mCurrBuffList[type];
        for (let i = 0; i < buffArray.length; ++i) {
            if (buffArray[i].mBuffConfig.mTypeId == typeId) {
                return true;
            }
        }
        return false;
    }

    private getPoolKey(type: BuffType): string  {
        switch (type)  {
            case BuffType.Behavior: return "BuffType.Behavior";
            case BuffType.Move: return "BuffType.Move";
            case BuffType.Hurt: return "BuffType.Hurt";
            case BuffType.Control: return "BuffType.Control";
        }
        return null;
    }
}