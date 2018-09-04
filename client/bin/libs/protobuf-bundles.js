var $protobuf = window.protobuf;
$protobuf.roots.default=window;
// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.awesomepackage = (function() {

    /**
     * Namespace awesomepackage.
     * @exports awesomepackage
     * @namespace
     */
    var awesomepackage = {};

    awesomepackage.AwesomeMessage = (function() {

        /**
         * Properties of an AwesomeMessage.
         * @memberof awesomepackage
         * @interface IAwesomeMessage
         * @property {string|null} [awesomeField] AwesomeMessage awesomeField
         */

        /**
         * Constructs a new AwesomeMessage.
         * @memberof awesomepackage
         * @classdesc Represents an AwesomeMessage.
         * @implements IAwesomeMessage
         * @constructor
         * @param {awesomepackage.IAwesomeMessage=} [properties] Properties to set
         */
        function AwesomeMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AwesomeMessage awesomeField.
         * @member {string} awesomeField
         * @memberof awesomepackage.AwesomeMessage
         * @instance
         */
        AwesomeMessage.prototype.awesomeField = "";

        /**
         * Creates a new AwesomeMessage instance using the specified properties.
         * @function create
         * @memberof awesomepackage.AwesomeMessage
         * @static
         * @param {awesomepackage.IAwesomeMessage=} [properties] Properties to set
         * @returns {awesomepackage.AwesomeMessage} AwesomeMessage instance
         */
        AwesomeMessage.create = function create(properties) {
            return new AwesomeMessage(properties);
        };

        /**
         * Encodes the specified AwesomeMessage message. Does not implicitly {@link awesomepackage.AwesomeMessage.verify|verify} messages.
         * @function encode
         * @memberof awesomepackage.AwesomeMessage
         * @static
         * @param {awesomepackage.IAwesomeMessage} message AwesomeMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AwesomeMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.awesomeField != null && message.hasOwnProperty("awesomeField"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.awesomeField);
            return writer;
        };

        /**
         * Encodes the specified AwesomeMessage message, length delimited. Does not implicitly {@link awesomepackage.AwesomeMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof awesomepackage.AwesomeMessage
         * @static
         * @param {awesomepackage.IAwesomeMessage} message AwesomeMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AwesomeMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AwesomeMessage message from the specified reader or buffer.
         * @function decode
         * @memberof awesomepackage.AwesomeMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {awesomepackage.AwesomeMessage} AwesomeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AwesomeMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.awesomepackage.AwesomeMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.awesomeField = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AwesomeMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof awesomepackage.AwesomeMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {awesomepackage.AwesomeMessage} AwesomeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AwesomeMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AwesomeMessage message.
         * @function verify
         * @memberof awesomepackage.AwesomeMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AwesomeMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.awesomeField != null && message.hasOwnProperty("awesomeField"))
                if (!$util.isString(message.awesomeField))
                    return "awesomeField: string expected";
            return null;
        };

        /**
         * Creates an AwesomeMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof awesomepackage.AwesomeMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {awesomepackage.AwesomeMessage} AwesomeMessage
         */
        AwesomeMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.awesomepackage.AwesomeMessage)
                return object;
            var message = new $root.awesomepackage.AwesomeMessage();
            if (object.awesomeField != null)
                message.awesomeField = String(object.awesomeField);
            return message;
        };

        /**
         * Creates a plain object from an AwesomeMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof awesomepackage.AwesomeMessage
         * @static
         * @param {awesomepackage.AwesomeMessage} message AwesomeMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AwesomeMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.awesomeField = "";
            if (message.awesomeField != null && message.hasOwnProperty("awesomeField"))
                object.awesomeField = message.awesomeField;
            return object;
        };

        /**
         * Converts this AwesomeMessage to JSON.
         * @function toJSON
         * @memberof awesomepackage.AwesomeMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AwesomeMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AwesomeMessage;
    })();

    return awesomepackage;
})();

$root.awesomepackage1 = (function() {

    /**
     * Namespace awesomepackage1.
     * @exports awesomepackage1
     * @namespace
     */
    var awesomepackage1 = {};

    awesomepackage1.AwesomeMessage1 = (function() {

        /**
         * Properties of an AwesomeMessage1.
         * @memberof awesomepackage1
         * @interface IAwesomeMessage1
         * @property {string|null} [awesomeField1] AwesomeMessage1 awesomeField1
         */

        /**
         * Constructs a new AwesomeMessage1.
         * @memberof awesomepackage1
         * @classdesc Represents an AwesomeMessage1.
         * @implements IAwesomeMessage1
         * @constructor
         * @param {awesomepackage1.IAwesomeMessage1=} [properties] Properties to set
         */
        function AwesomeMessage1(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AwesomeMessage1 awesomeField1.
         * @member {string} awesomeField1
         * @memberof awesomepackage1.AwesomeMessage1
         * @instance
         */
        AwesomeMessage1.prototype.awesomeField1 = "";

        /**
         * Creates a new AwesomeMessage1 instance using the specified properties.
         * @function create
         * @memberof awesomepackage1.AwesomeMessage1
         * @static
         * @param {awesomepackage1.IAwesomeMessage1=} [properties] Properties to set
         * @returns {awesomepackage1.AwesomeMessage1} AwesomeMessage1 instance
         */
        AwesomeMessage1.create = function create(properties) {
            return new AwesomeMessage1(properties);
        };

        /**
         * Encodes the specified AwesomeMessage1 message. Does not implicitly {@link awesomepackage1.AwesomeMessage1.verify|verify} messages.
         * @function encode
         * @memberof awesomepackage1.AwesomeMessage1
         * @static
         * @param {awesomepackage1.IAwesomeMessage1} message AwesomeMessage1 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AwesomeMessage1.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.awesomeField1 != null && message.hasOwnProperty("awesomeField1"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.awesomeField1);
            return writer;
        };

        /**
         * Encodes the specified AwesomeMessage1 message, length delimited. Does not implicitly {@link awesomepackage1.AwesomeMessage1.verify|verify} messages.
         * @function encodeDelimited
         * @memberof awesomepackage1.AwesomeMessage1
         * @static
         * @param {awesomepackage1.IAwesomeMessage1} message AwesomeMessage1 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AwesomeMessage1.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AwesomeMessage1 message from the specified reader or buffer.
         * @function decode
         * @memberof awesomepackage1.AwesomeMessage1
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {awesomepackage1.AwesomeMessage1} AwesomeMessage1
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AwesomeMessage1.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.awesomepackage1.AwesomeMessage1();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.awesomeField1 = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AwesomeMessage1 message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof awesomepackage1.AwesomeMessage1
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {awesomepackage1.AwesomeMessage1} AwesomeMessage1
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AwesomeMessage1.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AwesomeMessage1 message.
         * @function verify
         * @memberof awesomepackage1.AwesomeMessage1
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AwesomeMessage1.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.awesomeField1 != null && message.hasOwnProperty("awesomeField1"))
                if (!$util.isString(message.awesomeField1))
                    return "awesomeField1: string expected";
            return null;
        };

        /**
         * Creates an AwesomeMessage1 message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof awesomepackage1.AwesomeMessage1
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {awesomepackage1.AwesomeMessage1} AwesomeMessage1
         */
        AwesomeMessage1.fromObject = function fromObject(object) {
            if (object instanceof $root.awesomepackage1.AwesomeMessage1)
                return object;
            var message = new $root.awesomepackage1.AwesomeMessage1();
            if (object.awesomeField1 != null)
                message.awesomeField1 = String(object.awesomeField1);
            return message;
        };

        /**
         * Creates a plain object from an AwesomeMessage1 message. Also converts values to other types if specified.
         * @function toObject
         * @memberof awesomepackage1.AwesomeMessage1
         * @static
         * @param {awesomepackage1.AwesomeMessage1} message AwesomeMessage1
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AwesomeMessage1.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.awesomeField1 = "";
            if (message.awesomeField1 != null && message.hasOwnProperty("awesomeField1"))
                object.awesomeField1 = message.awesomeField1;
            return object;
        };

        /**
         * Converts this AwesomeMessage1 to JSON.
         * @function toJSON
         * @memberof awesomepackage1.AwesomeMessage1
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AwesomeMessage1.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AwesomeMessage1;
    })();

    return awesomepackage1;
})();