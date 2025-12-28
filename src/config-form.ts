import { profiles } from './profiles/profiles';
import { localize } from './locales/localize';

export function generateConfigFormSchema() {
  const profileItems = profiles.map((profile) => ({
    value: profile.manufacturer,
    label: profile.manufacturer,
  }));

  return {
    schema: [
      {
        name: 'sensor',
        required: true,
        selector: {
          entity: {
            filter: [
              {
                domain: ['sensor', 'text', 'input_text'],
              },
            ],
          },
        },
      },
      {
        name: 'manufacturer',
        required: true,
        selector: {
          select: {
            options: profileItems.map((item) => ({
              value: item.value,
              label: item.label,
            })),
            mode: 'dropdown',
          },
        },
      },
      {
        type: 'grid',
        name: '',
        flatten: true,
        column_min_width: '200px',
        schema: [
          {
            name: 'title',
            selector: { text: {} },
          },
          {
            name: 'portions',
            selector: {
              number: {
                min: 1,
                max: 10,
                mode: 'box',
                unit_of_measurement: 'g',
              },
            },
          },
        ],
      },
      {
        name: 'helper',
        selector: {
          entity: {
            filter: [
              {
                domain: 'input_text',
              },
            ],
          },
        },
      },
      {
        name: 'transport_type',
        selector: {
          select: {
            options: [
              { value: 'sensor', label: 'Sensor (default)' },
              { value: 'mqtt', label: 'MQTT' },
            ],
            mode: 'dropdown',
          },
        },
      },
    ],
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
