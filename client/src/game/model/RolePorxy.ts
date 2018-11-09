/*
* name;
*/
class RolePorxy extends puremvc.Proxy {
    private myPlayerInstId: number = 0;

    constructor() {
        super(ProxyNames.ROLE_PROXY);
        this.data = {};

        // Network.getInstance().on(MsgConst.ADD_MONSTER, this, this.add);
        // Network.getInstance().on(MsgConst.MOVE_MONSTER, this, this.move);

        Pomelo.getInstance().on('onAddEntities', this, this.onAddEntities);
        Pomelo.getInstance().on('onRemoveEntities', this, this.onRemoveEntities);
        Pomelo.getInstance().on('onUserLeave', this, this.onUserLeave);
        Pomelo.getInstance().on('onKick', this, this.onKick);
        Pomelo.getInstance().on('disconnect', this, this.onDisconnect);

        Pomelo.getInstance().on('onMove', this, this.onMove);
        //Pomelo.getInstance().on('onSkill', this, this.onSkill);

        Pomelo.getInstance().on('onAttack', this, this.onAttack);
        Pomelo.getInstance().on('onRevive', this, this.onRevive);

        //this.playerLogin(RandomUtils.limitInteger(1, 5), "192.168.6.100", 3014);
        this.playerLogin(Math.random().toString(), "192.168.6.100", 3014);
    }

    public playerLogin(name: string, h: string, p: number) {
        Pomelo.getInstance().init({ host: h, port: p }, ()=> {
            Pomelo.getInstance().request('gate.gateHandler.queryEntry', { uid: name }, (data)=> {
                Pomelo.getInstance().disconnect();

                if (data.code === 2001) {
                    alert('Servers error!');
                    return;
                }

                Pomelo.getInstance().init({ host: data.host, port: data.port, log: true }, ()=> {
                    Pomelo.getInstance().request('connector.entryHandler.entry', { name: name },  (data)=> {
                        Pomelo.getInstance().request("area.playerHandler.enterScene", { name: name, playerId: data.playerId }, (data)=> {
                            // if (data.code !== 200) {
                            //     alert('Servers error!');
                            //     return;
                            // }
                            if (!data.curPlayerInstId) 
                            {
                                console.error("curPlayer is null");
                                return;
                            }

                            this.setMyPlayerInstId(data.curPlayerInstId);
                            //this.addEntity(data.curPlayer);

                            for (let key in data.entities) {
                                 this.addEntity(data.entities[key]);
                                // let array = data.entities[key];
                                // for (let i = 0; i < array.length; i++) {
                                //     this.addEntity(array[i]);
                                // }
                            }
                            this.sendNotification(NotiNames.ENTER_SCENE);
                        });
                    });
                });
            });
        });
    }

    private onAddEntities(data) {
        for (let key in data.entities) {
            this.addEntity(data.entities[key]);
        }
    }

    private onRemoveEntities(data) {
        var entities = data.entities;
        //var area = app.getCurArea();
        let d = this.getMyPlayerData();
        for (var i = 0; i < entities.length; i++) {
            if (entities[i] !== d.mInstId) {
                this.remove(entities[i]);
            }
        }
    }

    private onUserLeave(data) {
        this.remove(data.entityId);
    }

    public addEntity(entity: any) {
        let d: RoleData = null
        switch (entity.mType) {
            case 'player':
                if (this.myPlayerInstId == entity.mInstId) {
                    if (this.getMyPlayerData()) return;
                    d = new MyPlayerData();
                    d.mTypeId = 1;
                }
                else {
                    d = new PlayerData();
                    d.mTypeId = 1;
                }

                break;
            case 'mob':
                d = new MonsterData();
                d.mTypeId = 2;
                break;
            default:
                return false;
        }

        d.mInstId = entity.mInstId;
        d.mMoveSpeed = 1;
        d.mSceneId = 1;
        d.mAtk = 1;
        d.mHp = 100;
        d.mDef = 100;
        d.mSkillList.push(1);
        d.mSkillList.push(2);
        d.mSkillList.push(3);
        d.mSkillList.push(4);
        d.setPos(entity.x, entity.y, entity.z);
        d.setDir(0, 0, 1);
        this.data[d.mInstId] = d;
        this.sendNotification(NotiNames.ADD_ROLE, [this, d]);
    }

