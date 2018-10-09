/*
* name;
*/
class RolePorxy extends puremvc.Proxy {
    constructor(name: string) {
        super(name);
        Pomelo.getInstance().on('addEntities', this, this.onAddEntities);
        Pomelo.getInstance().on('onMove', this, this.onMove);
    }

    onAddEntities(data) {
        var entities = data.entities;
        // var area = app.getCurArea();
        // if (!area) {
        //     return;
        // }
        for (var i = 0; i < entities.length; i++) {
            // var entity = area.getEntity(entities[i].entityId);
            // if (!entity) {
            //     area.addEntity(entities[i]);
            // }
        }
    }

    onMove(data) {
        let d = this.get(data.entityId);
        if (!d) return;

        //d.mMoveSpeed = param.speed;
        let m = new MoveData;
        m.setPos(data.endPos[0], data.endPos[1], data.endPos[2]);
        //m.setNextDir(param.dir[0], param.dir[1], param.dir[2]);
        d.mMoveList.push(m);
    }

}

class MyPlayerPorxy extends puremvc.Proxy {
    constructor() {
        super(ProxyNames.MYPLAYER_PROXY);

        Network.getInstance().on(MsgConst.ADD_MYPLAYER, this, this.add);
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

    add(param: any) {
        let d = new MyPlayerData();
        d.mInstId = param.instId;
        d.mTypeId = param.typeId;
        d.mMoveSpeed = param.speed;
        d.mSceneId = param.secenId;
        d.mAtk = param.atk;
        d.mHp = param.hp;
        d.mDef = param.def;
        d.mSkillList = param.skillList;
        d.setPos(param.pos[0], param.pos[1], param.pos[2]);
        d.setDir(param.dir[0], param.dir[1], param.dir[2]);
        this.setData(d);

        //this.sendNotification(NotiNames.MYPLAYER_ADDED, instId);
        this.sendNotification(NotiNames.ENTER_SCENE);
    }

    get(): MyPlayerData {
        return <MyPlayerData>this.data;
    }

    public setJoystickForward(x: number, z: number) {
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

    public move() {
        let data = this.get();
        Pomelo.getInstance().request('area.playerHandler.move', { targetPos: { x: data.mPos.x * 10 + 100, y: data.mPos.z * 10 + 100 } }, function (result) {
            if (result.code == 200) {
                // var sprite = app.getCurPlayer().getSprite();
                // var sPos = result.sPos;
                // sprite.translateTo(sPos.x, sPos.y);
            } else {
                console.warn('curPlayer move error!');
            }
        });

    }

    public playSkillByIndex(index: number) {
        let data = this.get();
        // 同步给服务器
        // 通知播放动作
        this.sendNotification(NotiNames.SKILL, [data, data.mSkillList[index]]);
    }
}

class PlayerPorxy extends puremvc.Proxy {
    constructor() {
        super(ProxyNames.PLAYER_PROXY);
        this.data = {};
        Network.getInstance().on(MsgConst.ADD_PLAYER, this, this.add);
    }


    add(param: any) {
        let d = new PlayerData();
        d.mInstId = param.instId;
        d.mTypeId = param.typeId;
        d.mMoveSpeed = param.speed;
        d.mAtk = param.atk;
        d.mHp = param.hp;
        d.mDef = param.def;
        d.mSkillList = param.skillList;
        d.setPos(param.pos[0], param.pos[1], param.pos[2]);
        d.setDir(param.dir[0], param.dir[1], param.dir[2]);

        this.data[d.mInstId] = d;

        this.sendNotification(NotiNames.ADD_ROLE, [this, d]);
    }

    remove(instId: number) {
        this.sendNotification(NotiNames.REMOVE_ROLE, this.get(instId));
        this.data[instId] = null;
    }

    get(instId: number): PlayerData {
        return this.data[instId];
    }
}

class NpcPorxy extends puremvc.Proxy {
    constructor() {
        super(ProxyNames.NPC_PROXY);
        this.data = {};
        Network.getInstance().on(MsgConst.ADD_NPC, this, this.add);
    }

    add(param: any) {
        let d = new NpcData();
        d.mInstId = param.instId;
        d.mTypeId = param.typeId;
        d.mMoveSpeed = param.speed;
        d.mAtk = param.atk;
        d.mHp = param.hp;
        d.mDef = param.def;
        d.mSkillList = param.skillList;
        d.setPos(param.pos[0], param.pos[1], param.pos[2]);
        d.setDir(param.dir[0], param.dir[1], param.dir[2]);
        this.data[d.mInstId] = d;

        this.sendNotification(NotiNames.ADD_ROLE, [this, d]);
    }

    move(param: any) {
        let d = this.get(param.instId);
        if (!d) return;

        d.mMoveSpeed = param.speed;
        let m = new MoveData;
        m.setPos(param.pos[0], param.pos[1], param.pos[2]);
        m.setNextDir(param.dir[0], param.dir[1], param.dir[2]);
        d.mMoveList.push(m);
    }

    remove(instId: number) {
        this.sendNotification(NotiNames.REMOVE_ROLE, this.get(instId));
        this.data[instId] = null;
    }

    get(instId: number): NpcData {
        return this.data[instId];
    }
}

class MonsterPorxy extends puremvc.Proxy {
    constructor() {
        super(ProxyNames.MONSTER_PROXY);
        this.data = {};
        Network.getInstance().on(MsgConst.ADD_MONSTER, this, this.add);
        Network.getInstance().on(MsgConst.MOVE_MONSTER, this, this.move);
    }

    add(param: any) {
        let d = new MonsterData();
        d.mInstId = param.instId;
        d.mTypeId = param.typeId;
        d.mMoveSpeed = param.speed;
        d.mAtk = param.atk;
        d.mHp = param.hp;
        d.mDef = param.def;
        d.mSkillList = param.skillList;
        d.setPos(param.pos[0], param.pos[1], param.pos[2]);
        d.setDir(param.dir[0], param.dir[1], param.dir[2]);
        this.data[d.mInstId] = d;

        this.sendNotification(NotiNames.ADD_ROLE, [this, d]);
    }

    move(param: any) {
        let d = this.get(param.instId);
        if (!d) return;

        d.mMoveSpeed = param.speed;
        let m = new MoveData;
        m.setPos(param.pos[0], param.pos[1], param.pos[2]);
        m.setNextDir(param.dir[0], param.dir[1], param.dir[2]);
        d.mMoveList.push(m);
    }

    remove(instId: number) {
        this.sendNotification(NotiNames.REMOVE_ROLE, this.get(instId));
        this.data[instId] = null;
    }

    get(instId: number): MonsterData {
        return this.data[instId];
    }
}