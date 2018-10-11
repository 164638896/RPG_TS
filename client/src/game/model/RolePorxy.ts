/*
* name;
*/
class RolePorxy extends puremvc.Proxy {
    private myPlayerInstId: number = 0;

    private offset: number = 500; //临时代码,未了服务器通过

    constructor() {
        super(ProxyNames.ROLE_PROXY);
        this.data = {};

        // Network.getInstance().on(MsgConst.ADD_MONSTER, this, this.add);
        // Network.getInstance().on(MsgConst.MOVE_MONSTER, this, this.move);

        Pomelo.getInstance().on('onAddEntities', this, this.onAddEntities);
        Pomelo.getInstance().on('onUserLeave', this, this.onUserLeave);
        Pomelo.getInstance().on('onKick', this, this.onKick);
        Pomelo.getInstance().on('disconnect', this, this.onDisconnect);

        Pomelo.getInstance().on('onMove', this, this.onMove);
        Pomelo.getInstance().on('onSkill', this, this.onSkill);

        this.playerLogin(RandomUtils.limitInteger(1, 5), "192.168.6.100", 3014);
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

    public onAddEntities(data) {
        var entities = data.player;
        for (var i = 0; i < entities.length; i++) {
            this.addEntity(entities[i]);
        }
    }

    public onUserLeave(data) {
        this.remove(data.entityId);
    }

    public addEntity(entity: any) {
        let d: RoleData = null
        switch (entity.type) {
            case 'player':
                if (this.myPlayerInstId == entity.entityId) {
                    if (this.getMyPlayerData()) return;
                    d = new MyPlayerData();
                }
                else {
                    d = new PlayerData();
                }

                break;
            case 'monster':
                d = new MonsterData();
                break;
            default:
                return false;
        }

        d.mInstId = entity.entityId;
        d.mTypeId = 1;
        d.mMoveSpeed = 1;
        d.mSceneId = 1;
        d.mAtk = 1;
        d.mHp = 100;
        d.mDef = 100;
        d.mSkillList.push(1);
        d.mSkillList.push(2);
        d.mSkillList.push(3);
        d.mSkillList.push(4);
        d.setPos((entity.x - this.offset) / 10, 0.282, (entity.y - this.offset) / 10);
        d.setDir(0, 0, 1);
        this.data[d.mInstId] = d;
        this.sendNotification(NotiNames.ADD_ROLE, [this, d]);
    }

    public move() {
        let data = this.get(this.myPlayerInstId);
        Pomelo.getInstance().request('area.playerHandler.move', { path: [{ x: (data.mPos.x * 10 + this.offset), y: (data.mPos.z * 10 + this.offset) }, { x: (data.mPos.x * 10 + this.offset), y: (data.mPos.z * 10 + this.offset) }] }, function (result) {
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
            else  {
                m = new MoveData;
            }
            m.setPos((data.path[0].x - this.offset) / 10, 0.282, (data.path[0].y - this.offset) / 10);
            //m.setNextDir(param.dir[0], param.dir[1], param.dir[2]);

            d.mMoveList.push(m);
        }
    }

    public playSkillByIndex(index: number) {
        let data = this.get(this.myPlayerInstId);

        Pomelo.getInstance().request('area.playerHandler.skill', { id: index }, function (result) {
            if (result.code == 200) {
            } else {
                console.warn('curPlayer skill error!');
            }
        });
    }

    public onSkill(param) {
        let data = this.get(param.entityId);
        if (data) {
            this.sendNotification(NotiNames.SKILL, [data, data.mSkillList[param.id]]);
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
}