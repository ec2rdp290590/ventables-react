import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, json, foreignKey, unique, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// USUARIOS tabla
export const users = pgTable("usuarios", {
  id: serial("usuario_id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("nombre_completo"),
  phone: text("telefono"),
  isAdmin: boolean("es_admin").default(false),
  createdAt: timestamp("fecha_creacion").defaultNow(),
});

// DIRECCIONES tabla
export const addresses = pgTable("direcciones", {
  id: serial("direccion_id").primaryKey(),
  userId: integer("usuario_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  street: text("calle").notNull(),
  city: text("ciudad").notNull(),
  state: text("estado").notNull(),
  postalCode: text("codigo_postal").notNull(),
  country: text("pais").notNull(),
  isDefault: boolean("es_principal").default(false),
});

// CATEGORIAS tabla
export const categories = pgTable("categorias", {
  id: serial("categoria_id").primaryKey(),
  name: text("nombre").notNull(),
  description: text("descripcion"),
  parentId: integer("categoria_padre_id"),
  image: text("imagen_url"),
});

// PRODUCTOS tabla
export const products = pgTable("productos", {
  id: serial("producto_id").primaryKey(),
  name: text("nombre").notNull(),
  description: text("descripcion"),
  price: doublePrecision("precio").notNull(),
  discount: doublePrecision("descuento").default(0),
  stock: integer("stock").notNull(),
  sku: text("sku").notNull().unique(),
  categoryId: integer("categoria_id").references(() => categories.id),
  image: text("imagen_url"),
  featured: boolean("destacado").default(false),
  createdAt: timestamp("fecha_creacion").defaultNow(),
});

// VARIANTES_PRODUCTO tabla
export const productVariants = pgTable("variantes_producto", {
  id: serial("variante_id").primaryKey(),
  productId: integer("producto_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  name: text("nombre").notNull(),
  value: text("valor").notNull(),
  priceModifier: doublePrecision("modificador_precio").default(0),
  stockModifier: integer("modificador_stock").default(0),
});

// CARRITOS tabla
export const carts = pgTable("carritos", {
  id: serial("carrito_id").primaryKey(),
  userId: integer("usuario_id").references(() => users.id, { onDelete: "cascade" }),
  sessionId: text("session_id"),
  createdAt: timestamp("fecha_creacion").defaultNow(),
  updatedAt: timestamp("fecha_actualizacion").defaultNow(),
});

// ITEMS_CARRITO tabla
export const cartItems = pgTable("items_carrito", {
  id: serial("item_id").primaryKey(),
  cartId: integer("carrito_id").notNull().references(() => carts.id, { onDelete: "cascade" }),
  productId: integer("producto_id").notNull().references(() => products.id),
  quantity: integer("cantidad").notNull().default(1),
  variantId: integer("variante_id").references(() => productVariants.id),
});

// PEDIDOS tabla
export const orders = pgTable("pedidos", {
  id: serial("pedido_id").primaryKey(),
  userId: integer("usuario_id").notNull().references(() => users.id),
  addressId: integer("direccion_id").references(() => addresses.id),
  total: doublePrecision("total").notNull(),
  status: text("estado").notNull().default("pendiente"),
  paymentMethod: text("metodo_pago"),
  shippingMethod: text("metodo_envio"),
  trackingNumber: text("numero_seguimiento"),
  createdAt: timestamp("fecha_creacion").defaultNow(),
  updatedAt: timestamp("fecha_actualizacion").defaultNow(),
});

// ITEMS_PEDIDO tabla
export const orderItems = pgTable("items_pedido", {
  id: serial("item_id").primaryKey(),
  orderId: integer("pedido_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("producto_id").notNull().references(() => products.id),
  quantity: integer("cantidad").notNull(),
  price: doublePrecision("precio").notNull(),
  variantId: integer("variante_id").references(() => productVariants.id),
});

// REVIEWS tabla
export const reviews = pgTable("reviews", {
  id: serial("review_id").primaryKey(),
  userId: integer("usuario_id").notNull().references(() => users.id),
  productId: integer("producto_id").notNull().references(() => products.id),
  rating: integer("calificacion").notNull(),
  comment: text("comentario"),
  createdAt: timestamp("fecha_creacion").defaultNow(),
});

// Exportar esquemas de inserción
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  isAdmin: true,
});

export const insertAddressSchema = createInsertSchema(addresses).omit({
  id: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertProductVariantSchema = createInsertSchema(productVariants).omit({
  id: true,
});

export const insertCartSchema = createInsertSchema(carts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// Exportar tipos
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Address = typeof addresses.$inferSelect;
export type InsertAddress = z.infer<typeof insertAddressSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type ProductVariant = typeof productVariants.$inferSelect;
export type InsertProductVariant = z.infer<typeof insertProductVariantSchema>;

export type Cart = typeof carts.$inferSelect;
export type InsertCart = z.infer<typeof insertCartSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

// Login type
export type LoginCredentials = Pick<InsertUser, "username" | "password">;
