'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const CUSTOMER_QUERY = `
  query GetCustomer {
    customer {
      id
      firstName
      lastName
      emailAddress {
        emailAddress
      }
      orders(first: 5) {
        nodes {
          id
          number
          processedAt
          totalPrice {
            amount
            currencyCode
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

  useEffect(() => {
    if (!isAuthenticated) {
      setCustomer(null);
      return;
    }

    const fetchCustomer = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/customer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: CUSTOMER_QUERY }),
        });
        const data = await res.json();
        setCustomer(data?.data?.customer ?? null);
      } catch (e) {
        setError('Failed to load customer data');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [isAuthenticated]);

  return { customer, loading, error };
}
