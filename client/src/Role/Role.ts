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
        this.mStateMachine.RegistState(new AniState(this, this.mStateMachine, StateType.Idle));
    }

    _start(state: Laya.RenderState): void {
        super._start(state);
    }

    _update(state: Laya.RenderState): void {
        super._update(state);
        this.mStateMachine.Update(state);
    }

    initData(proxy: puremvc.Proxy, data: RoleData)  {
        this.mRoleData = data;
        this.mRole3D.transform.position = this.mRoleData.mPos;
    }
}

class Player extends Role {
    private mPlayerPorxy: PlayerPorxy;

    constructor() {
        super();
    }

    _initialize(owner: Laya.ComponentNode): void {
        super._initialize(owner);

        this.mStateMachine.RegistState(new AniState(this, this.mStateMachine, StateType.Run));
        this.mStateMachine.RegistState(new AtkState(this, this.mStateMachine, StateType.Atk));
        this.mStateMachine.RegistState(new AniState(this, this.mStateMachine, StateType.Hit));
    }

    initData(proxy: puremvc.Proxy, data: RoleData)  {
        super.initData(proxy, data);
        this.mPlayerPorxy = proxy as PlayerPorxy;
    }

    getPlayerData(): PlayerData  {
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

    initData(proxy: puremvc.Proxy, data: RoleData)  {
        super.initData(proxy, data);
        this.mMyPlayerPorxy = proxy as MyPlayerPorxy;
    }

    getMyPlayerData(): MyPlayerData  {
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

        this.mStateMachine.RegistState(new AniState(this, this.mStateMachine, StateType.Run));
    }

    initData(proxy: puremvc.Proxy, data: RoleData)  {
        super.initData(proxy, data);
        this.mNpcPorxy = proxy as NpcPorxy;
    }

    getNpcData(): NpcData  {
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

        this.mStateMachine.RegistState(new AniState(this, this.mStateMachine, StateType.Run));
        this.mStateMachine.RegistState(new AtkState(this, this.mStateMachine, StateType.Atk));
        this.mStateMachine.RegistState(new AniState(this, this.mStateMachine, StateType.Hit));
    }

    initData(proxy: puremvc.Proxy, data: RoleData)  {
        super.initData(proxy, data);
        this.mMonsterPorxy = proxy as MonsterPorxy;
    }

    getMonsterData(): MonsterData  {
        return <MonsterData>this.mRoleData;
    }
}