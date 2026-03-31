import { log } from '../logger';
import {
  StorageAdapter,
  HomeAssistant,
  TransportType,
  MealPlanCardConfig,
  HasGetter,
  SensorConfig,
  MqttConfig,
  TuyaServiceConfig,
  DeviceProfile,
  FeedingTime,
  EncodingType,
} from '../types';
import { getEncoder } from '../profiles/serializer';

/**
 * Shared utility functions for entity state validation and retrieval
 */
function isValidState(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    (value === '' || value.trim() !== '') &&
    value !== 'unknown' &&
    value !== 'unavailable'
  );
}

function getFirstValidEntityValue(
  hass: HomeAssistant,
  ...entityIds: Array<string | undefined>
): string | null {
  for (const entityId of entityIds) {
    if (!entityId) continue;

    const value = hass.states?.[entityId]?.state;
    if (isValidState(value)) {
      return value;
    }
  }

  return null;
}

abstract class HassAdapterImpl implements StorageAdapter {
  protected getHass: HasGetter;
  protected encoder: ReturnType<typeof getEncoder>;

  constructor(hass: HasGetter, profile: DeviceProfile) {
    if (typeof hass !== 'function') {
      throw new Error('hass must be a function');
    }
    this.getHass = hass;
    this.encoder = getEncoder(profile);
  }

  protected abstract readRaw(): Promise<string | null>;

  async read(): Promise<FeedingTime[] | null> {
    const raw = await this.readRaw();
    if (!raw) return null;
    return this.encoder.decode(raw);
  }

  async isDataAvailable(): Promise<boolean> {
    const value = await this.readRaw();
    return value !== null && value !== undefined;
  }

  abstract write(meals: FeedingTime[]): Promise<void>;
}

/**
 * Sensor-based storage adapter
 * Reads from sensor/helper, writes via sensor.set_value
 * Handles encoding/decoding internally
 */
export class SensorAdapter extends HassAdapterImpl implements StorageAdapter {
  constructor(
    hass: HasGetter,
    profile: DeviceProfile,
    private sensorId: string,
    private helperId?: string,
  ) {
    super(hass, profile);
  }

  protected async readRaw(): Promise<string | null> {
    const hass = this.getHass();
    return getFirstValidEntityValue(hass, this.sensorId, this.helperId);
  }

  async write(meals: FeedingTime[]): Promise<void> {
    const encoded = this.encoder.encode(meals);

    const hass = this.getHass();
    await this.setEntityValue(hass, this.sensorId, encoded);

    // Also sync helper if configured
    if (this.helperId) {
      await this.setEntityValue(hass, this.helperId, encoded);
    }
  }

  private async setEntityValue(
    hass: HomeAssistant,
    entityId: string | undefined,
    value: string,
  ): Promise<void> {
    if (!entityId) return;
    const domain = entityId.split('.')[0];
    if (!domain) return;
    await hass.callService(domain, 'set_value', {
      entity_id: entityId,
      value,
    });
  }
}

/**
 * MQTT-based storage adapter
 * Reads from MQTT sensor entity state, publishes to MQTT topic
 * Handles encoding/decoding internally
 */
export class MqttAdapter extends HassAdapterImpl implements StorageAdapter {
  private deviceName: string;
  constructor(
    hass: HasGetter,
    profile: DeviceProfile,
    private sensorId: string,
    private helperId?: string,
  ) {
    super(hass, profile);
    this.deviceName = this.sensorId.split('.')[1] || '';
    if (!this.deviceName) {
      throw new Error(
        `Invalid sensor entity ID for MQTT: ${this.sensorId}. Expected format: sensor.device_name`,
      );
    }
  }

  protected async readRaw(): Promise<string | null> {
    const hass = this.getHass();
    return getFirstValidEntityValue(hass, this.sensorId, this.helperId);
  }

  async write(meals: FeedingTime[]): Promise<void> {
    const encoded = this.encoder.encode(meals);

    const hass = this.getHass();
    const topic = `zigbee2mqtt/${this.deviceName}/set`;
    await hass.callService('mqtt', 'publish', {
      topic,
      payload: encoded,
    });
  }
}

/**
 * Tuya Home Assistant service adapter.
 * Reads/writes via Home Assistant services, uses HomeAssistantEncoder for day-list format.
 * Handles encoding/decoding internally
 */
export class TuyaServiceAdapter
  extends HassAdapterImpl
  implements StorageAdapter
{
  constructor(
    hass: HasGetter,
    profile: DeviceProfile,
    private deviceId: string,
    private readAction: string,
    private writeAction: string,
  ) {
    super(hass, {
      ...profile,
      encodingType: EncodingType.HOME_ASSISTANT,
    });
  }

  protected async readRaw(): Promise<string | null> {
    const hass = this.getHass();
    const [domain, service] = this.readAction.split('.');
    if (!domain || !service) {
      throw new Error(`Invalid service action format: ${this.readAction}`);
    }

    try {
      log.debug(`Calling service ${domain}.${service} to read data`);
      log.debug(`Device ID: ${this.deviceId}`);
      const response = await hass.callWS<{ response: Record<string, unknown> }>(
        {
          type: 'call_service',
          domain,
          service,
          service_data: {
            device_id: this.deviceId,
          },
          return_response: true,
        },
      );

      const data = response.response.data;
      const raw = typeof data === 'string' ? data : JSON.stringify(data);
      return raw;
    } catch (error) {
      console.error('Error reading from tuya service:', error);
      return null;
    }
  }

  async write(meals: FeedingTime[]): Promise<void> {
    const encoded = this.encoder.encode(meals);

    const hass = this.getHass();
    const [domain, service] = this.writeAction.split('.');
    if (!domain || !service) {
      throw new Error(`Invalid service action format: ${this.writeAction}`);
    }

    const haPayload = JSON.parse(encoded);

    await hass.callService(domain, service, {
      device_id: this.deviceId,
      data: haPayload,
    });
  }
}

/**
 * Create storage adapter based on config
 */
export function createStorageAdapter(
  hass: HasGetter,
  config: MealPlanCardConfig,
  profile: DeviceProfile,
): StorageAdapter {
  const transportType = config.transport_type as TransportType;
  log.debug(`Creating storage adapter for transport type: ${transportType}`);
  switch (transportType) {
    case TransportType.SENSOR:
      const sensorConfig = config as SensorConfig;
      return new SensorAdapter(
        hass,
        profile,
        sensorConfig.sensor,
        sensorConfig.helper,
      );
    case TransportType.MQTT: {
      const mqttConfig = config as MqttConfig;
      return new MqttAdapter(
        hass,
        profile,
        mqttConfig.sensor,
        mqttConfig.helper,
      );
    }
    case TransportType.TUYA_SERVICE: {
      const tuyaConfig = config as TuyaServiceConfig;
      return new TuyaServiceAdapter(
        hass,
        profile,
        tuyaConfig.device_id,
        tuyaConfig.read_action,
        tuyaConfig.write_action,
      );
    }

    default:
      throw new Error(`Unknown transport type: ${transportType}`);
  }
}
