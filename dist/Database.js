"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const influx_1 = require("influx");
class Database {
    static connect(opts, meterName) {
        const db = new Database();
        db.measurement = opts.measurement;
        db.meterName = meterName;
        db.fieldMap = opts.fieldMap;
        const influxFieldTypes = {};
        const setInfluxFieldTypes = (keys) => {
            for (const key in keys) {
                var keyName = keys[key];
                if (typeof keyName === 'object') {
                    setInfluxFieldTypes(keyName);
                }
                else {
                    influxFieldTypes[keyName] = influx_1.FieldType.FLOAT;
                }
            }
        };
        setInfluxFieldTypes(opts.fieldMap);
        db.conn = new influx_1.InfluxDB({
            host: opts.host,
            port: opts.port ?? 8086,
            database: opts.db,
            username: opts.user ?? undefined,
            password: opts.password ?? undefined,
            schema: [
                {
                    measurement: db.measurement,
                    fields: influxFieldTypes,
                    tags: db.meterName ? ['meter'] : undefined
                }
            ]
        });
        return db;
    }
    async write(data) {
        var keyValues = {};
        const combineKeyValues = (keys, values) => {
            for (var key in keys) {
                var keyName = keys[key];
                if (typeof keyName === 'object') {
                    combineKeyValues(keyName, values[key]);
                }
                else {
                    keyValues[keyName] = values[key];
                }
            }
        };
        combineKeyValues(this.fieldMap, data);
        this.conn
            .writePoints([
            {
                measurement: this.measurement,
                tags: this.meterName ? { meter: this.meterName } : undefined,
                fields: keyValues
            }
        ])
            .catch((err) => {
            console.error(`Error saving data to InfluxDB! ${err.stack}`);
        });
        return await this.conn.writePoints([{ fields: data }]);
    }
}
exports.Database = Database;
//# sourceMappingURL=Database.js.map