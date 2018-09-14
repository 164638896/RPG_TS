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
                let role = RoleMgr.getInstance().createMonster(porxy as MonsterPorxy, roleData);
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

        let role: Role = null;
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

        let pos = role.mRole3D.transform.position;
        //let f = role.mRole3D.transform.forward;
        let forward = roleData.mForward;

        // let nf = new Laya.Vector3;
        // let nforward = new Laya.Vector3;
        // Laya.Vector3.normalize(f, nf);
        // Laya.Vector3.normalize(forward, nforward);

        let monsterPorxy = this.facade.retrieveProxy(ProxyNames.MONSTER_PROXY) as MonsterPorxy;
        let monsterArray = monsterPorxy.getDataDict().values;
        for (let i = 0; i < monsterArray.length; ++i) {
            let monsterData = monsterArray[i] as MonsterData;
            let tPos = monsterData.mPos;

            if(this.IsPointInCircularSector(pos.x, pos.z, forward.x, forward.z, 0.5, 3.14 / 2, tPos.x, tPos.z))
            {
                let monster = RoleMgr.getInstance().getMonster(monsterData.mInstId);
                monster.mStateMachine.switchState(StateType.Hit, [AniName.Hit, 1]);
            }
        }
       
        if (role) {
            let skillInfo = SkillConfig.getInstance().getSkillInfo(arr[1]);
            if (skillInfo) {
                role.mStateMachine.switchState(StateType.Atk, [skillInfo.ani, 2]);
            }
            else {
                console.error("没有这个技能Id=", arr[1]);
            }
        }
    }

    //c原点, u 方向, r半径, theta角度, p点是否在扇形里
    IsPointInCircularSector(cx: number, cy: number, ux: number, uy: number, r: number, theta: number, px: number, py: number): boolean {
        if (r <= 0 || theta <= 0 || theta > Math.PI) {
            console.log("IsPointInCircularSector 参数错误 r=", r, " theta=", theta);
            return false;
        }
        // D = P - C
        let dx = px - cx;
        let dy = py - cy;

        // |D| = (dx^2 + dy^2)^0.5
        let length = Math.sqrt(dx * dx + dy * dy);

        // |D| > r
        if (length > r)
            return false;

        // Normalize D
        dx /= length;
        dy /= length;

        // acos(D dot U) < theta
        let th:number = Math.acos(dx * ux + dy * uy);
        return th < theta;
    }
}