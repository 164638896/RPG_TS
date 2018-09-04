type Long = protobuf.Long;

/** Namespace awesomepackage. */
declare namespace awesomepackage {

    /** Properties of an AwesomeMessage. */
    interface IAwesomeMessage {

        /** AwesomeMessage awesomeField */
        awesomeField?: (string|null);
    }

    /** Represents an AwesomeMessage. */
    class AwesomeMessage implements IAwesomeMessage {

        /**
         * Constructs a new AwesomeMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: awesomepackage.IAwesomeMessage);

        /** AwesomeMessage awesomeField. */
        public awesomeField: string;

        /**
         * Creates a new AwesomeMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AwesomeMessage instance
         */
        public static create(properties?: awesomepackage.IAwesomeMessage): awesomepackage.AwesomeMessage;

        /**
         * Encodes the specified AwesomeMessage message. Does not implicitly {@link awesomepackage.AwesomeMessage.verify|verify} messages.
         * @param message AwesomeMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: awesomepackage.IAwesomeMessage, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Encodes the specified AwesomeMessage message, length delimited. Does not implicitly {@link awesomepackage.AwesomeMessage.verify|verify} messages.
         * @param message AwesomeMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: awesomepackage.IAwesomeMessage, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes an AwesomeMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AwesomeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): awesomepackage.AwesomeMessage;

        /**
         * Decodes an AwesomeMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AwesomeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): awesomepackage.AwesomeMessage;

        /**
         * Verifies an AwesomeMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AwesomeMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AwesomeMessage
         */
        public static fromObject(object: { [k: string]: any }): awesomepackage.AwesomeMessage;

        /**
         * Creates a plain object from an AwesomeMessage message. Also converts values to other types if specified.
         * @param message AwesomeMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: awesomepackage.AwesomeMessage, options?: protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AwesomeMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Namespace awesomepackage1. */
declare namespace awesomepackage1 {

    /** Properties of an AwesomeMessage1. */
    interface IAwesomeMessage1 {

        /** AwesomeMessage1 awesomeField1 */
        awesomeField1?: (string|null);
    }

    /** Represents an AwesomeMessage1. */
    class AwesomeMessage1 implements IAwesomeMessage1 {

        /**
         * Constructs a new AwesomeMessage1.
         * @param [properties] Properties to set
         */
        constructor(properties?: awesomepackage1.IAwesomeMessage1);

        /** AwesomeMessage1 awesomeField1. */
        public awesomeField1: string;

        /**
         * Creates a new AwesomeMessage1 instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AwesomeMessage1 instance
         */
        public static create(properties?: awesomepackage1.IAwesomeMessage1): awesomepackage1.AwesomeMessage1;

        /**
         * Encodes the specified AwesomeMessage1 message. Does not implicitly {@link awesomepackage1.AwesomeMessage1.verify|verify} messages.
         * @param message AwesomeMessage1 message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: awesomepackage1.IAwesomeMessage1, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Encodes the specified AwesomeMessage1 message, length delimited. Does not implicitly {@link awesomepackage1.AwesomeMessage1.verify|verify} messages.
         * @param message AwesomeMessage1 message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: awesomepackage1.IAwesomeMessage1, writer?: protobuf.Writer): protobuf.Writer;

        /**
         * Decodes an AwesomeMessage1 message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AwesomeMessage1
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): awesomepackage1.AwesomeMessage1;

        /**
         * Decodes an AwesomeMessage1 message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AwesomeMessage1
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): awesomepackage1.AwesomeMessage1;

        /**
         * Verifies an AwesomeMessage1 message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AwesomeMessage1 message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AwesomeMessage1
         */
        public static fromObject(object: { [k: string]: any }): awesomepackage1.AwesomeMessage1;

        /**
         * Creates a plain object from an AwesomeMessage1 message. Also converts values to other types if specified.
         * @param message AwesomeMessage1
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: awesomepackage1.AwesomeMessage1, options?: protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AwesomeMessage1 to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
