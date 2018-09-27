
const DEFAULT_MAX_RECONNECT_ATTEMPTS = 10;

const JS_WS_CLIENT_TYPE = 'js-websocket';
const JS_WS_CLIENT_VERSION = '0.0.1';

const RES_OK = 200;
const RES_FAIL = 500;
const RES_OLD_CLIENT = 501;

function blobToBuffer(blob, cb) {
    const fileReader = new FileReader();
    fileReader.onload = (event: Event) => {
        //const buffer = event.target.result; //modify by lai
        const buffer = fileReader.result;
        cb(buffer);
    };
    fileReader.readAsArrayBuffer(blob);
}

function defaultDecode(data) {
    const msg = Message.decode(data);
    msg.body = JSON.parse(Protocol.strdecode(msg.body));
    return msg;
}
function defaultEncode(reqId, route, msg) {
    const type = reqId ? Message.TYPE_REQUEST : Message.TYPE_NOTIFY;
    msg = Protocol.strencode(JSON.stringify(msg));
    const compressRoute = 0;
    return Message.encode(reqId, type, compressRoute, route, msg);
}
function defaultUrlGenerator(host, port) {
    let url = 'ws://' + host;
    if (port) {
        url += ':' + port;
    }
    return url;
}

class Pomelo extends laya.events.EventDispatcher {
    // private wsCreator:Function;
    // private wsCreatorWeb:Function;
    // private urlGenerator:Function;
    private reconnect: boolean;
    private reconncetTimer: number;
    private reconnectAttempts: number;
    private reconnectionDelay: number;
    private handshakeBuffer: any;
    private heartbeatInterval: number;
    private heartbeatTimeout: number;
    private nextHeartbeatTimeout: number;
    private gapThreshold: number;
    private heartbeatId: number;
    private heartbeatTimeoutId: number;
    private handshakeCallback: Function;

    private callbacks = {};
    private handlers = {};
    private reqId: number;
    private initCallback: Function;
    private socket: any;
    private params: any;
    private encode: Function;
    private decode: Function;
    private url: string;
    private browserWS: any;

    constructor() {
        super();
        // const {wsCreator, wsCreatorWeb, urlGenerator = defaultUrlGenerator} = args;
        // this.wsCreator = wsCreator;
        // this.wsCreatorWeb = wsCreatorWeb;
        // this.urlGenerator = urlGenerator;

        this.reconnect = false;
        this.reconncetTimer = null;
        this.reconnectAttempts = 0;
        this.reconnectionDelay = 5000;

        this.handshakeBuffer = {
            'sys': {
                type: JS_WS_CLIENT_TYPE,
                version: JS_WS_CLIENT_VERSION,
                rsa: {}
            },
            'user': {
            }
        };

        this.heartbeatInterval = 0;
        this.heartbeatTimeout = 0;
        this.nextHeartbeatTimeout = 0;
        this.gapThreshold = 100;   // heartbeat gap threashold
        this.heartbeatId = null;
        this.heartbeatTimeoutId = null;
        this.handshakeCallback = null;

        this.callbacks = {};
        this.handlers = {};
        this.handlers[Package.TYPE_HANDSHAKE] = this.handshake.bind(this);
        this.handlers[Package.TYPE_HEARTBEAT] = this.heartbeat.bind(this);
        this.handlers[Package.TYPE_DATA] = this.onData.bind(this);
        this.handlers[Package.TYPE_KICK] = this.onKick.bind(this);

        this.reqId = 0;
    }
    
    private static _instance = null;
    public static getInstance(): Pomelo {
        if (Pomelo._instance == null) {
            Pomelo._instance = new Pomelo();
        }
        return Pomelo._instance;
    }

