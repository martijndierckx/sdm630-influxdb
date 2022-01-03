export type SDM630Registers = {
  l1: {
    V: number;
    A: number;
    W: number;
    VA: number;
    VAr: number;
    powerFactor: number;
    phaseAngle: number;
    total: {
      import: {
        kWh: number;
        kVArh: number;
      };
      export: {
        kWh: number;
        kVArh: number;
      };
      kWh: number;
      kVArh: number;
    };
    demand: {
      A: number;
      maxA: number;
    };
    THD: {
      V: number;
      A: number;
    };
  };
  l2: {
    V: number;
    A: number;
    W: number;
    VA: number;
    VAr: number;
    powerFactor: number;
    phaseAngle: number;
    total: {
      import: {
        kWh: number;
        kVArh: number;
      };
      export: {
        kWh: number;
        kVArh: number;
      };
      kWh: number;
      kVArh: number;
    };
    demand: {
      A: number;
      maxA: number;
    };
    THD: {
      V: number;
      A: number;
    };
  };
  l3: {
    V: number;
    A: number;
    W: number;
    VA: number;
    VAr: number;
    powerFactor: number;
    phaseAngle: number;
    total: {
      import: {
        kWh: number;
        kVArh: number;
      };
      export: {
        kWh: number;
        kVArh: number;
      };
      kWh: number;
      kVArh: number;
    };
    demand: {
      A: number;
      maxA: number;
    };
    THD: {
      V: number;
      A: number;
    };
  };
  line2Line: {
    l1toL2: {
      THD: {
        V: number;
      };
    };
    l2toL3: {
      THD: {
        V: number;
      };
    };
    l3toL1: {
      THD: {
        V: number;
      };
    };
  };
  total: {
    A: number;
    W: number;
    VA: number;
    VAr: number;
    powerFactor: number;
    phaseAngle: number;
    import: {
      kWh: number;
      kVArh: number;
    };
    export: {
      kWh: number;
      kVArh: number;
    };
    kWh: number;
    kVArh: number;
    kVAh: number;
    Ah: number;
    demand: {
      W: number;
      maxW: number;
      VA: number;
      maxVA: number;
    };
  };
  average: {
    V: number;
    A: number;
    line2Line: {
      V: number;
      THD: {
        V: number;
      };
    };
    THD: {
      V: number;
    };
  };
  neutral: {
    A: number;
    demand: {
      A: number;
      maxA: number;
    };
  };
  frequency: number;
};
