'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useCustomer } from '@/hooks/useCustomer';

export function AccountPanel() {
  const { isAuthenticated } = useAuth();
  const { customer, loading } = useCustomer();

  if (!isAuthenticated) return null;
  if (loading) return <p>Loading your account...</p>;
  if (!customer) return <p>Could not load account data.</p>;

  return (
    <div>
      <h2>Hello, {customer.firstName}!</h2>
      <p>{customer.emailAddress?.emailAddress}</p>
      <h3>Recent Orders</h3>
      <ul>
        {customer.orders.nodes.map((order: any) => (
          <li key={order.id}>
            Order #{order.number} — {order.totalPrice.amount}{' '}
            {order.totalPrice.currencyCode}
          </li>
        ))}
      </ul>
    </div>
  );
}
