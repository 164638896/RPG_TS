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
    static MYPLAYER_PROXY: string = "MyPlayerProxy";
    static PLAYER_PROXY: string = "PlayerProxy";
    static MONSTER_PROXY: string = "MonsterProxy";
    static NPC_PROXY: string = "NpcProxy";
}

class MsgConst {
    static SOCKET_CONNECT: number = 1;
    static SOCKET_RECONNECT: number = 2;
    static SOCKET_START_RECONNECT: number = 3;
    static SOCKET_CLOSE: number = 4;
    static SOCKET_NOCONNECT: number = 5;

    static ADD_MYPLAYER: number = 6;
    static ADD_PLAYER: number = 7;
    static ADD_MONSTER: number = 8;
    static ADD_NPC: number = 9;
    static MOVE_MONSTER: number = 10;
}