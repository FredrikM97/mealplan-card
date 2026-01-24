import {
  StorageAdapter,
  HomeAssistant,
  TransportType,
  MealPlanCardConfig,
} from '../types';

/**
 * Shared utility functions for entity state validation and retrieval
 */
function getEntityValue(hass: HomeAssistant, entityId: string): string | null {
  const state = hass.states?.[entityId];
  const value = state?.state;
  return isValidState(value) ? value : null;
}

function isValidState(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.trim() !== '' &&
    value !== 'unknown' &&
    value !== 'unavailable'
  );
}

abstract class HassAdapterImpl {
  protected getHass: () => HomeAssistant;

  constructor(hass: () => HomeAssistant) {
    if (typeof hass !== 'function') {
      throw new Error('hass must be a function');
    }
    this.getHass = hass;
  }
}

/**
 * Sensor-based storage adapter
 * Reads from sensor/helper, writes via sensor.set_value
 */
export class SensorAdapter extends HassAdapterImpl implements StorageAdapter {
  constructor(
    hass: () => HomeAssistant,
    private sensorId: string,
    private helperId: string,
  ) {
    super(hass);
  }

  async read(): Promise<string | null> {
    const hass = this.getHass();
    const sensorValue = getEntityValue(hass, this.sensorId);
    const helperValue = getEntityValue(hass, this.helperId);
    if (sensorValue) return sensorValue;

    return helperValue;
  }

  async write(data: string): Promise<void> {
    const hass = this.getHass();
    await this.setEntityValue(hass, this.sensorId, data);

    // Also sync helper if configured
    if (this.helperId) {
      await this.setEntityValue(hass, this.helperId, data);
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
 */
export class MqttAdapter extends HassAdapterImpl implements StorageAdapter {
  constructor(
    hass: () => HomeAssistant,
    private deviceName: string,
    private sensorId: string,
    private helperId?: string,
  ) {
    super(hass);
  }

  async read(): Promise<string | null> {
    const hass = this.getHass();
    const sensorValue = getEntityValue(hass, this.sensorId);
    if (sensorValue) return sensorValue;

    // Fall back to helper if sensor empty
    if (this.helperId) {
      return getEntityValue(hass, this.helperId);
    }

    return null;
  }

  async write(data: string): Promise<void> {
    const hass = this.getHass();
    const topic = `zigbee2mqtt/${this.deviceName}/set`;
    await hass.callService('mqtt', 'publish', {
      topic,
      payload: data,
    });
  }
}

/**
 * Create storage adapter based on config
 */
export function createStorageAdapter(
  hass: () => HomeAssistant,
  config: MealPlanCardConfig,
): StorageAdapter {
  const transportType = config.transport_type as TransportType;
  const sensor = config.sensor as string;
  const helper = config.helper as string;

  switch (transportType) {
    case TransportType.SENSOR:
      return new SensorAdapter(hass, sensor, helper);
    case TransportType.MQTT: {
      const mqttDeviceName = sensor.split('.')[1]?.split('_')[0] || '';
      return new MqttAdapter(hass, mqttDeviceName, sensor, helper);
    }
    default:
      throw new Error(`Unknown transport type: ${transportType}`);
  }
}
