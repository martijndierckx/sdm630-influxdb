import { ModbusRegisters, Registers } from './ModBusRegisters';
import * as Modbus from 'jsmodbus';
import { Socket } from 'net';

export class ModbusConnection {
  private socket: Socket;
  private conn: Modbus.ModbusTCPClient = null;

  public static async connect(config: { port: number; host: string; slaveId: number }): Promise<ModbusConnection> {
    return new Promise((resolve) => {
      const modbusConn = new ModbusConnection();
      modbusConn.socket = new Socket();
      modbusConn.conn = new Modbus.client.TCP(modbusConn.socket, config.slaveId, 3000);

      // Events
      modbusConn.socket.on('connect', () => {
        resolve(modbusConn);
      });
      modbusConn.socket.on('end', () => {
        modbusConn.conn = null;
        // TODO reconnect on request?
      });

      modbusConn.socket.connect(config);
    });
  }

  public async disconnect() {
    this.socket.end(() => {
      return;
    });
  }

  public get isConnected(): boolean {
    return this.conn !== null;
  }

  public async getRegister(address: number): Promise<number> {
    const register = await this.getRegisterRange(address, 1);

    if (register == null) return null;
    return register[address];
  }

  public async getRegisterRanges(ranges: { startParam: number; quantity: number }[]): Promise<ModbusRegisters> {
    const registers: Registers = {};
    for (const range of ranges) {
      Object.assign(registers, await this.getRegisterRange(range.startParam, range.quantity));
    }

    return new ModbusRegisters(registers);
  }

  public async getRegisterRange(startParam: number, quantity: number): Promise<{ [address: number]: number }> {
    let res;
    try {
      res = await this.conn.readInputRegisters((startParam - 1) * 2, (quantity+1) * 2);
    } catch (e) {
      console.log(e);
      return null;
    }

    // Was data returned?
    if (res.response && res.response.body && !res.response.body.isException && res.response.body.byteCount > 0) {
      // Convert to correctly addressed object
      const data = {};
      for (const [i, val] of res.response.body.values.entries()) {
        let buf = Buffer.allocUnsafe(2);
        buf.writeUInt16BE(val);
        data[(startParam - 1) * 2 + i] = buf;
      }

      // Return data
      return data;
    }

    // Nothing returned
    throw Error(`Failed retrieving register range ${startParam} + ${(startParam - 1) * 2 + quantity}`);
  }
}
