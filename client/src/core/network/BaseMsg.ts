
interface BaseMsg {
    decode(msg: any): any;
    encode(id: number, data: any): any;
}

class JsonMsg implements BaseMsg {
    public decode(msg: any): any {
        let m = JSON.parse(msg);
        if (m.id) {
            return [m.id, m.data];
        }
    }

    public encode(id: number, data: any): any {
        let msg = {
            id: id,
            data: data
        };

        return JSON.stringify(msg);
    }
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

        var len = this.receiveByte.getInt16();
        var id = this.receiveByte.getInt16();
        if (this.receiveByte.bytesAvailable >= len) {
            let data: Laya.Byte = new Laya.Byte();
            data.writeArrayBuffer(this.receiveByte, 4, len);
            return [id, data];
        }
        return null;
    }

    public encode(id: number, data: any): any {
        let msg: Laya.Byte = new Laya.Byte();
        msg.endian = Laya.Byte.LITTLE_ENDIAN;
        msg.writeUint16(data.length + 4);
        msg.writeUint16(id);
        msg.writeArrayBuffer(data);
        msg.pos = 0;
        return msg;
    }
}