/**
 * Communicate data using radio packets
 */
//% color=#E3008C weight=96 icon="\uf012"
namespace radio {
    export class Packet {
        /**
         * The number payload if a number was sent in this packet (via ``sendNumber()`` or ``sendValue()``)
         * or 0 if this packet did not contain a number.
         */
        public receivedNumber: number;
        /**
         * The string payload if a string was sent in this packet (via ``sendString()`` or ``sendValue()``)
         * or the empty string if this packet did not contain a string.
         */
        public receivedString: string;
        /**
         * The buffer payload if a buffer was sent in this packet
         * or the empty buffer
         */
        public receivedBuffer: Buffer;
        /**
         * The system time of the sender of the packet at the time the packet was sent.
         */
        public time: number;
        /**
         * The serial number of the sender of the packet or 0 if the sender did not sent their serial number.
         */
        public serial: number;
        /**
         * The received signal strength indicator (RSSI) of the packet.
         */
        public signal: number;
    }

    export enum PacketProperty {
        //% blockIdentity=radio._packetProperty
        //% block="time"
        Time,
        //% block="serial number"
        //% blockIdentity=radio._packetProperty
        SerialNumber,
        //% blockIdentity=radio._packetProperty
        //% block="signal strength"
        SignalStrength
    }

    /**
     * Registers code to run when the radio receives a packet. Also takes the
     * received packet from the radio queue.
     */
    //% help=radio/on-data-packet-received blockHandlerKey="radioreceived" deprecated=true
    //% mutate=objectdestructuring
    //% mutateText=Packet
    //% mutateDefaults="receivedNumber;receivedString:name,receivedNumber:value;receivedString"
    //% blockId=radio_on_packet block="on radio received" blockGap=8
    export function onDataPacketReceived(cb: (packet: Packet) => void) {
        onDataReceived(() => {
            receiveNumber();
            const packet = new Packet();
            packet.receivedNumber = receivedNumber();
            packet.time = receivedTime();
            packet.serial = receivedSerial();
            packet.receivedString = receivedString();
            packet.receivedBuffer = receivedBuffer();
            packet.signal = receivedSignalStrength();
            lastPacket = packet;
            cb(packet)
        });
    }

    /**
     * Registers code to run when the radio receives a number.
     */
    //% help=radio/on-radio-received-number blockHandlerKey="radioreceived"
    //% blockId=radio_on_number block="on radio received" blockGap=8
    export function onReceivedNumber(cb: (receivedNumber: number) => void) {
        onDataReceived(() => {
            receiveNumber();
            const packet = new Packet();
            packet.time = receivedTime();
            packet.serial = receivedSerial();
            packet.signal = receivedSignalStrength();
            packet.receivedNumber = receivedNumber();
            lastPacket = packet;
            cb(packet.receivedNumber);
        });
    }

    /**
     * Registers code to run when the radio receives a key value pair.
     */
    //% help=radio/on-radio-received-value blockHandlerKey="radioreceived"
    //% blockId=radio_on_value block="on radio received" blockGap=8
    export function onReceivedValue(cb: (name: string, value: number) => void) {
        onDataReceived(() => {
            receiveNumber();
            const packet = new Packet();
            packet.time = receivedTime();
            packet.serial = receivedSerial();
            packet.signal = receivedSignalStrength();
            packet.receivedNumber = receivedNumber();
            packet.receivedString = receivedString();
            lastPacket = packet;
            cb(packet.receivedString, packet.receivedNumber)
        });
    }

    /**
     * Registers code to run when the radio receives a string.
     */
    //% help=radio/on-radio-received-string blockHandlerKey="radioreceived"
    //% blockId=radio_on_string block="on radio received" blockGap=8
    export function onReceivedString(cb: (receivedString: string) => void) {
        onDataReceived(() => {
            receiveNumber();
            const packet = new Packet();
            packet.time = receivedTime();
            packet.serial = receivedSerial();
            packet.signal = receivedSignalStrength();
            packet.receivedString = receivedString();
            lastPacket = packet;
            cb(packet.receivedString);
        });
    }

    /**
     * Registers code to run when the radio receives a buffer.
     */
    //% help=radio/on-radio-received-buffer blockHandlerKey="radioreceived" blockHidden=1
    //% blockId=radio_on_buffer block="on radio received" blockGap=8
    export function onReceivedBuffer(cb: (buffer: Buffer) => void) {
        onDataReceived(() => {
            receiveNumber();
            const packet = new Packet();
            packet.time = receivedTime();
            packet.serial = receivedSerial();
            packet.signal = receivedSignalStrength();
            packet.receivedBuffer = receivedBuffer();
            lastPacket = packet;
            cb(packet.receivedBuffer)
        });
    }

    let lastPacket: Packet;
    /**
     * Returns properties of the last radio packet received.
     * @param type the type of property to retrieve from the last packet
     */
    //% help=radio/get-received-packet-property advanced=true
    //% blockId=radio_received_packet_property block="received packet %type=radio_packet_property" blockGap=8
    export function getReceivedPacketProperty(type: number) {
        if (lastPacket) {
            switch(type) {
                case PacketProperty.Time: return lastPacket.time;
                case PacketProperty.SerialNumber: return lastPacket.serial;
                case PacketProperty.SignalStrength: return lastPacket.signal;
            }
        }
        return 0;
    }

    /**
     * Gets a packet property.
     * @param type the packet property type, eg: PacketProperty.time
     */
    //% blockId=radio_packet_property block="%note"
    //% shim=TD_ID blockHidden=1
    export function _packetProperty(type: PacketProperty): number {
        return type;
    }
}
