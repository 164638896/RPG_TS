/*
* name;
*/
class FuiBaseMediator extends puremvc.Mediator {
    constructor(name: string, viewComponent: fairygui.GComponent) {
        super(name, viewComponent);
    }
    
    open(): void {
        this.viewComponent.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
        fairygui.GRoot.inst.addChild(this.viewComponent);
    }

    close(): void {
        fairygui.GRoot.inst.removeChild(this.viewComponent, false);
    }

    onRemove(): void {
        fairygui.GRoot.inst.removeChild(this.viewComponent, true);
    }
}