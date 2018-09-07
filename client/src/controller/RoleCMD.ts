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
        if(currScene == null) return;

        let arr = notification.getBody();
        let porxy = arr[0] as puremvc.Proxy;
        let roleData = arr[1] as RoleData;

        let role = null;
        if (roleData.mRoleType == RoleType.OtherPlayer) {
            role = RoleMgr.getInstance().getPlayer(roleData.mInstId);
            if(role) return;

            let playerCfg = PlayerConfig.getInstance().getPlayerInfo(roleData.mTypeId);
            if (!playerCfg) {
                console.error("找不到玩家typeId=", roleData.mTypeId);
                return;
            }

            Laya.loader.create(playerCfg.res, Laya.Handler.create(this, this.onRoleComplete, [porxy, roleData]));
        }
        else if (roleData.mRoleType == RoleType.Monster) {

        }
        else if (roleData.mRoleType == RoleType.Npc) {

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

            }
            else if (roleData.mRoleType == RoleType.Npc) {

            }
        }
    }
}

class RemoveRoleCMD extends puremvc.SimpleCommand {
    constructor() {
        super();
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
            role = RoleMgr.getInstance().getMyPlayer() as Role;
        }
        else if (roleData.mRoleType == RoleType.OtherPlayer) {
            role = RoleMgr.getInstance().getPlayer(roleData.mInstId);
        }
        else if (roleData.mRoleType == RoleType.Monster) {

        }
        else if (roleData.mRoleType == RoleType.Npc) {

        }

        if (role) {
            let skillInfo = SkillConfig.getInstance().getSkillInfo(arr[1]);
            role.mStateMachine.SwitchState(StateType.Atk, skillInfo.ani);
        }
    }
}