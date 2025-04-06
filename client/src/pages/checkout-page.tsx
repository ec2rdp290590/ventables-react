import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { MainLayout } from "@/components/layouts/main-layout";
import { Breadcrumb } from "@/components/navigation/breadcrumb";
import { CartSummary } from "@/components/cart/cart-summary";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CreditCardIcon,
  Landmark,
  CircleDollarSign,
  CreditCard,
  Loader2Icon,
  ShoppingBagIcon,
  MapPinIcon,
  PlusIcon,
  CheckIcon,
  AlertTriangleIcon,
} from "lucide-react";

// Form schema for shipping address
const shippingSchema = z.object({
  addressId: z.string().optional(),
  useNewAddress: z.boolean().optional(),
  street: z.string().min(1, "La calle es requerida").optional(),
  city: z.string().min(1, "La ciudad es requerida").optional(),
  state: z.string().min(1, "La provincia/estado es requerido").optional(),
  postalCode: z.string().min(1, "El código postal es requerido").optional(),
  country: z.string().min(1, "El país es requerido").optional(),
  paymentMethod: z.enum(["credit_card", "bank_transfer", "paypal", "cash_on_delivery"]),
  shippingMethod: z.enum(["standard", "express", "pickup"]),
});

type ShippingFormValues = z.infer<typeof shippingSchema>;

