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

        if (roleData instanceof PlayerData) {
            let role = RoleMgr.getInstance().getPlayer(roleData.mInstId);
            if (role) return;

            let playerCfg = PlayerConfig.getInstance().getPlayer(roleData.mTypeId);
            if (!playerCfg) {
                console.error("找不到玩家typeId=", roleData.mTypeId);
                return;
            }

            Laya.loader.create(playerCfg.res, Laya.Handler.create(this, this.onRoleComplete, [porxy, roleData]));
        }
        else if (roleData instanceof MonsterData) {
            let role = RoleMgr.getInstance().getPlayer(roleData.mInstId);
            if (role) return;

            let monsterCfg = MonsterConfig.getInstance().getMonster(roleData.mTypeId);
            if (!monsterCfg) {
                console.error("找不到玩家typeId=", roleData.mTypeId);
                return;
            }

            Laya.loader.create(monsterCfg.res, Laya.Handler.create(this, this.onRoleComplete, [porxy, roleData]));
        }
        else if (roleData instanceof NpcData) {
            let role = RoleMgr.getInstance().getNpc(roleData.mInstId);
            if (role) return;

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
            if (roleData instanceof PlayerData) {
                let role = RoleMgr.getInstance().createPlayer(porxy as PlayerPorxy, roleData);
                currScene.addChild(role.mRole3D);
            }
            else if (roleData instanceof MonsterData) {
                let role = RoleMgr.getInstance().createMonster(porxy as PlayerPorxy, roleData);
                currScene.addChild(role.mRole3D);
            }
            else if (roleData instanceof NpcData) {
                let role = RoleMgr.getInstance().createNpc(porxy as PlayerPorxy, roleData);
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
        let arr = notification.getBody();
        let roleData = arr[0] as RoleData;

        if (roleData instanceof PlayerData) {
            RoleMgr.getInstance().removePlayer(roleData.mInstId);
        }
        else if (roleData instanceof MonsterData) {
            RoleMgr.getInstance().removeMonster(roleData.mInstId);
        }
        else if (roleData instanceof NpcData) {
            RoleMgr.getInstance().removeNpc(roleData.mInstId);
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
        let roleData = arr[0] as RoleData;

        let role = null;
        if (roleData instanceof MyPlayerData) {
            role = RoleMgr.getInstance().getMyPlayer();
        }
        else if (roleData instanceof PlayerData) {
            role = RoleMgr.getInstance().getPlayer(roleData.mInstId);
        }
        else if (roleData instanceof MonsterData) {
            role = RoleMgr.getInstance().getMonster(roleData.mInstId);
        }
        else if (roleData instanceof NpcData) {
            role = RoleMgr.getInstance().getNpc(roleData.mInstId);
        }

        if (role) {
            let skillInfo = SkillConfig.getInstance().getSkillInfo(arr[1]);
            if (skillInfo) {
                role.mStateMachine.switchState(StateType.Atk, skillInfo.ani);
            }
            else {
                console.error("没有这个技能Id=", arr[1]);
            }
        }
    }
}