import { ModbusRegisters } from "./ModBusRegisters.js";
import modbus from "modbus-stream";

export class ModbusConnection {
  conn = null;

  static connect(config) {
    return new Promise((resolve, reject) => {
      modbus.tcp.connect(config.port, config.host, (err, conn) => {
        // do something with connection
        if (err) {
          console.log(err);
          resolve(null);
        }

        const modbusConn = new ModbusConnection();
        modbusConn.conn = conn;
        resolve(modbusConn);
      });
    });
  }

  async getRegisterRanges(ranges) {
    return await ModbusRegisters.getRanges(this, ranges);
  }
}