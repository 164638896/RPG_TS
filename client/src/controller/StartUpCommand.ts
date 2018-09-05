/*
* name;
*/
class StartUpCommand extends puremvc.SimpleCommand {
    constructor() {
        super();
    }

    execute(notification: puremvc.INotification): void {

        //加载版本信息文件
        let url:string = 'version.json?' + Laya.Browser.window.resVersion;
        Laya.ResourceVersion.enable(url, Handler.create(this, this.versionComplete), Laya.ResourceVersion.FILENAME_VERSION);

        console.log("StartUpCommand");
    }

    private versionComplete() {

        fairygui.UIConfig.packageFileExtension = "bin";

        let Res2DArry = [
            { url: "res/Joystick@atlas0.png", type: Laya.Loader.IMAGE },
            { url: "res/Joystick.bin", type: Laya.Loader.BUFFER },
        ];
        Laya.loader.load(Res2DArry, Laya.Handler.create(this, this.loadingRes));
    }

    public loadingRes() {
        Laya.stage.addChild(fairygui.GRoot.inst.displayObject);
        fairygui.UIPackage.addPackage("res/Joystick");

        let loadingMediator = new LoadingMediator(MediatorNames.LOADING, fairygui.UIPackage.createObject("Joystick", "loading").asCom);
        this.facade.registerMediator(loadingMediator);

        let mainMediator = new MainMediator(MediatorNames.MAIN, fairygui.UIPackage.createObject("Joystick", "Main").asCom);
        this.facade.registerMediator(mainMediator);

        this.sendNotification(NotiNames.PRELOAD);
    }
}