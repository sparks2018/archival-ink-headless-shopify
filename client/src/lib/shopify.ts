/**
 * Shopify Storefront API Client
 * 
 * This client handles all communication with Shopify's Storefront API
 * for products, collections, cart, and checkout operations.
 */

const SHOPIFY_STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const SHOPIFY_API_VERSION = '2024-01';

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
  console.warn('Shopify environment variables not set. Using mock data.');
}

const STOREFRONT_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

/**
 * Make a GraphQL request to Shopify Storefront API
 */
async function shopifyFetch<T>({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, any>;
}): Promise<T> {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    throw new Error('Shopify credentials not configured');
  }

  const response = await fetch(STOREFRONT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.statusText}`);
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data as T;
}

/**
 * Shopify Product Type
 */
export interface ShopifyProduct {
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
  metafields?: Array<{
    key: string | null;
    value: string | null;
  } | null> | null;
}

/**
 * Shopify Collection Type
 */
export interface ShopifyCollection {
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

/**
 * Shopify Cart Type
 */
export interface ShopifyCart {
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

/**
 * Get all products
 */
export async function getProducts(first = 50): Promise<ShopifyProduct[]> {
  const query = `
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
              { namespace: "custom", key: "featured" },
              { namespace: "custom", key: "dimensions" },
              { namespace: "custom", key: "edition_size" },
              { namespace: "custom", key: "medium" },
              { namespace: "custom", key: "paper_weight" }
            ]) {
              key
              value
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    products: {
      edges: Array<{ node: ShopifyProduct }>;
    };
  }>({ query, variables: { first } });

  return data.products.edges.map((edge) => edge.node);
}

/**
 * Get a single product by handle
 */
export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const query = `
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
          { namespace: "custom", key: "featured" },
          { namespace: "custom", key: "dimensions" },
          { namespace: "custom", key: "edition_size" },
          { namespace: "custom", key: "medium" },
          { namespace: "custom", key: "paper_weight" }
        ]) {
          key
          value
        }
      }
    }
  `;

  const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
    query,
    variables: { handle },
  });

  return data.product;
}

/**
 * Get all collections (artists)
 */
export async function getCollections(first = 50): Promise<ShopifyCollection[]> {
  const query = `
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
  `;

  const data = await shopifyFetch<{
    collections: {
      edges: Array<{ node: ShopifyCollection }>;
    };
  }>({ query, variables: { first } });

  return data.collections.edges.map((edge) => edge.node);
}

/**
 * Get a single collection by handle
 */
export async function getCollection(handle: string): Promise<ShopifyCollection | null> {
  const query = `
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
  `;

  const data = await shopifyFetch<{ collection: ShopifyCollection | null }>({
    query,
    variables: { handle },
  });

  return data.collection;
}

/**
 * Create a new cart
 */
export async function createCart(): Promise<ShopifyCart> {
  const query = `
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
  `;

  const data = await shopifyFetch<{
    cartCreate: {
      cart: ShopifyCart;
    };
  }>({ query });

  return data.cartCreate.cart;
}

/**
 * Add items to cart
 */
export async function addToCart(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<ShopifyCart> {
  const query = `
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
  `;

  const data = await shopifyFetch<{
    cartLinesAdd: {
      cart: ShopifyCart;
    };
  }>({
    query,
    variables: { cartId, lines },
  });

  return data.cartLinesAdd.cart;
}

/**
 * Update cart line quantities
 */
export async function updateCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>
): Promise<ShopifyCart> {
  const query = `
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
  `;

  const data = await shopifyFetch<{
    cartLinesUpdate: {
      cart: ShopifyCart;
    };
  }>({
    query,
    variables: { cartId, lines },
  });

  return data.cartLinesUpdate.cart;
}

/**
 * Remove items from cart
 */
export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<ShopifyCart> {
  const query = `
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
  `;

  const data = await shopifyFetch<{
    cartLinesRemove: {
      cart: ShopifyCart;
    };
  }>({
    query,
    variables: { cartId, lineIds },
  });

  return data.cartLinesRemove.cart;
}

/**
 * Get cart by ID
 */
export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const query = `
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
  `;

  const data = await shopifyFetch<{ cart: ShopifyCart | null }>({
    query,
    variables: { cartId },
  });

  return data.cart;
}
