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

        if (roleData.mRoleType == RoleType.OtherPlayer) {
            let role = RoleMgr.getInstance().getPlayer(roleData.mInstId);
            if (role) return;

            let playerCfg = PlayerConfig.getInstance().getPlayer(roleData.mTypeId);
            if (!playerCfg) {
                console.error("找不到玩家typeId=", roleData.mTypeId);
                return;
            }

            Laya.loader.create(playerCfg.res, Laya.Handler.create(this, this.onRoleComplete, [porxy, roleData]));
        }
        else if (roleData.mRoleType == RoleType.Monster) {
            let role = RoleMgr.getInstance().getPlayer(roleData.mInstId);
            if (role) return;

            let monsterCfg = MonsterConfig.getInstance().getMonster(roleData.mTypeId);
            if (!monsterCfg) {
                console.error("找不到玩家typeId=", roleData.mTypeId);
                return;
            }

            Laya.loader.create(monsterCfg.res, Laya.Handler.create(this, this.onRoleComplete, [porxy, roleData]));
        }
        else if (roleData.mRoleType == RoleType.Npc) {
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
            if (roleData.mRoleType == RoleType.OtherPlayer) {
                let role = RoleMgr.getInstance().createPlayer(porxy as PlayerPorxy, roleData);
                currScene.addChild(role.mRole3D);
            }
            else if (roleData.mRoleType == RoleType.Monster) {
                let role = RoleMgr.getInstance().createMonster(porxy as PlayerPorxy, roleData);
                currScene.addChild(role.mRole3D);
            }
            else if (roleData.mRoleType == RoleType.Npc) {
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

        if (roleData.mRoleType == RoleType.OtherPlayer) {
            RoleMgr.getInstance().removePlayer(roleData.mInstId);
        }
        else if (roleData.mRoleType == RoleType.Monster) {
            RoleMgr.getInstance().removeMonster(roleData.mInstId);
        }
        else if (roleData.mRoleType == RoleType.Npc) {
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
        if (roleData.mRoleType == RoleType.MyPlayer) {
            role = RoleMgr.getInstance().getMyPlayer();
        }
        else if (roleData.mRoleType == RoleType.OtherPlayer) {
            role = RoleMgr.getInstance().getPlayer(roleData.mInstId);
        }
        else if (roleData.mRoleType == RoleType.Monster) {
            role = RoleMgr.getInstance().getMonster(roleData.mInstId);
        }
        else if (roleData.mRoleType == RoleType.Npc) {
            role = RoleMgr.getInstance().getNpc(roleData.mInstId);
        }

        if (role) {
            let skillInfo = SkillConfig.getInstance().getSkillInfo(arr[1]);
            if (skillInfo) {
                role.mStateMachine.SwitchState(StateType.Atk, skillInfo.ani);
            }
            else {
                console.error("没有这个技能Id=", arr[1]);
            }
        }
    }
}