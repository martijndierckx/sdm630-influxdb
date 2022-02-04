export type Registers = {
  [address: number]: Uint8Array;
};

export class ModbusRegisters {
  public registers: Registers = null;

  public constructor(registers: Registers) {
    this.registers = registers;
  }

  public get32BitFloatVal(param: number): number {
    const address = (param - 1) * 2;
    try {
      const buffer = Buffer.concat([this.registers[address], this.registers[address + 1]]);
      return +buffer.readFloatBE().toFixed(3);
    } catch (e) {
      console.error(`Couldn't parse 32 bit float param '${param}' value from 2 registers: ${address} & ${address + 1}`);
      console.error(e);
    }
    return null;
  }
}
