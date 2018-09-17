/*
* name;
*/
class ClientSocket {
    private mSocket: Laya.Socket = null;
    private mHost: string;
    private mPort: any;
    private mMsg: BaseMsg;

    private _needReconnect: boolean = false;
    private _maxReconnectCount = 10;
    private _reconnectCount: number = 0;
    private _connectFlag: boolean;
    private _isConnecting: boolean;

    constructor() {

    }

    private static _instance = null;
    public static getInstance(): ClientSocket {
        if (ClientSocket._instance == null) {
            ClientSocket._instance = new ClientSocket();
        }
        return ClientSocket._instance;
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
            MessageCenter.getInstance().dispatch(MsgConst.SOCKET_RECONNECT);
        } else {
            MessageCenter.getInstance().dispatch(MsgConst.SOCKET_CONNECT);
        }

        this._connectFlag = true;
    }

    private onSocketClose(e: any = null): void {
        this._isConnecting = false;

        if (this._needReconnect) {
            MessageCenter.getInstance().dispatch(MsgConst.SOCKET_START_RECONNECT);
            this.reconnect();
        } else {
            MessageCenter.getInstance().dispatch(MsgConst.SOCKET_CLOSE);
        }
    }

    private onSocketError(e: any = null): void {
        if (this._needReconnect) {
            this.reconnect();
        } else {
            MessageCenter.getInstance().dispatch(MsgConst.SOCKET_NOCONNECT);
        }
        this._isConnecting = false;
    }

    public initServer(host: string, port: any, msg: BaseMsg): void {
        this.mHost = host;
        this.mPort = port;
        this.mMsg = msg;
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
            MessageCenter.getInstance().dispatch(obj.id, obj.data);
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
}