import { Link } from "wouter";
import { 
  ShoppingCartIcon, 
  FacebookIcon, 
  InstagramIcon, 
  TwitterIcon, 
  YoutubeIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ClockIcon
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="text-2xl font-bold text-white mb-4">
              <span className="flex items-center">
                <ShoppingCartIcon className="mr-2" />
                Ventables
              </span>
            </div>
            <p className="mb-4">
              Ventables es tu destino de confianza para encontrar productos de calidad 
              a precios competitivos, con envío rápido y atención al cliente personalizada.
            </p>
            <div className="flex space-x-4 mt-6">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-primary-600 flex items-center justify-center transition-colors" 
                aria-label="Facebook"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-primary-600 flex items-center justify-center transition-colors" 
                aria-label="Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-primary-600 flex items-center justify-center transition-colors" 
                aria-label="Twitter"
              >
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-primary-600 flex items-center justify-center transition-colors" 
                aria-label="YouTube"
              >
                <YoutubeIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Información</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Sobre nosotros</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Términos y condiciones</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Política de privacidad</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Cuenta</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/account" className="hover:text-primary-400 transition-colors">
                  Mi cuenta
                </Link>
              </li>
              <li>
                <Link href="/account?tab=orders" className="hover:text-primary-400 transition-colors">
                  Historial de pedidos
                </Link>
              </li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Lista de deseos</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Devoluciones</a></li>
              <li>
                <Link href="/account?tab=addresses" className="hover:text-primary-400 transition-colors">
                  Mis direcciones
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPinIcon className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                <span>Av. Tecnológica 123, Distrito Innovación, Ciudad Nexus</span>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>(+123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <MailIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>soporte@ventables.com</span>
              </li>
              <li className="flex items-center">
                <ClockIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>Lunes a Viernes: 9am - 6pm</span>
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="border-neutral-800 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">© {new Date().getFullYear()} Ventables. Todos los derechos reservados.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {/* Payment methods icons */}
            <div className="h-8 w-14 bg-neutral-800 rounded flex items-center justify-center text-xs">VISA</div>
            <div className="h-8 w-14 bg-neutral-800 rounded flex items-center justify-center text-xs">MC</div>
            <div className="h-8 w-14 bg-neutral-800 rounded flex items-center justify-center text-xs">AMEX</div>
            <div className="h-8 w-14 bg-neutral-800 rounded flex items-center justify-center text-xs">PAYPAL</div>
            <div className="h-8 w-14 bg-neutral-800 rounded flex items-center justify-center text-xs">APPLE</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