    handshake(data) {
        data = JSON.parse(Protocol.strdecode(data));
        if (data.code === RES_OLD_CLIENT) {
            this.event('error', 'client version not fullfill');
            //this.emit('error', 'client version not fullfill');
            return;
        }

        if (data.code !== RES_OK) {
            this.event('error', 'handshake fail');
            //this.emit('error', 'handshake fail');
            return;
        }
        this.handshakeInit(data);

        const obj = Package.encode(Package.TYPE_HANDSHAKE_ACK);
        this.send(obj);
        this.initCallback && this.initCallback(this.socket);
    }
    handshakeInit(data) {
        if (data.sys && data.sys.heartbeat) {
            this.heartbeatInterval = data.sys.heartbeat * 1000;   // heartbeat interval
            this.heartbeatTimeout = this.heartbeatInterval * 2;   // max heartbeat timeout
        } else {
            this.heartbeatInterval = 0;
            this.heartbeatTimeout = 0;
        }

        typeof this.handshakeCallback === 'function' && this.handshakeCallback(data.user);
    }
    heartbeat(data) {
        if (!this.heartbeatInterval) {
            return;
        }

        const obj = Package.encode(Package.TYPE_HEARTBEAT);
        if (this.heartbeatTimeoutId) {
            clearTimeout(this.heartbeatTimeoutId);
            this.heartbeatTimeoutId = null;
        }

        if (this.heartbeatId) {
            // already in a heartbeat interval
            return;
        }
        this.heartbeatId = setTimeout(() => {
            this.heartbeatId = null;
            this.send(obj);

            this.nextHeartbeatTimeout = Date.now() + this.heartbeatTimeout;
            this.heartbeatTimeoutId = setTimeout(() => this.heartbeatTimeoutCb(), this.heartbeatTimeout);
        }, this.heartbeatInterval);
    }
    heartbeatTimeoutCb() {
        var gap = this.nextHeartbeatTimeout - Date.now();
        if (gap > this.gapThreshold) {
            this.heartbeatTimeoutId = setTimeout(() => this.heartbeatTimeoutCb(), gap);
        } else {
            console.error('server heartbeat timeout');
            this.event('heartbeat timeout');
            //this.emit('heartbeat timeout');
            this.disconnect();
        }
    }
    reset() {
        this.reconnect = false;
        this.reconnectionDelay = 1000 * 5;
        this.reconnectAttempts = 0;
        clearTimeout(this.reconncetTimer);
    }
    init(params, cb) {
        this.initCallback = cb;

        this.params = params;
        const {host, port, user, handshakeCallback, encode = defaultEncode, decode = defaultDecode, debugMode, browserWS} = params;

        this.encode = encode;
        this.decode = decode;

        this.url = defaultUrlGenerator(host, port);
        // if (debugMode) {
        //     this.url = defaultUrlGenerator(host, port);
        // }
        // else {
        //     this.url = this.urlGenerator(host, port);
        // }

        // if (browserWS) {
        //     this.wsCreator = this.wsCreatorWeb;
        //     this.browserWS = browserWS;
        // }

        this.handshakeBuffer.user = user;
        this.handshakeCallback = handshakeCallback;
        this.connect();
    }
    connect() {
        this.socket = new Laya.Socket();
        //this.socket.endian = Laya.Byte.LITTLE_ENDIAN;
        this.addEvents();
        //this.socket.connect(this.mHost, this.mPort);
        this.socket.connectByUrl(this.url);
    }

    private addEvents() {
        this.socket.on(Laya.Event.OPEN, this, this.onSocketOpen);
        this.socket.on(Laya.Event.MESSAGE, this, this.onReceiveMessage);
        this.socket.on(Laya.Event.CLOSE, this, this.onSocketClose);
        this.socket.on(Laya.Event.ERROR, this, this.onSocketError);
    }

    private removeEvents(): void {
        this.socket.off(Laya.Event.OPEN, this, this.onSocketOpen);
        this.socket.off(Laya.Event.MESSAGE, this, this.onReceiveMessage);
        this.socket.off(Laya.Event.CLOSE, this, this.onSocketClose);
        this.socket.off(Laya.Event.ERROR, this, this.onSocketError);
    }

    private onSocketOpen(event: any = null): void {
        if (!!this.reconnect) {
            //this.emit('reconnect');
            this.event('reconnect');
        }
        this.reset();
        const obj = Package.encode(Package.TYPE_HANDSHAKE, Protocol.strencode(JSON.stringify(this.handshakeBuffer)));
        this.send(obj);
    }

