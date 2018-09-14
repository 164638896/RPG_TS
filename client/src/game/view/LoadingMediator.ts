/*
* name;
*/
class LoadingMediator extends FuiBaseMediator {
    private mProgressBar: fairygui.GProgressBar;

    constructor(name: string, viewComponent: fairygui.GComponent) {
        super(name, viewComponent);

        this.registerListeners();
     
    }

    private registerListeners(): void {
        this.mProgressBar = this.viewComponent.getChild("Progress") as fairygui.GProgressBar;
    }

    listNotificationInterests(): string[] {
        return [
        ];
    }

    handleNotification(note: puremvc.INotification): void {
    }

    public setProgress(curr:number, max:number)
    {
        this.mProgressBar.value = curr;
        this.mProgressBar.max = max;
    }
}