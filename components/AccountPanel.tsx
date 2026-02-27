'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCustomer } from '@/hooks/useCustomer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { EditProfileDialog } from './EditProfileDialog';

export function AccountPanel() {
  const { isAuthenticated } = useAuth();
  const { customer, loading, refetchCustomer } = useCustomer();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (!isAuthenticated) return null;
  if (loading) return (
    <div className="container mx-auto py-10">
      <p className="text-center text-muted-foreground animate-pulse">Loading your account...</p>
    </div>
  );
  
  if (!customer) return (
    <div className="container mx-auto py-10 text-center">
      <p className="text-destructive">Could not load account data.</p>
    </div>
  );

  return (
    <>
      <div className="container mx-auto py-10 space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold">
                  Hola, {customer.firstName}!
                </CardTitle>
                <CardDescription className="mt-1 text-lg">
                  {customer.email}
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                {customer.tags && customer.tags.includes('MVZ') && (
                  <Badge variant="secondary" className="px-4 py-1 text-sm">
                    Usuario MVZ Verificado
                  </Badge>
                )}
                <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>Editar Datos de Usuario</Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ordenes recientes</CardTitle>
            <CardDescription>Aquí encontrarás un resumen de tu actividad reciente.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>
                {customer.orders.nodes.length === 0 
                  ? "No existen ordenes en el historial." 
                  : "Un listado de tus ordenes recientes."}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Orden</TableHead>
                  <TableHead>Estatus</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.orders.nodes.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.orderNumber}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="w-fit text-[10px] uppercase">
                          {order.financialStatus.replace('_', ' ')}
                        </Badge>
                        <Badge variant="secondary" className="w-fit text-[10px] uppercase">
                          {order.fulfillmentStatus.replace('_', ' ')}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        {order.lineItems.nodes.map((item: any, i: number) => (
                          <span key={i}>
                            {item.quantity}x {item.title}
                            {i < order.lineItems.nodes.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {order.totalPrice.amount} {order.totalPrice.currencyCode}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <EditProfileDialog 
        customer={customer} 
        refetchCustomer={refetchCustomer} 
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
      />
    </>
  );
}
