/*
* name;
*/

class PlayerControl extends Laya.Script {

    private mPlayerCamera: FollowPlayerCamera;

    private mMyPlayer: MyPlayer = null;
    private mMyPlayerData: MyPlayerData = null;
    private mTerrainSprite: Laya.MeshTerrainSprite3D = null;

    private mPlayerNewPos = new Laya.Vector3();
    private mPlayerNewDir = new Laya.Vector3();

    private _cameraQuat = new Laya.Quaternion();
    private _forward = new Laya.Vector3();
    private _dirPos = new Laya.Vector3();

    constructor() {
        super();
    }

    public _initialize(owner: Laya.Sprite3D): void {
        super._initialize(owner);

        this.mPlayerCamera = new FollowPlayerCamera(owner as Laya.Camera);
    }

    public initData(p: MyPlayer, h: Laya.MeshTerrainSprite3D) {
        this.mMyPlayer = p;
        this.mTerrainSprite = h;
        this.mMyPlayerData = this.mMyPlayer.mRoleData as MyPlayerData;
        this.mPlayerCamera.updateCamera(this.mMyPlayer.mRole3D.transform.position, true);
    }

    public _update(state: Laya.RenderState): void {
        super._update(state);

        let joystickForward = this.mMyPlayerData.mJoystickForward;
        if (joystickForward.x != 0 || joystickForward.z != 0) {

            let cameraDir = new Laya.Vector3(this.mPlayerCamera.mCameraForward.x, 0, -this.mPlayerCamera.mCameraForward.z);

            Laya.Quaternion.rotationLookAt(cameraDir, Laya.Vector3.Up, this._cameraQuat);
            Laya.Vector3.transformQuat(joystickForward, this._cameraQuat, this._forward);
            this.mMyPlayer.mRoleData.SetDir(this._forward);
            this.JoyStickMove(state);
        }
        else {
            this.joystickUp();
        }

        let cameraRotation = this.mMyPlayerData.mCameraRotation;
        if (cameraRotation.x != 0 || cameraRotation.y != 0) {
            this.mPlayerCamera.setParam(-cameraRotation.x / 500, cameraRotation.y / 500, this.mMyPlayer.mRole3D.transform.position);
            cameraRotation.x = 0;
            cameraRotation.y = 0;
        }
        else {
            let pos = this.mMyPlayer.mRole3D.transform.position;
            if (!Laya.Vector3.equals(this.mPlayerCamera.mTargetPos, pos)) {
                this.mPlayerCamera.updateCamera(pos);
            }
        }
    }

    public JoyStickMove(state: Laya.RenderState) {
        if (this.mMyPlayer.mBuffSystem.canMove()) {
            if (this.mMyPlayer.mStateMachine.switchState(StateType.Run, AniName.Run) == true) {

                let forward = this.mMyPlayer.mRoleData.GetForward();

                let role3D = this.mMyPlayer.mRole3D;

                // position
                let teampPos = new Laya.Vector3();
                Laya.Vector3.scale(forward, -this.mMyPlayer.mRoleData.mMoveSpeed * state.elapsedTime * 0.0007, teampPos);

                Laya.Vector3.add(role3D.transform.position, teampPos, teampPos);
                teampPos.y = this.mTerrainSprite.getHeight(teampPos.x, teampPos.z);
                if (!isNaN(teampPos.y)) {
                    role3D.transform.position = teampPos;
                }

                // rotate
                Laya.Vector3.add(role3D.transform.position, forward, this._dirPos);
                role3D.transform.lookAt(this._dirPos, Laya.Vector3.Up, false);
            }
        }
        else {
            this.mMyPlayer.mStateMachine.switchState(StateType.Idle, AniName.Idle);
        }
    }

    public joystickUp() {
        this.mMyPlayer.mStateMachine.switchState(StateType.Idle, AniName.Idle);
    }
}