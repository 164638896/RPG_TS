/*
* name;
*/


enum StateType {
    None = 0,
    Idle,
    Run,
    Atk,
    Hit,
    Death,
}

class AniName {
    public static Idle: string = "AttackStandy";
    public static Run: string = "Run01";
    public static Atk: string = "Attack01";
    public static Hit: string = "BG_Damage";
    public static Death: string = "BG_Death";
}

abstract class IState {
    protected mRole: Role;
    protected mStateType: StateType = StateType.None;
    protected mStateMachine: StateMachine;
    public mChangeState: Boolean = true;

    constructor(r: Role, machine: StateMachine, state: StateType) {
        this.mRole = r;
        this.mStateMachine = machine;
        this.mStateType = state;

    }

    public GetStateType(): StateType { return this.mStateType; }

    public EnterState(param1: any) {

    }

    public ExecuteStateAgain(param1: any) {

    }

    public LeaveState() {
        this.mChangeState = true;
    }

    public Update(state: Laya.RenderState) {

    }
}

class AniState extends IState {
    protected mAnimator: Laya.Animator;

    constructor(r: Role, machine: StateMachine, state: StateType) {
        super(r, machine, state);
        this.mAnimator = r.mRole3D.getComponentByType(Laya.Animator) as Laya.Animator;
    }

    public EnterState(param1: any) {
        this.mAnimator.play(param1);
    }
}

class TimeState extends IState {

    constructor(r: Role, machine: StateMachine, state: StateType) {
        super(r, machine, state);

    }

    public EnterState(param1: any) {

        Laya.timer.once(param1, this, this.onTimerComplete);
    }

    private onTimerComplete() {
        this.mStateMachine.NextState();
    }
}

class AtkState extends AniState {

    constructor(r: Role, machine: StateMachine, state: StateType) {
        super(r, machine, state);
    }

    public EnterState(param1: any) {
        super.EnterState(param1);

        this.mAnimator.once(Laya.Event.COMPLETE, this, this.onAniComplete);
        this.mAnimator.once(Laya.Event.STOPPED, this, this.onAniComplete);

        this.mChangeState = false;
    }

    public LeaveState() {
        this.mChangeState = true;
    }

    private onAniComplete() {
        this.mStateMachine.NextState();
    }
}

