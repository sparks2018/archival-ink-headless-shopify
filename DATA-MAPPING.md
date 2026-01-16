# Data Mapping: Manus Components → Shopify

This document explains exactly how Manus website data maps to Shopify entities.

## 🎨 Artwork (Product)

### Manus Component Expects

```typescript
interface Artwork {
  id: string;              // Unique identifier
  title: string;           // Artwork name
  artist: string;          // Artist name
  price: number;           // Current price
  originalPrice?: number;  // Original price (for sales)
  image: string;           // Image URL
  category: string;        // Category (Prints, Originals, etc.)
  soldOut?: boolean;       // Availability
  variantId?: string;      // For cart operations
  handle?: string;         // URL-friendly identifier
}
```

### Shopify Product Structure

```graphql
Product {
  id                    → artwork.id
  title                 → artwork.title
  handle                → artwork.handle
  vendor                → artwork.artist (primary)
  metafields.artist     → artwork.artist (fallback)
  priceRange.minVariantPrice.amount → artwork.price
  compareAtPriceRange   → artwork.originalPrice
  images[0].url         → artwork.image
  productType           → artwork.category (primary)
  metafields.category   → artwork.category (fallback)
  variants[0].availableForSale → !artwork.soldOut
  variants[0].id        → artwork.variantId
}
```

### How to Set Up in Shopify

| Field | Where to Set | Example |
|-------|-------------|---------|
| **Title** | Product → Title | "Cosmic Vision" |
| **Artist** | Product → Vendor | "Alex Grey" |
| **Price** | Product → Pricing → Price | $300.00 |
| **Sale Price** | Product → Pricing → Compare at price | $400.00 |
| **Image** | Product → Media | Upload artwork image |
| **Category** | Product → Product type | "Prints" |
| **Availability** | Product → Inventory → Quantity | 10 (or 0 for sold out) |
| **Handle** | Auto-generated from title | "cosmic-vision" |

---

## 👨‍🎨 Artist (Collection)

### Manus Component Expects

```typescript
interface Artist {
  id: string;           // Unique identifier
  name: string;         // Artist name
  slug: string;         // URL-friendly identifier
  image: string;        // Artist photo or representative work
  bio?: string;         // Artist biography
  artworkCount?: number; // Number of artworks
}
```

### Shopify Collection Structure

```graphql
Collection {
  id                    → artist.id
  title                 → artist.name
  handle                → artist.slug
  image.url             → artist.image
  description           → artist.bio
  products.edges.length → artist.artworkCount
}
```

### How to Set Up in Shopify

| Field | Where to Set | Example |
|-------|-------------|---------|
| **Name** | Collection → Title | "Alex Grey" |
| **Slug** | Auto-generated from title | "alex-grey" |
| **Image** | Collection → Image | Upload artist photo |
| **Bio** | Collection → Description | "Alex Grey is a visionary artist..." |
| **Artworks** | Collection → Products | Add products to collection |

### Collection Conditions

Set automatic conditions to include products:

```
Vendor equals "Alex Grey"
```

OR manually select products to include.

---

## 🛒 Cart Item

### Manus Component Expects

```typescript
interface CartItem {
  id: string;           // Product ID
  lineId?: string;      // Shopify cart line ID
  variantId?: string;   // Shopify variant ID
  title: string;        // Product title
  artist: string;       // Artist name
  price: number;        // Unit price
  image: string;        // Product image
  quantity: number;     // Quantity in cart
}
```

### Shopify Cart Structure

```graphql
Cart {
  id                                    → Stored in localStorage
  lines.edges[].node {
    id                                  → cartItem.lineId
    quantity                            → cartItem.quantity
    merchandise {
      id                                → cartItem.variantId
      product.title                     → cartItem.title
      product.featuredImage.url         → cartItem.image
      priceV2.amount                    → cartItem.price
    }
  }
  checkoutUrl                           → For checkout redirect
}
```

### Cart Operations

| Operation | Shopify Mutation | Purpose |
|-----------|-----------------|---------|
| **Create Cart** | `cartCreate` | Initialize new cart |
| **Add Item** | `cartLinesAdd` | Add product to cart |
| **Update Quantity** | `cartLinesUpdate` | Change item quantity |
| **Remove Item** | `cartLinesRemove` | Delete item from cart |
| **Get Cart** | `cart(id: $id)` | Retrieve cart state |

---

## 🏷️ Categories & Tags

### Category Mapping

| Manus Category | Shopify Field | How to Set |
|----------------|--------------|-----------|
| **Prints** | Product Type | Set to "Prints" |
| **Originals** | Product Type | Set to "Originals" |
| **Giclée Print** | Product Type | Set to "Giclée Print" |
| **Custom** | Metafield `custom.category` | Set in product metafields |

### Tag Mapping

| Manus Tag | Shopify Tag | Purpose |
|-----------|------------|---------|
| **Featured** | `featured` | Show in featured section |
| **New** | `new` | Show as new arrival |
| **Sale** | `sale` | Show in sale section |

