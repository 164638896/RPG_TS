/*
* name;
*/
class StartUpCMD extends puremvc.SimpleCommand {
    private mProgress: number;

    constructor() {
        super();
        this.mProgress = 0;
    }

    execute(notification: puremvc.INotification): void {
        console.info("StartUpCMD");

        let url: string = 'version.json';
        if (Laya.Browser.onWeiXin) {
            url = 'version.json';
        }
        else {
            url = 'version.json?v=' + Laya.Browser.window.resVersion;
        }

        Laya.ResourceVersion.enable(url, Laya.Handler.create(this, this.versionComplete), Laya.ResourceVersion.FILENAME_VERSION);
    }

    private versionComplete() {
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

        if (Laya.Browser.onWeiXin) {
            Laya.URL.basePath = "http://hsj-update.szfyhd.com/h5/wxgame/";
        }
        else {
            let cdnPath = Laya.Browser.window.getCDN();
            if (cdnPath && cdnPath != "") {
                Laya.URL.basePath = cdnPath;
            }
        }

        console.info("Laya.URL.basePath = ", Laya.URL.basePath);

        fairygui.UIConfig.packageFileExtension = "bin";

        let Res2DArry = [
            //{ url: "res/Loading@atlas0.png", type: Laya.Loader.IMAGE },
            { url: "res/ui/Loading.bin", type: Laya.Loader.BUFFER },
        ];
        Laya.loader.load(Res2DArry, Laya.Handler.create(this, this.loadingRes));
    }

    public loadingRes() {
        Laya.stage.addChild(fairygui.GRoot.inst.displayObject);
        fairygui.UIPackage.addPackage("res/ui/Loading");

        let loading = new LoadingMediator(MediatorNames.LOADING, fairygui.UIPackage.createObject("Loading", "loading").asCom);
        this.facade.registerMediator(loading);
        loading.open();

        // 先预加载公共资源
        //2d
        let Res2DArry = [
            { url: "config/PlayerCfg.json", "type": Laya.Loader.JSON },
            { url: "config/MonsterCfg.json", "type": Laya.Loader.JSON },
            { url: "config/NpcCfg.json", "type": Laya.Loader.JSON },
            { url: "config/SkillCfg.json", "type": Laya.Loader.JSON },
            { url: "config/SceneCfg.json", "type": Laya.Loader.JSON },
            { url: "config/BehaviorBuffCfg.json", "type": Laya.Loader.JSON },
            { url: "config/MoveBuffCfg.json", "type": Laya.Loader.JSON },
            { url: "config/HurtBuffCfg.json", "type": Laya.Loader.JSON },
            { url: "config/ControlBuffCfg.json", "type": Laya.Loader.JSON },
            { url: "res/ui/Joystick@atlas0.png", type: Laya.Loader.IMAGE },
            { url: "res/ui/Joystick.bin", type: Laya.Loader.BUFFER },
        ];
        Laya.loader.load(Res2DArry, Laya.Handler.create(this, this.on2DComplete), Laya.Handler.create(this, this.on2DProgress));

        // //3d
        // let Res3DArry = [
        //     //"res/3D/Girl01.lh",
        //     //"res/3D/1v1Scene.ls",
        // ];
        // Laya.loader.create(Res3DArry, Laya.Handler.create(this, this.on3DComplete), Laya.Handler.create(this, this.on3DProgress));
    }

    private on2DComplete() {
        PlayerConfig.getInstance().load("config/PlayerCfg.json");
        MonsterConfig.getInstance().load("config/MonsterCfg.json");
        NpcConfig.getInstance().load("config/NpcCfg.json");
        SkillConfig.getInstance().load("config/SkillCfg.json");
        SceneConfig.getInstance().load("config/SceneCfg.json");
        BuffConfig.getInstance().loadBehaviorBuff("config/BehaviorBuffCfg.json");
        BuffConfig.getInstance().loadMoveBuff("config/MoveBuffCfg.json");
        BuffConfig.getInstance().loadHurtBuff("config/HurtBuffCfg.json");
        BuffConfig.getInstance().loadControlBuff("config/ControlBuffCfg.json");

        fairygui.UIPackage.addPackage("res/ui/Joystick");

        //this.mProgress += 0.5;
        this.conmmonResComplete();
    }

    // private on3DComplete() {
    //     this.mProgress += 0.5;
    //     if (this.mProgress >= 1) this.conmmonResComplete();
    // }

    private on2DProgress(pro: number) {
        //console.log("2D " + pro);
    }

    // private on3DProgress(pro: number) {
    //     //console.log("3D " + pro);
    //     this.mLoading.setProgress(pro * 100, 100);
    // }

    private conmmonResComplete() {
        Network.getInstance().initServer("127.0.0.1", 8000, new JsonMsg); // test

        // 注册porxy
        this.facade.registerProxy(new MyPlayerPorxy());
        this.facade.registerProxy(new PlayerPorxy());
        this.facade.registerProxy(new MonsterPorxy());
        this.facade.registerProxy(new NpcPorxy());

        // 注册ui
        this.facade.registerMediator(new MainMediator(MediatorNames.MAIN, fairygui.UIPackage.createObject("Joystick", "Main").asCom));

        new LocalServer(); // test

        this.facade.registerCommand(NotiNames.ENTER_SCENE, EnterSceneCMD);
        this.sendNotification(NotiNames.ENTER_SCENE);

        ///////////////////////////////////////////
        Pomelo.getInstance().init({
            host: "127.0.0.1",
            port: 3014
        }, function () {
            console.log('success');
        });
        //////////////////////////////////////////
    }
}