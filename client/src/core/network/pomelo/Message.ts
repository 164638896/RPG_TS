
class Message {

    private static mTYPE_REQUEST:number = 0;
    private static mTYPE_NOTIFY:number = 1;
    private static mTYPE_RESPONSE:number = 2;
    private static mTYPE_PUSH:number = 3;

    static MSG_FLAG_BYTES = 1;
    static MSG_ROUTE_CODE_BYTES = 2;
    static MSG_ID_MAX_BYTES = 5;
    static MSG_ROUTE_LEN_BYTES = 1;

    static MSG_ROUTE_CODE_MAX = 0xffff;

    static MSG_COMPRESS_ROUTE_MASK = 0x1;
    static MSG_TYPE_MASK = 0x7;

    static get TYPE_REQUEST() {
        return Message.mTYPE_REQUEST;
    }
    static get TYPE_NOTIFY() {
        return Message.mTYPE_NOTIFY;
    }
    static get TYPE_RESPONSE() {
        return Message.mTYPE_RESPONSE;
    }
    static get TYPE_PUSH() {
        return Message.mTYPE_PUSH;
    }
    /**
     * Message protocol encode.
     *
     * @param  {Number} id            message id
     * @param  {Number} type          message type
     * @param  {Number} compressRoute whether compress route
     * @param  {Number|String} route  route code or route string
     * @param  {Buffer} msg           message body bytes
     * @return {Buffer}               encode result
     */
    static encode(id, type, compressRoute, route, msg) {
        // caculate message max length
        var idBytes = msgHasId(type) ? caculateMsgIdBytes(id) : 0;
        var msgLen = Message.MSG_FLAG_BYTES + idBytes;

        if (msgHasRoute(type)) {
            if (compressRoute) {
                if (typeof route !== 'number') {
                    throw new Error('error flag for number route!');
                }
                msgLen += Message.MSG_ROUTE_CODE_BYTES;
            } else {
                msgLen += Message.MSG_ROUTE_LEN_BYTES;
                if (route) {
                    route = Protocol.strencode(route);
                    if (route.length > 255) {
                        throw new Error('route maxlength is overflow');
                    }
                    msgLen += route.length;
                }
            }
        }
        if (msg) {
            msgLen += msg.length;
        }

        var buffer = new Uint8Array(msgLen);
        var offset = 0;

        // add flag
        offset = encodeMsgFlag(type, compressRoute, buffer, offset);

        // add message id
        if (msgHasId(type)) {
            offset = encodeMsgId(id, buffer, offset);
        }

        // add route
        if (msgHasRoute(type)) {
            offset = encodeMsgRoute(compressRoute, route, buffer, offset);
        }

        // add body
        if (msg) {
            offset = encodeMsgBody(msg, buffer, offset);
        }

        return buffer;
    }

    /**
     * Message protocol decode.
     *
     * @param  {Buffer|Uint8Array} buffer message bytes
     * @return {Object}            message object
     */
    static decode(buffer) {
        var bytes = new Uint8Array(buffer);
        var bytesLen = bytes.length || bytes.byteLength;
        var offset = 0;
        var id = 0;
        var route = null;

        // parse flag
        var flag = bytes[offset++];
        var compressRoute = flag & Message.MSG_COMPRESS_ROUTE_MASK;
        var type = (flag >> 1) & Message.MSG_TYPE_MASK;

        // parse id
        if (msgHasId(type)) {
            var m = parseInt(bytes[offset].toString());   // modify by lai
            var i = 0;
            do {
                var m = parseInt(bytes[offset].toString());   // modify by lai
                id = id + ((m & 0x7f) * Math.pow(2, (7 * i)));
                offset++;
                i++;
            } while (m >= 128);
        }

        // parse route
        if (msgHasRoute(type)) {
            if (compressRoute) {
                route = (bytes[offset++]) << 8 | bytes[offset++];
            } else {
                var routeLen = bytes[offset++];
                if (routeLen) {
                    route = new Uint8Array(routeLen);
                    PomoloUtil.copyArray(route, 0, bytes, offset, routeLen);
                    route = Protocol.strdecode(route);
                } else {
                    route = '';
                }
                offset += routeLen;
            }
        }

        // parse body
        var bodyLen = bytesLen - offset;
        var body = new Uint8Array(bodyLen);

        PomoloUtil.copyArray(body, 0, bytes, offset, bodyLen);

        return {
            'id': id, 'type': type, 'compressRoute': compressRoute,
            'route': route, 'body': body
        };
    }
}

var msgHasId = function (type) {
    return type === Message.TYPE_REQUEST || type === Message.TYPE_RESPONSE;
};

var msgHasRoute = function (type) {
    return type === Message.TYPE_REQUEST || type === Message.TYPE_NOTIFY ||
        type === Message.TYPE_PUSH;
};

var caculateMsgIdBytes = function (id) {
    var len = 0;
    do {
        len += 1;
        id >>= 7;
    } while (id > 0);
    return len;
};

var encodeMsgFlag = function (type, compressRoute, buffer, offset) {
    if (type !== Message.TYPE_REQUEST && type !== Message.TYPE_NOTIFY &&
        type !== Message.TYPE_RESPONSE && type !== Message.TYPE_PUSH) {
        throw new Error('unkonw message type: ' + type);
    }

    buffer[offset] = (type << 1) | (compressRoute ? 1 : 0);

    return offset + Message.MSG_FLAG_BYTES;
};

var encodeMsgId = function (id, buffer, offset) {
    do {
        var tmp = id % 128;
        var next = Math.floor(id / 128);

        if (next !== 0) {
            tmp = tmp + 128;
        }
        buffer[offset++] = tmp;

        id = next;
    } while (id !== 0);

    return offset;
};

var encodeMsgRoute = function (compressRoute, route, buffer, offset) {
    if (compressRoute) {
        if (route > Message.MSG_ROUTE_CODE_MAX) {
            throw new Error('route number is overflow');
        }

        buffer[offset++] = (route >> 8) & 0xff;
        buffer[offset++] = route & 0xff;
    } else {
        if (route) {
            buffer[offset++] = route.length & 0xff;
            PomoloUtil.copyArray(buffer, offset, route, 0, route.length);
            offset += route.length;
        } else {
            buffer[offset++] = 0;
        }
    }

    return offset;
};

var encodeMsgBody = function (msg, buffer, offset) {
    PomoloUtil.copyArray(buffer, offset, msg, 0, msg.length);
    return offset + msg.length;
};