/*
* name;
*/
class Network extends laya.events.EventDispatcher{
    private mSocket: Laya.Socket = null;
    private mHost: string;
    private mPort: any;
    private mMsg: BaseMsg;

    private _needReconnect: boolean = false;
    private _maxReconnectCount = 10;
    private _reconnectCount: number = 0;
    private _connectFlag: boolean;
    private _isConnecting: boolean;

    //private mMsgDict = {};

    constructor() {
        super();
    }

    private static _instance = null;
    public static getInstance(): Network {
        if (Network._instance == null) {
            Network._instance = new Network();
        }
        return Network._instance;
    }

    private addEvents() {
        this.mSocket.on(Laya.Event.OPEN, this, this.onSocketOpen);
        this.mSocket.on(Laya.Event.MESSAGE, this, this.onReceiveMessage);
        this.mSocket.on(Laya.Event.CLOSE, this, this.onSocketClose);
        this.mSocket.on(Laya.Event.ERROR, this, this.onSocketError);
    }

    private removeEvents(): void {
        this.mSocket.off(Laya.Event.OPEN, this, this.onSocketOpen);
        this.mSocket.off(Laya.Event.MESSAGE, this, this.onReceiveMessage);
        this.mSocket.off(Laya.Event.CLOSE, this, this.onSocketClose);
        this.mSocket.off(Laya.Event.ERROR, this, this.onSocketError);
    }

    private onSocketOpen(event: any = null): void {
        this._reconnectCount = 0;
        this._isConnecting = true;

        if (this._connectFlag && this._needReconnect) {
            //this.dispatch(MsgConst.SOCKET_RECONNECT);
            this.event(MsgConst.SOCKET_RECONNECT);
        } else {
            //this.dispatch(MsgConst.SOCKET_CONNECT);
            this.event(MsgConst.SOCKET_CONNECT);
        }

        this._connectFlag = true;
    }

    private onSocketClose(e: any = null): void {
        this._isConnecting = false;

        if (this._needReconnect) {
            //this.dispatch(MsgConst.SOCKET_START_RECONNECT);
            this.event(MsgConst.SOCKET_START_RECONNECT);
            this.reconnect();
        } else {
            //this.dispatch(MsgConst.SOCKET_CLOSE);
            this.event(MsgConst.SOCKET_CLOSE);
        }
    }

    private onSocketError(e: any = null): void {
        if (this._needReconnect) {
            this.reconnect();
        } else {
            //this.dispatch(MsgConst.SOCKET_NOCONNECT);
            this.event(MsgConst.SOCKET_NOCONNECT);
        }
        this._isConnecting = false;
    }

    public initServer(host: string, port: any, msg: BaseMsg): void {
        this.mHost = host;
        this.mPort = port;
        this.mMsg = msg;
        this.connect();
    }

    public connect(): void {
        this.mSocket = new Laya.Socket();
        this.mSocket.endian = Laya.Byte.LITTLE_ENDIAN;
        this.addEvents();
        this.mSocket.connect(this.mHost, this.mPort);
        //this.mSocket.connectByUrl("ws://localhost:8989");
    }

    private reconnect(): void {
        this.closeCurrentSocket();
        this._reconnectCount++;
        if (this._reconnectCount < this._maxReconnectCount) {
            this.connect();
        } else {
            this._reconnectCount = 0;
        }
    }

    private onReceiveMessage(msg: any = null): void {
        var obj: any = this.mMsg.decode(msg);
        if (obj != null) {
            //this.dispatch(obj.id, obj.data);
            this.event(obj.id, obj.data);
        }
    }

    public send(msgID: number, msg: any): void {
        var obj: any = this.mMsg.encode(msgID, msg);
        if (obj) {
            this.mSocket.send(obj);
        }
    }

    public close(): void {
        this._connectFlag = false;
        this.closeCurrentSocket();
        //this.mMsgDict = {};
    }

    private closeCurrentSocket() {
        this.removeEvents();
        this.mSocket.close();
        this.mSocket = null;
        this._isConnecting = false;
    }

    public isConnecting(): boolean {
        return this._isConnecting;
    }


    // public on(type: number, listenerObj: any, listener: Function): boolean {
    //     let arr: Array<any> = this.mMsgDict[type];
    //     if (arr == null) {
    //         arr = new Array<any>();
    //         this.mMsgDict[type] = arr;
    //     }

    //     //检测是否已经存在
    //     let i: number = 0;
    //     let len: number = arr.length;
    //     for (i; i < len; i++) {
    //         if (arr[i][0] == listener && arr[i][1] == listenerObj) {
    //             return false;
    //         }
    //     }

    //     arr.push([listener, listenerObj]);
    //     return true;
    // }

    // public off(type: number, listenerObj: any, listener: Function): boolean {
    //     let arr: Array<any> = this.mMsgDict[type];
    //     if (arr == null) {
    //         return false;
    //     }

    //     let i: number = 0;
    //     let len: number = arr.length;
    //     for (i; i < len; i++) {
    //         if (arr[i][0] == listener && arr[i][1] == listenerObj) {
    //             arr.splice(i, 1);
    //             break;
    //         }
    //     }

    //     if (arr.length == 0) {
    //         this.mMsgDict[type] = null;
    //         delete this.mMsgDict[type];
    //     }

    //     return true;
    // }

    // public offAll(listenerObj: any): void {
    //     let keys = Object.keys(this.mMsgDict);
    //     for (var i: number = 0, len = keys.length; i < len; i++) {
    //         var type = keys[i];
    //         var arr: Array<any> = this.mMsgDict[type];
    //         for (var j = 0; j < arr.length; j++) {
    //             if (arr[j][1] == listenerObj) {
    //                 arr.splice(j, 1);
    //                 j--;
    //             }
    //         }

    //         if (arr.length == 0) {
    //             this.mMsgDict[type] = null;
    //             delete this.mMsgDict[type];
    //         }
    //     }
    // }

    // public dispatch(type: number, ...param: any[]): boolean {
    //     if (this.mMsgDict[type] == null) {
    //         return false;
    //     }

    //     let listeners: Array<any> = this.mMsgDict[type];
    //     let i: number = 0;
    //     let len: number = listeners.length;
    //     let listener: Array<any> = null;
    //     while (i < len) {
    //         listener = listeners[i];
    //         listener[0].apply(listener[1], param);
    //         if (listeners.length != len) {
    //             len = listeners.length;
    //             i--;
    //         }
    //         i++;
    //     }
    // }
}