import { shopifyFetch } from './client';
import { AppCustomer } from './types';

// ─────────────────────────────────────────────
// Mutations GraphQL
// ─────────────────────────────────────────────

const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        firstName
        lastName
        email
        phone
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_QUERY = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
    }
  }
`;

// ─────────────────────────────────────────────
// Fonctions exportées
// ─────────────────────────────────────────────

export interface AuthResult {
  success: boolean;
  token?: string;
  customer?: AppCustomer;
  error?: string;
}

/**
 * Connexion d'un client existant.
 * Retourne un token d'accès si les identifiants sont corrects.
 */
export async function loginCustomer(email: string, password: string): Promise<AuthResult> {
  try {
    const { data } = await shopifyFetch<any>({
      query: CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
      variables: {
        input: { email, password },
      },
    });

    const errors = data?.customerAccessTokenCreate?.customerUserErrors;
    if (errors && errors.length > 0) {
      return { success: false, error: errors[0].message };
    }

    const token = data?.customerAccessTokenCreate?.customerAccessToken?.accessToken;
    if (!token) {
      return { success: false, error: 'Identifiants incorrects.' };
    }

    // Récupérer les infos du client avec le token
    const customer = await fetchCustomer(token);
    return { success: true, token, customer: customer ?? undefined };
  } catch (error) {
    console.error('Erreur loginCustomer:', error);
    return { success: false, error: 'Une erreur réseau est survenue.' };
  }
}

/**
 * Inscription d'un nouveau client.
 * Crée le compte puis connecte automatiquement.
 */
export async function registerCustomer(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<AuthResult> {
  try {
    // 1. Créer le compte
    const { data } = await shopifyFetch<any>({
      query: CUSTOMER_CREATE_MUTATION,
      variables: {
        input: { firstName, lastName, email, password },
      },
    });

    const errors = data?.customerCreate?.customerUserErrors;
    if (errors && errors.length > 0) {
      return { success: false, error: errors[0].message };
    }

    // 2. Succès : on demande à l'utilisateur de valider son email
    return { success: true };
  } catch (error) {
    console.error('Erreur registerCustomer:', error);
    return { success: false, error: 'Une erreur réseau est survenue.' };
  }
}

/**
 * Récupère les informations du client connecté via son token.
 */
export async function fetchCustomer(token: string): Promise<AppCustomer | null> {
  try {
    const { data } = await shopifyFetch<any>({
      query: CUSTOMER_QUERY,
      variables: { customerAccessToken: token },
    });

    const customer = data?.customer;
    if (!customer) return null;

    return {
      id: customer.id,
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      email: customer.email || '',
      phone: customer.phone || null,
    };
  } catch (error) {
    console.error('Erreur fetchCustomer:', error);
    return null;
  }
}
