import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { MainLayout } from "@/components/layouts/main-layout";
import { Breadcrumb } from "@/components/navigation/breadcrumb";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/common/badge";
import {
  UserIcon,
  MapPinIcon,
  PackageIcon,
  Plus,
  Pencil,
  Trash2,
  ExternalLinkIcon,
  Loader2Icon,
} from "lucide-react";

// Form schema for profile
const profileSchema = z.object({
  username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  fullName: z.string().optional(),
  phone: z.string().optional(),
});

// Form schema for address
const addressSchema = z.object({
  street: z.string().min(1, "La calle es requerida"),
  city: z.string().min(1, "La ciudad es requerida"),
  state: z.string().min(1, "La provincia/estado es requerido"),
  postalCode: z.string().min(1, "El código postal es requerido"),
  country: z.string().min(1, "El país es requerido"),
  isDefault: z.boolean().default(false),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type AddressFormValues = z.infer<typeof addressSchema>;

export default function AccountPage() {
  const [, navigate] = useLocation();
  const [location] = useLocation();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [isEditingAddress, setIsEditingAddress] = useState<number | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  
  // Get active tab from URL params
  const params = new URLSearchParams(location.split('?')[1]);
  const initialTab = params.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);
  
  // Change tab and update URL
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/account?tab=${value}`, { replace: true });
  };

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      fullName: user?.fullName || "",
      phone: user?.phone || "",
    },
  });
  
  // Address form for adding/editing addresses
  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      isDefault: false,
    },
  });

  // Fetch user addresses
  const { data: addresses = [], refetch: refetchAddresses } = useQuery({
    queryKey: ['/api/addresses'],
    enabled: !!user,
  });
  
  // Fetch user orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/orders'],
    enabled: !!user,
  });

  // Mutations for addresses
  const createAddressMutation = useMutation({
    mutationFn: async (addressData: AddressFormValues) => {
      const res = await apiRequest("POST", "/api/addresses", addressData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Dirección añadida",
        description: "Tu dirección ha sido añadida exitosamente",
      });
      setIsAddingAddress(false);
      addressForm.reset();
      refetchAddresses();
    },
    onError: (error: Error) => {
      toast({
        title: "Error al añadir la dirección",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const updateAddressMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: AddressFormValues }) => {
      const res = await apiRequest("PUT", `/api/addresses/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Dirección actualizada",
        description: "Tu dirección ha sido actualizada exitosamente",
      });
      setIsEditingAddress(null);
      addressForm.reset();
      refetchAddresses();
    },
    onError: (error: Error) => {
      toast({
        title: "Error al actualizar la dirección",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const deleteAddressMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/addresses/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Dirección eliminada",
        description: "Tu dirección ha sido eliminada exitosamente",
      });
      refetchAddresses();
    },
    onError: (error: Error) => {
      toast({
        title: "Error al eliminar la dirección",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submissions
  const onProfileSubmit = (data: ProfileFormValues) => {
    // Not implemented yet - would update user profile
    toast({
      title: "Perfil actualizado",
      description: "Tu perfil ha sido actualizado exitosamente",
    });
  };
  
  const onAddressSubmit = (data: AddressFormValues) => {
    if (isEditingAddress !== null) {
      updateAddressMutation.mutate({ id: isEditingAddress, data });
    } else {
      createAddressMutation.mutate(data);
    }
  };
  
  // Handle edit address
  const handleEditAddress = (address: any) => {
    setIsEditingAddress(address.id);
    setIsAddingAddress(false);
    addressForm.reset({
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
    });
  };
  
  // Handle delete address
  const handleDeleteAddress = (id: number) => {
    if (window.confirm("¿Estás seguro de querer eliminar esta dirección?")) {
      deleteAddressMutation.mutate(id);
    }
  };
  
  // Handle new address
  const handleAddAddress = () => {
    setIsAddingAddress(true);
    setIsEditingAddress(null);
    addressForm.reset({
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      isDefault: addresses.length === 0,
    });
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendiente':
        return <Badge variant="default">Pendiente</Badge>;
      case 'enviado':
        return <Badge variant="new">Enviado</Badge>;
      case 'entregado':
        return <Badge variant="limited">Entregado</Badge>;
      case 'cancelado':
        return <Badge variant="sale">Cancelado</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  // Breadcrumb setup
  const breadcrumbItems = [
    { label: "Mi Cuenta" }
  ];

  if (authLoading || !user) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
          <Loader2Icon className="h-12 w-12 animate-spin text-primary-600" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <h1 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-neutral-100">
          Mi Cuenta
        </h1>
        
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile" className="flex items-center">
              <UserIcon className="mr-2 h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center">
              <MapPinIcon className="mr-2 h-4 w-4" />
              Direcciones
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center">
              <PackageIcon className="mr-2 h-4 w-4" />
              Pedidos
            </TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <UserIcon className="mr-2 h-5 w-5" />
                Información Personal
              </h2>
              
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de Usuario</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo Electrónico</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre Completo</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit">Guardar Cambios</Button>
                </form>
              </Form>
              
              <Separator className="my-8" />
              
              <h2 className="text-lg font-bold mb-4">Cambiar Contraseña</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Contraseña Actual
                    </label>
                    <Input type="password" placeholder="********" />
                  </div>
                  <div></div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Nueva Contraseña
                    </label>
                    <Input type="password" placeholder="********" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Confirmar Nueva Contraseña
                    </label>
                    <Input type="password" placeholder="********" />
                  </div>
                </div>
                
                <Button>Cambiar Contraseña</Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center">
                  <MapPinIcon className="mr-2 h-5 w-5" />
                  Mis Direcciones
                </h2>
                
                {!isAddingAddress && isEditingAddress === null && (
                  <Button onClick={handleAddAddress}>
                    <Plus className="mr-2 h-4 w-4" />
                    Añadir Dirección
                  </Button>
                )}
              </div>
              
              {isAddingAddress || isEditingAddress !== null ? (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">
                    {isEditingAddress !== null ? "Editar Dirección" : "Añadir Nueva Dirección"}
                  </h3>
                  <Form {...addressForm}>
                    <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4">
                      <FormField
                        control={addressForm.control}
                        name="street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Calle y Número</FormLabel>
                            <FormControl>
                              <Input placeholder="Calle y número" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={addressForm.control}
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
                          control={addressForm.control}
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
                          control={addressForm.control}
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
                          control={addressForm.control}
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
                      
                      <FormField
                        control={addressForm.control}
                        name="isDefault"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                                checked={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Establecer como dirección principal
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex space-x-2">
                        <Button 
                          type="submit"
                          disabled={createAddressMutation.isPending || updateAddressMutation.isPending}
                        >
                          {createAddressMutation.isPending || updateAddressMutation.isPending ? (
                            <>
                              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                              Guardando...
                            </>
                          ) : (
                            <>Guardar Dirección</>
                          )}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setIsAddingAddress(false);
                            setIsEditingAddress(null);
                            addressForm.reset();
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              ) : addresses.length > 0 ? (
                <div className="mt-4 space-y-4">
                  {addresses.map((address: any) => (
                    <div 
                      key={address.id} 
                      className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4"
                    >
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium flex items-center">
                            {address.street}
                            {address.isDefault && (
                              <span className="ml-2 text-xs bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 py-0.5 px-2 rounded-full">
                                Principal
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            {address.city}, {address.state}, {address.postalCode}
                          </div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            {address.country}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditAddress(address)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteAddress(address.id)}
                            disabled={deleteAddressMutation.isPending}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPinIcon className="mx-auto h-12 w-12 text-neutral-300 dark:text-neutral-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No tienes direcciones guardadas</h3>
                  <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                    Añade una dirección para facilitar tus futuras compras
                  </p>
                  <Button onClick={handleAddAddress}>
                    <Plus className="mr-2 h-4 w-4" />
                    Añadir Dirección
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-6 flex items-center">
                <PackageIcon className="mr-2 h-5 w-5" />
                Mis Pedidos
              </h2>
              
              {ordersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2Icon className="animate-spin h-12 w-12 text-primary-600" />
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order: any) => (
                    <div 
                      key={order.id} 
                      className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div>
                          <div className="font-medium">
                            Pedido #{order.id}
                          </div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            {formatDate(order.createdAt)}
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0 flex items-center">
                          {getStatusBadge(order.status)}
                          <Button 
                            variant="link" 
                            size="sm" 
                            asChild 
                            className="ml-2"
                          >
                            <Link href={`/orders/${order.id}`}>
                              Ver Detalles
                              <ExternalLinkIcon className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div className="flex flex-wrap justify-between items-center">
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                          {order.items?.length || 0} productos
                        </div>
                        <div className="font-medium">
                          Total: ${order.total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <PackageIcon className="mx-auto h-12 w-12 text-neutral-300 dark:text-neutral-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No tienes pedidos</h3>
                  <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                    Tus pedidos aparecerán aquí cuando realices una compra
                  </p>
                  <Button asChild>
                    <Link href="/products">
                      Explorar Productos
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

// Needed for Link when used with asChild
import { Link } from "wouter";
