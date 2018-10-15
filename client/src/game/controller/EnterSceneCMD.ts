/*
* name;
*/
class EnterSceneCMD extends puremvc.SimpleCommand {
    private mLoading: LoadingMediator;
    constructor() {
        super();
    }

    execute(notification: puremvc.INotification): void {
        console.info("EnterSceneCMD");

        this.mLoading = this.facade.retrieveMediator(MediatorNames.LOADING) as LoadingMediator;

        let myRolePorxy = this.facade.retrieveProxy(ProxyNames.ROLE_PROXY) as RolePorxy;
        let myPlayerData = myRolePorxy.getMyPlayerData();
        if (!myPlayerData)
        {
            console.error("MyPlayer 没有初始化");
            return;
        } 

        let sceneCfg = SceneConfig.getInstance().getSceneInfo(myPlayerData.mSceneId);
        if (!sceneCfg) {
            console.error("找不到场景ID=", myPlayerData.mSceneId);
            return;
        }

        let playerCfg = PlayerConfig.getInstance().getPlayer(myPlayerData.mTypeId);
        if (!playerCfg) {
            console.error("找不到玩家typeId=", myPlayerData.mTypeId);
            return;
        }

        let resURL = [sceneCfg.res, playerCfg.res];

        Laya.loader.create([sceneCfg.res, playerCfg.res], Laya.Handler.create(this, this.onSceneComplete, [sceneCfg.res, playerCfg.res, sceneCfg.asynres]), Laya.Handler.create(this, this.onSceneProgress));
    }

    private onSceneComplete(sceneRes: any, myPlayerRes: any, asynres: any) {
        let scene: Laya.Scene = Laya.loader.getRes(sceneRes);
        if (!scene) {
            console.error("取不到场景资源:", sceneRes);
            return;
        }

        Laya.stage.addChildAt(scene, 0);

        for (let i in asynres)  {
            scene.addChild(Laya.loader.create(asynres[i]));
        }

        //获取可行走区域模型
        var meshSprite3D: Laya.MeshSprite3D = scene.getChildByName('Scenes').getChildByName('HeightMap') as Laya.MeshSprite3D;
        //使可行走区域模型隐藏
        meshSprite3D.active = false;
        //初始化MeshTerrainSprite3D
        let terrainSprite = Laya.MeshTerrainSprite3D.createFromMesh(meshSprite3D.meshFilter.sharedMesh as Laya.Mesh, 100, 100);
        //更新terrainSprite世界矩阵(为可行走区域世界矩阵)
        terrainSprite.transform.worldMatrix = meshSprite3D.transform.worldMatrix;

        // 创建自己
        let myPlayer = RoleMgr.getInstance().getMyPlayer();
        if (myPlayer == null) {
            myPlayer = RoleMgr.getInstance().createMyPlayer(this.facade.retrieveProxy(ProxyNames.ROLE_PROXY) as RolePorxy);
        }

        if (!myPlayer) {
            console.error("没有创建主角");
            return;
        }
        scene.addChild(myPlayer.mRole3D);

        let camera: Laya.Camera = scene.getChildByName('Scenes').getChildByName("Main Camera") as Laya.Camera;
        if (camera) {
            let playerControl: PlayerControl = camera.addComponent(PlayerControl) as PlayerControl;
            playerControl.initData(myPlayer as MyPlayer, terrainSprite);
        }

        this.facade.registerCommand(NotiNames.ADD_ROLE, AddRoleCMD);
        this.facade.registerCommand(NotiNames.REMOVE_ROLE, RemoveRoleCMD);
        this.facade.registerCommand(NotiNames.SKILL, SkillCMD);

        this.initRole();

        this.mLoading.close();
        // 打开主界面
        let main = this.facade.retrieveMediator(MediatorNames.MAIN) as MainMediator;
        main.open();
    }

    private onSceneProgress(pro: number) {
        this.mLoading.setProgress(pro, 1);
    }

    private initRole() {

        let rolePorxy = this.facade.retrieveProxy(ProxyNames.ROLE_PROXY) as RolePorxy;
        let playerData = rolePorxy.getData();
        for (let i in playerData) {
            this.sendNotification(NotiNames.ADD_ROLE, [rolePorxy, playerData[i]]);
        }
    }
}