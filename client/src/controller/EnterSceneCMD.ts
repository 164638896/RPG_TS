/*
* name;
*/
class EnterSceneCMD extends puremvc.SimpleCommand {
    constructor() {
        super();
    }

    execute(notification: puremvc.INotification): void {
        console.log("EnterSceneCMD");

        let data = notification.getBody();

        let scene: Laya.Scene = Laya.loader.getRes("res/3D/1v1Scene.ls");
        Laya.stage.addChildAt(scene, 0);

        ///test 地图可行走区域
        //获取可行走区域模型
        var meshSprite3D: Laya.MeshSprite3D = scene.getChildByName('Scenes').getChildByName('HeightMap') as Laya.MeshSprite3D;
        //使可行走区域模型隐藏
        meshSprite3D.active = false;
        //初始化MeshTerrainSprite3D
        let terrainSprite = Laya.MeshTerrainSprite3D.createFromMesh(meshSprite3D.meshFilter.sharedMesh as Laya.Mesh, 100, 100);
        //更新terrainSprite世界矩阵(为可行走区域世界矩阵)
        terrainSprite.transform.worldMatrix = meshSprite3D.transform.worldMatrix;
        ///test

        // 创建自己
        let myPlayer = RoleMgr.getInstance().getMyPlayer();
        if (myPlayer == null)  {
            myPlayer = RoleMgr.getInstance().createMyPlayer(this.facade.retrieveProxy(ProxyNames.MYPLAYER_PROXY) as MyPlayerPorxy);
        }

        if(myPlayer)
        {
            scene.addChild(myPlayer.mRole3D);

            let camera: Laya.Camera = scene.getChildByName("Main Camera") as Laya.Camera;
            if (camera) {
                let playerControl: PlayerControl = camera.addComponent(PlayerControl) as PlayerControl;
                playerControl.initData(myPlayer, terrainSprite);
            }
        }

        // 初始化其他玩家
        let playerPorxy = this.facade.retrieveProxy(ProxyNames.PLAYER_PROXY) as PlayerPorxy;
        let playerArray = playerPorxy.getDataDict().values;
        for (let i = 0; i < playerArray.length; ++i) {
            let otherPlayerData = playerArray[i] as PlayerData;
            let player = RoleMgr.getInstance().createPlayer(playerPorxy, otherPlayerData);
            scene.addChild(player.mRole3D);
        }

        // 打开主界面
        let main = this.facade.retrieveMediator(MediatorNames.MAIN) as MainMediator;
        main.open();
    }
}