    public move() {
        let data = this.get(this.myPlayerInstId);
        Pomelo.getInstance().request('area.playerHandler.move', { x: data.mPos.x, y: data.mPos.y, z: data.mPos.z}, function (result) {
            if (result.code == 200) {
                // var sprite = app.getCurPlayer().getSprite();
                // var sPos = result.sPos;
                // sprite.translateTo(sPos.x, sPos.y);
            } else {
                console.warn('curPlayer move error!');
            }
        });
    }
    public onMove(msg: {InstId: number, x: number, y: number, z: number}) {
        if (msg.InstId != this.myPlayerInstId) {
            let d = this.get(msg.InstId);
            if (!d) return;

            //d.mMoveSpeed = param.speed;
            let m;
            if (d.mMoveList.length > 5) {
                m = d.mMoveList.shift();
            }
            else {
                m = new MoveData;
            }
            m.setPos(msg.x, msg.y, msg.z);
            //m.setNextDir(param.dir[0], param.dir[1], param.dir[2]);

            d.mMoveList.push(m);
        }
    }

    // myPlayer
    public setJoystickForward(x: number, z: number) {
        let data = this.getMyPlayerData();
        if (data) {
            data.mJoystickForward.x = x;
            data.mJoystickForward.y = 0;
            data.mJoystickForward.z = z;
        }
    }

    // myPlayer
    public setCameraRotation(x: number, y: number) {
        let data = this.getMyPlayerData();
        if (data) {
            data.mCameraRotation.x = x;
            data.mCameraRotation.y = y;
        }
    }

    public getMyPlayerData(): MyPlayerData {
        return this.get(this.myPlayerInstId) as MyPlayerData;
    }

    public get(instId: number): RoleData {
        return this.data[instId];
    }

    public remove(instId: number) {
        let roleData = this.get(instId);
        if (roleData) {
            this.sendNotification(NotiNames.REMOVE_ROLE, roleData);
            delete this.data[instId];
        }
    }

    private removeAll() {
        for (let i in this.data) {
            this.sendNotification(NotiNames.REMOVE_ROLE, this.data[i]);
        }
        this.data = {};
    }

    public setMyPlayerInstId(id: number) {
        this.myPlayerInstId = id;
    }

    private onKick(data) {
        Pomelo.getInstance().disconnect();
        this.removeAll();
        //this.playerLogin(RandomUtils.limitInteger(1, 5), "192.168.6.100", 3014);
        console.log("onKick");
    }

    private onDisconnect() {

    }
    public playSkillByIndex(index: number) {
        let data = this.get(this.myPlayerInstId);

        // Pomelo.getInstance().request('area.fightHandler.attack', { id: index }, function (result) {
        //     if (result.code == 200) {
        //     } else {
        //         console.warn('curPlayer skill error!');
        //     }
        // });
        
        Pomelo.getInstance().notify("area.playerHandler.skill", {
            skillId: data.mSkillList[index],
            playerInstId: data.mInstId
        });
    }
    private onAttack(data: {skillId: number, playerInstId: number, targets: Array<number>, result: any}) {

        this.sendNotification(NotiNames.SKILL, data);

        // if (result === AttackResult.SUCCESS) {
        //     let attackData = this.get(attackerId);
        //     let targetData = this.get(targetId);
        //     if (attackData) {
        //         this.sendNotification(NotiNames.SKILL, [attackData, targetData, skillId]);
        //     }
        //     //successAction(params);
        // } else if (result === AttackResult.KILLED) {
        //     //killedAction(params);
        //     console.log("KILLED");
        // } else if (result === AttackResult.NOT_IN_RANGE) {
        //     //targetSprite.stand({ x1: attackerPos.x, x2: attackerPos.y, y1: targetPos.x, y2: targetPos.y });
        // }
    }

    private onRevive(data) { // 复活
        // var area = app.getCurArea();
        // var curPlayer = app.getCurPlayer();
        // if (curPlayer.entityId !== data.entityId) {
        //     area.addEntity(data.entity);
        // }
        // var player = area.getEntity(data.entityId);
        // player.died = false;
        // player.set('hp', data.hp);
        // var sprite = player.getSprite();
        // sprite.revive(data, function () {
        //     if (player.entityId === app.getCurPlayer().entityId) {
        //         area.map.centerTo(data.x, data.y);
        //         mainPanel.reviveMaskHide();
        //     }
        // });
        console.log("onRevive");
    }
}