"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModbusConnection = void 0;
const tslib_1 = require("tslib");
const modbus_stream_1 = (0, tslib_1.__importDefault)(require("modbus-stream"));
const ModBusRegisters_1 = require("./ModBusRegisters");
class ModbusConnection {
    constructor() {
        this.conn = null;
    }
    static connect(config) {
        return new Promise((resolve, reject) => {
            modbus_stream_1.default.tcp.connect(config.port, config.host, null, (err, conn) => {
                if (err) {
                    reject(err);
                    return;
                }
                const modbusConn = new ModbusConnection();
                modbusConn.conn = conn;
                conn.on('close', () => {
                    modbusConn.conn = null;
                });
                resolve(modbusConn);
            });
        });
    }
    async getRegisterRanges(ranges) {
        const registers = {};
        for (const range of ranges) {
            Object.assign(registers, await this.getgetRegisterRange(range.startParam, range.quantity));
        }
        return new ModBusRegisters_1.ModbusRegisters(registers);
    }
    async getgetRegisterRange(startParam, quantity) {
        return new Promise((resolve, reject) => {
            this.conn.readInputRegisters({ address: (startParam - 1) * 2, quantity: quantity * 2 }, (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                const data = {};
                for (const [i, val] of res.response.data.entries()) {
                    data[(startParam - 1) * 2 + i] = val;
                }
                resolve(data);
            });
        });
    }
}
exports.ModbusConnection = ModbusConnection;
//# sourceMappingURL=ModBusConnection.js.map