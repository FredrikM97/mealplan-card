# MealPlanCard

A HACS card for Home Assistant to monitor and control your pet feeder using a meal_plan base64 format. This card is designed for Tuya Mealplan data, but can work for other feeders if they use a compatible meal_plan or similar base64-encoded format. This integration work best with [Tuya-local](https://github.com/make-all/tuya-local)

<img width="430" src="https://github.com/user-attachments/assets/13882cf0-ca0e-4768-89e9-fcbc15d50aef" ce/>

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=FredrikM97&repository=mealplan-card&category=plugin)

## Features

- See next scheduled feeding and total food for today
- Add, edit, and delete feeding times with or without day selection
- Supports meal_plan data with days and without days
- Card configuration and meal plan persist over Home Assistant restarts and reloads
- Light and dark mode

## How it works

The card expects a base64 string (example: 'fwQAAQB/CQACAX8PAAEBfxUAAgEIEgABAA=='). This string is decoded and allows edits in two supported formats:

**With days:**

```json
[
  { "time": "04:00", "days": 127, "portion": 1, "enabled": false },
  { "time": "09:00", "days": 127, "portion": 2, "enabled": true },
  { "time": "15:00", "days": 127, "portion": 1, "enabled": true },
  { "time": "21:00", "days": 127, "portion": 2, "enabled": true },
  { "time": "18:00", "days": 8, "portion": 1, "enabled": false }
]
```

When the user makes changes and presses save on the schedule view, the config is updated and sent to the Tuya cloud. The implementation reduces the delay for actions compared to Smart Life and allows seamless integration with Home Assistant for Tuya feeders with a meal_plan configuration.

## Installation

1. Click the **Add to HACS** button above, or manually add this repository as a custom repository in HACS (category: Lovelace).
2. Find "Mealplan Card" in HACS under Frontend and install it.
3. Search for Mealplan Pet Feeder in the card selector view.
   **After update ensure to hard refresh page/clean cache**

## Supported Devices

The following devices are known to work with this card:

- **Cleverio PF100**
- **Honeyguardian**
- **PetNest**

## Support

For issues, feature requests, or contributions, please open an issue or pull request on [GitHub](https://github.com/FredrikM97/mealplan-card).
