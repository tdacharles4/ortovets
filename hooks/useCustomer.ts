'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// This query is now written for the Storefront API and requires the customerAccessToken variable.
const CUSTOMER_QUERY = `
  query GetCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      orders(first: 5) {
        nodes {
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
            nodes {
              title
              quantity
            }
          }
        }
      }
    }
  }
`;

export function useCustomer() {
  const { isAuthenticated } = useAuth();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = useCallback(async () => {
    if (!isAuthenticated) {
      setCustomer(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: CUSTOMER_QUERY }),
      });
      const data = await res.json();
      
      if (data.errors) {
          console.error("GraphQL errors from useCustomer:", data.errors);
          throw new Error("GraphQL error");
      }

      setCustomer(data?.data?.customer ?? null);
    } catch (e) {
      setError('Failed to load customer data');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  return { customer, loading, error, refetchCustomer: fetchCustomer };
}
