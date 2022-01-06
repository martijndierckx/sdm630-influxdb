import { InfluxDB, FieldType } from 'influx';

export type DatabaseConnectionConfig = {
  host: string;
  port?: number;
  db: string;
  user?: string;
  password?: string;
  measurement: string;
  fieldMap: any;
};

export class Database {
  private conn: InfluxDB;

  private measurement: string;
  private meterName: string;
  private fieldMap: any;

  public static connect(opts: DatabaseConnectionConfig, meterName: string) {
    const db = new Database();

    // Save params
    db.measurement = opts.measurement;
    db.meterName = meterName;
    db.fieldMap = opts.fieldMap;

    // Fieldmap to fields list
    const influxFieldTypes: { [column: string]: FieldType } = {};
    const setInfluxFieldTypes = (keys: any[]) => {
      for (const key in keys) {
        var keyName = keys[key];
        if (typeof keyName === 'object') {
          setInfluxFieldTypes(keyName);
        } else {
          influxFieldTypes[keyName] = FieldType.FLOAT;
        }
      }
    };
    setInfluxFieldTypes(opts.fieldMap);

    // Initiate connection
    db.conn = new InfluxDB({
      host: opts.host,
      port: opts.port ?? 8086,
      database: opts.db,
      username: opts.user ?? undefined,
      password: opts.password ?? undefined,
      schema: [
        {
          measurement: db.measurement,
          fields: influxFieldTypes,
          tags: ['meter']
        }
      ]
    });

    return db;
  }

  public async write(data: { [name: string]: any }): Promise<void> {
    // Create key value pairs
    var keyValues = {};
    const combineKeyValues = (keys, values) => {
      for (var key in keys) {
        var keyName = keys[key];
        if (typeof keyName === 'object') {
          combineKeyValues(keyName, values[key]);
        } else {
          keyValues[keyName] = values[key];
        }
      }
    };
    combineKeyValues(this.fieldMap, data);

    // Write
    this.conn.writePoints([
      {
        measurement: this.measurement,
        tags: { meter: this.meterName },
        fields: keyValues
      }
    ]);

    return await this.conn.writePoints([{ fields: data }]);
  }
}
