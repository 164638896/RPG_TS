/*
* name;
*/

class Role extends Laya.Script {

    public mStateMachine: StateMachine = new StateMachine();
    public mBuffSystem: BuffSystem = new BuffSystem(this);
    public mRoleData: RoleData = new RoleData();

    public mRole3D: Laya.Sprite3D;

    constructor() {
        super();
    }

    _initialize(owner: Laya.ComponentNode): void {
        super._initialize(owner);
        this.mRole3D = owner as Laya.Sprite3D;
        this.mStateMachine.RegistState(new AniState(this, this.mStateMachine, StateType.Idle));
    }

    _start(state: Laya.RenderState): void {
        super._start(state);
    }

    _update(state: Laya.RenderState): void {
        super._update(state);
        this.mStateMachine.Update(state);
    }
}

class Npc extends Role {
    constructor() {
        super();
    }

    _initialize(owner: Laya.ComponentNode): void {
        super._initialize(owner);

        this.mStateMachine.RegistState(new AniState(this, this.mStateMachine, StateType.Run));
    }
}

class Player extends Role {
    constructor() {
        super();
    }

    _initialize(owner: Laya.ComponentNode): void {
        super._initialize(owner);

        this.mStateMachine.RegistState(new AniState(this, this.mStateMachine, StateType.Run));
        this.mStateMachine.RegistState(new AtkState(this, this.mStateMachine, StateType.Atk));
        this.mStateMachine.RegistState(new AniState(this, this.mStateMachine, StateType.Hit));
    }
}

class MyPlayer extends Player {
    constructor() {
        super();
    }

    _initialize(owner: Laya.ComponentNode): void {
        super._initialize(owner);
    }
}

class Monster extends Role {
    constructor() {
        super();
    }

    _initialize(owner: Laya.ComponentNode): void {
        super._initialize(owner);

        this.mStateMachine.RegistState(new AniState(this, this.mStateMachine, StateType.Run));
        this.mStateMachine.RegistState(new AtkState(this, this.mStateMachine, StateType.Atk));
        this.mStateMachine.RegistState(new AniState(this, this.mStateMachine, StateType.Hit));
    }
}