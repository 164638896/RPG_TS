/*
* name;
*/

class Role extends Laya.Script {
    public mStateMachine: StateMachine = new StateMachine();
    public mBuffSystem: BuffSystem = new BuffSystem(this);
    public mRoleData: RoleData = null; //小心数据被释放

    public mRole3D: Laya.Sprite3D;

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

    initData(proxy: puremvc.Proxy, data: RoleData) {
        this.mRoleData = data;
        this.mRole3D.transform.position = this.mRoleData.mPos;
    }

    private updatePos(state: Laya.RenderState) {
        if (Laya.Vector3.equals(this.mRole3D.transform.position, this.mRoleData.mPos)) {
            if (this.mRoleData.mMoveList.length != 0)  {
                this.mRoleData.mPos = this.mRoleData.mMoveList.shift().mPos;
            }
            else  {
                if (this.mStateMachine.getCurStateType() == StateType.Run) {
                    this.mStateMachine.switchState(StateType.Idle, [AniName.Idle, 1]);
                }
                return;
            }
        }

        if (this.mBuffSystem.canMove()) {
            let rate: number = 1;
            if (this.mRoleData.mMoveList.length > 2) rate *= 2;

            if (this.mStateMachine.switchState(StateType.Run, [AniName.Run, rate]) == true) {
                let maxStep = this.mRoleData.mMoveSpeed * (state.elapsedTime * 0.001) * rate;
      
                let dist = Laya.Vector3.distance(this.mRole3D.transform.position, this.mRoleData.mPos);
                this.mRoleData.setForward(this.mRoleData.mPos, this.mRole3D.transform.position);
                let forward = this.mRoleData.mForward;
                if (dist <= maxStep + 0.001) {
                    maxStep = dist;
                }

                let teampPos = new Laya.Vector3();

                // position
                Laya.Vector3.scale(forward, maxStep, teampPos);
                Laya.Vector3.add(this.mRole3D.transform.position, teampPos, teampPos);
                this.mRole3D.transform.position = teampPos;

                // rotate
                let dirPos = new Laya.Vector3();
                //Laya.Vector3.add(teampPos, forward, dirPos);
                Laya.Vector3.subtract(teampPos, forward, dirPos);
                this.mRole3D.transform.lookAt(dirPos, Laya.Vector3.Up, false);
            }
        }
        else {
            this.mStateMachine.switchState(StateType.Idle, [AniName.Idle, 1]);
        }
    }
}

class Player extends Role {
    private mPlayerPorxy: PlayerPorxy;

    constructor() {
        super();
    }

    _initialize(owner: Laya.ComponentNode): void {
        super._initialize(owner);

        this.mStateMachine.registState(new LoopAniState(this, this.mStateMachine, StateType.Run));
        this.mStateMachine.registState(new AtkState(this, this.mStateMachine, StateType.Atk));
        this.mStateMachine.registState(new OnceAniState(this, this.mStateMachine, StateType.Hit));
    }

    initData(proxy: puremvc.Proxy, data: RoleData) {
        super.initData(proxy, data);
        this.mPlayerPorxy = proxy as PlayerPorxy;
    }

    getPlayerData(): PlayerData {
        return <PlayerData>this.mRoleData;
    }
}

class MyPlayer extends Player {
    private mMyPlayerPorxy: MyPlayerPorxy;

    constructor() {
        super();
    }

    _initialize(owner: Laya.ComponentNode): void {
        super._initialize(owner);
    }

    initData(proxy: puremvc.Proxy, data: RoleData) {
        super.initData(proxy, data);
        this.mMyPlayerPorxy = proxy as MyPlayerPorxy;
    }

    getMyPlayerData(): MyPlayerData {
        return <MyPlayerData>this.mRoleData;
    }
}

class Npc extends Role {
    private mNpcPorxy: NpcPorxy;

    constructor() {
        super();
    }

    _initialize(owner: Laya.ComponentNode): void {
        super._initialize(owner);

        this.mStateMachine.registState(new LoopAniState(this, this.mStateMachine, StateType.Run));
    }

    initData(proxy: puremvc.Proxy, data: RoleData) {
        super.initData(proxy, data);
        this.mNpcPorxy = proxy as NpcPorxy;
    }

    getNpcData(): NpcData {
        return <NpcData>this.mRoleData;
    }
}

class Monster extends Role {
    private mMonsterPorxy: MonsterPorxy;
    constructor() {
        super();
    }

    _initialize(owner: Laya.ComponentNode): void {
        super._initialize(owner);

        this.mStateMachine.registState(new LoopAniState(this, this.mStateMachine, StateType.Run));
        this.mStateMachine.registState(new AtkState(this, this.mStateMachine, StateType.Atk));
        this.mStateMachine.registState(new OnceAniState(this, this.mStateMachine, StateType.Hit));
    }

    initData(proxy: puremvc.Proxy, data: RoleData) {
        super.initData(proxy, data);
        this.mMonsterPorxy = proxy as MonsterPorxy;
    }

    getMonsterData(): MonsterData {
        return <MonsterData>this.mRoleData;
    }
}