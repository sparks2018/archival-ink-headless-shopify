# Archival Ink Gallery - Headless Shopify Setup Guide

This guide will walk you through setting up your Manus website as a headless Shopify storefront.

## 📋 Table of Contents

1. [Shopify Store Setup](#shopify-store-setup)
2. [Storefront API Configuration](#storefront-api-configuration)
3. [Data Mapping](#data-mapping)
4. [Environment Variables](#environment-variables)
5. [Local Development](#local-development)
6. [Deployment to Vercel](#deployment-to-vercel)
7. [Managing Your Store](#managing-your-store)

---

## 1. Shopify Store Setup

### Create or Access Your Shopify Store

1. Go to [Shopify](https://www.shopify.com) and create a store or log into your existing store
2. Complete the basic store setup (name, address, etc.)
3. You'll need a Shopify plan (Basic or higher) for custom domain and full features

---

## 2. Storefront API Configuration

### Enable Storefront API Access

1. **Go to Shopify Admin** → Settings → Apps and sales channels
2. Click **"Develop apps"** (you may need to enable custom app development first)
3. Click **"Create an app"**
4. Name it: `Archival Ink Headless Storefront`
5. Click **"Configure Storefront API scopes"**

### Required API Scopes

Enable these scopes:

- ✅ `unauthenticated_read_product_listings` - Read products
- ✅ `unauthenticated_read_product_inventory` - Check stock
- ✅ `unauthenticated_read_product_tags` - Read tags
- ✅ `unauthenticated_read_collection_listings` - Read collections
- ✅ `unauthenticated_write_checkouts` - Create checkouts
- ✅ `unauthenticated_read_checkouts` - Read checkout data

### Get Your API Credentials

1. Click **"Install app"** to install it on your store
2. Go to **"API credentials"** tab
3. Copy these values:
   - **Store Domain**: `your-store.myshopify.com`
   - **Storefront API access token**: Long alphanumeric string (starts with `shpat_`)

⚠️ **Important**: The Storefront API token is PUBLIC and safe to use in frontend code.

---

## 3. Data Mapping

### Shopify → Manus Component Mapping

| Manus Concept | Shopify Entity | How to Set Up |
|---------------|----------------|---------------|
| **Artwork** | Product | Create products in Shopify Admin |
| **Artist** | Collection OR Vendor | Create collections for each artist |
| **Category** | Product Type OR Tag | Set product type (e.g., "Prints", "Originals") |
| **Price** | Product Price | Set in product variants |
| **Sale Price** | Compare At Price | Set "Compare at price" for discounts |
| **Image** | Product Images | Upload artwork images |
| **Sold Out** | Inventory | Managed automatically by Shopify |
| **Featured** | Tag OR Metafield | Add "featured" tag to products |

### Product Setup in Shopify

For each artwork:

1. **Go to Products** → Add product
2. **Title**: Artwork title (e.g., "Cosmic Vision")
3. **Description**: Artwork description
4. **Media**: Upload artwork image(s)
5. **Pricing**:
   - **Price**: Current price (e.g., $300)
   - **Compare at price**: Original price if on sale (e.g., $400)
6. **Inventory**: Set quantity available
7. **Product organization**:
   - **Product type**: Category (e.g., "Prints", "Originals")
   - **Vendor**: Artist name (e.g., "Alex Grey")
   - **Collections**: Add to artist collection
   - **Tags**: Add "featured" for featured artworks

### Collection Setup (Artists)

For each artist:

1. **Go to Products** → Collections → Create collection
2. **Title**: Artist name (e.g., "Alex Grey")
3. **Description**: Artist bio
4. **Collection image**: Artist photo or representative artwork
5. **Conditions**: Set to automatically include products where:
   - **Vendor** equals "Alex Grey"
   OR manually select products

### Metafields (Optional Advanced Setup)

For more control, use metafields:

1. **Go to Settings** → Custom data → Products
2. Add definition:
   - **Name**: Artist
   - **Namespace and key**: `custom.artist`
   - **Type**: Single line text
3. Add definition:
   - **Name**: Featured
   - **Namespace and key**: `custom.featured`
   - **Type**: True/False
4. Add definition:
   - **Name**: Category
   - **Namespace and key**: `custom.category`
   - **Type**: Single line text

---

## 4. Environment Variables

### Create `.env` File

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Shopify credentials:
   ```env
   VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxx
   ```

⚠️ **Never commit `.env` to Git** (it's in `.gitignore`)

---

## 5. Local Development

### Install Dependencies

```bash
pnpm install
```

### Run Development Server

```bash
pnpm run dev
```

The site will be available at `http://localhost:5000`

### Testing Shopify Integration

1. **Products**: Should load from Shopify automatically
2. **Add to Cart**: Click "Add to Cart" on any artwork
3. **Cart**: Open cart drawer to see items
4. **Checkout**: Click "Checkout" → redirects to Shopify checkout

---

## 6. Deployment to Vercel

### Prerequisites

- GitHub account
- Vercel account (free tier works)

### Steps

1. **Push code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/archival-ink-gallery.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Vite configuration

3. **Add Environment Variables**:
   - In Vercel project settings → Environment Variables
   - Add:
     - `VITE_SHOPIFY_STORE_DOMAIN` = `your-store.myshopify.com`
     - `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN` = `shpat_xxxxx`
   - Apply to: Production, Preview, and Development

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live at `your-project.vercel.app`

5. **Custom Domain** (optional):
   - Go to Vercel project → Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

---

## 7. Managing Your Store

### Adding New Artworks

1. Go to Shopify Admin → Products → Add product
2. Fill in all details (title, description, price, images)
3. Set vendor (artist name)
4. Add to appropriate collection
5. Add tags (e.g., "featured")
6. Save

**Changes appear immediately** on your website (no rebuild needed)

### Managing Inventory

1. Go to Product → Inventory
2. Update quantity
3. When quantity reaches 0, product shows as "Sold Out" automatically

### Processing Orders

1. Orders appear in Shopify Admin → Orders
2. Fulfill orders from Shopify Admin
3. Shopify handles:
   - Payment processing
   - Order emails
   - Shipping labels (if configured)
   - Customer accounts

### Managing Artists (Collections)

1. Go to Products → Collections
2. Edit collection to update artist bio, image
3. Add/remove products from collection

### Pricing and Sales

1. Edit product → Pricing
2. Set **Compare at price** to show sale discount
3. Update **Price** for current selling price
4. Discount badge appears automatically

---

## 🎯 Key Features

### What Shopify Manages

✅ Products, inventory, pricing  
✅ Collections (artists)  
✅ Cart and checkout  
✅ Payment processing  
✅ Order management  
✅ Customer accounts  
✅ Shipping and fulfillment  
✅ Tax calculations  

### What Manus Website Handles

✅ Beautiful UI/UX  
✅ Animations and interactions  
✅ Product browsing and filtering  
✅ Wishlist/favorites (local storage)  
✅ Gallery views  
✅ Artist pages  
✅ Lightbox product view  

---

## 🔧 Troubleshooting

### Products Not Loading

1. Check environment variables are set correctly
2. Verify Storefront API token has correct scopes
3. Check browser console for errors
4. Ensure products are published to "Online Store" sales channel

### Cart Not Working

1. Verify `unauthenticated_write_checkouts` scope is enabled
2. Check browser console for API errors
3. Clear localStorage and try again

### Checkout Redirect Issues

1. Ensure Shopify checkout is enabled
2. Verify store has payment methods configured
3. Check that products have prices set

---

## 📚 API Reference

### Queries Used

- `products(first: 100)` - Fetch all products
- `product(handle: "...")` - Fetch single product
- `collections(first: 50)` - Fetch all collections
- `collection(handle: "...")` - Fetch single collection

### Mutations Used

- `cartCreate` - Create new cart
- `cartLinesAdd` - Add items to cart
- `cartLinesUpdate` - Update quantities
- `cartLinesRemove` - Remove items

### Files Reference

- `client/src/lib/shopify.ts` - Shopify API client
- `client/src/lib/shopify-transform.ts` - Data transformations
- `client/src/contexts/CartContext.tsx` - Cart management
- `client/src/hooks/useShopifyProducts.ts` - React hooks

---

## 🚀 Next Steps

1. ✅ Complete Shopify store setup
2. ✅ Add your products and collections
3. ✅ Configure environment variables
4. ✅ Test locally
5. ✅ Deploy to Vercel
6. ✅ Add custom domain
7. ✅ Launch!

---

## 💡 Tips

- **Start with a few products** to test the integration
- **Use high-quality images** (at least 2000px wide)
- **Write detailed descriptions** for SEO
- **Set up shipping zones** in Shopify before launch
- **Test checkout flow** thoroughly before going live
- **Enable customer accounts** for repeat buyers

---

## 📞 Support

- **Shopify Help**: https://help.shopify.com
- **Storefront API Docs**: https://shopify.dev/docs/api/storefront
- **Vercel Docs**: https://vercel.com/docs

---

**Your Manus website is now a fully functional Shopify storefront!** 🎉
