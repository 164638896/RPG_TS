/*
* name;
*/

enum BuffType {
    None = 0,
    Behavior,
    Move,
    Hurt,
    Control,
}

abstract class IBuff {
    protected mReceRole: Role;
    protected mSendRole: Role;

    protected mBeginTime: Number;
    public mInstId: Number;
    public mType: BuffType;

    protected mBuffConfig: any;
    constructor(type: BuffType) {
        this.mType = type;
    }

    public init(sendRole: Role, receRole: Role, config: any, beginTime: Number) {
        this.mSendRole = sendRole;
        this.mReceRole = receRole;
        this.mBuffConfig = config;
        Laya.timer.once(this.mBuffConfig.duration, this, this.onLeave);
    }

    public onEnter() {

    }

    public onLeave() {
        this.mReceRole.mBuffSystem.removeBuff(this);
    }

    public onUpdate() {

    }
}

class BehaviorBuff extends IBuff {
    constructor() {
        super(BuffType.Behavior);
    }

    public mBehaviorBuffConfig: Behaviorbuffcfg
    public onEnter() {
        this.mBehaviorBuffConfig = this.mBuffConfig as Behaviorbuffcfg;
        super.onEnter();
    }

    public onLeave() {
        super.onLeave();
    }

    public onUpdate() {
        super.onUpdate();
    }
}

class MoveBuff extends IBuff {
    private static TargetForward: number = 1;
    private static TargetBackward: number = 2;
    private static SelfForward: number = 3;
    private static SelfBackward: number = 4;
    private static SelfForwardOffset: number = 5;

    public mMoveBuffConfig: Movebuffcfg;

    constructor() {
        super(BuffType.Move);
    }

    public onEnter() {
        this.mMoveBuffConfig = this.mBuffConfig as Movebuffcfg;
        super.onEnter();
    }

    public onLeave() {
        super.onLeave();
    }

    public onUpdate() {
        super.onUpdate();
    }
}

class HurtBuff extends IBuff {
    constructor() {
        super(BuffType.Hurt);
    }

    public onEnter() {
        super.onEnter();
    }

    public onLeave() {
        super.onLeave();
    }

    public onUpdate() {
        super.onUpdate();
    }
}

class ControlBuff extends IBuff {
    public mControlBuffConfig: Controlbuffcfg;

    constructor() {
        super(BuffType.Control);
    }

    public onEnter() {
        this.mControlBuffConfig = this.mBuffConfig as Controlbuffcfg;
        super.onEnter();
        if (this.mControlBuffConfig.ClearBuff) {
            this.mReceRole.mBuffSystem.clearAllBuff();
        }
    }

    public onLeave() {
        super.onLeave();
    }

    public onUpdate() {
        super.onUpdate();
    }
}