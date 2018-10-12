/*
* name;
*/
class RoleMgr{
    private mPlayerDict={};
    private mMonsterDict={};
    private mNpcDict={};
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

    public createMyPlayer(myPlayerPorxy: RolePorxy) : MyPlayer{
        let myPlayerData = myPlayerPorxy.getMyPlayerData();
        if(!myPlayerData) return null;

        let myPlayerCfg = PlayerConfig.getInstance().getPlayer(myPlayerData.mTypeId);
        if (!myPlayerCfg) {
            return null;
        }

        let myPlayer3DRoot = Laya.loader.getRes(myPlayerCfg.res) as Laya.Sprite3D;
        if (myPlayer3DRoot) {
            let myPlayer3D = Laya.Sprite3D.instantiate(myPlayer3DRoot);
            this.mMyPlayer = myPlayer3D.addComponent(MyPlayer) as MyPlayer;
            this.mMyPlayer.initData(myPlayerPorxy, myPlayerData);
            return this.mMyPlayer;
        }
        return null;
    }

    public getMyPlayer(){
        return this.mMyPlayer;
    }

    public removeMyPlayer(inst: number)  {
        let currScene = Laya.stage.getChildAt(0) as Laya.Scene;
        currScene.removeChild(this.mMyPlayer.mRole3D);
    }

    public createPlayer(playerPorxy: RolePorxy, playerData: PlayerData) : Player{
        let playerCfg = PlayerConfig.getInstance().getPlayer(playerData.mTypeId);
        if (!playerCfg) {
            return null;
        }

        let player3DRoot = Laya.loader.getRes(playerCfg.res) as Laya.Sprite3D;
        if (player3DRoot) {
            let originalPlayer = player3DRoot.getChildAt(0) as Laya.Sprite3D;

            let player3D = laya.utils.Pool.getItem(originalPlayer.name);
            if(player3D == null) player3D = Laya.Sprite3D.instantiate(player3DRoot);
            
            let player = player3D.addComponent(Player) as Player;
            player.initData(playerPorxy, playerData);
            this.mPlayerDict[playerData.mInstId] = player;

            return player;
        }
        return null;
    }

    public getPlayer(inst:number): Player{
        return this.mPlayerDict[inst];
    }

    public removePlayer(inst: number)  {
        let currScene = Laya.stage.getChildAt(0) as Laya.Scene;

        let player = this.getPlayer(inst);
        currScene.removeChild(player.mRole3D);
        //laya.utils.Pool.recover(player.mRole3D.name, player.mRole3D);
    }

    public createMonster(monsterProxy: RolePorxy, monsterData: MonsterData) : Monster{
        let monsterCfg = MonsterConfig.getInstance().getMonster(monsterData.mTypeId);
        if (!monsterCfg) {
            return null;
        }

        let monster3DRoot = Laya.loader.getRes(monsterCfg.res) as Laya.Sprite3D;
        if (monster3DRoot) {
            let originalMonster = monster3DRoot.getChildAt(0) as Laya.Sprite3D;

            let monster3D = laya.utils.Pool.getItem(originalMonster.name);
            if(monster3D == null) monster3D = Laya.Sprite3D.instantiate(monster3DRoot);
            
            let monster = monster3D.addComponent(Monster) as Monster;
            monster.initData(monsterProxy, monsterData);
            //this.mMonsterDict.set(monsterData.mInstId, monster);
            this.mMonsterDict[monsterData.mInstId] = monster;

            return monster;
        }
        return null;
    }

    public getMonster(inst:number): Monster{
        //return this.mMonsterDict.get(inst);
        return this.mMonsterDict[inst];
    }

    public removeMonster(inst: number)  {
        let currScene = Laya.stage.getChildAt(0) as Laya.Scene;

        let monster = this.getMonster(inst);
        currScene.removeChild(monster.mRole3D);
        //laya.utils.Pool.recover(monster.mRole3D.name, monster.mRole3D);
    }

    public createNpc(npcProxy: RolePorxy, npcData: NpcData) : Npc{
        let npcCfg = NpcConfig.getInstance().getNpc(npcData.mTypeId);
        if (!npcCfg) {
            return null;
        }

        let npc3DRoot = Laya.loader.getRes(npcCfg.res) as Laya.Sprite3D;
        if (npc3DRoot) {
            let originalNpc = npc3DRoot.getChildAt(0) as Laya.Sprite3D;

            let npc3D = laya.utils.Pool.getItem(originalNpc.name);
            if(npc3D == null) npc3D = Laya.Sprite3D.instantiate(npc3DRoot);
            
            let npc = npc3D.addComponent(Npc) as Npc;
            npc.initData(npcProxy, npcData);
            //this.mNpcDict.set(npcData.mInstId, npc);
            this.mNpcDict[npcData.mInstId] = npc;

            return npc;
        }
        return null;
    }

    public getNpc(inst:number): Monster{
        //return this.mNpcDict.get(inst);
        return this.mNpcDict[inst];
    }

    public removeNpc(inst: number)  {
        let currScene = Laya.stage.getChildAt(0) as Laya.Scene;

        let npc = this.getNpc(inst);
        currScene.removeChild(npc.mRole3D);
        //laya.utils.Pool.recover(npc.mRole3D.name, npc.mRole3D);
    }
}