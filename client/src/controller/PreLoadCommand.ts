/*
* name;
*/
class PreLoadCommand extends puremvc.SimpleCommand {

    private mProgress: number;
    private mPlayerDict: laya.utils.Dictionary = new laya.utils.Dictionary;
    private mSkillDict: laya.utils.Dictionary = new laya.utils.Dictionary;
    private mLoading: LoadingMediator;

    constructor() {
        super();
        this.mProgress = 0;
    }

    execute(notification: puremvc.INotification): void {
        console.log("PreLoadCommand");

        // loading
        this.mLoading = this.facade.retrieveMediator(MediatorNames.LOADING) as LoadingMediator;
        this.mLoading.open();

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
            // { url: "res/Joystick@atlas0.png", type: Laya.Loader.IMAGE },
            // { url: "res/Joystick.bin", type: Laya.Loader.BUFFER },
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
        // 初始化porxy
        this.facade.registerProxy(new MyPlayerPorxy());
        this.facade.registerProxy(new PlayerPorxy());
        this.facade.registerProxy(new MonsterPorxy());
        this.facade.registerProxy(new NpcPorxy());

        this.sendNotification(NotiNames.ENTER_SCENE);

        this.mLoading.close();
    }   
}