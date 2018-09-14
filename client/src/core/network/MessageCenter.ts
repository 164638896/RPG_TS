
class MessageCenter {
    private mMsgDict: any;

    public constructor() {
        this.mMsgDict = {};
    }

    private static _instance = null;
    public static getInstance(): MessageCenter {
        if (MessageCenter._instance == null) {
            MessageCenter._instance = new MessageCenter();
        }
        return MessageCenter._instance;
    }

    public clear() {
        this.mMsgDict = {};
    }

    public addListener(type: number, listenerObj: any, listener: Function): boolean {
        let arr: Array<any> = this.mMsgDict[type];
        if (arr == null) {
            arr = new Array<any>();
            this.mMsgDict[type] = arr;
        }

        //检测是否已经存在
        let i: number = 0;
        let len: number = arr.length;
        for (i; i < len; i++) {
            if (arr[i][0] == listener && arr[i][1] == listenerObj) {
                return false;
            }
        }

        arr.push([listener, listenerObj]);
        return true;
    }

    public removeListener(type: number, listenerObj: any, listener: Function): boolean {
        let arr: Array<any> = this.mMsgDict[type];
        if (arr == null) {
            return false;
        }

        let i: number = 0;
        let len: number = arr.length;
        for (i; i < len; i++) {
            if (arr[i][0] == listener && arr[i][1] == listenerObj) {
                arr.splice(i, 1);
                break;
            }
        }

        if (arr.length == 0) {
            this.mMsgDict[type] = null;
            delete this.mMsgDict[type];
        }

        return true;
    }

    public removeAll(listenerObj: any): void {
        let keys = Object.keys(this.mMsgDict);
        for (var i: number = 0, len = keys.length; i < len; i++) {
            var type = keys[i];
            var arr: Array<any> = this.mMsgDict[type];
            for (var j = 0; j < arr.length; j++) {
                if (arr[j][1] == listenerObj) {
                    arr.splice(j, 1);
                    j--;
                }
            }

            if (arr.length == 0) {
                this.mMsgDict[type] = null;
                delete this.mMsgDict[type];
            }
        }
    }

    public dispatch(type: number, ...param: any[]): boolean {
        if (this.mMsgDict[type] == null) {
            return false;
        }

        let vo: MessageVo = laya.utils.Pool.getItemByClass("MessageVo", MessageVo);
        vo.type = type;
        vo.param = param;
        return this.dealMsg(vo);
    }

    private dealMsg(msgVo: MessageVo): boolean {
        let listeners: Array<any> = this.mMsgDict[msgVo.type];
        let i: number = 0;
        let len: number = listeners.length;
        let listener: Array<any> = null;
        while (i < len) {
            listener = listeners[i];
            listener[0].apply(listener[1], msgVo.param);
            if (listeners.length != len) {
                len = listeners.length;
                i--;
            }
            i++;
        }
        msgVo.dispose();
        laya.utils.Pool.recover("MessageVo", msgVo);
        return true;
    }
}

class MessageVo {
    public type: number;
    public param: any[];

    public constructor() {
    }

    public dispose(): void {
        this.type = null
        this.param = null;
    }
}