import { HomeAssistant, MealPlanCardConfig, TransportType } from './types';
import { property } from 'lit/decorators/property.js';
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { profiles } from './profiles/profiles';
import { localize } from './locales/localize';

@customElement('mealplan-card-editor')
export class MealPlanCardEditor extends LitElement {
  @property({ type: Object }) hass!: HomeAssistant;
  @property({ type: Object }) _config!: MealPlanCardConfig;

  public setConfig(config: MealPlanCardConfig) {
    this._config = config;
  }

  private _computeSchema() {
    if (!this._config) return [];

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
              { value: TransportType.SERVICE, label: 'Service' },
            ],
            mode: 'dropdown',
          },
        },
      },
    ];

    if (this._config.transport_type === TransportType.SENSOR) {
      schema.push({
        type: 'grid',
        schema: [
          {
            name: 'sensor',
            required: true,
            selector: {
              entity: {
                filter: [{ domain: ['sensor', 'text', 'input_text'] }],
              },
            },
          },
          {
            name: 'helper',
            selector: { entity: { filter: [{ domain: 'input_text' }] } },
          },
        ],
      });
    }
    if (this._config.transport_type === TransportType.MQTT) {
      schema.push({
        type: 'grid',
        schema: [
          {
            name: 'sensor',
            required: true,
            selector: {
              entity: {
                filter: [{ domain: ['sensor', 'text', 'input_text'] }],
              },
            },
          },
          {
            name: 'helper',
            selector: { entity: { filter: [{ domain: 'input_text' }] } },
          },
        ],
      });
    }
    if (this._config.transport_type === TransportType.SERVICE) {
      schema.push({
        type: 'grid',
        schema: [
          {
            name: 'dp_code',
            required: true,
            selector: {
              text: { placeholder: 'e.g., meal_plan' },
            },
          },
          {
            name: 'device_id',
            required: true,
            selector: {
              device: {},
            },
          },
          {
            name: 'read_action',
            required: true,
            selector: {
              text: { placeholder: 'e.g., tuya.get_data' },
            },
          },
          {
            name: 'write_action',
            required: true,
            selector: {
              text: { placeholder: 'e.g., tuya.set_data' },
            },
          },
        ],
      });
    }
    return schema;
  }
  /*
   * Checks if all required fields in the current config are filled.
   */
  private _allRequiredFieldsFilled(): boolean {
    if (!this._config) return false;
    const schema = this._computeSchema();
    return this._checkRequiredFields(schema);
  }
  /**
   *  Recursively checks required fields in the schema.
   */
  private _checkRequiredFields(schema: Record<string, unknown>[]): boolean {
    for (const field of schema) {
      if (field.schema && Array.isArray(field.schema)) {
        if (!this._checkRequiredFields(field.schema)) {
          return false;
        }
      }
      if (field.name && field.required) {
        const value = this._config[field.name as keyof MealPlanCardConfig];
        if (!value || value === '') {
          return false;
        }
      }
    }
    return true;
  }
  private _valueChanged(ev: CustomEvent) {
    this._config = ev.detail.value;
    if (this._allRequiredFieldsFilled()) {
      this.dispatchEvent(
        new CustomEvent('config-changed', {
          detail: { config: this._config },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  render() {
    const isValid = this._allRequiredFieldsFilled();

    return html`
      ${!isValid
        ? html`<ha-alert alert-type="warning">
            ${localize('config.incomplete_configuration')}
          </ha-alert>`
        : ''}
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._computeSchema()}
        .computeLabel=${this.computeLabel}
        .computeHelper=${this.computeHelper}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private computeLabel = (schema: { name: string }) => {
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
      case 'write_action':
        return localize('config.write_action_label');
      case 'read_action':
        return localize('config.read_action_label');
      case 'dp_code':
        return localize('config.dp_code_label');
      case 'device_id':
        return localize('config.device_id_label');
      case 'incomplete_configuration':
        return localize('config.incomplete_configuration');
      default:
        return undefined;
    }
  };
  private computeHelper = (schema: { name: string }) => {
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
  };
}
