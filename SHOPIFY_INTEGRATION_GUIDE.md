# Archival Ink Gallery: Shopify Integration Guide

This guide provides detailed instructions on how to integrate essential e-commerce features that require Shopify-side setup. For a seamless customer experience, it is crucial to connect your headless storefront with Shopify's powerful checkout and backend capabilities.

**Author:** Manus AI
**Date:** January 18, 2026

---

## 1. Features Requiring Shopify Integration

The following features, while initiated on your headless storefront, require Shopify apps or custom development to function correctly during and after the checkout process:

- **Order Bumps:** Adding related products (like framing) to the cart just before checkout.
- **Post-Purchase Upsells:** Offering one-click upsells after the customer has completed their purchase.
- **Cart Abandonment Recovery:** Sending automated emails to customers who start the checkout process but do not complete their purchase.

---


## 2. Order Bumps & Post-Purchase Upsells

To implement order bumps and post-purchase upsells, you will need to use Shopify apps that leverage Shopify's **Checkout Extensibility** and **Post-Purchase Extension APIs**. These APIs allow apps to add functionality directly into the Shopify checkout and post-purchase pages.

### Recommended Shopify Apps

Based on our research, the following apps are highly recommended for implementing these features:

| App Name | Key Features | Pricing | App Store Link |
|---|---|---|---|
| **Aftersell** | Post-purchase & checkout upsells, 1-click offers, thank you page upsells | From $7.99/month | [apps.shopify.com/aftersell](https://apps.shopify.com/aftersell) |
| **OrderBump** | Checkout & post-purchase upsells, cross-sells, easy setup | From $29.99/month | [apps.shopify.com/orderbump](https://apps.shopify.com/orderbump) |
| **Zipify OCU** | Pre & post-purchase upsells, 1-click upsell funnels, AI-powered recommendations | From $35/month | [apps.shopify.com/zipify-oneclickupsell](https://apps.shopify.com/zipify-oneclickupsell) |

### General Setup Process

1.  **Install the App:** Choose one of the recommended apps from the Shopify App Store and install it in your Shopify admin.
2.  **Create Your Offers:** Inside the app's dashboard, create your order bump and post-purchase upsell offers. You can typically target these offers based on the products in the customer's cart.
3.  **Configure Display Settings:** Customize the appearance of your offers to match your brand. Most apps provide a visual editor for this.
4.  **Enable the Extension:** In your Shopify admin, go to **Settings > Checkout** and ensure the app's checkout extension is enabled.

---


## 3. Cart Abandonment Recovery

Cart abandonment recovery is a critical feature for any e-commerce store. For a headless setup, you can leverage Shopify webhooks to trigger automated email sequences when a customer abandons their checkout.

### How It Works

1.  **Webhook Subscription:** You subscribe to Shopify webhook topics, specifically `checkouts/create` and `checkouts/update`.
2.  **Webhook Event:** When a customer enters their email during checkout but doesn't complete the purchase, Shopify sends a webhook event to a URL you specify.
3.  **Backend Service:** You need a backend service (e.g., a serverless function) to receive this webhook data.
4.  **Email Campaign:** Your backend service then triggers an email campaign through an email marketing platform like Klaviyo or Omnisend.

### Recommended Email Marketing Platforms

While you can build a custom solution, using a platform with built-in Shopify integration is highly recommended. These platforms provide pre-built cart abandonment flows and robust analytics.

| Platform | Key Features | Pricing | Website |
|---|---|---|---|
| **Klaviyo** | Advanced segmentation, powerful automation, A/B testing, SMS marketing | Free up to 250 contacts | [klaviyo.com](https://www.klaviyo.com) |
| **Omnisend** | Email & SMS automation, pre-built workflows, popups & forms | Free plan available | [omnisend.com](https://www.omnisend.com) |

### Manual Webhook Setup (for custom solutions)

If you prefer to build your own solution, here's how to set up the webhooks:

1.  **Create a Backend Endpoint:** Set up a publicly accessible URL on your backend that can receive POST requests from Shopify.
2.  **Create a Webhook in Shopify:**
    - In your Shopify admin, go to **Settings > Notifications**.
    - Scroll down to the **Webhooks** section and click **Create webhook**.
    - For the **Event**, select `Checkout creation` (`checkouts/create`).
    - For the **URL**, enter your backend endpoint URL.
    - For the **Webhook API version**, select the latest stable version.
    - Repeat the process for the `Checkout update` (`checkouts/update`) event.

### Backend API for Webhooks (Example with Node.js/Express)

Here is a basic example of how your backend could handle the webhook:

```javascript
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Endpoint to receive Shopify webhooks
app.post('/webhooks/shopify/checkout', (req, res) => {
  const checkoutData = req.body;

  // Check if the checkout is abandoned
  if (checkoutData.abandoned_checkout_url) {
    console.log('Abandoned checkout:', checkoutData.id);

    // TODO: Trigger your email sending logic here
    // e.g., send an email to checkoutData.email with a link to checkoutData.abandoned_checkout_url
  }

  res.status(200).send('Webhook received');
});

app.listen(3000, () => console.log('Shopify webhook listener started on port 3000'));
```

---



## 4. Customizing the Checkout Page

With Shopify's Checkout Extensibility, you can customize the look and feel of your checkout page to match your brand. This is done through a combination of Shopify's branding settings and apps that use checkout extensions.

### Using Shopify's Branding Settings

Shopify provides a powerful branding editor that allows you to customize many aspects of your checkout page without any code:

1.  **Go to your Shopify admin > Settings > Brand**.
2.  Here you can upload your logo, set your brand colors, and choose your typography.
3.  These settings will be automatically applied to your checkout page, ensuring a consistent brand experience.

### Sidekick Prompts for Checkout Customization

You can use a design tool like Sidekick to generate a theme for your checkout page. Here are some prompts you can use:

> "Create a Shopify checkout page theme for an art gallery called 'Archival Ink'. The primary colors should be a deep purple (#4A00E0) and a vibrant pink (#8E2DE2). The typography should be elegant and modern, using a serif font like 'Playfair Display' for headings and a clean sans-serif font like 'Inter' for body text. The overall feel should be sophisticated, minimalist, and trustworthy."

### Using Checkout Extension Apps

For more advanced customizations, you can use apps that provide checkout extensions. These apps can add new functionality and content to your checkout page, such as:

-   Custom banners and messages
-   Trust badges and security seals
-   Additional form fields
-   Gift wrapping options

You can find these apps in the [Shopify App Store](https://apps.shopify.com/extensions/checkout).

---

## References

[1] [Aftersell Post Purchase Upsell](https://apps.shopify.com/aftersell)
[2] [OrderBump ‑ Checkout Upsells](https://apps.shopify.com/orderbump)
[3] [One Click Upsell ‑ Zipify OCU](https://apps.shopify.com/zipify-oneclickupsell)
[4] [Klaviyo: Email Marketing & SMS](https://www.klaviyo.com)
[5] [Omnisend: Email Marketing & SMS](https://www.omnisend.com)
[6] [Shopify Checkout Extensibility](https://shopify.dev/docs/apps/build/checkout)
