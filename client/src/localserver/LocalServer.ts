/*
* name;
*/
class SRole {
    public mRoleData: RoleData = null;
}

class SPlayer extends SRole {

}

class SNpc extends SRole {

}

class SMonster extends SRole {

}

class LocalServer {
    private mPlayerDict = {};
    private mMonsterDict = {};
    private mNpcDict = {};

    private static mInstId: number = 0;

    constructor() {
        this.createMyPlayer(1, 0, 0.282, -2.68);
        // this.createPlayer(1);
        // this.createNpc(1);
        this.createMonster(1, -1, 0.282, -2.68);
        this.createMonster(2, 1, 0.282, -2.68);

        Laya.timer.loop(3000, this, this.moveMonster);
    }

    public createMyPlayer(typeId: number, x: number, y: number, z: number) {
        let playerCfg = PlayerConfig.getInstance().getPlayer(typeId);
        if (!playerCfg) {
            return null;
        }

        let d = new MyPlayerData();
        d.mSceneId = 1;
        d.mMoveSpeed = playerCfg.speed;
        d.mAtk = playerCfg.atk;
        d.mHp = playerCfg.hp;
        d.mDef = playerCfg.def;
        d.mSkillList = playerCfg.skill;
        d.mTypeId = typeId;
        d.mInstId = LocalServer.mInstId++;
        d.setPos(x, y, z);
        d.setDir(0, 0, -1);

        let player = new SPlayer();
        player.mRoleData = d;
        this.mPlayerDict[d.mInstId] = player;

        Network.getInstance().dispatch(MsgConst.ADD_MYPLAYER, {
            secenId: d.mSceneId,
            instId: d.mInstId,
            typeId: d.mTypeId,
            pos: [d.mPos.x, d.mPos.y, d.mPos.z],
            dir: [d.mForward.x, d.mForward.y, d.mForward.z],
            speed: d.mMoveSpeed,
            atk: d.mAtk,
            hp: d.mHp,
            def: d.mDef,
            skillList: d.mSkillList,
        });
    }

    public createPlayer(typeId: number, x: number, y: number, z: number) {
        let playerCfg = PlayerConfig.getInstance().getPlayer(typeId);
        if (!playerCfg) {
            return null;
        }

        let d = new PlayerData();
        d.mSceneId = 1;
        d.mMoveSpeed = playerCfg.speed;
        d.mAtk = playerCfg.atk;
        d.mHp = playerCfg.hp;
        d.mDef = playerCfg.def;
        d.mSkillList = playerCfg.skill;
        d.mTypeId = typeId;
        d.mInstId = LocalServer.mInstId++;
        d.setPos(-0.353, 0.282, -2.68);
        d.setDir(0, 0, -1);

        let player = new SPlayer();
        player.mRoleData = d;
        this.mPlayerDict[d.mInstId] = player;

        Network.getInstance().dispatch(MsgConst.ADD_PLAYER, {
            secenId: d.mSceneId,
            instId: d.mInstId,
            typeId: d.mTypeId,
            pos: [d.mPos.x, d.mPos.y, d.mPos.z],
            dir: [d.mForward.x, d.mForward.y, d.mForward.z],
            speed: d.mMoveSpeed,
            atk: d.mAtk,
            hp: d.mHp,
            def: d.mDef,
            skillList: d.mSkillList,
        });
    }

    public createNpc(typeId: number, x: number, y: number, z: number) {
        let npcCfg = NpcConfig.getInstance().getNpc(typeId);
        if (!npcCfg) {
            return null;
        }

        let d = new NpcData();
        d.mSceneId = 1;
        d.mMoveSpeed = npcCfg.speed;
        d.mAtk = npcCfg.atk;
        d.mHp = npcCfg.hp;
        d.mDef = npcCfg.def;
        d.mSkillList = npcCfg.skill;
        d.mTypeId = typeId;
        d.mInstId = LocalServer.mInstId++;

        d.setPos(-0.353, 0.282, -2.68);
        d.setDir(0, 0, -1);

        let player = new SPlayer();
        player.mRoleData = d;
        this.mPlayerDict[d.mInstId] = player;

        Network.getInstance().dispatch(MsgConst.ADD_NPC, {
            secenId: d.mSceneId,
            instId: d.mInstId,
            typeId: d.mTypeId,
            pos: [d.mPos.x, d.mPos.y, d.mPos.z],
            dir: [d.mForward.x, d.mForward.y, d.mForward.z],
            speed: d.mMoveSpeed,
            atk: d.mAtk,
            hp: d.mHp,
            def: d.mDef,
            skillList: d.mSkillList,
        });

    }

    public createMonster(typeId: number, x: number, y: number, z: number) {
        let monsterCfg = MonsterConfig.getInstance().getMonster(typeId);
        if (!monsterCfg) {
            return;
        }

        let d = new MonsterData();
        d.mMoveSpeed = monsterCfg.speed;
        d.mAtk = monsterCfg.atk;
        d.mHp = monsterCfg.hp;
        d.mDef = monsterCfg.def;
        d.mSkillList = monsterCfg.skill;

        d.mTypeId = typeId;
        d.mInstId = LocalServer.mInstId++;

        d.setPos(x, y, z);
        d.setDir(0, 0, -1);
        let monster = new SMonster();
        monster.mRoleData = d;
        this.mMonsterDict[d.mInstId] = monster;

        Network.getInstance().dispatch(MsgConst.ADD_MONSTER, {
            secenId: 1,
            instId: d.mInstId,
            typeId: d.mTypeId,
            pos: [d.mPos.x, d.mPos.y, d.mPos.z],
            dir: [d.mForward.x, d.mForward.y, d.mForward.z],
            speed: d.mMoveSpeed,
            atk: d.mAtk,
            hp: d.mHp,
            def: d.mDef,
            skillList: d.mSkillList,
        });
    }

    public moveMonster() {
        let keys = Object.keys(this.mMonsterDict);
        let index = RandomUtils.randomArray(keys)
        let d = this.mMonsterDict[index].mRoleData as MonsterData;
        //let d = RandomUtils.randomArray(a).mRoleData as MonsterData;
        let oldPos = d.mPos.clone();
        if (d.mMoveList.length < 1) {
            let m = new MoveData();
            d.mMoveList.push(m);
        }

        d.mMoveList[0].mPos.x = RandomUtils.limit(0, 2);
        d.mMoveList[0].mPos.z = RandomUtils.limit(-3.5, -2);
        d.mMoveList[0].mPos.y = oldPos.y;
        d.mMoveList[0].setNextForward(d.mMoveList[0].mPos, oldPos);

        Network.getInstance().dispatch(MsgConst.MOVE_MONSTER, {
            instId: d.mInstId,
            pos: [d.mMoveList[0].mPos.x, d.mMoveList[0].mPos.y, d.mMoveList[0].mPos.z],
            dir: [d.mMoveList[0].mNextForward.x, d.mMoveList[0].mNextForward.y, d.mMoveList[0].mNextForward.z],
            speed: d.mMoveSpeed
        });
    }
}
