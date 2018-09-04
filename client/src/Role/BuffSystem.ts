/*
* name;
*/
class BuffSystem {
    public mRole: Role;
    private mCurrBuffList: laya.utils.Dictionary = new laya.utils.Dictionary;
    private static mInstId: number;

    constructor(role: Role) {
        this.mRole = role;
    }

    public AddBuff(sendRole: Role, type: BuffType, typeId: Number): Number {

        return -1;
    }

    public CanMove(): boolean {
        let move: boolean = true;
        // foreach (var item in mCurrBuffList[(int)IBuff.BuffType.Behavior])
        // {
        //     if (item.Value is BehaviorBuff)
        //     {
        //         BehaviorBuff bb = item.Value as BehaviorBuff;
        //         if (bb.mBehaviorBuffConfig.mCanMove == false)
        //         {
        //             move = false;
        //             break;
        //         }
        //     }
        // }

        return move;
    }
}