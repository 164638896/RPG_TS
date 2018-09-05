/*
* name;
*/
class StartUpCommand extends puremvc.SimpleCommand {
    constructor() {
        super();
    }

    execute(notification: puremvc.INotification): void {

        //加载版本信息文件
        let url:string = 'version.json?v=' + Laya.Browser.window.resVersion;
        Laya.ResourceVersion.enable(url, Handler.create(this, this.versionComplete), Laya.ResourceVersion.FILENAME_VERSION);

        console.log("StartUpCommand");
    }

    private versionComplete() {

        fairygui.UIConfig.packageFileExtension = "bin";

        let Res2DArry = [
            //{ url: "res/Loading@atlas0.png", type: Laya.Loader.IMAGE },
            { url: "res/Loading.bin", type: Laya.Loader.BUFFER },
        ];
        Laya.loader.load(Res2DArry, Laya.Handler.create(this, this.loadingRes));
    }

    public loadingRes() {
        Laya.stage.addChild(fairygui.GRoot.inst.displayObject);
        fairygui.UIPackage.addPackage("res/Loading");

        this.facade.registerMediator(new LoadingMediator(MediatorNames.LOADING, fairygui.UIPackage.createObject("Loading", "loading").asCom));

        this.sendNotification(NotiNames.PRELOAD);
    }
}