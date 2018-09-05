/*
* name;
*/

class MyPlayerPorxy extends puremvc.Proxy{
    constructor(){
        super(ProxyNames.MYPLAYER_PROXY);
        this.data = new MyPlayerData();

        // 测试数据
        this.add();
    }

    add()
    {
        let instId : number = 1;
        let typeId: number = 1;

        let playerCfg = PlayerConfig.getInstance().getPlayerInfo(typeId);
        if(playerCfg)
        {
            let data = new MyPlayerData();
            data.mMoveSpeed = playerCfg.speed;
            data.mAtk = playerCfg.atk;
            data.mHp = playerCfg.hp;
            data.mDef = playerCfg.def;
            data.mCurrSkillId = playerCfg.skill;
            data.mTypeId = typeId;
            data.mInstId = instId;
            data.mPos = new Laya.Vector3(-0.353, 0.282, -2.68);
            this.setData(data);

            this.sendNotification(NotiNames.MYPLAYER_ADDED, instId);
        }
        else
        {
            console.log("找不到玩家 typeId =1" );
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
        this.sendNotification(NotiNames.SKILL, [data.mInstId, skillId]);
    }
}

class PlayerPorxy extends puremvc.Proxy{
    constructor(){
        super(ProxyNames.PLAYER_PROXY);
        this.data = new laya.utils.Dictionary;
    }

	getDataDict():laya.utils.Dictionary
	{
		return <laya.utils.Dictionary> this.data;
	}

    add()
    {
        // let d = new PlayerData();
        // this.getDataDict().set(1, d);
        // this.sendNotification(NotiNames.PLAYER_ADDED, instId);
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
        // this.getDataDict().set(1, d);
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
        // this.getDataDict().set(1, d);
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