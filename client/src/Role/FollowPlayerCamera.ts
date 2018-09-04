/*
* name;
*/

class FollowPlayerCamera {
    protected mCamera: Laya.Camera;

    public mCameraForward: Laya.Vector3 = new Laya.Vector3(0, 0, 1);

    private mCameraOffsetHeight: number = 1;
    private mCameraOffsetDis: number = -1;
    private mLookAtOffset: Laya.Vector3 = new Laya.Vector3(0, 0.3, 0);

    private _cameraQuat: Laya.Quaternion = new Laya.Quaternion;
    private _cameraOffset = new Laya.Vector3();
    private _cameraNewPos = new Laya.Vector3();
    private _lookAtPos = new Laya.Vector3();

    constructor(camera: Laya.Camera) {
        this.mCamera = camera;
    }

    public setParam(rad: number, heigh:number, targetPos: Laya.Vector3) {
        Laya.Quaternion.createFromAxisAngle(Laya.Vector3.Up, rad, this._cameraQuat);
        Laya.Vector3.transformQuat(this.mCameraForward, this._cameraQuat, this.mCameraForward);
        this.mCameraForward.y = 0;
        this.mCameraOffsetHeight += heigh;
        this.updateCamera(targetPos);
    }

    public updateCamera(targetPos: Laya.Vector3) {

        Laya.Vector3.scale(this.mCameraForward, this.mCameraOffsetDis, this._cameraOffset);
        Laya.Vector3.add(targetPos, this._cameraOffset, this._cameraNewPos);
        this._cameraNewPos.y = targetPos.y + this.mCameraOffsetHeight;
        this.mCamera.transform.position = this._cameraNewPos;

        Laya.Vector3.add(targetPos, this.mLookAtOffset, this._lookAtPos);
        this.mCamera.transform.lookAt(this._lookAtPos, Laya.Vector3.Up, false);
    }

}