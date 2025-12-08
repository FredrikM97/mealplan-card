import type { DeviceProfileGroup } from './types';
import { profiles } from './profiles';

function findManufacturerProfile(group, device_manufacturer, device_model) {
  for (const manu of group.profiles) {
    if (manu.manufacturer === device_manufacturer) {
      const models = Array.isArray(manu.models) ? manu.models : [];
      const model = device_model ?? models[0] ?? '';
      if (!device_model || models.includes(model) || models.length === 0) {
        return { ...group, manufacturer: manu.manufacturer, model };
      }
    }
  }
  return undefined;
}

export function resolveProfile(config: {
  device_manufacturer?: string;
  device_model?: string;
}): (DeviceProfileGroup & { manufacturer: string; model: string }) | undefined {
  const { device_manufacturer, device_model } = config || {};
  if (!device_manufacturer) {
    // Silently return undefined if no manufacturer is specified
    // This is expected during initial configuration in the editor
    return undefined;
  }
  for (const group of profiles) {
    const result = findManufacturerProfile(
      group,
      device_manufacturer,
      device_model,
    );
    if (result) return result;
  }
  console.warn(
    'No matching profile found for',
    device_manufacturer,
    device_model,
  );
  return undefined;
}

// Helper to find a profile group by manufacturer and model
export function findProfileByKey(profiles: DeviceProfileGroup[], key: string) {
  const [manufacturer, model] = key.split(':');
  return profiles.find((group) =>
    group.profiles.some((p) => {
      const models = Array.isArray(p.models) ? p.models : [];
      return (
        p.manufacturer === manufacturer &&
        (models.includes(model) || (!model && models.length === 0))
      );
    }),
  );
}

// Returns dropdown items for manufacturer/model selection, with unique value keys
export function getProfileDropdownItems(profiles: DeviceProfileGroup[]) {
  return profiles.flatMap((group) =>
    group.profiles.flatMap((manu) => {
      const models = Array.isArray(manu.models) ? manu.models : [];
      return (models.length ? models : ['']).map((model) => {
        const isSingle = models.length <= 1;
        let label = '';
        if (!manu.manufacturer) {
          label = '[Missing manufacturer]';
          console.warn('Device profile missing manufacturer:', manu);
        } else if (isSingle || !model) {
          label = manu.manufacturer;
        } else {
          label = `${manu.manufacturer} - ${model}`;
        }
        return {
          value: `${manu.manufacturer}:${model}`,
          label,
        };
      });
    }),
  );
}
