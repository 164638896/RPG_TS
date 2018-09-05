/*
* name;
*/

class SkillCommand extends puremvc.SimpleCommand {
    constructor() {
        super();
    }

    execute(notification: puremvc.INotification): void {
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