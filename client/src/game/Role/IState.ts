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
    public static Hit: string = "Damage";
    public static Death: string = "Death";
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

    public EnterState(param: any) : boolean{
        return false;
    }

    public ExecuteStateAgain(param: any) {

    }

    public LeaveState() {
        this.mChangeState = true;
    }

    public Update(state: Laya.RenderState) {

    }
}

class LoopAniState extends IState {
    protected mAnimator: Laya.Animator;

    constructor(r: Role, machine: StateMachine, state: StateType) {
        super(r, machine, state);
        this.mAnimator = r.mRole3D.getComponentByType(Laya.Animator) as Laya.Animator;
    }

    public EnterState(param: any) : boolean{
        return this.playAni(param);
    }

    public playAni(param: any) : boolean{
        let ac = this.mAnimator.getClip(param[0])
        if(ac == null)
        {
            console.error("找不到动作名为: ", param[0]);
            return false;
        }
            
        this.mAnimator.play(param[0], param[1]);
        return true;
    }

    public ExecuteStateAgain(param: any) {
        this.mAnimator.playbackRate = param[1];
    }
}

class TimeState extends IState {

    constructor(r: Role, machine: StateMachine, state: StateType) {
        super(r, machine, state);

    }

    public EnterState(param: any) : boolean{
        Laya.timer.once(param, this, this.onTimerComplete);
        return true;
    }

    private onTimerComplete() {
        this.mStateMachine.nextState();
    }
}

class AtkState extends LoopAniState {

    constructor(r: Role, machine: StateMachine, state: StateType) {
        super(r, machine, state);
    }

    public EnterState(param: any) : boolean {
        if(!super.EnterState(param)) return false;

        this.mAnimator.once(Laya.Event.COMPLETE, this, this.onAniComplete);
        this.mAnimator.once(Laya.Event.STOPPED, this, this.onAniComplete);

        this.mChangeState = false;

        return true;
    }

    public LeaveState() {
        this.mChangeState = true;
    }

    private onAniComplete() {
        this.mStateMachine.nextState();
    }
}

class OnceAniState extends LoopAniState {

    constructor(r: Role, machine: StateMachine, state: StateType) {
        super(r, machine, state);
    }

    public EnterState(param: any) : boolean {
        if(!super.EnterState(param)) return false;

        this.mAnimator.once(Laya.Event.COMPLETE, this, this.onAniComplete);
        this.mAnimator.once(Laya.Event.STOPPED, this, this.onAniComplete);

        return true;
    }

    private onAniComplete() {
        this.mStateMachine.nextState();
    }
}