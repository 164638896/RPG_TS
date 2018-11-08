/*
* name;
*/

class AddRoleCMD extends puremvc.SimpleCommand {
    constructor() {
        super();
    }

    execute(notification: puremvc.INotification): void {
        console.info("AddRoleCMD");

        let currScene = Laya.stage.getChildAt(0) as Laya.Scene;
        if (currScene == null) return;

        let arr = notification.getBody();
        let porxy = arr[0] as puremvc.Proxy;
        let roleData = arr[1] as RoleData;

        let role = RoleMgr.getInstance().getRole(roleData.mInstId);
        if (role) return;

        if (roleData instanceof MyPlayerData) {

        }
        else if (roleData instanceof PlayerData) {
            let playerCfg = PlayerConfig.getInstance().getPlayer(roleData.mTypeId);
            if (!playerCfg) {
                console.error("找不到玩家typeId=", roleData.mTypeId);
                return;
            }

            Laya.loader.create(playerCfg.res, Laya.Handler.create(this, this.onRoleComplete, [porxy, roleData]));
        }
        else if (roleData instanceof MonsterData) {
            let monsterCfg = MonsterConfig.getInstance().getMonster(roleData.mTypeId);
            if (!monsterCfg) {
                console.error("找不到玩家typeId=", roleData.mTypeId);
                return;
            }

            Laya.loader.create(monsterCfg.res, Laya.Handler.create(this, this.onRoleComplete, [porxy, roleData]));
        }
        else if (roleData instanceof NpcData) {
            let npcCfg = NpcConfig.getInstance().getNpc(roleData.mTypeId);
            if (!npcCfg) {
                console.error("找不到玩家typeId=", roleData.mTypeId);
                return;
            }

            Laya.loader.create(npcCfg.res, Laya.Handler.create(this, this.onRoleComplete, [porxy, roleData]));
        }
    }

    private onRoleComplete(porxy: puremvc.Proxy, roleData: RoleData) {
        let currScene = Laya.stage.getChildAt(0) as Laya.Scene;
        if (currScene) {
            if (roleData instanceof MyPlayerData) {

            }
            else if (roleData instanceof PlayerData) {
                let role = RoleMgr.getInstance().createPlayer(porxy as RolePorxy, roleData);
                currScene.addChild(role.mRole3D);
            }
            else if (roleData instanceof MonsterData) {
                let role = RoleMgr.getInstance().createMonster(porxy as RolePorxy, roleData);
                currScene.addChild(role.mRole3D);
            }
            else if (roleData instanceof NpcData) {
                let role = RoleMgr.getInstance().createNpc(porxy as RolePorxy, roleData);
                currScene.addChild(role.mRole3D);
            }
        }
    }
}

class RemoveRoleCMD extends puremvc.SimpleCommand {
    constructor() {
        super();
    }

    execute(notification: puremvc.INotification): void {
        console.info("RemoveRoleCMD");
        let roleData = notification.getBody() as RoleData;
        if (roleData) {
            RoleMgr.getInstance().removeRole(roleData.mInstId);
        }
    }
}

class SkillCMD extends puremvc.SimpleCommand {
    constructor() {
        super();
    }

    execute(notification: puremvc.INotification): void {
        console.info("SkillCMD");

        let arr = notification.getBody();
        let attackData = arr[0] as RoleData;
        let targetData = arr[1] as RoleData;

        let attackRole: Role = RoleMgr.getInstance().getRole(attackData.mInstId);

        // let pos = role.mRole3D.transform.position;
        // let forward = roleData.mForward;

        // let monsterPorxy = this.facade.retrieveProxy(ProxyNames.ROLE_PROXY) as RolePorxy;
        // let datas = monsterPorxy.getData();
        // for (let i in datas) {
        //     let monsterData = datas[i] as MonsterData;
        //     let tPos = monsterData.mPos;
        //     let monster = RoleMgr.getInstance().getMonster(monsterData.mInstId);
        //     if (monster != null && monster.mRole3D != null) { // 还没加载好怪物
        //         if (MathUtils.IsPointInCircularSector(pos.x, pos.z, forward.x, forward.z, 0.5, 3.14 / 2, tPos.x, tPos.z)) {
        //             monster.mStateMachine.switchState(StateType.Hit, [AniName.Hit, 1]);
        //         }
        //     }
        // }

        if (attackRole) {
            let skillInfo = SkillConfig.getInstance().getSkillInfo(arr[2]);
            if (skillInfo) {
                attackRole.mStateMachine.switchState(StateType.Atk, [skillInfo.ani, 2]);
                if (targetData) {
                    let targetRole: Role = RoleMgr.getInstance().getRole(targetData.mInstId);
                    if (targetRole) {
                        targetRole.mStateMachine.switchState(StateType.Hit, [AniName.Hit, 1]);
                    }
                }
            }
            else {
                console.error("没有这个技能Id=", arr[1]);
            }
        }
    }
}