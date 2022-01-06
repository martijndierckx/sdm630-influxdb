import * as modbus from 'modbus-stream';
import { ModbusRegisters, Registers } from './ModBusRegisters';

export class ModbusConnection {
  public conn: modbus.TCPStream = null;

  public static connect(config: { port: number; host: string }): Promise<ModbusConnection> {
    return new Promise((resolve, reject) => {
      modbus.tcp.connect(config.port, config.host, undefined, (err: Error, conn: modbus.TCPStream) => {
        if (err) {
          reject(err);
          return;
        }

        // Create connection object
        const modbusConn = new ModbusConnection();
        modbusConn.conn = conn;

        // Remove connection object on disconnect
        conn.on('close', () => {
          modbusConn.conn = null;
        });

        // Return connection object
        resolve(modbusConn);
      });
    });
  }

  public async getRegisterRanges(ranges: { startParam: number; quantity: number }[]): Promise<ModbusRegisters> {
    const registers: Registers = {};
    for (const range of ranges) {
      Object.assign(registers, await this.getgetRegisterRange(range.startParam, range.quantity));
    }

    return new ModbusRegisters(registers);
  }

  public async getgetRegisterRange(startParam: number, quantity: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.conn.readInputRegisters({ address: (startParam - 1) * 2, quantity: quantity * 2 }, (err, res) => {
        if (err) {
          reject(err);
          return;
        }

        // Convert to correctly addressed object
        const data = {};
        for (const [i, val] of res.response.data.entries()) {
          data[(startParam - 1) * 2 + i] = val;
        }

        // Return data
        resolve(data);
      });
    });
  }
}
