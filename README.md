<img width="1983" height="793" alt="image" src="https://github.com/user-attachments/assets/a2086563-923b-46e7-ab36-0e37dadb77c9" />

---

[![Home Assistant][ha-versions-shield]][homeassistant]
[![Release][releases-shield]][releases]
[![Docs][wiki-shield]][wiki]

[![Tests][build-shield]][build]
[![Coverage][codecov-shield]][codecov]
[![License][license-shield]](LICENSE.md)
[![Downloads][downloads-shield]][releases]
[![Dev Container][devcontainer-shield]][devcontainer]

## About

A Home Assistant plugin to manage and monitor pet feeders using a `meal_plan` structure. Support Home assistant tuya, local-tuya and services.

It is primarily designed for Tuya-based feeders, but may also work with other devices that expose a compatible schedule entity. Best used alongside [Tuya Local](https://github.com/make-all/tuya-local) for local control.

For supported devices and models, see [SUPPORTED.md](SUPPORTED.md).

## Features

- See next scheduled feeding and total food for today
- Add, edit, and delete feeding times with or without day selection
- Supports meal_plan data with and without days
- Configuration and schedule persist over Home Assistant restarts
- Light and dark mode support

## How it works

The card expects a base64 string (example: `fwQAAQB/CQACAX8PAAEBfxUAAgEIEgABAA==`).

This string is decoded into editable schedules.

### With days

```json
[
  { "time": "04:00", "days": 127, "portion": 1, "enabled": false },
  { "time": "09:00", "days": 127, "portion": 2, "enabled": true },
  { "time": "15:00", "days": 127, "portion": 1, "enabled": true },
  { "time": "21:00", "days": 127, "portion": 2, "enabled": true },
  { "time": "18:00", "days": 8, "portion": 1, "enabled": false }
]
```

# Enjoy the integration?

Star ⭐ the repository to help others discover the integration.

[![Sponsor FredrikM97][github-sponsor-shield]][github-sponsor] [![Static Badge][buymeacoffee-shield]][buymeacoffee]

[build-shield]: https://img.shields.io/github/actions/workflow/status/FredrikM97/mealplan-card/test.yaml?style=for-the-badge&label=Tests
[build]: https://github.com/FredrikM97/mealplan-card/actions
[codecov-shield]: https://img.shields.io/codecov/c/github/FredrikM97/mealplan-card?style=for-the-badge&label=Coverage
[codecov]: https://codecov.io/gh/FredrikM97/mealplan-card
[license-shield]: https://img.shields.io/github/license/FredrikM97/mealplan-card.svg?style=for-the-badge
[downloads-shield]: https://img.shields.io/github/downloads/FredrikM97/mealplan-card/total.svg?style=for-the-badge
[devcontainer-shield]: https://img.shields.io/badge/Dev%20Container-Open-007ACC?style=for-the-badge&logo=visualstudiocode
[devcontainer]: https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/FredrikM97/mealplan-card
[ha-versions-shield]: https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/FredrikM97/mealplan-card/main/hacs.json&label=Home%20Assistant&query=$.homeassistant&color=41BDF5&style=for-the-badge&logo=homeassistant
[releases-shield]: https://img.shields.io/github/release/FredrikM97/mealplan-card.svg?style=for-the-badge&color=41BDF5
[releases]: https://github.com/FredrikM97/mealplan-card/releases
[wiki-shield]: https://img.shields.io/badge/Docs-Wiki-41BDF5?style=for-the-badge
[wiki]: https://github.com/FredrikM97/mealplan-card/wiki
[homeassistant]: https://my.home-assistant.io/redirect/hacs_repository/?owner=FredrikM97&repository=mealplan-card&category=plugin
[github-sponsor-shield]: https://img.shields.io/badge/Sponsor-FredrikM97-EA4AAA?style=for-the-badge&logo=githubsponsors
[github-sponsor]: https://github.com/sponsors/FredrikM97
[buymeacoffee-shield]: https://img.shields.io/badge/Donate-Buy%20Me%20a%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee
[buymeacoffee]: https://www.buymeacoffee.com/FredrikM97