---

## 💰 Pricing

### Price Display Logic

```typescript
// Regular price
if (product.compareAtPriceRange exists) {
  originalPrice = compareAtPriceRange.minVariantPrice.amount
  currentPrice = priceRange.minVariantPrice.amount
  discount = originalPrice - currentPrice
  showSaleBadge = true
} else {
  currentPrice = priceRange.minVariantPrice.amount
  showSaleBadge = false
}
```

### How to Set Sales

1. Go to Product → Pricing
2. Set **Price**: $300 (sale price)
3. Set **Compare at price**: $400 (original price)
4. Save

Result: Shows as "$300 $400" with sale badge

---

## 🔍 Search & Filtering

### Searchable Fields

The search function queries these Shopify fields:

- `product.title`
- `product.vendor`
- `product.tags`
- `product.metafields.artist`

### Filter Options

| Filter | Shopify Field | Values |
|--------|--------------|--------|
| **Artist** | `vendor` or `metafields.artist` | Artist names |
| **Category** | `productType` or `metafields.category` | Category names |
| **Price Range** | `priceRange.minVariantPrice.amount` | Min/max values |
| **Availability** | `variants.availableForSale` | In stock / Sold out |

---

## 📊 Metafields (Advanced)

For more control, use custom metafields:

### Product Metafields

| Namespace.Key | Type | Purpose | Example |
|--------------|------|---------|---------|
| `custom.artist` | Single line text | Override vendor | "Alex Grey" |
| `custom.category` | Single line text | Override product type | "Limited Edition" |
| `custom.featured` | True/False | Mark as featured | true |
| `custom.edition_size` | Number | Edition size | 100 |
| `custom.dimensions` | Single line text | Artwork dimensions | "24 x 36 inches" |
| `custom.medium` | Single line text | Art medium | "Acrylic on canvas" |
| `custom.year` | Number | Year created | 2024 |

### How to Access Metafields

```graphql
product {
  metafields(identifiers: [
    { namespace: "custom", key: "artist" },
    { namespace: "custom", key: "category" },
    { namespace: "custom", key: "featured" }
  ]) {
    key
    value
  }
}
```

---

## 🎯 Featured Products

### Method 1: Using Tags

1. Go to Product → Organization
2. Add tag: `featured`
3. Save

Products with `featured` tag appear in Featured Artist section.

### Method 2: Using Metafields

1. Go to Product → Metafields
2. Set `custom.featured` = `true`
3. Save

---

## 🖼️ Images

### Image Requirements

| Use Case | Recommended Size | Format |
|----------|-----------------|--------|
| **Product Grid** | 800 x 1000px | JPG/PNG |
| **Lightbox** | 2000 x 2500px | JPG/PNG |
| **Thumbnail** | 400 x 500px | JPG/PNG |
| **Collection** | 1200 x 1200px | JPG/PNG |

### How to Upload

1. Go to Product → Media
2. Upload multiple images (first is featured image)
3. Reorder by dragging
4. Add alt text for SEO

---

## 🔄 Data Flow

### Product Display Flow

```
Shopify Admin (Add Product)
  ↓
Shopify Storefront API
  ↓
shopify.ts (API Client)
  ↓
shopify-transform.ts (Transform to Artwork)
  ↓
useShopifyProducts.ts (React Hook)
  ↓
Manus Components (Display)
```

### Cart Flow

```
User Clicks "Add to Cart"
  ↓
CartContext.addToCart()
  ↓
shopify.ts (cartLinesAdd mutation)
  ↓
Shopify Cart API
  ↓
Cart Updated (localStorage + Shopify)
  ↓
Cart Drawer Shows Item
```

### Checkout Flow

```
User Clicks "Checkout"
  ↓
CartContext.checkoutUrl
  ↓
Redirect to Shopify Checkout
  ↓
Shopify Handles Payment
  ↓
Order Created in Shopify Admin
```

---

## 📝 Quick Reference

### Essential Shopify Fields

**For each product, always set:**
- ✅ Title
- ✅ Price
- ✅ Image (at least one)
- ✅ Vendor (artist name)
- ✅ Product type (category)
- ✅ Inventory quantity
- ✅ Published to "Online Store" channel

**Optional but recommended:**
- Compare at price (for sales)
- Tags (for filtering)
- Multiple images
- Detailed description
- Collections

---

## 🚀 Testing Checklist

After setting up products:

- [ ] Products appear on homepage
- [ ] Artist collections show correct products
- [ ] Prices display correctly
- [ ] Sale badges show when compare at price is set
- [ ] Images load in grid and lightbox
- [ ] "Add to Cart" works
- [ ] Cart shows correct items and totals
- [ ] Checkout redirects to Shopify
- [ ] Sold out products show as unavailable

---

**All data is managed in Shopify Admin and automatically syncs to your Manus website!** 🎉
