import { shopifyFetch } from './client';
import { AppOrder, AppAddress } from './types';

// ─────────────────────────────────────────────
// Mutations & Queries GraphQL
// ─────────────────────────────────────────────

const CUSTOMER_ORDERS_QUERY = `
  query getCustomerOrders($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: 20, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 5) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    image {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const CUSTOMER_ADDRESSES_QUERY = `
  query getCustomerAddresses($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      defaultAddress {
        id
      }
      addresses(first: 10) {
        edges {
          node {
            id
            firstName
            lastName
            address1
            address2
            city
            country
            zip
            phone
          }
        }
      }
    }
  }
`;

// ─────────────────────────────────────────────
// Fonctions exportées
// ─────────────────────────────────────────────

/**
 * Récupère l'historique des commandes du client connecté.
 */
export async function fetchCustomerOrders(token: string): Promise<AppOrder[]> {
  try {
    const { data } = await shopifyFetch<any>({
      query: CUSTOMER_ORDERS_QUERY,
      variables: { customerAccessToken: token },
    });

    const ordersEdges = data?.customer?.orders?.edges || [];

    return ordersEdges.map((edge: any) => {
      const node = edge.node;
      
      const lineItemsEdges = node.lineItems?.edges || [];
      const lineItems = lineItemsEdges.map((liEdge: any) => ({
        title: liEdge.node.title,
        quantity: liEdge.node.quantity,
        imageUrl: liEdge.node.variant?.image?.url || null,
      }));

      return {
        id: node.id,
        orderNumber: node.orderNumber,
        processedAt: node.processedAt,
        financialStatus: node.financialStatus,
        fulfillmentStatus: node.fulfillmentStatus,
        totalPrice: {
          amount: node.totalPrice.amount,
          currencyCode: node.totalPrice.currencyCode,
        },
        lineItems,
      };
    });
  } catch (error) {
    console.error('Erreur fetchCustomerOrders:', error);
    return [];
  }
}

/**
 * Récupère les adresses du client connecté.
 */
export async function fetchCustomerAddresses(token: string): Promise<AppAddress[]> {
  try {
    const { data } = await shopifyFetch<any>({
      query: CUSTOMER_ADDRESSES_QUERY,
      variables: { customerAccessToken: token },
    });

    const defaultAddressId = data?.customer?.defaultAddress?.id;
    const addressesEdges = data?.customer?.addresses?.edges || [];

    return addressesEdges.map((edge: any) => {
      const node = edge.node;
      return {
        id: node.id,
        firstName: node.firstName || '',
        lastName: node.lastName || '',
        address1: node.address1 || '',
        address2: node.address2 || null,
        city: node.city || '',
        country: node.country || '',
        zip: node.zip || '',
        phone: node.phone || null,
        isDefault: node.id === defaultAddressId,
      };
    });
  } catch (error) {
    console.error('Erreur fetchCustomerAddresses:', error);
    return [];
  }
}
