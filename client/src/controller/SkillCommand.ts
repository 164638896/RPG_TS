/*
* name;
*/

class SkillCommand extends puremvc.SimpleCommand {
    constructor() {
        super();
    }

    execute(notification: puremvc.INotification): void {
        var ani:string = notification.getBody();
        let myPlayer = RoleMgr.getInstance().getMyPlayer();
        myPlayer.mStateMachine.SwitchState(StateType.Atk, ani);
    }
}