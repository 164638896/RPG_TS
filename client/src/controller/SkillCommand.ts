/*
* name;
*/

class SkillCommand extends puremvc.SimpleCommand {
    constructor() {
        super();
    }

    execute(notification: puremvc.INotification): void {
        let arr = notification.getBody();
        let role = RoleMgr.getInstance().getMyPlayer() as Role;
        if(role.mRoleData.mInstId != arr[0])
        {
            role = RoleMgr.getInstance().getPlayer(arr[0]);
        }

        let skillInfo = SkillConfig.getInstance().getSkillInfo(arr[1]);
        role.mStateMachine.SwitchState(StateType.Atk, skillInfo.ani);
    }
}