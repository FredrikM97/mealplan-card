# Cleverio PF100 Feeder Card

A HACS card for the Cleverio PF100 Pet Feeder, allowing you to monitor and control your feeder directly from Home Assistant. It can work for other feeders if a meal_plan or similar that is encoded in same base64 format. However, there is currently no list of other supported devices. Feel free to send a message or add a issue/pr so we can populate a list of supported devices. This setup is supported by the https://github.com/make-all/tuya-local.

---

<!-- Card Preview Placeholder -->
<p align="center">
  <img width="400" alt="Screenshot 2025-06-24 at 15 09 09" src="https://github.com/user-attachments/assets/e5b04377-59ed-4064-82cc-864caf07d10d" />
  <img width="400" alt="Screenshot 2025-06-24 at 15 05 07" src="https://github.com/user-attachments/assets/3cd0ef3a-62f4-4d86-a5ae-6854de67eba9" />
  <img width="400" alt="Screenshot 2025-06-24 at 15 04 20" src="https://github.com/user-attachments/assets/4a61a152-2245-41b7-bcf9-5bb0467edc87" />
  <br>
  <i>Card preview</i>
</p>





[![Add to HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=FredrikM97&repository=cleverio-pf100-feeder-card)

---

## Features

- Display and manage feeding schedules with a modern UI
- See next scheduled feeding and total food for today
- Add, edit, and delete feeding times with day and portion selection
- Works with the Cleverio PF100 sensor (including MakeAll/Tuya Local integrations)
- Easy integration with Home Assistant dashboards

## How it works

The card expects a base64 string (example: 'fwQAAQB/CQACAX8PAAEBfxUAAgEIEgABAA=='). This string is decoded and allow any edits onto it in the format.
```
      { time: '04:00', daysMask: 127, portion: 1, enabled: false },
      { time: '09:00', daysMask: 127, portion: 2, enabled: true },
      { time: '15:00', daysMask: 127, portion: 1, enabled: true },
      { time: '21:00', daysMask: 127, portion: 2, enabled: true },
      { time: '18:00', daysMask: 8, portion: 1, enabled: false }
```
When the user have made changes and pressed the save on schedule view the config is updated and sent to the tuya cloud. The implementation reduces the delay for actions compared to smartlife and allow seemless integration with home assistant for tuya feeders with a meal_plan configuration.

## Installation

### 1. Add to HACS

Click the **Add to HACS** button above, or manually add this repository as a custom repository in HACS (category: Lovelace).

### 2. Install the Card

Find "Cleverio PF100 Feeder Card" in HACS under Frontend and install it.

### 4. Use the Card in Your Dashboard

Search for Cleverio Pet Feeder in the card selector view.

## Configuration

| Name    | Type   | Required | Description                                 |
|---------|--------|----------|---------------------------------------------|
| sensor  | string | Yes      | The sensor entity holding the meal plan     |
| title   | string | No       | Card title (optional, defaults to Pet Feeder)|

## Support

For issues, feature requests, or contributions, please open an issue or pull request on [GitHub](https://github.com/FredrikM97/cleverio-pf100-feeder-card).
