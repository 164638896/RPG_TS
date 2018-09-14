/*
* name;
*/

class FollowPlayerCamera {
    private mCamera: Laya.Camera;
    public mCameraForward: Laya.Vector3 = new Laya.Vector3(0, -0.6, 1);
    public mCameraOffsetDis: number = -1.5;
    public mLookAtOffset: Laya.Vector3 = new Laya.Vector3(0, 0.15, 0);
    public mTargetPos: Laya.Vector3 = new Laya.Vector3();

    private _cameraQuat: Laya.Quaternion = new Laya.Quaternion;
    private _cameraQuatH: Laya.Quaternion = new Laya.Quaternion;
    private _cameraOffset = new Laya.Vector3();
    private _cameraNewPos = new Laya.Vector3();
    private _lookAtPos = new Laya.Vector3();
    private _UnitX = new Laya.Vector3();
    private _cameraForward = new Laya.Vector3();

    constructor(camera: Laya.Camera) {
        this.mCamera = camera;
    }

    public setParam(yaw: number, pitch: number, targetPos: Laya.Vector3) {
        Laya.Quaternion.createFromAxisAngle(Laya.Vector3.Up, yaw, this._cameraQuat);
        Laya.Vector3.transformQuat(this.mCameraForward, this._cameraQuat, this.mCameraForward);
        Laya.Vector3.normalize(this.mCameraForward, this.mCameraForward);
        Laya.Vector3.cross(Laya.Vector3.Up, this.mCameraForward, this._UnitX);
        Laya.Vector3.normalize(this._UnitX, this._UnitX);
        Laya.Quaternion.createFromAxisAngle(this._UnitX, pitch, this._cameraQuatH);
        Laya.Vector3.transformQuat(this.mCameraForward, this._cameraQuatH, this._cameraForward);

        if (this._cameraForward.y <= -0.2 && this._cameraForward.y >= -0.9) {
            this._cameraForward.cloneTo(this.mCameraForward);
        }

        this.updateCamera(targetPos);
    }

    public updateCamera(targetPos: Laya.Vector3, force:boolean = false) {
        if(force) this.mTargetPos = targetPos;
        else Laya.Tween.to(this.mTargetPos, {x:targetPos.x, y:targetPos.y, z:targetPos.z}, 1000, Laya.Ease.strongOut);

        Laya.Vector3.scale(this.mCameraForward, this.mCameraOffsetDis, this._cameraOffset);
        Laya.Vector3.add(this.mTargetPos, this._cameraOffset, this._cameraNewPos);

        this.mCamera.transform.position = this._cameraNewPos;

        Laya.Vector3.add(this.mTargetPos, this.mLookAtOffset, this._lookAtPos);
        this.mCamera.transform.lookAt(this._lookAtPos, Laya.Vector3.Up, false);
        //console.log("x=",this.mCameraForward.x," y=", this.mCameraForward.y," z=", this.mCameraForward.z)
    }
}