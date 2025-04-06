# Ventables.com

Plataforma de comercio electrónico moderna y robusta, diseñada para proporcionar una experiencia de compra excepcional tanto para clientes como para administradores.

## Características Principales

### Para Clientes
- **Interfaz Intuitiva y Responsiva**: Diseño adaptable a cualquier dispositivo (móvil, tablet, escritorio) con una experiencia de usuario consistente y fluida.
- **Catálogo de Productos Completo**: Navegación por categorías, filtros avanzados y sistema de búsqueda para encontrar productos fácilmente.
- **Detalles de Producto Enriquecidos**: Imágenes de alta calidad, descripciones detalladas, especificaciones técnicas, variantes de producto y opiniones de otros clientes.
- **Carrito de Compras Optimizado**: Añadir, actualizar o eliminar productos con actualizaciones en tiempo real del subtotal y total.
- **Proceso de Checkout Simplificado**: Experiencia de pago intuitiva con opciones para guardar direcciones y preferencias para compras futuras.
- **Gestión de Cuenta de Usuario**: Registro e inicio de sesión fáciles, historial de pedidos, seguimiento de estado y gestión de direcciones.
- **Sistema de Valoraciones y Reseñas**: Posibilidad de dejar opiniones y valoraciones sobre productos adquiridos.

### Para Administradores
- **Panel de Administración Completo**: Control total sobre productos, categorías, pedidos y usuarios.
- **Gestión de Inventario**: Seguimiento de stock en tiempo real, alertas de bajo inventario y actualización sencilla de cantidades.
- **Catálogo Flexible**: Crear, editar y organizar productos en categorías, con soporte para variantes (tallas, colores, etc.).
- **Gestión de Pedidos**: Visualización clara de nuevos pedidos, actualización de estados y procesamiento eficiente.
- **Informes y Analíticas**: Datos sobre ventas, productos populares y comportamiento de usuarios.

## Tecnologías Utilizadas
- **Frontend**: React 18 con TypeScript, TanStack Query para gestión de estado, Wouter para enrutamiento ligero.
- **Componentes UI**: Shadcn UI, Tailwind CSS para diseño responsivo y personalización avanzada.
- **Backend**: Node.js con Express para API RESTful.
- **Base de datos**: PostgreSQL con Drizzle ORM para modelado de datos y consultas tipadas.
- **Autenticación**: Sistema seguro basado en sesiones con Passport.js.
- **Validación**: Zod para validación de esquemas en frontend y backend.

## Características de Seguridad
- Hashing seguro de contraseñas.
- Prevención de ataques CSRF y XSS.
- Validación estricta de datos de entrada.
- Manejo seguro de sesiones de usuario.
- Consultas parametrizadas para prevenir inyección SQL.

## Instalación y Uso
1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/ec2rdp290590/ventables-react.git

npm install

npm run dev

Estructura del Proyecto
/client: Código del frontend React.
/src/components: Componentes reutilizables.
/src/hooks: Hooks personalizados.
/src/pages: Páginas de la aplicación.
/src/context: Contextos de React para estado global.
/server: API backend Express.
/routes.ts: Definición de endpoints API.
/storage.ts: Interfaz de acceso a datos.
/auth.ts: Configuración de autenticación.
/shared: Código compartido entre frontend y backend.
/schema.ts: Modelos de datos y validación con Drizzle/Zod.

Licencia
Este proyecto está bajo la Licencia MIT.

Desarrollado por Jesús Montes.

