# MealPlanCard

[![Home Assistant][ha-versions-shield]][homeassistant]
[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)
![Downloads][downloads-shield]
[![Build Status][build-shield]][build]
[![Code Coverage][codecov-shield]][codecov]
[![Documentation Status][wiki-shield]][wiki]
[![Open in Dev Containers][devcontainer-shield]][devcontainer]

## About

A HACS card for Home Assistant to monitor and control your pet feeder using a meal_plan base64 format. This card is designed for Tuya Mealplan data, but can work for other feeders if they use a compatible meal_plan/schedule entity. Support both hex and base64 data. This integration work best with [Tuya-local](https://github.com/make-all/tuya-local)

If your device is missing from the list feel free to open an issue with related info and it will be added.

<img width="430" src="https://github.com/user-attachments/assets/13882cf0-ca0e-4768-89e9-fcbc15d50aef" ce/>

[![Add to HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=FredrikM97&repository=mealplan-card&categoryplugin)

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

## Support

For issues, feature requests, or contributions, please open an issue or pull request on [GitHub](https://github.com/FredrikM97/mealplan-card).

[build-shield]: https://github.com/FredrikM97/mealplan-card/actions/workflows/test.yaml/badge.svg
[build]: https://github.com/FredrikM97/mealplan-card/actions
[codecov-shield]: https://codecov.io/gh/FredrikM97/mealplan-card/branch/dev/graph/badge.svg
[codecov]: https://codecov.io/gh/FredrikM97/mealplan-card
[license-shield]: https://img.shields.io/github/license/FredrikM97/mealplan-card.svg
[devcontainer-shield]: https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode
[devcontainer]: https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/FredrikM97/mealplan-card
[ha-versions-shield]: https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/FredrikM97/mealplan-card/main/hacs.json&label=homeassistant&query=$.homeassistant&color=blue&logo=homeassistant
[releases-shield]: https://img.shields.io/github/release/FredrikM97/mealplan-card.svg
[releases]: https://github.com/FredrikM97/mealplan-card/releases
[wiki-shield]: https://img.shields.io/badge/docs-wiki-blue.svg
[wiki]: https://github.com/FredrikM97/mealplan-card/wiki
[homeassistant]: https://my.home-assistant.io/redirect/hacs_repository/?owner=FredrikM97&repository=mealplan-card&category=plugin
[downloads-shield]: https://img.shields.io/github/downloads/FredrikM97/mealplan-card/total.svg
