
interface BaseMsg {
    decode(msg: any): any;
    encode(id: number, msg: any): any;
}

class ProtoBufMsg implements BaseMsg {
    private receiveByte: Laya.Byte;

    public constructor() {
        this.receiveByte = new Laya.Byte();
        this.receiveByte.endian = Laya.Byte.LITTLE_ENDIAN;
    }

    public decode(msg: any): any {
        this.receiveByte.clear();
        this.receiveByte.writeArrayBuffer(msg);
        this.receiveByte.pos = 0;

        var msgID = this.receiveByte.getInt16();
        var len = this.receiveByte.getInt16();
        if (this.receiveByte.bytesAvailable >= len) {
            let byte: Laya.Byte = new Laya.Byte();
            byte.writeArrayBuffer(this.receiveByte, 4, len);
            return [msgID, byte];
        }
        return null;
    }

    public encode(msgID: number, msg: any): any {
        let pkg: Laya.Byte = new Laya.Byte();
        pkg.endian = Laya.Byte.LITTLE_ENDIAN;
        pkg.writeUint16(msg.length + 4);
        pkg.writeUint16(msgID);
        pkg.writeArrayBuffer(msg);
        return pkg;
    }
}