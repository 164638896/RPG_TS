/*
* name;
*/
class RolePorxy extends puremvc.Proxy {
    private myPlayerInstId: number = 0;

    private offset: number = 700; //临时代码,未了服务器通过

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

        this.playerLogin(RandomUtils.limitInteger(1, 5), "127.0.0.1", 3014);
    }

    public playerLogin(name: number, h: string, p: number) {
        Pomelo.getInstance().init({ host: h, port: p }, function () {
            Pomelo.getInstance().request('gate.gateHandler.queryEntry', { uid: name }, function (data) {
                Pomelo.getInstance().disconnect();

                if (data.code === 2001) {
                    alert('Servers error!');
                    return;
                }

                Pomelo.getInstance().init({ host: data.host, port: data.port, log: true }, function () {
                    Pomelo.getInstance().request('connector.entryHandler.entry', { name: name }, function (data) {
                        Pomelo.getInstance().request("area.playerHandler.enterScene", { name: name, playerId: data.playerId }, function (data) {
                            let rolePorxy = AppFacade.getInstance().retrieveProxy(ProxyNames.ROLE_PROXY) as RolePorxy;
                            // if (data.code !== 200) {
                            //     alert('Servers error!');
                            //     return;
                            // }
                            if (!data.curPlayer) return;

                            rolePorxy.setMyPlayerInstId(data.curPlayer.entityId);
                            rolePorxy.addEntity(data.curPlayer);

                            for (let key in data.entities) {
                                let array = data.entities[key];
                                for (let i = 0; i < array.length; i++) {
                                    rolePorxy.addEntity(array[i]);
                                }
                            }
                            AppFacade.getInstance().sendNotification(NotiNames.ENTER_SCENE);
                        });
                    });
                });
            });
        });
    }

    private onAddEntities(data) {
        if (data.player) {
            for (var i = 0; i < data.player.length; i++) {
                this.addEntity(data.player[i]);
            }
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
        switch (entity.type) {
            case 'player':
                if (this.myPlayerInstId == entity.entityId) {
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

        d.mInstId = entity.entityId;
        d.mMoveSpeed = 1;
        d.mSceneId = 1;
        d.mAtk = 1;
        d.mHp = 100;
        d.mDef = 100;
        d.mSkillList.push(1);
        d.mSkillList.push(2);
        d.mSkillList.push(3);
        d.mSkillList.push(4);
        d.setPos((entity.x - this.offset) / 100, 0.282, (entity.y - this.offset) / 100);
        d.setDir(0, 0, 1);
        this.data[d.mInstId] = d;
        this.sendNotification(NotiNames.ADD_ROLE, [this, d]);
    }

    public move() {
        let data = this.get(this.myPlayerInstId);
        Pomelo.getInstance().request('area.playerHandler.move', { path: [{ x: (data.mPos.x * 100 + this.offset), y: (data.mPos.z * 100 + this.offset) }, { x: (data.mPos.x * 100 + this.offset), y: (data.mPos.z * 100 + this.offset) }] }, function (result) {
            if (result.code == 200) {
                // var sprite = app.getCurPlayer().getSprite();
                // var sPos = result.sPos;
                // sprite.translateTo(sPos.x, sPos.y);
            } else {
                console.warn('curPlayer move error!');
            }
        });
    }

    public onMove(data) {
        if (data.entityId != this.myPlayerInstId) {
            let d = this.get(data.entityId);
            if (!d) return;

            //d.mMoveSpeed = param.speed;
            let m;
            if (d.mMoveList.length > 5) {
                m = d.mMoveList.shift();
            }
            else {
                m = new MoveData;
            }
            m.setPos((data.path[0].x - this.offset) / 100, 0.282, (data.path[0].y - this.offset) / 100);
            //m.setNextDir(param.dir[0], param.dir[1], param.dir[2]);

            d.mMoveList.push(m);
        }
    }

    public playSkillByIndex(index: number) {
        let data = this.get(this.myPlayerInstId);

        // Pomelo.getInstance().request('area.fightHandler.attack', { id: index }, function (result) {
        //     if (result.code == 200) {
        //     } else {
        //         console.warn('curPlayer skill error!');
        //     }
        // });
        
        Pomelo.getInstance().notify("area.fightHandler.useSkill", {
            skillId: data.mSkillList[index],
            entityId: data.mInstId
        });
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
            this.data[instId] = null;
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

    private onAttack(data) {
        var skillId = data.skillId; //技能id
        let attackerId = data.attacker; // 攻击者
        let targetId = data.target; // 被攻击者

        var resultData = data.result;
        var result = resultData.result;

        if (result === AttackResult.SUCCESS) {
            let attackData = this.get(attackerId);
            let targetData = this.get(targetId);
            if (attackData) {
                this.sendNotification(NotiNames.SKILL, [attackData, targetData, skillId]);
            }
            //successAction(params);
        } else if (result === AttackResult.KILLED) {
            //killedAction(params);
            console.log("KILLED");
        } else if (result === AttackResult.NOT_IN_RANGE) {
            //targetSprite.stand({ x1: attackerPos.x, x2: attackerPos.y, y1: targetPos.x, y2: targetPos.y });
        }
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