/*
* name;
*/

class MyPlayerPorxy extends puremvc.Proxy{
    constructor(){
        super(ProxyNames.MYPLAYER_PROXY);
      
        // 测试数据
        this.add();
    }

    add()
    {
        let instId : number = 1;
        let typeId: number = 1;
        let secenId: number = 1;

        let playerCfg = PlayerConfig.getInstance().getPlayerInfo(typeId);
        if(playerCfg)
        {
            let d = new MyPlayerData();
            d.mRoleType = RoleType.MyPlayer;
            d.mMoveSpeed = playerCfg.speed;
            d.mAtk = playerCfg.atk;
            d.mHp = playerCfg.hp;
            d.mDef = playerCfg.def;
            d.mCurrSkillId = playerCfg.skill;
            d.mTypeId = typeId;
            d.mInstId = instId;
            d.mSceneId = secenId;
            d.mPos = new Laya.Vector3(-0.353, 0.282, -2.68);
            this.setData(d);

            //this.sendNotification(NotiNames.MYPLAYER_ADDED, instId);
            this.sendNotification(NotiNames.ENTER_SCENE);
        }
        else
        {
            console.error("找不到玩家 typeId =1" );
        }
    }

    get():MyPlayerData
    {
       	return <MyPlayerData> this.data;
    }

    public setJoystickForward(x:number, z:number)
    {
        let data = this.get();        
        data.mJoystickForward.x = x;
        data.mJoystickForward.y = 0;
        data.mJoystickForward.z = z;
    }

    public setCameraRotation(x: number, y: number)  {
        let data = this.get();
        data.mCameraRotation.x = x;
        data.mCameraRotation.y = y;
    }

    public playSkill(skillId: number)
    {
        let data = this.get();
        // 同步给服务器
        // 通知播放动作
        this.sendNotification(NotiNames.SKILL, [data, skillId]);
    }
}

class PlayerPorxy extends puremvc.Proxy{
    constructor(){
        super(ProxyNames.PLAYER_PROXY);
        this.data = new laya.utils.Dictionary;

        // 测试数据
        this.add();
    }

	getDataDict():laya.utils.Dictionary
	{
		return <laya.utils.Dictionary> this.data;
	}

    add()
    {
        let instId : number = 2;
        let typeId: number = 2;

        let playerCfg = PlayerConfig.getInstance().getPlayerInfo(typeId);
        if(playerCfg)
        {
            let d = new PlayerData();
            d.mRoleType = RoleType.OtherPlayer;
            d.mMoveSpeed = playerCfg.speed;
            d.mAtk = playerCfg.atk;
            d.mHp = playerCfg.hp;
            d.mDef = playerCfg.def;
            d.mCurrSkillId = playerCfg.skill;
            d.mTypeId = typeId;
            d.mInstId = instId;
     
            d.mPos = new Laya.Vector3(-0.353, 0.282, -2.68);
            this.getDataDict().set(d.mInstId, d);

            this.sendNotification(NotiNames.ADD_ROLE, [this, d]);
        }
        else
        {
            console.log("找不到玩家 typeId =1" );
        }     
    }

    remove(instId:number)
    {
        this.sendNotification(NotiNames.PLAYER_REMOVE, instId);
        this.getDataDict().remove(instId);
    }

    get(instId:number):PlayerData
    {
        return this.getDataDict().get(instId);
    }
}

class NpcPorxy extends puremvc.Proxy{
    constructor(){
        super(ProxyNames.MONSTER_PROXY);
        this.data = new laya.utils.Dictionary;
    }

	getDataDict():laya.utils.Dictionary
	{
		return <laya.utils.Dictionary> this.data;
	}

    add()
    {
        // let d = new NpcData();
        //this.sendNotification(NotiNames.ADD_ROLE, [this, d]);
    }

    remove(instId:number)
    {
        this.sendNotification(NotiNames.NPC_ADDED, instId);
        this.getDataDict().remove(instId);
    }

    get(instId:number):NpcData
    {
        return this.getDataDict().get(instId);
    }
}

class MonsterPorxy extends puremvc.Proxy{
    constructor(){
        super(ProxyNames.MONSTER_PROXY);
        this.data = new laya.utils.Dictionary;
    }

	getDataDict():laya.utils.Dictionary
	{
		return <laya.utils.Dictionary> this.data;
	}

    add()
    {
        // let d = new MonsterData();
        //this.sendNotification(NotiNames.ADD_ROLE, [this, d]);
    }

    remove(instId:number)
    {
        this.sendNotification(NotiNames.MONSTER_ADDED, instId);
        this.getDataDict().remove(instId);
    }

    get(instId:number):MonsterData
    {
        return this.getDataDict().get(instId);
    }
}