/*
* name;
*/
class EnterSceneCMD extends puremvc.SimpleCommand {
    constructor() {
        super();
    }

    execute(notification: puremvc.INotification): void {
        console.info("EnterSceneCMD");

        let myPlayerPorxy = this.facade.retrieveProxy(ProxyNames.MYPLAYER_PROXY) as MyPlayerPorxy;
        let myPlayerData = myPlayerPorxy.get();
        if (!myPlayerData) return;

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

        Laya.loader.create(resURL, Laya.Handler.create(this, this.onSceneComplete, resURL), Laya.Handler.create(this, this.onSceneProgress));
    }

    private onSceneComplete(sceneRes: any, myPlayerRes: any) {
        let scene: Laya.Scene = Laya.loader.getRes(sceneRes.url);
        if (!scene) {
            console.error("取不到场景资源:", sceneRes);
            return;
        }

        Laya.stage.addChildAt(scene, 0);

        //获取可行走区域模型
        var meshSprite3D: Laya.MeshSprite3D = scene.getChildByName('HeightMap') as Laya.MeshSprite3D;
        //使可行走区域模型隐藏
        meshSprite3D.active = false;
        //初始化MeshTerrainSprite3D
        let terrainSprite = Laya.MeshTerrainSprite3D.createFromMesh(meshSprite3D.meshFilter.sharedMesh as Laya.Mesh, 100, 100);
        //更新terrainSprite世界矩阵(为可行走区域世界矩阵)
        terrainSprite.transform.worldMatrix = meshSprite3D.transform.worldMatrix;

        // 创建自己
        let myPlayer = RoleMgr.getInstance().getMyPlayer();
        if (myPlayer == null) {
            myPlayer = RoleMgr.getInstance().createMyPlayer(this.facade.retrieveProxy(ProxyNames.MYPLAYER_PROXY) as MyPlayerPorxy);
        }

        if (!myPlayer) {
            console.error("没有创建主角");
            return;
        }
        scene.addChild(myPlayer.mRole3D);

        let camera: Laya.Camera = scene.getChildByName("Main Camera") as Laya.Camera;
        if (camera) {
            let playerControl: PlayerControl = camera.addComponent(PlayerControl) as PlayerControl;
            playerControl.initData(myPlayer, terrainSprite);
        }

        // 打开主界面
        let main = this.facade.retrieveMediator(MediatorNames.MAIN) as MainMediator;
        main.open();

        this.facade.registerCommand(NotiNames.ADD_ROLE, AddRoleCMD);
        this.facade.registerCommand(NotiNames.REMOVE_ROLE, RemoveRoleCMD);
        this.facade.registerCommand(NotiNames.SKILL, SkillCMD);

        // 初始化其他玩家
        let playerPorxy = this.facade.retrieveProxy(ProxyNames.PLAYER_PROXY) as PlayerPorxy;
        let playerArray = playerPorxy.getDataDict().values;
        for (let i = 0; i < playerArray.length; ++i) {
            let otherPlayerData = playerArray[i] as PlayerData;
            this.sendNotification(NotiNames.ADD_ROLE, [playerPorxy, otherPlayerData]);
        }
        // 初始化monster
        let monsterPorxy = this.facade.retrieveProxy(ProxyNames.MONSTER_PROXY) as MonsterPorxy;
        let monsterArray = monsterPorxy.getDataDict().values;
        for (let i = 0; i < monsterArray.length; ++i) {
            let monsterData = monsterArray[i] as PlayerData;
            this.sendNotification(NotiNames.ADD_ROLE, [monsterPorxy, monsterData]);
        }
        // 初始化npc
        let npcPorxy = this.facade.retrieveProxy(ProxyNames.NPC_PROXY) as NpcPorxy;
        let npcArray = npcPorxy.getDataDict().values;
        for (let i = 0; i < npcArray.length; ++i) {
            let npcData = npcArray[i] as PlayerData;
            this.sendNotification(NotiNames.ADD_ROLE, [npcPorxy, npcData]);
        }
    }

    private onSceneProgress(pro: number) {
        //console.log("2D " + pro);
    }
}