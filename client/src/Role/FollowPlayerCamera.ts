/*
* name;
*/

class FollowPlayerCamera {
    private mCamera: Laya.Camera;
    public mCameraForward: Laya.Vector3 = new Laya.Vector3(0, -1, 1);
    public mCameraOffsetDis: number = -1.5;
    public mLookAtOffset: Laya.Vector3 = new Laya.Vector3(0, 0.3, 0);
    public mTargetPos: Laya.Vector3 = new Laya.Vector3();

    private _cameraQuat: Laya.Quaternion = new Laya.Quaternion;
    private _cameraQuatH: Laya.Quaternion = new Laya.Quaternion;
    private _cameraOffset = new Laya.Vector3();
    private _cameraNewPos = new Laya.Vector3();
    private _lookAtPos = new Laya.Vector3();
    private _x = new Laya.Vector3();

    constructor(camera: Laya.Camera) {
        this.mCamera = camera;
    }

    public setParam(yaw: number, pitch: number, targetPos: Laya.Vector3) {
        Laya.Quaternion.createFromAxisAngle(Laya.Vector3.Up, yaw, this._cameraQuat);
        Laya.Vector3.transformQuat(this.mCameraForward, this._cameraQuat, this.mCameraForward);
        Laya.Vector3.normalize(this.mCameraForward, this.mCameraForward);
        Laya.Vector3.cross(Laya.Vector3.Up, this.mCameraForward, this._x);
        Laya.Vector3.normalize(this._x, this._x);
        Laya.Quaternion.createFromAxisAngle(this._x, pitch, this._cameraQuatH);
        Laya.Vector3.transformQuat(this.mCameraForward, this._cameraQuatH, this.mCameraForward);

        this.updateCamera(targetPos);
    }

    public updateCamera(targetPos: Laya.Vector3) {

        this.mTargetPos = targetPos;

        if (this.mCameraForward.y >= -0.1) this.mCameraForward.y = -0.1;
        if (this.mCameraForward.y <= -0.85) this.mCameraForward.y = -0.85;

        Laya.Vector3.normalize(this.mCameraForward, this.mCameraForward);

        Laya.Vector3.scale(this.mCameraForward, this.mCameraOffsetDis, this._cameraOffset);
        Laya.Vector3.add(this.mTargetPos, this._cameraOffset, this._cameraNewPos);

        this.mCamera.transform.position = this._cameraNewPos;

        Laya.Vector3.add(this.mTargetPos, this.mLookAtOffset, this._lookAtPos);
        this.mCamera.transform.lookAt(this._lookAtPos, Laya.Vector3.Up, false);
    }
}