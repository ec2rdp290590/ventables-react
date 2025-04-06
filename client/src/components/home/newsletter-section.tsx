import { useState } from "react";
import { MailIcon, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Correo electrónico inválido",
        description: "Por favor ingresa un correo electrónico válido",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate subscription process
    setIsSubmitting(true);
    
    // Just simulate a network request
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      toast({
        title: "¡Suscripción exitosa!",
        description: "Recibirás nuestras novedades y ofertas exclusivas en tu correo",
      });
    }, 1000);
  };

  return (
    <section className="bg-primary-600 dark:bg-primary-800 py-12 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-3">Mantente al día con nuestras novedades</h2>
        <p className="max-w-xl mx-auto mb-6 opacity-90">
          Suscríbete para recibir información sobre nuevos productos, ofertas exclusivas y contenido personalizado.
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
          <div className="relative flex-grow">
            <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-500 h-5 w-5" />
            <Input
              type="email"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-[46px] bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="bg-white text-primary-600 hover:bg-neutral-100 font-medium h-[46px] px-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <SendIcon className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Suscribirse"
            )}
          </Button>
        </form>
        
        <p className="text-sm mt-4 opacity-80">
          Al suscribirte, aceptas nuestra política de privacidad y comunicaciones.
        </p>
      </div>
    </section>
  );
}
