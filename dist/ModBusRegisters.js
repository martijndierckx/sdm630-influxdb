"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModbusRegisters = void 0;
class ModbusRegisters {
    constructor(registers) {
        this.registers = null;
        this.registers = registers;
    }
    get32BitFloatVal(param) {
        const address = (param - 1) * 2;
        try {
            const buffer = Buffer.concat([this.registers[address], this.registers[address + 1]]);
            return +buffer.readFloatBE().toFixed(3);
        }
        catch (e) {
            console.error(`Couldn't parse 32 bit float param '${param}' value from 2 registers: ${address} & ${address + 1}`);
            console.error(e);
        }
        return null;
    }
}
exports.ModbusRegisters = ModbusRegisters;
//# sourceMappingURL=ModBusRegisters.js.map