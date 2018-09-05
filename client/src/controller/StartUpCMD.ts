/*
* name;
*/
class StartUpCMD extends puremvc.SimpleCommand {
    private mProgress: number;
    private mLoading: LoadingMediator;

    constructor() {
        super();
        this.mProgress = 0;
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

        this.mLoading = new LoadingMediator(MediatorNames.LOADING, fairygui.UIPackage.createObject("Loading", "loading").asCom);
        this.facade.registerMediator(this.mLoading);
        this.mLoading.open();

        //this.sendNotification(NotiNames.PRELOAD);

        // //本地包白名单
        // Laya.MiniAdpter.nativefiles = [
        //     "wxlocal",
        //     "res/atlas/houzi.atlas",
        //     "res/atlas/houzi.png",
        //     "common/tishi.png",
        //     "common/bg.png",
        //     "ui.json",
        //     "newLb/bg031.png"
        // ];
        // Laya.URL.basePath = "https://XXXX.com";//请把XXXX换成自己的真实网址；
        // console.log("Laya.URL.rootPath: " + Laya.URL.rootPath);
        // console.log("Laya.URL.basePath: " + Laya.URL.basePath);

        // 先预加载公共资源
        //2d
        let Res2DArry = [
            { url: "config/PlayerCfg.json", "type": Laya.Loader.JSON },
            { url: "config/SkillCfg.json", "type": Laya.Loader.JSON },
            { url: "res/Joystick@atlas0.png", type: Laya.Loader.IMAGE },
            { url: "res/Joystick.bin", type: Laya.Loader.BUFFER },
        ];
        Laya.loader.load(Res2DArry, Laya.Handler.create(this, this.on2DComplete), Laya.Handler.create(this, this.on2DProgress));

        //3d
        let Res3DArry = [
            "res/3D/Girl.lh",
            "res/3D/1v1Scene.ls",
        ];
        Laya.loader.create(Res3DArry, Laya.Handler.create(this, this.on3DComplete), Laya.Handler.create(this, this.on3DProgress));
        //Laya.loader.maxLoader = 5;
    }

     private on2DComplete() {
        PlayerConfig.getInstance().load("config/PlayerCfg.json");
        SkillConfig.getInstance().load("config/SkillCfg.json");
        fairygui.UIPackage.addPackage("res/Joystick");

        this.mProgress += 0.5;
        if (this.mProgress >= 1) this.conmmonResComplete();
    }

    private on3DComplete() {
        this.mProgress += 0.5;
        if (this.mProgress >= 1) this.conmmonResComplete();
    }

    private on2DProgress(pro: number) {
        console.log("2D " +pro);
    }

    private on3DProgress(pro: number) {
        console.log("3D " +pro);
        this.mLoading.setProgress(pro*100, 100);
    }

    private conmmonResComplete()
    {
        this.mLoading.close();

        // 注册porxy
        this.facade.registerProxy(new MyPlayerPorxy());
        this.facade.registerProxy(new PlayerPorxy());
        this.facade.registerProxy(new MonsterPorxy());
        this.facade.registerProxy(new NpcPorxy());

        // 注册ui
        this.facade.registerMediator(new MainMediator(MediatorNames.MAIN, fairygui.UIPackage.createObject("Joystick", "Main").asCom));

        // 注册命令
        this.facade.registerCommand(NotiNames.ENTER_SCENE, EnterSceneCMD);
        this.facade.registerCommand(NotiNames.SKILL, SkillCMD);

        this.sendNotification(NotiNames.ENTER_SCENE);
    }   
}