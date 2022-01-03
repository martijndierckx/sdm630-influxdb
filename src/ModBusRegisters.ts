export type Registers = {
  [address: number]: Uint8Array;
};

export class ModbusRegisters {
  public registers: Registers = null;

  public constructor(registers: Registers) {
    this.registers = registers;
  }

  public get16BitFloatVal(param: number) {
    try {
      const address = (param - 1) * 2;
      const buffer = Buffer.concat([this.registers[address], this.registers[address + 1]]);
      return +buffer.readFloatBE().toFixed(3);
    } catch (e) {}
    return 0;
  }
}
