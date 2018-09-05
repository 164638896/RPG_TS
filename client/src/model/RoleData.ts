/*
* name;
*/

enum RoleType {
    None = 0,
    MyPlayer,
    OtherPlayer,
    Monster,
    Npc,
}

class RoleData {
    public mRoleType:RoleType; 
    public mName: string;
    public mInstId: number;
    public mTypeId: number;
    public mMoveSpeed: number;
    public mHp: number;
    public mAtk: number;
    public mDef: number;
    public mCurrSkillId: number;
    public mTargetInstId: number;
    public mPos: Laya.Vector3;
    private mForward = new Laya.Vector3();

    public mSkillList:Array<number> = new Array<number>();

    constructor() {

    }

    public SetForward(targetPos: Laya.Vector3, currPos: Laya.Vector3) {
        Laya.Vector3.subtract(targetPos, currPos, this.mForward);
        this.mForward.y = 0;
        Laya.Vector3.normalize(this.mForward, this.mForward);
    }

    public SetDir(targetDir: Laya.Vector3) {
        targetDir.y = 0;
        Laya.Vector3.normalize(targetDir, this.mForward);
    }

    public GetForward(): Laya.Vector3 { return this.mForward; }
}

class PlayerData extends RoleData
{

}

class MyPlayerData extends PlayerData
{
    public mJoystickForward = new Laya.Vector3;
    public mCameraRotation = new Laya.Vector2;
}

class NpcData extends RoleData
{

}

class MonsterData extends RoleData
{

}