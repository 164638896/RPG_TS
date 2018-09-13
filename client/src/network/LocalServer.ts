/*
* name;
*/
class SRole {
    public mRoleData: RoleData = null;
}

class SPlayer extends Role {

}

class SNpc extends Role {

}

class SMonster extends Role {

}

class LocalServer {
    private mPlayerDict: laya.utils.Dictionary = new laya.utils.Dictionary;
    private mMonsterDict: laya.utils.Dictionary = new laya.utils.Dictionary;
    private mNpcDict: laya.utils.Dictionary = new laya.utils.Dictionary;

    private static mInstId: number = 0;

    constructor() {
        this.createMyPlayer(1);
        //this.createPlayer(1);
        //this.createNpc(1);
        this.createMonster(2);

        //Laya.timer.loop(100, this, this.update);
        Laya.timer.loop(500, this, this.moveMonster);
    }

    private update() {

    }

    public createMyPlayer(typeId: number) {
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
        let m = new MoveData;
        m.setPos(-0.353, 0.282, -2.68);
        //m.setDir(param.dir[0], param.dir[1], param.dir[2]);
        d.mMoveList.push(m);

        let player = new SPlayer();
        player.mRoleData = d;
        this.mPlayerDict.set(d.mInstId, player);

        MessageCenter.getInstance().dispatch(MsgConst.ADD_MYPLAYER, {
            secenId: d.mSceneId,
            instId: d.mInstId,
            typeId: d.mTypeId,
            pos: [d.mMoveList[0].mPos.x, d.mMoveList[0].mPos.y, d.mMoveList[0].mPos.z],
            dir: [d.mMoveList[0].mForward.x, d.mMoveList[0].mForward.y, d.mMoveList[0].mForward.z],
            speed: d.mMoveSpeed,
            atk: d.mAtk,
            hp: d.mHp,
            def: d.mDef,
            skillList: d.mSkillList,
        });
    }

    public createPlayer(typeId: number) {
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

        let m = new MoveData;
        m.setPos(-0.353, 0.282, -1.68);
        //m.setDir(param.dir[0], param.dir[1], param.dir[2]);
        d.mMoveList.push(m);

        let player = new SPlayer();
        player.mRoleData = d;
        this.mPlayerDict.set(d.mInstId, player);

        MessageCenter.getInstance().dispatch(MsgConst.ADD_PLAYER, {
            secenId: d.mSceneId,
            instId: d.mInstId,
            typeId: d.mTypeId,
            pos: [d.mMoveList[0].mPos.x, d.mMoveList[0].mPos.y, d.mMoveList[0].mPos.z],
            dir: [d.mMoveList[0].mForward.x, d.mMoveList[0].mForward.y, d.mMoveList[0].mForward.z],
            speed: d.mMoveSpeed,
            atk: d.mAtk,
            hp: d.mHp,
            def: d.mDef,
            skillList: d.mSkillList,
        });
    }

    public createNpc(typeId: number) {
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

        let m = new MoveData;
        m.setPos(-0.853, 0.282, -1.68);
        //m.setDir(param.dir[0], param.dir[1], param.dir[2]);
        d.mMoveList.push(m);

        let player = new SPlayer();
        player.mRoleData = d;
        this.mPlayerDict.set(d.mInstId, player);

        MessageCenter.getInstance().dispatch(MsgConst.ADD_NPC, {
            secenId: d.mSceneId,
            instId: d.mInstId,
            typeId: d.mTypeId,
            pos: [d.mMoveList[0].mPos.x, d.mMoveList[0].mPos.y, d.mMoveList[0].mPos.z],
            dir: [d.mMoveList[0].mForward.x, d.mMoveList[0].mForward.y, d.mMoveList[0].mForward.z],
            speed: d.mMoveSpeed,
            atk: d.mAtk,
            hp: d.mHp,
            def: d.mDef,
            skillList: d.mSkillList,
        });

    }

    public createMonster(typeId: number) {
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


        let m = new MoveData;
        m.setPos(-0.353, 0.282, -2);
        //m.setDir(param.dir[0], param.dir[1], param.dir[2]);
        d.mMoveList.push(m);

        let monster = new SMonster();
        monster.mRoleData = d;
        this.mMonsterDict.set(d.mInstId, monster);

        MessageCenter.getInstance().dispatch(MsgConst.ADD_MONSTER, {
            secenId: 1,
            instId: d.mInstId,
            typeId: d.mTypeId,
            pos: [d.mMoveList[0].mPos.x, d.mMoveList[0].mPos.y, d.mMoveList[0].mPos.z],
            dir: [d.mMoveList[0].mForward.x, d.mMoveList[0].mForward.y, d.mMoveList[0].mForward.z],
            speed: d.mMoveSpeed,
            atk: d.mAtk,
            hp: d.mHp,
            def: d.mDef,
            skillList: d.mSkillList,
        });
    }

    public moveMonster() {
        let array = this.mMonsterDict.values;
        for (let i = 0; i < array.length; ++i) {
            let d = array[i].mRoleData as MonsterData;
            let oldPos = d.mMoveList[0].mPos.clone();
            d.mMoveList[0].mPos.x = Math.random() * 2;
            d.mMoveList[0].mPos.z = -2 - Math.random() * 1.5;
            d.mMoveList[0].setForward(d.mMoveList[0].mPos, oldPos);

            MessageCenter.getInstance().dispatch(MsgConst.MOVE_MONSTER, {
                instId: d.mInstId,
                pos: [d.mMoveList[0].mPos.x, d.mMoveList[0].mPos.y, d.mMoveList[0].mPos.z],
                dir: [d.mMoveList[0].mForward.x, d.mMoveList[0].mForward.y, d.mMoveList[0].mForward.z],
                speed: d.mMoveSpeed
            });
        }
    }
}
