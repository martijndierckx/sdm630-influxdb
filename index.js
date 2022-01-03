import { ModbusConnection } from "./ModBusConnection.js";

(async () => {
  // Set refresh interval
  const INTERVAL = process.env.INTERVAL ? parseInt(process.env.INTERVAL) : 1000;

  // Configure connection
  const connOpts = {
    host: process.env.MODBUS_HOST,
    port: process.env.MODBUS_PORT ? parseInt(process.env.MODBUS_PORT) : 502,
  };

  // Connect to modbus
  let modbusConn;
  try {
    modbusConn = await ModbusConnection.connect(connOpts);
  } catch (e) {
    console.error(`Couldn't connect to ${connOpts.host}:${connOpts.port}`);
    console.error(e);
    process.exit(1);
  }

  // Read registers every second
  setInterval(async () => {
    if (modbusConn && modbusConn.conn) {
      // Retrieve vals (max 40 per trip = 80 registers)
      const registers = await modbusConn.getRegisterRanges([
        { startParam: 1, quantity: 40 },
        { startParam: 41, quantity: 13 },
        { startParam: 101, quantity: 34 },
        { startParam: 168, quantity: 23 },
      ]);

      // Extract data
      const data = {
        l1: {
          V: registers.getFloatVal(1),
          A: registers.getFloatVal(4),
          W: registers.getFloatVal(7),
          VA: registers.getFloatVal(10),
          VAr: registers.getFloatVal(13),
          powerFactor: registers.getFloatVal(16),
          phaseAngle: registers.getFloatVal(19),
          total: {
            import: {
              kWh: registers.getFloatVal(174),
              kVArh: registers.getFloatVal(183),
            },
            export: {
              kWh: registers.getFloatVal(177),
              kVArh: registers.getFloatVal(186),
            },
            kWh: registers.getFloatVal(180),
            kVArh: registers.getFloatVal(189),
          },
          demand: {
            A: registers.getFloatVal(130),
            maxA: registers.getFloatVal(133),
          },
          THD: {
            V: registers.getFloatVal(118),
            A: registers.getFloatVal(121),
          },
        },
        l2: {
          V: registers.getFloatVal(2),
          A: registers.getFloatVal(5),
          W: registers.getFloatVal(8),
          VA: registers.getFloatVal(11),
          VAr: registers.getFloatVal(14),
          powerFactor: registers.getFloatVal(17),
          phaseAngle: registers.getFloatVal(20),
          total: {
            import: {
              kWh: registers.getFloatVal(175),
              kVArh: registers.getFloatVal(184),
            },
            export: {
              kWh: registers.getFloatVal(178),
              kVArh: registers.getFloatVal(187),
            },
            kWh: registers.getFloatVal(181),
            kVArh: registers.getFloatVal(190),
          },
          demand: {
            A: registers.getFloatVal(131),
            maxA: registers.getFloatVal(134),
          },
          THD: {
            V: registers.getFloatVal(119),
            A: registers.getFloatVal(122),
          },
        },
        l3: {
          V: registers.getFloatVal(3),
          A: registers.getFloatVal(6),
          W: registers.getFloatVal(9),
          VA: registers.getFloatVal(12),
          VAr: registers.getFloatVal(15),
          powerFactor: registers.getFloatVal(18),
          phaseAngle: registers.getFloatVal(21),
          total: {
            import: {
              kWh: registers.getFloatVal(176),
              kVArh: registers.getFloatVal(185),
            },
            export: {
              kWh: registers.getFloatVal(179),
              kVArh: registers.getFloatVal(188),
            },
            kWh: registers.getFloatVal(182),
            kVArh: registers.getFloatVal(191),
          },
          demand: {
            A: registers.getFloatVal(132),
            maxA: registers.getFloatVal(135),
          },
          THD: {
            V: registers.getFloatVal(120),
            A: registers.getFloatVal(123),
          },
        },
        line2Line: {
          l1toL2: {
            THD: {
              V: registers.getFloatVal(168),
            },
          },
          l2toL3: {
            THD: {
              V: registers.getFloatVal(169),
            },
          },
          l3toL1: {
            THD: {
              V: registers.getFloatVal(170),
            },
          },
        },
        total: {
          A: registers.getFloatVal(25),
          W: registers.getFloatVal(27),
          VA: registers.getFloatVal(29),
          VAr: registers.getFloatVal(31),
          powerFactor: registers.getFloatVal(32),
          phaseAngle: registers.getFloatVal(34),
          import: {
            kWh: registers.getFloatVal(37),
            kVArh: registers.getFloatVal(39),
          },
          export: {
            kWh: registers.getFloatVal(38),
            kVArh: registers.getFloatVal(40),
          },
          kWh: registers.getFloatVal(172),
          kVArh: registers.getFloatVal(173),
          kVAh: registers.getFloatVal(41),
          Ah: registers.getFloatVal(42),
          demand: {
            W: registers.getFloatVal(43),
            maxW: registers.getFloatVal(44),
            VA: registers.getFloatVal(51),
            maxVA: registers.getFloatVal(52),
          },
        },
        average: {
          V: registers.getFloatVal(22),
          A: registers.getFloatVal(24),
          line2Line: {
            V: registers.getFloatVal(104),
            THD: {
              V: registers.getFloatVal(171),
            },
          },
          THD: {
            V: registers.getFloatVal(125),
          },
        },
        neutral: {
          A: registers.getFloatVal(113),
          demand: {
            A: registers.getFloatVal(53),
            maxA: registers.getFloatVal(54),
          },
        },
        frequency: registers.getFloatVal(36),
      };

      console.log(data);
    } else {
      // Throw error forcing container to restart
      throw Error("Connection closed");
    }
  }, INTERVAL);
})();
