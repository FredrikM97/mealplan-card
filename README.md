# Cleverio PF100 Feeder Card

A custom Lovelace card for the Cleverio PF100 Pet Feeder, allowing you to monitor and control your feeder directly from Home Assistant.

---

<!-- Card Preview Placeholder -->
<p align="center">
  <img src=".github/card-preview.png" alt="Card preview" width="400"/>
  <br>
  <i>Card preview (replace this image with a screenshot of your card)</i>
</p>

[![Add to HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=FredrikM97&repository=cleverio-pf100-feeder-card)

---

## Features

- Display and manage feeding schedules with a modern UI
- See next scheduled feeding and total food for today
- Add, edit, and delete feeding times with day and portion selection
- Works with the Cleverio PF100 sensor (including MakeAll/Tuya Local integrations)
- Easy integration with Home Assistant dashboards

## Installation

### 1. Add to HACS

Click the **Add to HACS** button above, or manually add this repository as a custom repository in HACS (category: Lovelace).

### 2. Install the Card

Find "Cleverio PF100 Feeder Card" in HACS under Frontend and install it.

### 3. Add as a Lovelace Resource

Go to **Settings → Dashboards → Resources** and add:

```yaml
url: /local/cleverio-pf100-feeder-card/cleverio_pet_feeder_card.js
type: module
```

### 4. Use the Card in Your Dashboard

Add the following to your Lovelace dashboard YAML:

```yaml
type: 'custom:cleverio_pet_feeder_card'
title: Pet feeder card
sensor: text.pet_feeder_meal_plan


```

## Configuration

| Name    | Type   | Required | Description                                 |
|---------|--------|----------|---------------------------------------------|
| sensor  | string | Yes      | The sensor entity holding the meal plan     |
| title   | string | No       | Card title (optional, defaults to Pet Feeder)|

## Support

For issues, feature requests, or contributions, please open an issue or pull request on [GitHub](https://github.com/FredrikM97/cleverio-pf100-feeder-card).