    private onReceiveMessage(msg: any = null): void {
        this.processPackage(Package.decode(msg.data));
        // new package arrived, update the heartbeat timeout
        if (this.heartbeatTimeout) {
            this.nextHeartbeatTimeout = Date.now() + this.heartbeatTimeout;
        }

        // if (this.browserWS) {
        //     blobToBuffer(msg.data, (buffer) => {
        //         this.processPackage(Package.decode(buffer));
        //         // new package arrived, update the heartbeat timeout
        //         if (this.heartbeatTimeout) {
        //             this.nextHeartbeatTimeout = Date.now() + this.heartbeatTimeout;
        //         }
        //     });
        // } else {
        //     this.processPackage(Package.decode(msg.data));
        //     // new package arrived, update the heartbeat timeout
        //     if (this.heartbeatTimeout) {
        //         this.nextHeartbeatTimeout = Date.now() + this.heartbeatTimeout;
        //     }
        // }
    }

    private onSocketClose(event: any = null): void {
        const maxReconnectAttempts = this.params.maxReconnectAttempts || DEFAULT_MAX_RECONNECT_ATTEMPTS;
        this.event('close', event);
        this.event('disconnect', event);
        // this.emit('close', event);
        // this.emit('disconnect', event);
        if (!!this.params.reconnect && this.reconnectAttempts < maxReconnectAttempts) {
            this.reconnect = true;
            this.reconnectAttempts++;
            this.reconncetTimer = setTimeout(() => this.connect(), this.reconnectionDelay);
            this.reconnectionDelay *= 2;
        }
    }

    private onSocketError(event: any = null): void {
        this.event('io-error', event);
        //this.emit('io-error', event);
        console.error('socket error: ', event);
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = false;
        }

        if (this.heartbeatId) {
            clearTimeout(this.heartbeatId);
            this.heartbeatId = null;
        }
        if (this.heartbeatTimeoutId) {
            clearTimeout(this.heartbeatTimeoutId);
            this.heartbeatTimeoutId = null;
        }
    }
    
    request(route, msg, cb) {
        if (arguments.length === 2 && typeof msg === 'function') {
            cb = msg;
            msg = {};
        } else {
            msg = msg || {};
        }
        route = route || msg.route;
        if (!route) {
            return;
        }

        this.reqId++;
        this.sendMessage(this.reqId, route, msg);

        this.callbacks[this.reqId] = cb;
    }
    notify(route, msg) {
        msg = msg || {};
        this.sendMessage(0, route, msg);
    }
    sendMessage(reqId, route, msg) {
        msg = this.encode(reqId, route, msg);

        const packet = Package.encode(Package.TYPE_DATA, msg);
        this.send(packet);
    }
    send(packet) {
        // if (this.browserWS) {
        //     this.socket.send(packet.buffer);
        // } else {
        //     this.socket.send({ data: packet.buffer });
        // }
        this.socket.send(packet.buffer);
    }
    onData(msg) {
        msg = this.decode(msg);
        this.processMessage(msg);
    }
    onKick(data) {
        data = JSON.parse(Protocol.strdecode(data));
        this.event('onKick', data);
        //this.emit('onKick', data);
    }
    processMessage(msg) {
        if (!msg.id) {
            this.event(msg.route, msg.body);
            //this.emit(msg.route, msg.body);
            return;
        }

        //if have a id then find the callback function with the request
        const cb = this.callbacks[msg.id];

        delete this.callbacks[msg.id];
        typeof cb === 'function' && cb(msg.body);
    }
    processPackage(msgs) {
        if (Array.isArray(msgs)) {
            for (let i = 0; i < msgs.length; i++) {
                const msg = msgs[i];
                this.handlers[msg.type](msg.body);
            }
        } else {
            this.handlers[msgs.type](msgs.body);
        }
    }
    // newInstance() {
    //     return new Pomelo({
    //         wsCreator: this.wsCreator,
    //         urlGenerator: this.urlGenerator
    //     });
    // }
}