export default function CheckoutPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const { cartItems, subtotal, taxes, shipping, total } = useCart();
  const [isUsingNewAddress, setIsUsingNewAddress] = useState(false);

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  // Fetch user addresses
  const { data: addresses = [], isLoading: addressesLoading } = useQuery({
    queryKey: ['/api/addresses'],
    enabled: !!user,
  });

  // Form setup
  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      addressId: "",
      useNewAddress: false,
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      paymentMethod: "credit_card",
      shippingMethod: "standard",
    },
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const res = await apiRequest("POST", "/api/orders", orderData);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Pedido creado",
        description: "Tu pedido ha sido creado exitosamente",
      });
      navigate(`/orders/${data.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Error al crear el pedido",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = async (data: ShippingFormValues) => {
    if (!user) {
      toast({
        title: "Debes iniciar sesión",
        description: "Por favor inicia sesión para continuar",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      let addressId = data.addressId;
      
      // Create new address if needed
      if (data.useNewAddress && data.street) {
        const addressData = {
          userId: user.id,
          street: data.street,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
          isDefault: addresses.length === 0, // Make default if it's the first
        };
        
        const res = await apiRequest("POST", "/api/addresses", addressData);
        const newAddress = await res.json();
        addressId = newAddress.id.toString();
      }
      
      // Create order
      const orderData = {
        addressId: parseInt(addressId || "0"),
        total: total,
        paymentMethod: data.paymentMethod,
        shippingMethod: data.shippingMethod,
      };
      
      await createOrderMutation.mutateAsync(orderData);
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  // Toggle between new address and existing address
  const toggleNewAddress = (value: boolean) => {
    setIsUsingNewAddress(value);
    form.setValue("useNewAddress", value);
    
    if (value) {
      form.setValue("addressId", "");
    } else {
      // Reset new address fields
      form.setValue("street", "");
      form.setValue("city", "");
      form.setValue("state", "");
      form.setValue("postalCode", "");
      form.setValue("country", "");
    }
  };

  // Breadcrumb setup
  const breadcrumbItems = [
    { label: "Carrito", href: "/cart" },
    { label: "Checkout" },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <h1 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-neutral-100">
          Finalizar Compra
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Shipping Address Section */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg p-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center">
                    <MapPinIcon className="mr-2 h-5 w-5" />
                    Dirección de Envío
                  </h2>
                  
                  {addressesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2Icon className="animate-spin h-8 w-8 text-primary-600" />
                    </div>
                  ) : addresses.length > 0 ? (
                    <div className="space-y-4">
                      {!isUsingNewAddress && (
                        <FormField
                          control={form.control}
                          name="addressId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Selecciona una dirección</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una dirección" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {addresses.map((address: any) => (
                                    <SelectItem key={address.id} value={address.id.toString()}>
                                      {address.street}, {address.city}, {address.state}, {address.country}
                                      {address.isDefault && " (Principal)"}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      <div className="flex items-center justify-between">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => toggleNewAddress(!isUsingNewAddress)}
                        >
                          {isUsingNewAddress ? (
                            <>Usar dirección existente</>
                          ) : (
                            <><PlusIcon className="mr-2 h-4 w-4" /> Añadir nueva dirección</>
                          )}
                        </Button>
                        
                        {isUsingNewAddress && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => toggleNewAddress(false)}
                          >
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : null}
                  
                  {(isUsingNewAddress || addresses.length === 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="street"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Calle y Número</FormLabel>
                            <FormControl>
                              <Input placeholder="Calle y número" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ciudad</FormLabel>
                            <FormControl>
                              <Input placeholder="Ciudad" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Provincia/Estado</FormLabel>
                            <FormControl>
                              <Input placeholder="Provincia o Estado" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Código Postal</FormLabel>
                            <FormControl>
                              <Input placeholder="Código Postal" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>País</FormLabel>
                            <FormControl>
                              <Input placeholder="País" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
                
                {/* Shipping Method Section */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg p-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center">
                    <TruckIcon className="mr-2 h-5 w-5" />
                    Método de Envío
                  </h2>
                  
                  <FormField
                    control={form.control}
                    name="shippingMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-3"
                          >
                            <div className="flex items-center justify-between space-x-2 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700">
                              <div className="flex items-center">
                                <RadioGroupItem value="standard" id="standard" />
                                <label 
                                  htmlFor="standard" 
                                  className="font-medium text-base flex items-center ml-2 cursor-pointer"
                                >
                                  Envío Estándar (3-5 días)
                                </label>
                              </div>
                              <div className="font-medium">
                                {shipping > 0 ? `$${shipping.toFixed(2)}` : "Gratis"}
                              </div>
                            </div>
                            <div className="flex items-center justify-between space-x-2 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700">
                              <div className="flex items-center">
                                <RadioGroupItem value="express" id="express" />
                                <label 
                                  htmlFor="express" 
                                  className="font-medium text-base flex items-center ml-2 cursor-pointer"
                                >
                                  Envío Express (1-2 días)
                                </label>
                              </div>
                              <div className="font-medium">$19.99</div>
                            </div>
                            <div className="flex items-center justify-between space-x-2 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700">
                              <div className="flex items-center">
                                <RadioGroupItem value="pickup" id="pickup" />
                                <label 
                                  htmlFor="pickup" 
                                  className="font-medium text-base flex items-center ml-2 cursor-pointer"
                                >
                                  Recoger en Tienda
                                </label>
                              </div>
                              <div className="font-medium">Gratis</div>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Payment Method Section */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg p-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center">
                    <CreditCardIcon className="mr-2 h-5 w-5" />
                    Método de Pago
                  </h2>
                  
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-3"
                          >
                            <div className="flex items-center space-x-2 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700">
                              <RadioGroupItem value="credit_card" id="credit_card" />
                              <label 
                                htmlFor="credit_card" 
                                className="font-medium text-base flex items-center ml-2 cursor-pointer"
                              >
                                <CreditCard className="h-5 w-5 mr-2" />
                                Tarjeta de Crédito/Débito
                              </label>
                            </div>
                            <div className="flex items-center space-x-2 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700">
                              <RadioGroupItem value="paypal" id="paypal" />
                              <label 
                                htmlFor="paypal" 
                                className="font-medium text-base flex items-center ml-2 cursor-pointer"
                              >
                                <CircleDollarSign className="h-5 w-5 mr-2" />
                                PayPal
                              </label>
                            </div>
                            <div className="flex items-center space-x-2 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700">
                              <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                              <label 
                                htmlFor="bank_transfer" 
                                className="font-medium text-base flex items-center ml-2 cursor-pointer"
                              >
                                <Landmark className="h-5 w-5 mr-2" />
                                Transferencia Bancaria
                              </label>
                            </div>
                            <div className="flex items-center space-x-2 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700">
                              <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                              <label 
                                htmlFor="cash_on_delivery" 
                                className="font-medium text-base flex items-center ml-2 cursor-pointer"
                              >
                                <CircleDollarSign className="h-5 w-5 mr-2" />
                                Pago contra entrega
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Order Items Preview */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg p-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center">
                    <ShoppingBagIcon className="mr-2 h-5 w-5" />
                    Resumen de Productos ({cartItems.length})
                  </h2>
                  
                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center">
                        <div className="flex-shrink-0 w-16 h-16 mr-4">
                          <img 
                            src={item.product.image || "https://placehold.co/200x200?text=Imagen+no+disponible"} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover rounded-md" 
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="text-sm font-medium">{item.product.name}</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            Cantidad: {item.quantity}
                          </div>
                        </div>
                        <div className="font-medium">
                          ${((item.product.price - (item.product.discount || 0)) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <Button type="submit" className="w-full mt-4" size="lg" disabled={createOrderMutation.isPending}>
                    {createOrderMutation.isPending ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>Confirmar y Pagar</>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-4">Resumen del Pedido</h2>
              
              <CartSummary 
                subtotal={subtotal}
                taxes={taxes}
                shipping={shipping}
                total={total}
              />
              
              {shipping === 0 && (
                <div className="flex items-center mt-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm">
                  <CheckIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Envío gratis en pedidos mayores a $100</span>
                </div>
              )}
              
              <div className="mt-4 text-xs text-neutral-500 dark:text-neutral-400 text-center">
                Al completar tu compra, aceptas nuestros términos y condiciones y política de privacidad.
              </div>
              
              <div className="flex items-center mt-4 p-3 bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-lg text-sm">
                <AlertTriangleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Los impuestos se calculan en base a tu dirección de envío.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Import TruckIcon
import { TruckIcon } from "lucide-react";
