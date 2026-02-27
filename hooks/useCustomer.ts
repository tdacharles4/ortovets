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
      tags
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

// Shared state to keep all components in sync
let globalCustomer: any = null;
let globalLoading = false;
let globalError: string | null = null;
const listeners = new Set<(data: { customer: any; loading: boolean; error: string | null }) => void>();

function notifyListeners() {
  listeners.forEach((listener) => 
    listener({ customer: globalCustomer, loading: globalLoading, error: globalError })
  );
}

export function useCustomer() {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState({
    customer: globalCustomer,
    loading: globalLoading,
    error: globalError,
  });

  const fetchCustomer = useCallback(async (force = false) => {
    if (!isAuthenticated) {
      globalCustomer = null;
      globalLoading = false;
      globalError = null;
      notifyListeners();
      return;
    }

    // Avoid redundant fetches unless forced
    if (globalCustomer && !force) return;

    globalLoading = true;
    globalError = null;
    notifyListeners();

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

      globalCustomer = data?.data?.customer ?? null;
    } catch (e) {
      globalError = 'Failed to load customer data';
    } finally {
      globalLoading = false;
      notifyListeners();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const listener = (newState: any) => setState(newState);
    listeners.add(listener);

    // Initial fetch if authenticated and no data
    if (isAuthenticated && !globalCustomer && !globalLoading) {
      fetchCustomer();
    }

    return () => {
      listeners.delete(listener);
    };
  }, [isAuthenticated, fetchCustomer]);

  const refetchCustomer = useCallback(() => fetchCustomer(true), [fetchCustomer]);

  return { 
    customer: state.customer, 
    loading: state.loading, 
    error: state.error, 
    refetchCustomer 
  };
}
