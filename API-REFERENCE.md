# Shopify Storefront API Reference

Complete reference for all Shopify API queries and mutations used in this project.

## 📚 Table of Contents

1. [Product Queries](#product-queries)
2. [Collection Queries](#collection-queries)
3. [Cart Mutations](#cart-mutations)
4. [Cart Queries](#cart-queries)
5. [Error Handling](#error-handling)

---

## 🛍️ Product Queries

### Get All Products

**Function**: `getProducts(first: number)`

**GraphQL Query**:
```graphql
query GetProducts($first: Int!) {
  products(first: $first) {
    edges {
      node {
        id
        title
        handle
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              availableForSale
              priceV2 {
                amount
                currencyCode
              }
            }
          }
        }
        tags
        vendor
        productType
        metafields(identifiers: [
          { namespace: "custom", key: "artist" },
          { namespace: "custom", key: "category" },
          { namespace: "custom", key: "featured" }
        ]) {
          key
          value
        }
      }
    }
  }
}
```

**Variables**:
```json
{
  "first": 100
}
```

**Response**:
```typescript
{
  products: {
    edges: Array<{
      node: ShopifyProduct
    }>
  }
}
```

**Usage**:
```typescript
import { getProducts } from '@/lib/shopify';

const products = await getProducts(100);
```

---

### Get Single Product

**Function**: `getProduct(handle: string)`

**GraphQL Query**:
```graphql
query GetProduct($handle: String!) {
  product(handle: $handle) {
    id
    title
    handle
    description
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
        }
      }
    }
    variants(first: 10) {
      edges {
        node {
          id
          title
          availableForSale
          priceV2 {
            amount
            currencyCode
          }
        }
      }
    }
    tags
    vendor
    productType
    metafields(identifiers: [
      { namespace: "custom", key: "artist" },
      { namespace: "custom", key: "category" },
      { namespace: "custom", key: "featured" }
    ]) {
      key
      value
    }
  }
}
```

**Variables**:
```json
{
  "handle": "cosmic-vision"
}
```

**Response**:
```typescript
{
  product: ShopifyProduct | null
}
```

**Usage**:
```typescript
import { getProduct } from '@/lib/shopify';

const product = await getProduct('cosmic-vision');
```

---

## 🎨 Collection Queries

### Get All Collections

**Function**: `getCollections(first: number)`

**GraphQL Query**:
```graphql
query GetCollections($first: Int!) {
  collections(first: $first) {
    edges {
      node {
        id
        title
        handle
        description
        image {
          url
          altText
        }
        products(first: 50) {
          edges {
            node {
              id
              title
              handle
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              vendor
              tags
            }
          }
        }
      }
    }
  }
}
```

**Variables**:
```json
{
  "first": 50
}
```

**Response**:
```typescript
{
  collections: {
    edges: Array<{
      node: ShopifyCollection
    }>
  }
}
```

**Usage**:
```typescript
import { getCollections } from '@/lib/shopify';

const collections = await getCollections(50);
```

---

### Get Single Collection

**Function**: `getCollection(handle: string)`

**GraphQL Query**:
```graphql
query GetCollection($handle: String!) {
  collection(handle: $handle) {
    id
    title
    handle
    description
    image {
      url
      altText
    }
    products(first: 50) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                priceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
          vendor
          tags
          productType
        }
      }
    }
  }
}
```

**Variables**:
```json
{
  "handle": "alex-grey"
}
```

**Response**:
```typescript
{
  collection: ShopifyCollection | null
}
```

**Usage**:
```typescript
import { getCollection } from '@/lib/shopify';

const collection = await getCollection('alex-grey');
```

---

## 🛒 Cart Mutations

### Create Cart

**Function**: `createCart()`

**GraphQL Mutation**:
```graphql
mutation CreateCart {
  cartCreate {
    cart {
      id
      checkoutUrl
      lines(first: 10) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                product {
                  title
                  featuredImage {
                    url
                    altText
                  }
                }
                priceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
      }
    }
  }
}
```

**Response**:
```typescript
{
  cartCreate: {
    cart: ShopifyCart
  }
}
```

**Usage**:
```typescript
import { createCart } from '@/lib/shopify';

const cart = await createCart();
console.log(cart.id); // Store this ID
console.log(cart.checkoutUrl); // Use for checkout
```

---

### Add Items to Cart

**Function**: `addToCart(cartId: string, lines: CartLineInput[])`

**GraphQL Mutation**:
```graphql
mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      id
      checkoutUrl
      lines(first: 50) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                product {
                  title
                  featuredImage {
                    url
                    altText
                  }
                }
                priceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
      }
    }
  }
}
```

**Variables**:
```json
{
  "cartId": "gid://shopify/Cart/...",
  "lines": [
    {
      "merchandiseId": "gid://shopify/ProductVariant/...",
      "quantity": 1
    }
  ]
}
```

**Response**:
```typescript
{
  cartLinesAdd: {
    cart: ShopifyCart
  }
}
```

**Usage**:
```typescript
import { addToCart } from '@/lib/shopify';

const cart = await addToCart(cartId, [
  {
    merchandiseId: 'gid://shopify/ProductVariant/12345',
    quantity: 1
  }
]);
```

---

### Update Cart Lines

**Function**: `updateCartLines(cartId: string, lines: CartLineUpdateInput[])`

**GraphQL Mutation**:
```graphql
mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart {
      id
      checkoutUrl
      lines(first: 50) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                product {
                  title
                  featuredImage {
                    url
                    altText
                  }
                }
                priceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
      }
    }
  }
}
```

**Variables**:
```json
{
  "cartId": "gid://shopify/Cart/...",
  "lines": [
    {
      "id": "gid://shopify/CartLine/...",
      "quantity": 2
    }
  ]
}
```

**Response**:
```typescript
{
  cartLinesUpdate: {
    cart: ShopifyCart
  }
}
```

**Usage**:
```typescript
import { updateCartLines } from '@/lib/shopify';

const cart = await updateCartLines(cartId, [
  {
    id: 'gid://shopify/CartLine/12345',
    quantity: 2
  }
]);
```

---

### Remove Items from Cart

**Function**: `removeFromCart(cartId: string, lineIds: string[])`

**GraphQL Mutation**:
```graphql
mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart {
      id
      checkoutUrl
      lines(first: 50) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                product {
                  title
                  featuredImage {
                    url
                    altText
                  }
                }
                priceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
      }
    }
  }
}
```

**Variables**:
```json
{
  "cartId": "gid://shopify/Cart/...",
  "lineIds": [
    "gid://shopify/CartLine/..."
  ]
}
```

**Response**:
```typescript
{
  cartLinesRemove: {
    cart: ShopifyCart
  }
}
```

**Usage**:
```typescript
import { removeFromCart } from '@/lib/shopify';

const cart = await removeFromCart(cartId, [
  'gid://shopify/CartLine/12345'
]);
```

---

## 🔍 Cart Queries

### Get Cart by ID

**Function**: `getCart(cartId: string)`

**GraphQL Query**:
```graphql
query GetCart($cartId: ID!) {
  cart(id: $cartId) {
    id
    checkoutUrl
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              product {
                title
                featuredImage {
                  url
                  altText
                }
              }
              priceV2 {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
    cost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
    }
  }
}
```

**Variables**:
```json
{
  "cartId": "gid://shopify/Cart/..."
}
```

**Response**:
```typescript
{
  cart: ShopifyCart | null
}
```

**Usage**:
```typescript
import { getCart } from '@/lib/shopify';

const cart = await getCart(cartId);
```

---

## ⚠️ Error Handling

### API Error Response

```typescript
{
  errors: [
    {
      message: "Error message",
      locations: [...],
      path: [...]
    }
  ]
}
```

### Handling Errors

```typescript
try {
  const products = await getProducts(100);
} catch (error) {
  if (error instanceof Error) {
    console.error('Shopify API error:', error.message);
  }
}
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| **401 Unauthorized** | Invalid access token | Check `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN` |
| **404 Not Found** | Invalid store domain | Check `VITE_SHOPIFY_STORE_DOMAIN` |
| **Throttled** | Too many requests | Implement rate limiting |
| **Invalid GraphQL** | Syntax error in query | Check query syntax |
| **Missing scopes** | API scopes not enabled | Enable required scopes in Shopify Admin |

---

## 🔐 Authentication

### Storefront API Token

- **Type**: Public token (safe for frontend)
- **Format**: `shpat_xxxxxxxxxxxxxxxxxxxxx`
- **Location**: Environment variable `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- **Header**: `X-Shopify-Storefront-Access-Token`

### Required Scopes

- `unauthenticated_read_product_listings`
- `unauthenticated_read_product_inventory`
- `unauthenticated_read_product_tags`
- `unauthenticated_read_collection_listings`
- `unauthenticated_write_checkouts`
- `unauthenticated_read_checkouts`

---

## 📊 Rate Limits

### Storefront API Limits

- **Cost-based system**: Each query has a cost
- **Bucket size**: 1000 points
- **Restore rate**: 50 points/second
- **Typical query cost**: 2-10 points

### Best Practices

1. **Batch requests** when possible
2. **Cache responses** in localStorage or state
3. **Implement exponential backoff** for retries
4. **Monitor costs** in response headers

---

## 🎯 TypeScript Types

### ShopifyProduct

```typescript
interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        priceV2: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
  tags: string[];
  vendor: string;
  productType: string;
  metafields: Array<{
    key: string;
    value: string;
  }>;
}
```

### ShopifyCollection

```typescript
interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: {
    url: string;
    altText: string | null;
  } | null;
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}
```

### ShopifyCart

```typescript
interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          product: {
            title: string;
            featuredImage: {
              url: string;
              altText: string | null;
            };
          };
          priceV2: {
            amount: string;
            currencyCode: string;
          };
        };
      };
    }>;
  };
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}
```

---

## 📚 Resources

- **Shopify Storefront API Docs**: https://shopify.dev/docs/api/storefront
- **GraphQL Explorer**: https://shopify.dev/docs/apps/tools/graphiql-admin-api
- **API Versioning**: https://shopify.dev/docs/api/usage/versioning

---

**Complete API reference for headless Shopify integration!** 🚀
