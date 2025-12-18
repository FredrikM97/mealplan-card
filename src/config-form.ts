import { profiles } from './profiles/profiles';

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
    computeLabel: (schema: any) => {
      switch (schema.name) {
        case 'sensor':
          return 'Meal Plan Sensor';
        case 'manufacturer':
          return 'Feeder Profile';
        case 'title':
          return 'Title';
        case 'portions':
          return 'Portions per Meal';
        case 'helper':
          return 'Helper Entity (Optional)';
        case 'transport_type':
          return 'Transport Type';
        default:
          return undefined;
      }
    },
    computeHelper: (schema: any) => {
      switch (schema.name) {
        case 'sensor':
          return 'Select the sensor or text entity containing meal plan data';
        case 'manufacturer':
          return 'Select your feeder manufacturer and model';
        case 'helper':
          return 'This input_text helper acts as a backup storage for your meal plan schedule. When the sensor is unavailable, the card will restore the schedule from this helper to prevent data loss.';
        case 'portions':
          return 'Number of portions per feeding';
        case 'transport_type':
          return 'How to write data: Sensor (via set_value service) or MQTT (publish to zigbee2mqtt topic)';
        default:
          return undefined;
      }
    },
  };
}
