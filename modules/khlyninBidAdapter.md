# Khlynin Adapter

## Overview

**Module Name:** Khlynin Bidder Adapter  
**Module Type:** Bidder Adapter  
**Maintainer:** ihor.khlynin@example.com  

The Khlynin Adapter provides banner bidding support via a simple JSON endpoint.  
This adapter is intended for demonstration and testing purposes.

---

## Bid Request Parameters

| Name         | Scope    | Type   | Description                                   | Example       |
|-------------|---------|--------|-----------------------------------------------|--------------|
| placementId | required | string | Unique ID of the ad placement on the page.    | "abc123"     |

---

## Example Ad Unit Configuration

```javascript
var adUnits = [
  {
    code: 'ad-unit-code-300x250',
    mediaTypes: {
      banner: {
        sizes: [[300, 250], [300, 600]]
      }
    },
    bids: [
      {
        bidder: 'khlyninAdapter',
        params: {
          placementId: 'test-placement-123'
        }
      }
    ]
  }
];
