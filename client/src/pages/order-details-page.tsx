import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layouts/main-layout";
import { Breadcrumb } from "@/components/navigation/breadcrumb";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/common/badge";
import {
  PackageIcon,
  TruckIcon,
  MapPinIcon,
  CreditCardIcon,
  ChevronLeftIcon,
  Loader2Icon,
  ClipboardCheckIcon,
  ArrowRightIcon,
  AlertTriangleIcon,
} from "lucide-react";

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  
  // Fetch order details
  const { data: orderData, isLoading } = useQuery({
    queryKey: ['/api/orders', id],
    enabled: !!id && !!user,
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Get status badge and description
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pendiente':
        return {
          badge: <Badge variant="default">Pendiente</Badge>,
          description: "Tu pedido está siendo procesado",
          icon: <ClipboardCheckIcon className="h-5 w-5 text-neutral-500" />
        };
      case 'enviado':
        return {
          badge: <Badge variant="new">Enviado</Badge>,
          description: "Tu pedido está en camino",
          icon: <TruckIcon className="h-5 w-5 text-green-500" />
        };
      case 'entregado':
        return {
          badge: <Badge variant="limited">Entregado</Badge>,
          description: "Tu pedido ha sido entregado",
          icon: <CheckIcon className="h-5 w-5 text-green-500" />
        };
      case 'cancelado':
        return {
          badge: <Badge variant="sale">Cancelado</Badge>,
          description: "Tu pedido ha sido cancelado",
          icon: <AlertTriangleIcon className="h-5 w-5 text-red-500" />
        };
      default:
        return {
          badge: <Badge variant="default">{status}</Badge>,
          description: "Estado del pedido",
          icon: <PackageIcon className="h-5 w-5 text-neutral-500" />
        };
    }
  };
  
  // Get payment method info
  const getPaymentMethodInfo = (method: string) => {
    switch (method) {
      case 'credit_card':
        return {
          name: "Tarjeta de Crédito/Débito",
          icon: <CreditCardIcon className="h-5 w-5 text-neutral-500" />
        };
      case 'bank_transfer':
        return {
          name: "Transferencia Bancaria",
          icon: <LandmarkIcon className="h-5 w-5 text-neutral-500" />
        };
      case 'paypal':
        return {
          name: "PayPal",
          icon: <DollarSignIcon className="h-5 w-5 text-neutral-500" />
        };
      case 'cash_on_delivery':
        return {
          name: "Pago contra entrega",
          icon: <DollarSignIcon className="h-5 w-5 text-neutral-500" />
        };
      default:
        return {
          name: method,
          icon: <CreditCardIcon className="h-5 w-5 text-neutral-500" />
        };
    }
  };
  
  // Get shipping method info
  const getShippingMethodInfo = (method: string) => {
    switch (method) {
      case 'standard':
        return {
          name: "Envío Estándar (3-5 días)",
          icon: <TruckIcon className="h-5 w-5 text-neutral-500" />
        };
      case 'express':
        return {
          name: "Envío Express (1-2 días)",
          icon: <ZapIcon className="h-5 w-5 text-neutral-500" />
        };
      case 'pickup':
        return {
          name: "Recoger en Tienda",
          icon: <MapPinIcon className="h-5 w-5 text-neutral-500" />
        };
      default:
        return {
          name: method,
          icon: <TruckIcon className="h-5 w-5 text-neutral-500" />
        };
    }
  };
  
  // Handle loading and auth states
  if (authLoading || isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
          <Loader2Icon className="h-12 w-12 animate-spin text-primary-600" />
        </div>
      </MainLayout>
    );
  }
  
  if (!user) {
    navigate("/auth");
    return null;
  }
  
  const order = orderData?.order;
  const orderItems = orderData?.items || [];
  
  if (!order) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Pedido no encontrado</h1>
          <p className="mb-6">El pedido que buscas no existe o no tienes acceso a él.</p>
          <Button onClick={() => navigate("/account?tab=orders")}>
            Ver Mis Pedidos
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  const statusInfo = getStatusInfo(order.status);
  const paymentInfo = getPaymentMethodInfo(order.paymentMethod);
  const shippingInfo = getShippingMethodInfo(order.shippingMethod);
  
  // Breadcrumb setup
  const breadcrumbItems = [
    { label: "Mi Cuenta", href: "/account" },
    { label: "Pedidos", href: "/account?tab=orders" },
    { label: `Pedido #${order.id}` }
  ];
  
  // Calculate subtotal
  const subtotal = orderItems.reduce((acc: number, item: any) => 
    acc + (item.price * item.quantity), 0);
  
  // Simplified tax calculation
  const taxes = subtotal * 0.06;
  
  // Calculate shipping cost (the difference between total and subtotal+taxes)
  const shippingCost = order.total - subtotal - taxes;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
            Pedido #{order.id}
          </h1>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/account?tab=orders")}
            className="mt-2 md:mt-0"
          >
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Volver a Mis Pedidos
          </Button>
        </div>
        
        {/* Order Status */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center">
              {statusInfo.icon}
              <div className="ml-3">
                <div className="flex items-center">
                  <h2 className="text-lg font-bold mr-2">Estado del Pedido</h2>
                  {statusInfo.badge}
                </div>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                  {statusInfo.description}
                </p>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 text-sm">
              <div className="text-neutral-500 dark:text-neutral-400">
                Fecha del Pedido
              </div>
              <div className="font-medium">
                {formatDate(order.createdAt)}
              </div>
            </div>
          </div>
          
          {order.trackingNumber && (
            <div className="mt-4 p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg text-sm">
              <div className="font-medium">Número de Seguimiento</div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">
                  {order.trackingNumber}
                </span>
                <Button variant="link" size="sm" className="p-0 h-auto">
                  Seguir Pedido <ArrowRightIcon className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <ShoppingBagIcon className="mr-2 h-5 w-5" />
                Productos
              </h2>
              
              <div className="space-y-4">
                {orderItems.map((item: any) => (
                  <div key={item.id} className="flex border-b border-neutral-200 dark:border-neutral-700 pb-4 last:border-0 last:pb-0">
                    <div className="w-16 h-16 flex-shrink-0">
                      <img 
                        src={item.product?.image || "https://placehold.co/200x200?text=Imagen+no+disponible"} 
                        alt={item.product?.name || "Producto"} 
                        className="w-full h-full object-cover rounded-md" 
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <div className="font-medium">
                        {item.product?.name || "Producto"}
                      </div>
                      {item.variant && (
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                          {item.variant.name}: {item.variant.value}
                        </div>
                      )}
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        Cantidad: {item.quantity}
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        ${item.price.toFixed(2)} c/u
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Shipping Address */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <MapPinIcon className="mr-2 h-5 w-5" />
                Dirección de Envío
              </h2>
              
              {order.address ? (
                <div>
                  <div className="font-medium">
                    {order.address.street}
                  </div>
                  <div className="text-neutral-500 dark:text-neutral-400">
                    {order.address.city}, {order.address.state}, {order.address.postalCode}
                  </div>
                  <div className="text-neutral-500 dark:text-neutral-400">
                    {order.address.country}
                  </div>
                </div>
              ) : (
                <div className="text-neutral-500 dark:text-neutral-400">
                  Información de envío no disponible
                </div>
              )}
            </div>
            
            {/* Payment & Shipping Method */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center">
                  <CreditCardIcon className="mr-2 h-5 w-5" />
                  Método de Pago
                </h2>
                
                <div className="flex items-center">
                  {paymentInfo.icon}
                  <span className="ml-2">{paymentInfo.name}</span>
                </div>
              </div>
              
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center">
                  <TruckIcon className="mr-2 h-5 w-5" />
                  Método de Envío
                </h2>
                
                <div className="flex items-center">
                  {shippingInfo.icon}
                  <span className="ml-2">{shippingInfo.name}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-4">Resumen del Pedido</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Subtotal</span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Impuestos</span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    ${taxes.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Envío</span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    ${shippingCost.toFixed(2)}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="font-medium text-lg text-neutral-800 dark:text-white">Total</span>
                  <span className="font-bold text-lg text-neutral-900 dark:text-white">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
              
              {order.status === 'entregado' && (
                <Button className="w-full mt-6">
                  Comprar de Nuevo
                </Button>
              )}
              
              {order.status === 'pendiente' && (
                <Button variant="outline" className="w-full mt-6 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                  Cancelar Pedido
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Additional icons
import { 
  CheckIcon, 
  LandmarkIcon, 
  DollarSignIcon,
  ZapIcon,
  ShoppingBagIcon
} from "lucide-react";
