import { useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ShoppingCartIcon, UserIcon, MailIcon, LockIcon } from "lucide-react";

// Extend the user schema with validation rules
const loginSchema = z.object({
  username: z.string().min(1, "El nombre de usuario es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

const registerSchema = insertUserSchema
  .extend({
    confirmPassword: z.string().min(8, "La confirmación de contraseña es requerida"),
    email: z.string().email("Correo electrónico inválido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phone: "",
    },
  });

  // Form submission handlers
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    // Remove confirmPassword as it's not in the API schema
    const { confirmPassword, ...userData } = data;
    registerMutation.mutate(userData);
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden w-full max-w-5xl flex flex-col md:flex-row">
          {/* Form Column */}
          <div className="md:w-1/2 p-8">
            <div className="mb-6 text-center md:text-left">
              <h1 className="text-2xl font-bold flex items-center justify-center md:justify-start text-primary-600 dark:text-primary-400 mb-2">
                <ShoppingCartIcon className="mr-2" />
                Ventables
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Accede a tu cuenta o regístrate para comenzar a comprar
              </p>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>
              
              {/* Login Form */}
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de Usuario</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <UserIcon className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                              <Input 
                                placeholder="usuario" 
                                className="pl-10" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <LockIcon className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                              <Input 
                                type="password" 
                                placeholder="********" 
                                className="pl-10" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              {/* Register Form */}
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de Usuario</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <UserIcon className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                              <Input 
                                placeholder="usuario" 
                                className="pl-10" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo Electrónico</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MailIcon className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                              <Input 
                                type="email" 
                                placeholder="ejemplo@correo.com" 
                                className="pl-10" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre Completo</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Juan Pérez" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teléfono</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="+123456789" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <LockIcon className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                              <Input 
                                type="password" 
                                placeholder="********" 
                                className="pl-10" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar Contraseña</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <LockIcon className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                              <Input 
                                type="password" 
                                placeholder="********" 
                                className="pl-10" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Registrando..." : "Registrarse"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Hero Column */}
          <div className="md:w-1/2 bg-gradient-to-br from-primary-700 to-primary-900 text-white p-8 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">Bienvenido a Ventables</h2>
            <p className="mb-6">
              Tu destino para encontrar los mejores productos con atención personalizada y envíos rápidos.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span>Compra segura con métodos de pago protegidos</span>
              </li>
              <li className="flex items-start">
                <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span>Envíos rápidos a todo el país en 24-48 horas</span>
              </li>
              <li className="flex items-start">
                <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span>Atención al cliente 24/7 para todas tus consultas</span>
              </li>
              <li className="flex items-start">
                <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span>Garantía de satisfacción o devolución del dinero</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
