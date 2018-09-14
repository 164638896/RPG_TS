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

class MoveData {
    public mNextForward = new Laya.Vector3();
    public mPos = new Laya.Vector3();

    public setNextDir(x: number, y: number, z: number)  {
        this.mNextForward.x = x;
        this.mNextForward.y = y;
        this.mNextForward.z = z;
        Laya.Vector3.normalize(this.mNextForward, this.mNextForward);
    }

    public setPos(x: number, y: number, z: number)  {
        this.mPos.x = x;
        this.mPos.y = y;
        this.mPos.z = z;
    }

    public setNextForward(targetPos: Laya.Vector3, currPos: Laya.Vector3) {
        Laya.Vector3.subtract(targetPos, currPos, this.mNextForward);
        this.mNextForward.y = 0;
        Laya.Vector3.normalize(this.mNextForward, this.mNextForward);
    }
}

class RoleData {
    public mName: string;
    public mInstId: number;
    public mTypeId: number;
    public mSceneId: number;
    public mMoveSpeed: number;
    public mHp: number;
    public mAtk: number;
    public mDef: number;
    public mTargetInstId: number;
    public mForward = new Laya.Vector3();
    public mPos = new Laya.Vector3();
    public mMoveList: Array<MoveData> = new Array<MoveData>();
    public mSkillList: Array<number> = new Array<number>();

    public setPos(x: number, y: number, z: number)  {
        this.mPos.x = x;
        this.mPos.y = y;
        this.mPos.z = z;
    }
    
    public setDir(x: number, y: number, z: number)  {
        this.mForward.x = x;
        this.mForward.y = y;
        this.mForward.z = z;
        Laya.Vector3.normalize(this.mForward, this.mForward);
    }
    public setForward(targetPos: Laya.Vector3, currPos: Laya.Vector3) {
        Laya.Vector3.subtract(targetPos, currPos, this.mForward);
        this.mForward.y = 0;
        Laya.Vector3.normalize(this.mForward, this.mForward);
    }

    constructor() {

    }
}

class PlayerData extends RoleData {

}

class MyPlayerData extends PlayerData {

    public mJoystickForward = new Laya.Vector3;
    public mCameraRotation = new Laya.Vector2;

}

class NpcData extends RoleData {

}

class MonsterData extends RoleData {

}