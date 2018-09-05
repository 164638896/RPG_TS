/*
* name;
*/

class StateInfo {
    public mStateType: StateType = StateType.None;
    public mParam1: any;
}

class StateMachine {
    private mCurrState: IState;
    private mDictState: laya.utils.Dictionary = new laya.utils.Dictionary;
    private mDefaultStateInfo: StateInfo = new StateInfo();
    private mNextStateInfo: StateInfo = new StateInfo();

    constructor() {

        this.mDefaultStateInfo.mStateType = StateType.Idle;
        this.mDefaultStateInfo.mParam1 = AniName.Idle;
    }

    public RegistState(state: IState): Boolean {
        if (this.mDictState.get(state.GetStateType())) {
            console.log("StateMachine::RegistState->state had exist! state id=" + state.GetStateType());
            return false;
        }

        this.mDictState.set(state.GetStateType(), state);
        return true;
    }

    public UnRegistState(state: IState) {
        this.mDictState.remove(state.GetStateType());
    }

    public SwitchState(stateType: StateType, param1: any): Boolean {

        if (null != this.mCurrState && !this.mCurrState.mChangeState) {
            //console.log("不可切换，等待此状态:" + this.mCurrState.GetStateType())
            return false;
        }

        if (null != this.mCurrState && this.mCurrState.GetStateType() == stateType) {
            this.mCurrState.ExecuteStateAgain(param1);
            return true;
        }

        let newState: IState = this.mDictState.get(stateType);
        if (newState == null) return false;

        return this.ExeState(newState, param1);
    }

    public Update(state: Laya.RenderState) {
        if (this.mCurrState != null) {
            this.mCurrState.Update(state);
        }
    }

    public GetCurState(): IState {
        return this.mCurrState;
    }

    public SetNextState(nextStateType: StateType, param1: any) {
        this.mNextStateInfo.mStateType = nextStateType;
        this.mNextStateInfo.mParam1 = param1;
    }

    public NextState() : boolean{
        if (this.mNextStateInfo.mStateType != StateType.None) {
            let newState: IState = this.mDictState.get(this.mNextStateInfo.mStateType);
            if (newState == null) return false;

            this.ExeState(newState, this.mNextStateInfo.mParam1);
            this.mNextStateInfo.mStateType = StateType.None;
        }
        else {
            let newState: IState = this.mDictState.get(this.mDefaultStateInfo.mStateType);
            if (newState == null) return false;

            this.ExeState(newState, this.mDefaultStateInfo.mParam1);
        }
    }

    private ExeState(newState: IState, param1: any) : boolean{
        if (this.mCurrState != null) this.mCurrState.LeaveState();

        this.mCurrState = newState;

       return this.mCurrState.EnterState(param1);
    }
}