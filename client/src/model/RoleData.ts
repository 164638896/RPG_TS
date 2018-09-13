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
    public mForward = new Laya.Vector3();
    public mPos = new Laya.Vector3();

    public setDir(x: number, y: number, z: number)  {
        this.mForward.x = x;
        this.mForward.y = y;
        this.mForward.z = z;
        Laya.Vector3.normalize(this.mForward, this.mForward);
    }

    public setPos(x: number, y: number, z: number)  {
        this.mPos.x = x;
        this.mPos.y = y;
        this.mPos.z = z;
    }

    public setForward(targetPos: Laya.Vector3, currPos: Laya.Vector3) {
        Laya.Vector3.subtract(targetPos, currPos, this.mForward);
        this.mForward.y = 0;
        Laya.Vector3.normalize(this.mForward, this.mForward);
    }

    // public SetDir(targetDir: Laya.Vector3) {
    //     targetDir.y = 0;
    //     Laya.Vector3.normalize(targetDir, this.mForward);
    // }

    public getForward(): Laya.Vector3 { return this.mForward; }
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
    public mMoveList: Array<MoveData> = new Array<MoveData>();
    public mSkillList: Array<number> = new Array<number>();

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