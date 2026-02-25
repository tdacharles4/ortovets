const domain = process.env.SHOPIFY_STORE_DOMAIN;
const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function shopifyFetch<T>({ query, variables }: { query: string; variables?: Record<string, unknown> }): Promise<{ status: number; body: T }> {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken!,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    return {
      status: result.status,
      body: await result.json()
    };
  } catch (error) {
    console.error('Error reaching Shopify Storefront API:', error);
    throw {
      error,
      query,
    };
  }
}

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  availableForSale: boolean;
  images: {
    edges: {
      node: {
        url: string;
        altText: string;
      };
    }[];
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    edges: {
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: {
          amount: string;
          currencyCode: string;
        };
        selectedOptions: {
          name: string;
          value: string;
        }[];
      };
    }[];
  };
};

export function isMenudeoVariant(variant: any) {
  if (!variant) return false;
  const title = variant.title?.toLowerCase() || "";
  const options = variant.selectedOptions?.map((opt: any) => opt.value.toLowerCase()).join(" ") || "";
  
  // Explicit check for menudeo
  if (title.includes("menudeo") || options.includes("menudeo")) return true;
  // If it mentions mayoreo, it's NOT menudeo
  if (title.includes("mayoreo") || options.includes("mayoreo")) return false;
  
  // Default to true if neither is mentioned (standard products)
  return true;
}

export function getMenudeoPriceRange(product: ShopifyProduct) {
  const menudeoVariants = product.variants.edges
    .map(edge => edge.node)
    .filter(isMenudeoVariant);

  if (menudeoVariants.length === 0) {
    return product.priceRange;
  }

  const prices = menudeoVariants.map(v => parseFloat(v.price.amount));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const currencyCode = menudeoVariants[0].price.currencyCode;

  return {
    minVariantPrice: {
      amount: minPrice.toString(),
      currencyCode,
    },
    maxVariantPrice: {
      amount: maxPrice.toString(),
      currencyCode,
    },
  };
}

export async function getProduct(handle: string) {
  return shopifyFetch<{ data: { product: ShopifyProduct } }>({
    query: `{
      product(handle: "${handle}") {
        id
        title
        handle
        description
        availableForSale
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 20) {
          edges {
            node {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }`
  });
}

export async function getProducts() {
  return shopifyFetch<{ data: { products: { edges: { node: ShopifyProduct }[] } } }>({
    query: `{
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            description
            availableForSale
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      }
    }`
  });
}
