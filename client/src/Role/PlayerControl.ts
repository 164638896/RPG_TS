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
        this.mPlayerCamera.updateCamera(this.mMyPlayer.mRole3D.transform.position);

        //--------------------------------------------------------------------
        Laya.stage.on(laya.events.Event.KEY_UP, this, this.onKeyUp);
        Laya.stage.on(laya.events.Event.KEY_PRESS, this, this.onPress);
        //--------------------------------------------------------------------
    }

    public _update(state: Laya.RenderState): void {
        super._update(state);

        let joystickForward = this.mMyPlayerData.mJoystickForward;
        if (joystickForward.x != 0 || joystickForward.z != 0) {

            let cameraDir = new Laya.Vector3(this.mPlayerCamera.mCameraForward.x, 0, -this.mPlayerCamera.mCameraForward.z);

            let cameraQuat = new Laya.Quaternion();
            Laya.Quaternion.rotationLookAt(cameraDir, Laya.Vector3.Up, cameraQuat);

            let forward = new Laya.Vector3;
            Laya.Vector3.transformQuat(joystickForward, cameraQuat, forward);

            this.mMyPlayer.mRoleData.SetDir(forward);
            this.JoyStickMove(state);
        }
        else {
            this.joystickUp();
        }

        let cameraRotation = this.mMyPlayerData.mCameraRotation;
        if (cameraRotation.x != 0 || cameraRotation.y != 0) {
            this.mPlayerCamera.setParam(-cameraRotation.x / 1000, cameraRotation.y/1000, this.mMyPlayer.mRole3D.transform.position);
            cameraRotation.x = 0;
            cameraRotation.y = 0;
        }
    }

    public JoyStickMove(state: Laya.RenderState) {
        if (this.mMyPlayer.mBuffSystem.CanMove()) {
            if (this.mMyPlayer.mStateMachine.SwitchState(StateType.Run, AniName.Run) == true) {

                let forward = this.mMyPlayer.mRoleData.GetForward();

                let role3D = this.mMyPlayer.mRole3D;

                // position
                let teampPos = new Laya.Vector3();
                Laya.Vector3.scale(forward, -this.mMyPlayer.mRoleData.mMoveSpeed * state.elapsedTime * 0.001, teampPos);

                Laya.Vector3.add(role3D.transform.position, teampPos, teampPos);
                teampPos.y = this.mTerrainSprite.getHeight(teampPos.x, teampPos.z);
                if (!isNaN(teampPos.y)) {
                    role3D.transform.position = teampPos;
                }

                // rotate
                let dirPos = new Laya.Vector3();
                Laya.Vector3.add(role3D.transform.position, forward, dirPos);
                role3D.transform.lookAt(dirPos, Laya.Vector3.Up, false);

                this.mPlayerCamera.updateCamera(this.mMyPlayer.mRole3D.transform.position);
            }
        }
        else {
            this.mMyPlayer.mStateMachine.SwitchState(StateType.Idle, AniName.Idle);
        }
    }

    public joystickUp() {
        this.mMyPlayer.mStateMachine.SwitchState(StateType.Idle, AniName.Idle);
    }

    //-------------------------------------------------------------------
    private onKeyUp() {
        this.mMyPlayerData.mJoystickForward.x = 0;
        this.mMyPlayerData.mJoystickForward.z = 0;
    }

    private onPress(e: Laya.Event = null){
        let x: number = 0;
        let z: number = 0;

        if (e.keyCode == 119) z = -1;
        if (e.keyCode == 115) z = 1;
        if (e.keyCode == 97) x = -1;
        if (e.keyCode == 100) x = 1;
        
        if (x != 0 || z != 0)  {
            this.mMyPlayerData.mJoystickForward.x = x;
            this.mMyPlayerData.mJoystickForward.z = z;
        }
    }
    //-------------------------------------------------------------------
}