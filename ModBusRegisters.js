export class ModbusRegisters {
  registers = null;
  conn = null;

  static async getRanges(conn, ranges) {
    this.conn = conn;

    //const start = Date.now();
    const modbusRegisters = new ModbusRegisters();
    modbusRegisters.registers = {};
    for (const range of ranges) {
      Object.assign(
        modbusRegisters.registers,
        await ModbusRegisters.getRange(range.startParam, range.quantity)
      );
    }
    //console.log(Date.now() - start + 'ms');
    return modbusRegisters;
  }

  static async getRange(startParam, quantity) {
    return new Promise((resolve, reject) => {
      this.conn.conn.readInputRegisters(
        { address: (startParam - 1) * 2, quantity: quantity * 2 },
        (err, res) => {
          if (err) {
            console.log(err);
            resolve({});
          }

          // Convert to correctly addressed object
          const data = {};
          for (const [i, val] of res.response.data.entries()) {
            data[(startParam - 1) * 2 + i] = val;
          }

          // Return data
          resolve(data);
        }
      );
    });
  }

  getFloatVal(param) {
    try {
      const address = (param - 1) * 2;
      const buffer = Buffer.concat([
        this.registers[address],
        this.registers[address + 1],
      ]);
      return +buffer.readFloatBE().toFixed(3);
    } catch (e) {}
    return 0;
  }
}
