/*
* name;
*/

class MyPlayerPorxy extends puremvc.Proxy {
    constructor() {
        super(ProxyNames.MYPLAYER_PROXY);

        // 测试数据
        this.add(null);

        // MessageCenter.getInstance().addListener(MsgConst.USER_LOGIN, this, this.add);
        // this.socketTest("test");
    }

    // public socketTest(userName:string):void{

    //     let message = new awesomepackage.AwesomeMessage();
    //     message.awesomeField= userName;

    //     let encodeBuffer = awesomepackage.AwesomeMessage.encode(message).finish();      
    //     ClientSocket.getInstance().send(1, encodeBuffer);

    //     let decodeMessage = awesomepackage.AwesomeMessage.decode(encodeBuffer) as awesomepackage.AwesomeMessage;
    //     console.log(decodeMessage.awesomeField); 
    // }

    add(obj: any)  {
        let instId: number = 1;
        let typeId: number = 1;
        let secenId: number = 1;

        let playerCfg = PlayerConfig.getInstance().getPlayer(typeId);
        if (playerCfg)  {
            let d = new MyPlayerData();
            d.mMoveSpeed = playerCfg.speed;
            d.mAtk = playerCfg.atk;
            d.mHp = playerCfg.hp;
            d.mDef = playerCfg.def;
            d.mSkillList = playerCfg.skill;
            d.mTypeId = typeId;
            d.mInstId = instId;
            d.mSceneId = secenId;
            d.mPos = new Laya.Vector3(-0.353, 0.282, -2.68);
            this.setData(d);

            //this.sendNotification(NotiNames.MYPLAYER_ADDED, instId);
            this.sendNotification(NotiNames.ENTER_SCENE);
        }
        else  {
            console.error("找不到玩家 typeId =1");
        }
    }

    get(): MyPlayerData  {
        return <MyPlayerData>this.data;
    }

    public setJoystickForward(x: number, z: number)  {
        let data = this.get();
        data.mJoystickForward.x = x;
        data.mJoystickForward.y = 0;
        data.mJoystickForward.z = z;
    }

    public setCameraRotation(x: number, y: number) {
        let data = this.get();
        data.mCameraRotation.x = x;
        data.mCameraRotation.y = y;
    }
    public playSkillByIndex(index: number)  {
        let data = this.get();
        // 同步给服务器
        // 通知播放动作
        this.sendNotification(NotiNames.SKILL, [data, data.mSkillList[index]]);
    }
}

class PlayerPorxy extends puremvc.Proxy {
    constructor() {
        super(ProxyNames.PLAYER_PROXY);
        this.data = new laya.utils.Dictionary;

        // 测试数据
        this.add();
    }

    getDataDict(): laya.utils.Dictionary {
        return <laya.utils.Dictionary>this.data;
    }

    add()  {
        let instId: number = 2;
        let typeId: number = 2;

        let playerCfg = PlayerConfig.getInstance().getPlayer(typeId);
        if (playerCfg)  {
            let d = new PlayerData();
            d.mMoveSpeed = playerCfg.speed;
            d.mAtk = playerCfg.atk;
            d.mHp = playerCfg.hp;
            d.mDef = playerCfg.def;
            d.mSkillList = playerCfg.skill;
            d.mTypeId = typeId;
            d.mInstId = instId;

            d.mPos = new Laya.Vector3(-0.353, 0.282, -1.68);
            this.getDataDict().set(d.mInstId, d);

            this.sendNotification(NotiNames.ADD_ROLE, [this, d]);
        }
        else  {
            console.log("找不到Player typeId =1");
        }
    }

    remove(instId: number)  {
        this.sendNotification(NotiNames.REMOVE_ROLE, this.get(instId));
        this.getDataDict().remove(instId);
    }

    get(instId: number): PlayerData  {
        return this.getDataDict().get(instId);
    }
}

class NpcPorxy extends puremvc.Proxy {
    constructor() {
        super(ProxyNames.NPC_PROXY);
        this.data = new laya.utils.Dictionary;

        // 测试数据
        this.add();
    }

    getDataDict(): laya.utils.Dictionary {
        return <laya.utils.Dictionary>this.data;
    }

    add()  {
        let instId: number = 4;
        let typeId: number = 1;

        let npcCfg = NpcConfig.getInstance().getNpc(typeId);
        if (npcCfg)  {
            let d = new NpcData();
            d.mMoveSpeed = npcCfg.speed;
            d.mAtk = npcCfg.atk;
            d.mHp = npcCfg.hp;
            d.mDef = npcCfg.def;
            d.mSkillList = npcCfg.skill;
            d.mTypeId = typeId;
            d.mInstId = instId;

            d.mPos = new Laya.Vector3(-1.353, 0.282, -2.68);
            this.getDataDict().set(d.mInstId, d);

            this.sendNotification(NotiNames.ADD_ROLE, [this, d]);
        }
        else  {
            console.log("找不到Npc typeId =1");
        }
    }

    remove(instId: number)  {
        this.sendNotification(NotiNames.REMOVE_ROLE, this.get(instId));
        this.getDataDict().remove(instId);
    }

    get(instId: number): NpcData  {
        return this.getDataDict().get(instId);
    }
}

class MonsterPorxy extends puremvc.Proxy {
    constructor() {
        super(ProxyNames.MONSTER_PROXY);
        this.data = new laya.utils.Dictionary;

        // 测试数据
        this.add();
    }

    getDataDict(): laya.utils.Dictionary {
        return <laya.utils.Dictionary>this.data;
    }

    add()  {
        let instId: number = 3;
        let typeId: number = 1;

        let monsterCfg = MonsterConfig.getInstance().getMonster(typeId);
        if (monsterCfg)  {
            let d = new MonsterData();
            d.mMoveSpeed = monsterCfg.speed;
            d.mAtk = monsterCfg.atk;
            d.mHp = monsterCfg.hp;
            d.mDef = monsterCfg.def;
            d.mSkillList = monsterCfg.skill;
            d.mTypeId = typeId;
            d.mInstId = instId;

            d.mPos = new Laya.Vector3(-0.353, 0.282, -3.68);
            this.getDataDict().set(d.mInstId, d);

            this.sendNotification(NotiNames.ADD_ROLE, [this, d]);
        }
        else  {
            console.log("找不到Monster typeId =1");
        }
    }

    remove(instId: number)  {
        this.sendNotification(NotiNames.REMOVE_ROLE, this.get(instId));
        this.getDataDict().remove(instId);
    }

    get(instId: number): MonsterData  {
        return this.getDataDict().get(instId);
    }
}