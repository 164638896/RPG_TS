/*
* name;
*/

class NotiNames {
    static STARTUP: string = "StartUp";
    static ENTER_SCENE: string = "EnterScene";

    static ADD_ROLE: string = "AddRole";
    static REMOVE_ROLE: string = "RemoveRole";
    static SKILL: string = "Skill";
}

class MediatorNames {
    static LOADING: string = "Loading";
    static MAIN: string = "Main";
}

class ProxyNames {
    static ROLE_PROXY: string = "RoleProxy";
    // static MYPLAYER_PROXY: string = "MyPlayerProxy";
    // static PLAYER_PROXY: string = "PlayerProxy";
    // static MONSTER_PROXY: string = "MonsterProxy";
    // static NPC_PROXY: string = "NpcProxy";
}

class MsgConst {
    static SOCKET_CONNECT: string = "1";
    static SOCKET_RECONNECT: string = "2";
    static SOCKET_START_RECONNECT: string = "3";
    static SOCKET_CLOSE: string = "4";
    static SOCKET_NOCONNECT: string = "5";

    static ADD_MYPLAYER: string = "6";
    static ADD_PLAYER: string = "7";
    static ADD_MONSTER: string = "8";
    static ADD_NPC: string = "9";
    static MOVE_MONSTER: string = "10";
}