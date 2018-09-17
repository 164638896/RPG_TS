/*
* name;
*/

class StateInfo {
    public mStateType: StateType = StateType.None;
    public mParam: any;
}

class StateMachine {
    private mCurrState: IState;
    private mDictState = {};
    private mDefaultStateInfo: StateInfo = new StateInfo();
    private mNextStateInfo: StateInfo = new StateInfo();

    constructor() {

        this.mDefaultStateInfo.mStateType = StateType.Idle;
        this.mDefaultStateInfo.mParam = [AniName.Idle, 1];
    }

    public registState(state: IState): Boolean {
        if (this.mDictState[state.GetStateType()]) {
            console.warn("StateMachine::RegistState->state had exist! state id=" + state.GetStateType());
            return false;
        }

        this.mDictState[state.GetStateType()] = state;
        //this.mDictState.set(state.GetStateType(), state);
        return true;
    }

    public unRegistState(state: IState) {
        this.mDictState[state.GetStateType()] = null;
    }

    public switchState(stateType: StateType, param: any): Boolean {

        if (null != this.mCurrState && !this.mCurrState.mChangeState) {
            //console.log("不可切换，等待此状态:" + this.mCurrState.GetStateType())
            return false;
        }

        if (null != this.mCurrState && this.mCurrState.GetStateType() == stateType) {
            this.mCurrState.ExecuteStateAgain(param);
            return true;
        }

        let newState: IState = this.mDictState[stateType];
        if (newState == null) return false;

        return this.exeState(newState, param);
    }

    public update(state: Laya.RenderState) {
        if (this.mCurrState != null) {
            this.mCurrState.Update(state);
        }
    }

    public getCurState(): IState {
        return this.mCurrState;
    }
    public getCurStateType(): StateType {
        if (this.mCurrState)  {
            return this.mCurrState.GetStateType();
        }
        return StateType.None;
    }
    public setNextState(nextStateType: StateType, param: any) {
        this.mNextStateInfo.mStateType = nextStateType;
        this.mNextStateInfo.mParam = param;
    }

    public nextState(): boolean {
        if (this.mNextStateInfo.mStateType != StateType.None) {
            let newState: IState = this.mDictState[this.mNextStateInfo.mStateType];
            if (newState == null) return false;

            this.exeState(newState, this.mNextStateInfo.mParam);
            this.mNextStateInfo.mStateType = StateType.None;
        }
        else {
            let newState: IState = this.mDictState[this.mDefaultStateInfo.mStateType];
            if (newState == null) return false;

            this.exeState(newState, this.mDefaultStateInfo.mParam);
        }
    }

    private exeState(newState: IState, param: any): boolean {
        if (this.mCurrState != null) this.mCurrState.LeaveState();

        this.mCurrState = newState;

        return this.mCurrState.EnterState(param);
    }
}