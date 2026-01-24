import { profiles } from './profiles/profiles';
import { localize } from './locales/localize';
import { TransportType } from './types';

const TRANSPORT_FIELDS = {
  [TransportType.SENSOR]: [
    {
      name: 'sensor',
      required: true,
      selector: {
        entity: { filter: [{ domain: ['sensor', 'text', 'input_text'] }] },
      },
    },
    {
      name: 'helper',
      selector: { entity: { filter: [{ domain: 'input_text' }] } },
    },
  ],
  [TransportType.MQTT]: [
    {
      name: 'sensor',
      required: true,
      selector: {
        entity: { filter: [{ domain: ['sensor', 'text', 'input_text'] }] },
      },
    },
    {
      name: 'helper',
      selector: { entity: { filter: [{ domain: 'input_text' }] } },
    },
  ],
};

export function generateConfigFormSchema() {
  const schema: Record<string, unknown>[] = [
    {
      type: 'grid',
      name: '',
      flatten: true,
      column_min_width: '200px',
      schema: [
        { name: 'title', selector: { text: {} } },
        {
          name: 'portions',
          selector: {
            number: { min: 1, max: 10, mode: 'box', unit_of_measurement: 'g' },
          },
        },
      ],
    },
    {
      name: 'manufacturer',
      required: true,
      selector: {
        select: {
          options: profiles.map(({ manufacturer }) => ({
            value: manufacturer,
            label: manufacturer,
          })),
          mode: 'dropdown',
        },
      },
    },
    {
      name: 'transport_type',
      required: true,
      selector: {
        select: {
          options: [
            { value: TransportType.SENSOR, label: 'Sensor (default)' },
            { value: TransportType.MQTT, label: 'MQTT' },
          ],
          mode: 'dropdown',
        },
      },
    },
    {
      type: 'expandable',
      name: 'sensor_config',
      title: 'Sensor Configuration',
      icon: 'mdi:pulse',
      flatten: true,
      schema: TRANSPORT_FIELDS[TransportType.SENSOR],
    },
    {
      type: 'expandable',
      name: 'mqtt_config',
      title: 'MQTT Configuration',
      icon: 'mdi:mqtt',
      flatten: true,
      schema: TRANSPORT_FIELDS[TransportType.MQTT],
    },
  ];

  return {
    schema,

    computeLabel: (schema: { name: string }) => {
      switch (schema.name) {
        case 'sensor':
          return localize('config.sensor_label');
        case 'manufacturer':
          return localize('config.manufacturer_label');
        case 'title':
          return localize('config.title_label');
        case 'portions':
          return localize('config.portion_label');
        case 'helper':
          return localize('config.helper_label');
        case 'transport_type':
          return localize('config.transport_label');
        default:
          return undefined;
      }
    },
    computeHelper: (schema: { name: string }) => {
      switch (schema.name) {
        case 'sensor':
          return localize('config.sensor_helper');
        case 'manufacturer':
          return localize('config.manufacturer_helper');
        case 'helper':
          return localize('config.helper_helper');
        case 'portions':
          return localize('config.portion_helper');
        case 'transport_type':
          return localize('config.transport_helper');
        default:
          return undefined;
      }
    },
  };
}
