/*
* name;
*/

class Role extends Laya.Script {
    public mStateMachine: StateMachine = new StateMachine();
    public mBuffSystem: BuffSystem = new BuffSystem(this);
    public mRoleData: RoleData = null; //小心数据被释放
    public mRolePorxy: RolePorxy;
    public mRole3D: Laya.Sprite3D;
    private _teampPos = new Laya.Vector3();
    private _dirPos = new Laya.Vector3();
    constructor() {
        super();
    }

    _initialize(owner: Laya.ComponentNode): void {
        super._initialize(owner);
        this.mRole3D = owner as Laya.Sprite3D;
        this.mStateMachine.registState(new LoopAniState(this, this.mStateMachine, StateType.Idle));
    }

    _start(state: Laya.RenderState): void {
        super._start(state);
    }

    _update(state: Laya.RenderState): void {
        super._update(state);
        this.mStateMachine.update(state);
        this.mBuffSystem.update();
        this.updatePos(state);
    }

    initData(proxy: RolePorxy, data: RoleData) {
        this.mRolePorxy = proxy;
        this.mRoleData = data;
        this.mRole3D.transform.translate(this.mRoleData.mPos, false);
    }

    private updatePos(state: Laya.RenderState) {
        if (Laya.Vector3.equals(this.mRole3D.transform.position, this.mRoleData.mPos)) {
            if (this.mRoleData.mMoveList.length != 0) {
                this.mRoleData.mPos = this.mRoleData.mMoveList.shift().mPos;
            }
            else {
                if (this.mStateMachine.getCurStateType() == StateType.Run) {
                    this.mStateMachine.switchState(StateType.Idle, [AniName.Idle, 1]);
                }
                return;
            }
        }

        if (this.mBuffSystem.canMove()) {
            let rate: number = 1;
            if (this.mRoleData.mMoveList.length > 2) {
                rate *= 2;
            }

            if (this.mStateMachine.switchState(StateType.Run, [AniName.Run, rate]) == true) {
                let maxStep = this.mRoleData.mMoveSpeed * (state.elapsedTime * 0.001) * rate;

                let dist = Laya.Vector3.distance(this.mRole3D.transform.position, this.mRoleData.mPos);
                this.mRoleData.setForward(this.mRoleData.mPos, this.mRole3D.transform.position);
                let forward = this.mRoleData.mForward;
                if (dist <= maxStep + 0.001) {
                    maxStep = dist;
                }

                // position
                Laya.Vector3.scale(forward, maxStep, this._teampPos);
                this.mRole3D.transform.translate(this._teampPos, false);

                // rotate
                Laya.Vector3.subtract(this.mRole3D.transform.position, forward, this._dirPos);
                this.mRole3D.transform.lookAt(this._dirPos, Laya.Vector3.Up, false);
            }
        }
        else {
            this.mStateMachine.switchState(StateType.Idle, [AniName.Idle, 1]);
        }
    }
}

class Player extends Role {
    constructor() {
        super();
    }

    _initialize(owner: Laya.ComponentNode): void {
        super._initialize(owner);

        this.mStateMachine.registState(new LoopAniState(this, this.mStateMachine, StateType.Run));
        this.mStateMachine.registState(new AtkState(this, this.mStateMachine, StateType.Atk));
        this.mStateMachine.registState(new OnceAniState(this, this.mStateMachine, StateType.Hit));
    }

    getPlayerData(): PlayerData {
        return <PlayerData>this.mRoleData;
    }
}

class MyPlayer extends Player {
    private mlastPos: Laya.Vector3 = new Laya.Vector3();
    private mLastTime: number = 0;
    constructor() {
        super();
    }

    _initialize(owner: Laya.ComponentNode): void {
        super._initialize(owner);
    }

    getMyPlayerData(): MyPlayerData {
        return <MyPlayerData>this.mRoleData;
    }

    move(force?: boolean) {
        if (!Laya.Vector3.equals(this.mRoleData.mPos, this.mlastPos)) {
            if (Date.now() - this.mLastTime > 200 || force) {
                this.mRolePorxy.move();
                this.mlastPos = this.mRoleData.mPos;
                this.mLastTime = Date.now();
            }
        }
    }
}

class Npc extends Role {
    constructor() {
        super();
    }

    _initialize(owner: Laya.ComponentNode): void {
        super._initialize(owner);

        this.mStateMachine.registState(new LoopAniState(this, this.mStateMachine, StateType.Run));
    }

    getNpcData(): NpcData {
        return <NpcData>this.mRoleData;
    }
}

class Monster extends Role {
    constructor() {
        super();
    }

    _initialize(owner: Laya.ComponentNode): void {
        super._initialize(owner);

        this.mStateMachine.registState(new LoopAniState(this, this.mStateMachine, StateType.Run));
        this.mStateMachine.registState(new AtkState(this, this.mStateMachine, StateType.Atk));
        this.mStateMachine.registState(new OnceAniState(this, this.mStateMachine, StateType.Hit));
    }

    getMonsterData(): MonsterData {
        return <MonsterData>this.mRoleData;
    }
}