/*
* name;
*/
class MainMediator extends FuiBaseMediator {
    private mMyPlayerPorxy: RolePorxy;
    private touchId: number = -1;
    private _startStageX: number;
    private _startStageY: number;

    constructor(name: string, viewComponent: fairygui.GComponent) {
        super(name, viewComponent);

        this.registerListeners();
    }

    open(): void {
        super.open();
        let joystick = new JoystickModule(this.viewComponent);
        joystick.on(JoystickModule.JoystickMoving, this, this.onJoystickMoving);
        joystick.on(JoystickModule.JoystickUp, this, this.onJoystickUp);
        this.mMyPlayerPorxy = <RolePorxy>this.facade.retrieveProxy(ProxyNames.ROLE_PROXY);
    }

    private registerListeners(): void {
        for (let i = 0; i < 4; ++i)  {
            let strBtn: string = "Btn" + i;
            let skillBtn = this.viewComponent.getChild(strBtn);
            skillBtn.onClick(this, this.onClickSkill, [i]);
        }

        let moveArea = this.viewComponent.getChild("MoveArea");
        moveArea.on(laya.events.Event.MOUSE_DOWN, this, this.onTouchDown);
    }

    public listNotificationInterests(): string[] {
        return [
        ];
    }

    public handleNotification(note: puremvc.INotification): void {

    }

    private onJoystickMoving(x: number, y: number): void {
        this.mMyPlayerPorxy.setJoystickForward(x, y);
        //this.sendNotification( NotiNames.JOYSTICK_MOVING);
    }

    private onJoystickUp() {
        this.mMyPlayerPorxy.setJoystickForward(0, 0);
        //this.sendNotification( NotiNames.JOYSTICK_UP);
    }

    private onClickSkill(index, evt: Event): void {
        this.mMyPlayerPorxy.playSkillByIndex(index);
        //this.sendNotification(NotiNames.SKILL, AniName.Atk);
    }

    private onTouchDown(evt: laya.events.Event) {
        if (this.touchId == -1) {//First touch
            this.touchId = evt.touchId;
            Laya.stage.on(laya.events.Event.MOUSE_MOVE, this, this.onTouchMove);
            Laya.stage.on(laya.events.Event.MOUSE_UP, this, this.onTouchUp);
            Laya.stage.on(laya.events.Event.MOUSE_OUT, this, this.onTouchUp);

            this._startStageX = Laya.stage.mouseX;
            this._startStageY = Laya.stage.mouseY;
        }
    }

    private onTouchMove(evt: laya.events.Event): void {
        if (this.touchId != -1 && evt.touchId == this.touchId) {
            var offsetX: number = Laya.stage.mouseX - this._startStageX;
            var offsetY: number = Laya.stage.mouseY - this._startStageY;
            this.mMyPlayerPorxy.setCameraRotation(offsetX, offsetY);

            this._startStageX = Laya.stage.mouseX;
            this._startStageY = Laya.stage.mouseY;
        }
    }

    private onTouchUp(evt: laya.events.Event): void {
        if (this.touchId != -1 && evt.touchId == this.touchId) {
            this.touchId = -1;

            Laya.stage.off(laya.events.Event.MOUSE_MOVE, this, this.onTouchMove);
            Laya.stage.off(laya.events.Event.MOUSE_UP, this, this.onTouchUp);
            Laya.stage.off(laya.events.Event.MOUSE_OUT, this, this.onTouchUp);
        }
    }
}