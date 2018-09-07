/*
* name;
*/
class RoleMgr{
    private mPlayerDict: laya.utils.Dictionary = new laya.utils.Dictionary;
    private mMyPlayer: MyPlayer;

    constructor() {

    }

    private static _instance = null;
    public static getInstance(): RoleMgr {
        if (RoleMgr._instance == null) {
            RoleMgr._instance = new RoleMgr();
        }
        return RoleMgr._instance;
    }

    public createMyPlayer(myPlayerPorxy: MyPlayerPorxy) : MyPlayer{
        let myPlayerData = myPlayerPorxy.get();
        if(!myPlayerData) return null;

        let myPlayerCfg = PlayerConfig.getInstance().getPlayerInfo(myPlayerData.mTypeId);
        if (!myPlayerCfg) {
            return null;
        }

        let myPlayer3DRoot = Laya.loader.getRes(myPlayerCfg.res) as Laya.Sprite3D;
        if (myPlayer3DRoot) {
            let myPlayer3D = myPlayer3DRoot.getChildAt(0) as Laya.Sprite3D;
            this.mMyPlayer = myPlayer3D.addComponent(MyPlayer) as MyPlayer;
            this.mMyPlayer.initData(myPlayerPorxy, myPlayerData);
            return this.mMyPlayer;
        }
        return null;
    }

    public getMyPlayer(){
        return this.mMyPlayer;
    }

    public createPlayer(playerPorxy: PlayerPorxy, playerData: PlayerData) : Player{
        let playerCfg = PlayerConfig.getInstance().getPlayerInfo(playerData.mTypeId);
        if (!playerCfg) {
            return null;
        }

        let player3DRoot = Laya.loader.getRes(playerCfg.res) as Laya.Sprite3D;
        if (player3DRoot) {
            let player3D = player3DRoot.getChildAt(0) as Laya.Sprite3D;
            let player = player3D.addComponent(Player) as Player;
            player.initData(playerPorxy, playerData);
            this.mPlayerDict.set(playerData.mInstId, player);

            return player;
        }
        return null;
    }

    public getPlayer(inst:number): Player{
        return this.mPlayerDict.get(inst);
    }

    public removePlayer()
    {
        
    }
}