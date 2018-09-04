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
    protected mInstId : Number;

    //protected mBuffConfig: BuffConfig;
    constructor() {

    }

    public Init(sendRole:Role, receRole:Role, beginTime:Number)
    {

    }

    public OnEnter()
    {

    }

    public OnLeave()
    {

    }

    public onUpdate()
    {

    }
}