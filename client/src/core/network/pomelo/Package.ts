
class Package {
    static PKG_HEAD_BYTES = 4;
    
    private static mTYPE_HANDSHAKE = 1;
    private static mTYPE_HANDSHAKE_ACK = 2;
    private static mTYPE_HEARTBEAT = 3;
    private static mTYPE_DATA = 4;
    private static mTYPE_KICK = 5;

    static get TYPE_HANDSHAKE() {
        return Package.mTYPE_HANDSHAKE;
    }
    static get TYPE_HANDSHAKE_ACK() {
        return Package.mTYPE_HANDSHAKE_ACK;
    }
    static get TYPE_HEARTBEAT() {
        return Package.mTYPE_HEARTBEAT;
    }
    static get TYPE_DATA() {
        return Package.mTYPE_DATA;
    }
    static get TYPE_KICK() {
        return Package.mTYPE_KICK;
    }
    /**
     * Package protocol encode.
     *
     * Pomelo package format:
     * +------+-------------+------------------+
     * | type | body length |       body       |
     * +------+-------------+------------------+
     *
     * Head: 4bytes
     *   0: package type,
     *      1 - handshake,
     *      2 - handshake ack,
     *      3 - heartbeat,
     *      4 - data
     *      5 - kick
     *   1 - 3: big-endian body length
     * Body: body length bytes
     *
     * @param  {Number}    type   package type
     * @param  {Uint8Array} body   body content in bytes
     * @return {Uint8Array}        new byte array that contains encode result
     */
    static encode(type, body?) : Uint8Array{
        var length = body ? body.length : 0;
        var buffer = new Uint8Array(Package.PKG_HEAD_BYTES + length);
        var index = 0;
        buffer[index++] = type & 0xff;
        buffer[index++] = (length >> 16) & 0xff;
        buffer[index++] = (length >> 8) & 0xff;
        buffer[index++] = length & 0xff;
        if (body) {
            PomoloUtil.copyArray(buffer, index, body, 0, length);
        }
        // return String.fromCharCode.apply(null,buffer);
        return buffer;
    }

    /**
     * Package protocol decode.
     * See encode for package format.
     *
     * @param  {Uint8Array} buffer byte array containing package content
     * @return {Object}           {type: package type, buffer: body byte array}
     */
    static decode(buffer) :Object{
        // buffer = toUTF8Array(str)
        var offset = 0;
        var bytes = new Uint8Array(buffer);
        var length = 0;
        var rs = [];
        while (offset < bytes.length) {
            var type = bytes[offset++];
            length = ((bytes[offset++]) << 16 | (bytes[offset++]) << 8 | bytes[offset++]) >>> 0;
            var body = length ? new Uint8Array(length) : null;
            PomoloUtil.copyArray(body, 0, bytes, offset, length);
            offset += length;
            rs.push({ 'type': type, 'body': body });
        }
        return rs.length === 1 ? rs[0] : rs;
    }
}