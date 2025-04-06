import { 
  TruckIcon, 
  ShieldCheckIcon, 
  CreditCardIcon, 
  HeadphonesIcon 
} from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="bg-neutral-50 dark:bg-neutral-850 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-10 text-center text-neutral-800 dark:text-neutral-100">
          ¿Por qué elegir Ventables?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm text-center">
            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 mb-4">
              <TruckIcon className="h-8 w-8" />
            </div>
            <h3 className="font-medium text-lg mb-2 text-neutral-800 dark:text-neutral-100">
              Envío Rápido
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Entrega en 24-48 horas en la mayoría de áreas urbanas. Seguimiento en tiempo real.
            </p>
          </div>
          
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm text-center">
            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 mb-4">
              <ShieldCheckIcon className="h-8 w-8" />
            </div>
            <h3 className="font-medium text-lg mb-2 text-neutral-800 dark:text-neutral-100">
              Garantía Extendida
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Todos nuestros productos incluyen garantía extendida por 2 años sin costo adicional.
            </p>
          </div>
          
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm text-center">
            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 mb-4">
              <CreditCardIcon className="h-8 w-8" />
            </div>
            <h3 className="font-medium text-lg mb-2 text-neutral-800 dark:text-neutral-100">
              Pago Seguro
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Múltiples métodos de pago con cifrado de última generación para proteger tus datos.
            </p>
          </div>
          
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm text-center">
            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 mb-4">
              <HeadphonesIcon className="h-8 w-8" />
            </div>
            <h3 className="font-medium text-lg mb-2 text-neutral-800 dark:text-neutral-100">
              Soporte 24/7
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Asistencia personalizada disponible todos los días del año por chat, teléfono o email.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
