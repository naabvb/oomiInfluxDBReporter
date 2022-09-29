import * as Influx from "influx";
import { InfluxDbSettings } from "../interfaces/InfluxDb";

export class InfluxDbUploader {
  private client: Influx.InfluxDB;

  constructor(settings: InfluxDbSettings) {
    this.client = this.createClient(settings);
  }

  createClient = (settings: InfluxDbSettings): Influx.InfluxDB => {
    return new Influx.InfluxDB({
      host: settings.host,
      port: settings.port,
      protocol: settings.protocol,
      username: settings.username,
      password: settings.password,
      database: settings.database,
      schema: [
        {
          measurement: "consumption",
          fields: {
            kwh: Influx.FieldType.FLOAT,
          },
          tags: ["key"],
        },
      ],
    });
  };

  writeDataPoint = async (consumptionPairs: [number, number][]) => {
    consumptionPairs.forEach(async ([timestamp, kwh]) => {
      await this.client.writePoints([
        {
          measurement: "consumption",
          fields: { kwh: kwh },
          timestamp: new Date(timestamp),
        },
      ]);
    });
  };
}