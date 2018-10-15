/*
* name;
*/
class RoleMgr {
    private mRoleDict = {};
    private mMyPlayerId: number;

    constructor() {

    }

    private static _instance = null;
    public static getInstance(): RoleMgr {
        if (RoleMgr._instance == null) {
            RoleMgr._instance = new RoleMgr();
        }
        return RoleMgr._instance;
    }

    public createMyPlayer(myPlayerPorxy: RolePorxy): MyPlayer {
        let myPlayerData = myPlayerPorxy.getMyPlayerData();
        if (!myPlayerData) return null;

        let myPlayerCfg = PlayerConfig.getInstance().getPlayer(myPlayerData.mTypeId);
        if (!myPlayerCfg) {
            return null;
        }

        let myPlayer3DRoot = Laya.loader.getRes(myPlayerCfg.res) as Laya.Sprite3D;
        if (myPlayer3DRoot) {
            let myPlayer3D = Laya.Sprite3D.instantiate(myPlayer3DRoot);
            let mMyPlayer = myPlayer3D.addComponent(MyPlayer) as MyPlayer;
            mMyPlayer.initData(myPlayerPorxy, myPlayerData);
            this.mRoleDict[myPlayerData.mInstId] = mMyPlayer;
            return mMyPlayer;
        }
        return null;
    }

    public getMyPlayer() {
        return this.getRole(this.mMyPlayerId);
    }

    public createPlayer(playerPorxy: RolePorxy, playerData: PlayerData): Player {
        let playerCfg = PlayerConfig.getInstance().getPlayer(playerData.mTypeId);
        if (!playerCfg) {
            return null;
        }

        let player3DRoot = Laya.loader.getRes(playerCfg.res) as Laya.Sprite3D;
        if (player3DRoot) {
            let originalPlayer = player3DRoot.getChildAt(0) as Laya.Sprite3D;

            let player3D = laya.utils.Pool.getItem(originalPlayer.name);
            if (player3D == null) player3D = Laya.Sprite3D.instantiate(player3DRoot);

            let player = player3D.addComponent(Player) as Player;
            player.initData(playerPorxy, playerData);
            this.mRoleDict[playerData.mInstId] = player;

            return player;
        }
        return null;
    }

    public createMonster(monsterProxy: RolePorxy, monsterData: MonsterData): Monster {
        let monsterCfg = MonsterConfig.getInstance().getMonster(monsterData.mTypeId);
        if (!monsterCfg) {
            return null;
        }

        let monster3DRoot = Laya.loader.getRes(monsterCfg.res) as Laya.Sprite3D;
        if (monster3DRoot) {
            let originalMonster = monster3DRoot.getChildAt(0) as Laya.Sprite3D;

            let monster3D = laya.utils.Pool.getItem(originalMonster.name);
            if (monster3D == null) monster3D = Laya.Sprite3D.instantiate(monster3DRoot);

            let monster = monster3D.addComponent(Monster) as Monster;
            monster.initData(monsterProxy, monsterData);
            //this.mMonsterDict.set(monsterData.mInstId, monster);
            this.mRoleDict[monsterData.mInstId] = monster;

            return monster;
        }
        return null;
    }

    public createNpc(npcProxy: RolePorxy, npcData: NpcData): Npc {
        let npcCfg = NpcConfig.getInstance().getNpc(npcData.mTypeId);
        if (!npcCfg) {
            return null;
        }

        let npc3DRoot = Laya.loader.getRes(npcCfg.res) as Laya.Sprite3D;
        if (npc3DRoot) {
            let originalNpc = npc3DRoot.getChildAt(0) as Laya.Sprite3D;

            let npc3D = laya.utils.Pool.getItem(originalNpc.name);
            if (npc3D == null) npc3D = Laya.Sprite3D.instantiate(npc3DRoot);

            let npc = npc3D.addComponent(Npc) as Npc;
            npc.initData(npcProxy, npcData);
            //this.mNpcDict.set(npcData.mInstId, npc);
            this.mRoleDict[npcData.mInstId] = npc;

            return npc;
        }
        return null;
    }

    public removeRole(inst: number) {
        let currScene = Laya.stage.getChildAt(0) as Laya.Scene;

        let role = this.mRoleDict[inst];
        if (role)  {
            currScene.removeChild(role.mRole3D);
            delete this.mRoleDict[inst];
            //laya.utils.Pool.recover(player.mRole3D.name, player.mRole3D);
        }
    }

    public getRole(inst: number): Role  {
        return this.mRoleDict[inst];
    }
}