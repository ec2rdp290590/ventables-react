import { 
  users, 
  addresses, 
  categories, 
  products, 
  productVariants, 
  carts, 
  cartItems, 
  orders, 
  orderItems, 
  reviews, 
  type User, 
  type InsertUser, 
  type Address, 
  type InsertAddress,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type ProductVariant,
  type InsertProductVariant,
  type Cart,
  type InsertCart,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Review,
  type InsertReview
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Auth & Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Addresses
  getAddressById(id: number): Promise<Address | undefined>;
  getAddressesByUserId(userId: number): Promise<Address[]>;
  createAddress(address: InsertAddress): Promise<Address>;
  updateAddress(id: number, address: Partial<InsertAddress>): Promise<Address>;
  deleteAddress(id: number): Promise<void>;
  
  // Categories
  getCategoryById(id: number): Promise<Category | undefined>;
  getAllCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Products
  getProductById(id: number): Promise<Product | undefined>;
  getProducts(filters: any, options: any): Promise<[Product[], number]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  
  // Product Variants
  getProductVariantById(id: number): Promise<ProductVariant | undefined>;
  getProductVariantsByProductId(productId: number): Promise<ProductVariant[]>;
  createProductVariant(variant: InsertProductVariant): Promise<ProductVariant>;
  
  // Carts
  getCartById(id: number): Promise<Cart | undefined>;
  getCartByUserId(userId: number): Promise<Cart | undefined>;
  getCartBySessionId(sessionId: string): Promise<Cart | undefined>;
  getOrCreateCart(userId: number | null, sessionId: string): Promise<Cart>;
  createCart(cart: InsertCart): Promise<Cart>;
  
  // Cart Items
  getCartItems(cartId: number): Promise<CartItem[]>;
  addCartItem(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem>;
  removeCartItem(id: number): Promise<void>;
  clearCart(cartId: number): Promise<void>;
  
  // Orders
  getOrderById(id: number): Promise<Order | undefined>;
  getOrdersByUserId(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  createOrderFromCart(order: InsertOrder, cartId: number): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order>;
  
  // Order Items
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  addOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  
  // Reviews
  getProductReviews(productId: number): Promise<Review[]>;
  getUserProductReview(userId: number, productId: number): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Session store for auth
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private addressesMap: Map<number, Address>;
  private categoriesMap: Map<number, Category>;
  private productsMap: Map<number, Product>;
  private productVariantsMap: Map<number, ProductVariant>;
  private cartsMap: Map<number, Cart>;
  private cartItemsMap: Map<number, CartItem>;
  private ordersMap: Map<number, Order>;
  private orderItemsMap: Map<number, OrderItem>;
  private reviewsMap: Map<number, Review>;
  
  sessionStore: session.SessionStore;
  
  private userIdCounter: number = 1;
  private addressIdCounter: number = 1;
  private categoryIdCounter: number = 1;
  private productIdCounter: number = 1;
  private variantIdCounter: number = 1;
  private cartIdCounter: number = 1;
  private cartItemIdCounter: number = 1;
  private orderIdCounter: number = 1;
  private orderItemIdCounter: number = 1;
  private reviewIdCounter: number = 1;

  constructor() {
    this.usersMap = new Map();
    this.addressesMap = new Map();
    this.categoriesMap = new Map();
    this.productsMap = new Map();
    this.productVariantsMap = new Map();
    this.cartsMap = new Map();
    this.cartItemsMap = new Map();
    this.ordersMap = new Map();
    this.orderItemsMap = new Map();
    this.reviewsMap = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
    
    // Initialize with some sample data
    this.initSampleData();
  }
  
  private initSampleData() {
    // Add sample categories
    const electronics = this.createCategory({ 
      name: "Electrónica", 
      description: "Productos electrónicos y tecnológicos", 
      image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3" 
    });
    
    const furniture = this.createCategory({ 
      name: "Muebles", 
      description: "Mobiliario para el hogar y oficina", 
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3" 
    });
    
    const clothing = this.createCategory({ 
      name: "Ropa", 
      description: "Prendas de vestir y accesorios", 
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3" 
    });
    
    // Add sample products
    this.createProduct({
      name: "Laptop Ultradelgada Premium 2023",
      description: "Potente laptop con procesador de última generación y pantalla de alta resolución",
      price: 899.99,
      discount: 150,
      stock: 25,
      sku: "LAPTOP-2023",
      categoryId: electronics.id,
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3",
      featured: true
    });
    
    this.createProduct({
      name: "Audífonos Inalámbricos Pro",
      description: "Auriculares con cancelación de ruido y gran calidad de sonido",
      price: 149.99,
      discount: 0,
      stock: 50,
      sku: "AUDIO-PRO-1",
      categoryId: electronics.id,
      image: "https://images.unsplash.com/photo-1585104365269-ab7e0e5dba9d?ixlib=rb-4.0.3",
      featured: true
    });
    
    this.createProduct({
      name: "Silla Ergonómica Premium",
      description: "Silla de oficina con soporte lumbar y ajustes personalizables",
      price: 249.99,
      discount: 50,
      stock: 15,
      sku: "CHAIR-ERGO-1",
      categoryId: furniture.id,
      image: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3",
      featured: true
    });
    
    this.createProduct({
      name: "Camiseta de Algodón Premium",
      description: "Camiseta de algodón pima de alta calidad y diseño exclusivo",
      price: 29.99,
      discount: 0,
      stock: 100,
      sku: "SHIRT-PM-1",
      categoryId: clothing.id,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3",
      featured: false
    });
  }

  // AUTH & USERS
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      isAdmin: false, 
      createdAt: now 
    };
    this.usersMap.set(id, user);
    return user;
  }

  // ADDRESSES
  async getAddressById(id: number): Promise<Address | undefined> {
    return this.addressesMap.get(id);
  }
  
  async getAddressesByUserId(userId: number): Promise<Address[]> {
    return Array.from(this.addressesMap.values()).filter(
      (address) => address.userId === userId
    );
  }
  
  async createAddress(address: InsertAddress): Promise<Address> {
    const id = this.addressIdCounter++;
    const newAddress: Address = { ...address, id };
    this.addressesMap.set(id, newAddress);
    
    // If this is the first address or marked as default, ensure it's the only default
    if (address.isDefault) {
      for (const [addressId, existingAddress] of this.addressesMap.entries()) {
        if (existingAddress.userId === address.userId && existingAddress.id !== id) {
          this.addressesMap.set(addressId, { ...existingAddress, isDefault: false });
        }
      }
    }
    
    return newAddress;
  }
  
  async updateAddress(id: number, address: Partial<InsertAddress>): Promise<Address> {
    const existingAddress = this.addressesMap.get(id);
    if (!existingAddress) {
      throw new Error("Dirección no encontrada");
    }
    
    const updatedAddress: Address = { ...existingAddress, ...address };
    this.addressesMap.set(id, updatedAddress);
    
    // If marked as default, update other addresses for this user
    if (address.isDefault) {
      for (const [addressId, addr] of this.addressesMap.entries()) {
        if (addr.userId === existingAddress.userId && addr.id !== id) {
          this.addressesMap.set(addressId, { ...addr, isDefault: false });
        }
      }
    }
    
    return updatedAddress;
  }
  
  async deleteAddress(id: number): Promise<void> {
    const address = this.addressesMap.get(id);
    if (!address) {
      throw new Error("Dirección no encontrada");
    }
    
    this.addressesMap.delete(id);
    
    // If this was the default address, make another one default if possible
    if (address.isDefault) {
      const userAddresses = Array.from(this.addressesMap.values())
        .filter(addr => addr.userId === address.userId);
      
      if (userAddresses.length > 0) {
        this.addressesMap.set(userAddresses[0].id, {
          ...userAddresses[0],
          isDefault: true
        });
      }
    }
  }

  // CATEGORIES
  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categoriesMap.get(id);
  }
  
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categoriesMap.values());
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const newCategory: Category = { ...category, id };
    this.categoriesMap.set(id, newCategory);
    return newCategory;
  }

  // PRODUCTS
  async getProductById(id: number): Promise<Product | undefined> {
    return this.productsMap.get(id);
  }
  
  async getProducts(filters: any = {}, options: any = {}): Promise<[Product[], number]> {
    let products = Array.from(this.productsMap.values());
    
    // Apply filters
    if (filters.categoryId) {
      products = products.filter(p => p.categoryId === filters.categoryId);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      products = products.filter(
        p => p.name.toLowerCase().includes(searchTerm) || 
             (p.description && p.description.toLowerCase().includes(searchTerm))
      );
    }
    
    if (filters.minPrice !== undefined) {
      products = products.filter(p => p.price >= filters.minPrice);
    }
    
    if (filters.maxPrice !== undefined) {
      products = products.filter(p => p.price <= filters.maxPrice);
    }
    
    if (filters.featured !== undefined) {
      products = products.filter(p => p.featured === filters.featured);
    }
    
    // Count total before pagination
    const total = products.length;
    
    // Apply sorting
    if (options.sort) {
      switch (options.sort) {
        case 'price_asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        // Add more sorting options as needed
      }
    }
    
    // Apply pagination
    if (options.offset !== undefined && options.limit) {
      products = products.slice(options.offset, options.offset + options.limit);
    }
    
    return [products, total];
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const now = new Date();
    const newProduct: Product = { ...product, id, createdAt: now };
    this.productsMap.set(id, newProduct);
    return newProduct;
  }
  
  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> {
    const existingProduct = this.productsMap.get(id);
    if (!existingProduct) {
      throw new Error("Producto no encontrado");
    }
    
    const updatedProduct: Product = { ...existingProduct, ...product };
    this.productsMap.set(id, updatedProduct);
    return updatedProduct;
  }

  // PRODUCT VARIANTS
  async getProductVariantById(id: number): Promise<ProductVariant | undefined> {
    return this.productVariantsMap.get(id);
  }
  
  async getProductVariantsByProductId(productId: number): Promise<ProductVariant[]> {
    return Array.from(this.productVariantsMap.values()).filter(
      (variant) => variant.productId === productId
    );
  }
  
  async createProductVariant(variant: InsertProductVariant): Promise<ProductVariant> {
    // Check for duplicate variant
    const existingVariants = await this.getProductVariantsByProductId(variant.productId);
    const duplicate = existingVariants.find(
      v => v.name === variant.name && v.value === variant.value
    );
    
    if (duplicate) {
      throw new Error("Ya existe una variante con ese nombre y valor para este producto");
    }
    
    const id = this.variantIdCounter++;
    const newVariant: ProductVariant = { ...variant, id };
    this.productVariantsMap.set(id, newVariant);
    return newVariant;
  }

  // CARTS
  async getCartById(id: number): Promise<Cart | undefined> {
    return this.cartsMap.get(id);
  }
  
  async getCartByUserId(userId: number): Promise<Cart | undefined> {
    return Array.from(this.cartsMap.values()).find(
      (cart) => cart.userId === userId
    );
  }
  
  async getCartBySessionId(sessionId: string): Promise<Cart | undefined> {
    return Array.from(this.cartsMap.values()).find(
      (cart) => cart.sessionId === sessionId
    );
  }
  
  async getOrCreateCart(userId: number | null, sessionId: string): Promise<Cart> {
    // First try to find an existing cart
    let cart: Cart | undefined;
    
    if (userId) {
      cart = await this.getCartByUserId(userId);
    }
    
    if (!cart && sessionId) {
      cart = await this.getCartBySessionId(sessionId);
    }
    
    // If no cart exists, create a new one
    if (!cart) {
      cart = await this.createCart({
        userId: userId || undefined,
        sessionId
      });
    } else if (userId && !cart.userId) {
      // If user logged in and we found a session cart, associate it with the user
      cart = {
        ...cart,
        userId,
        updatedAt: new Date()
      };
      this.cartsMap.set(cart.id, cart);
    }
    
    return cart;
  }
  
  async createCart(cart: InsertCart): Promise<Cart> {
    const id = this.cartIdCounter++;
    const now = new Date();
    const newCart: Cart = { 
      ...cart, 
      id, 
      createdAt: now,
      updatedAt: now 
    };
    this.cartsMap.set(id, newCart);
    return newCart;
  }

  // CART ITEMS
  async getCartItems(cartId: number): Promise<CartItem[]> {
    return Array.from(this.cartItemsMap.values())
      .filter(item => item.cartId === cartId)
      .map(item => {
        // Enrich cart item with product data
        const product = this.productsMap.get(item.productId);
        const variant = item.variantId ? this.productVariantsMap.get(item.variantId) : undefined;
        
        return {
          ...item,
          product: product,
          variant: variant
        } as any;
      });
  }
  
  async addCartItem(item: InsertCartItem): Promise<CartItem> {
    // Check if product exists
    const product = this.productsMap.get(item.productId);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    
    // Check if variant exists if provided
    if (item.variantId) {
      const variant = this.productVariantsMap.get(item.variantId);
      if (!variant || variant.productId !== item.productId) {
        throw new Error("Variante no válida para este producto");
      }
    }
    
    // Check if item already exists in cart
    const existingItems = Array.from(this.cartItemsMap.values())
      .filter(cartItem => 
        cartItem.cartId === item.cartId && 
        cartItem.productId === item.productId &&
        cartItem.variantId === item.variantId
      );
    
    if (existingItems.length > 0) {
      // Update quantity instead of creating a new item
      const existingItem = existingItems[0];
      return this.updateCartItemQuantity(
        existingItem.id, 
        existingItem.quantity + (item.quantity || 1)
      );
    }
    
    // Create new cart item
    const id = this.cartItemIdCounter++;
    const newCartItem: CartItem = { 
      ...item, 
      id,
      quantity: item.quantity || 1
    };
    this.cartItemsMap.set(id, newCartItem);
    
    // Update cart updatedAt timestamp
    const cart = this.cartsMap.get(item.cartId);
    if (cart) {
      this.cartsMap.set(item.cartId, {
        ...cart,
        updatedAt: new Date()
      });
    }
    
    return newCartItem;
  }
  
  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem> {
    const cartItem = this.cartItemsMap.get(id);
    if (!cartItem) {
      throw new Error("Ítem de carrito no encontrado");
    }
    
    if (quantity < 1) {
      throw new Error("La cantidad debe ser al menos 1");
    }
    
    const updatedCartItem: CartItem = { ...cartItem, quantity };
    this.cartItemsMap.set(id, updatedCartItem);
    
    // Update cart updatedAt timestamp
    const cart = this.cartsMap.get(cartItem.cartId);
    if (cart) {
      this.cartsMap.set(cartItem.cartId, {
        ...cart,
        updatedAt: new Date()
      });
    }
    
    return updatedCartItem;
  }
  
  async removeCartItem(id: number): Promise<void> {
    const cartItem = this.cartItemsMap.get(id);
    if (!cartItem) {
      throw new Error("Ítem de carrito no encontrado");
    }
    
    this.cartItemsMap.delete(id);
    
    // Update cart updatedAt timestamp
    const cart = this.cartsMap.get(cartItem.cartId);
    if (cart) {
      this.cartsMap.set(cartItem.cartId, {
        ...cart,
        updatedAt: new Date()
      });
    }
  }
  
  async clearCart(cartId: number): Promise<void> {
    // Delete all items for this cart
    for (const [id, item] of this.cartItemsMap.entries()) {
      if (item.cartId === cartId) {
        this.cartItemsMap.delete(id);
      }
    }
    
    // Update cart updatedAt timestamp
    const cart = this.cartsMap.get(cartId);
    if (cart) {
      this.cartsMap.set(cartId, {
        ...cart,
        updatedAt: new Date()
      });
    }
  }

  // ORDERS
  async getOrderById(id: number): Promise<Order | undefined> {
    return this.ordersMap.get(id);
  }
  
  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return Array.from(this.ordersMap.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderIdCounter++;
    const now = new Date();
    const newOrder: Order = { 
      ...order, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.ordersMap.set(id, newOrder);
    return newOrder;
  }
  
  async createOrderFromCart(order: InsertOrder, cartId: number): Promise<Order> {
    // Get cart items
    const cartItems = await this.getCartItems(cartId);
    if (cartItems.length === 0) {
      throw new Error("No hay ítems en el carrito");
    }
    
    // Create order
    const newOrder = await this.createOrder(order);
    
    // Create order items from cart items
    for (const cartItem of cartItems) {
      const product = this.productsMap.get(cartItem.productId);
      if (!product) continue;
      
      // Calculate price considering product discount
      const itemPrice = product.discount 
        ? product.price - product.discount 
        : product.price;
      
      // If there's a variant, apply price modifier
      let finalPrice = itemPrice;
      if (cartItem.variantId) {
        const variant = this.productVariantsMap.get(cartItem.variantId);
        if (variant) {
          finalPrice += variant.priceModifier;
        }
      }
      
      await this.addOrderItem({
        orderId: newOrder.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        price: finalPrice,
        variantId: cartItem.variantId
      });
      
      // Update product stock
      if (product) {
        const updatedStock = Math.max(0, product.stock - cartItem.quantity);
        await this.updateProduct(product.id, { stock: updatedStock });
      }
    }
    
    // Clear cart
    await this.clearCart(cartId);
    
    return newOrder;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const order = this.ordersMap.get(id);
    if (!order) {
      throw new Error("Pedido no encontrado");
    }
    
    const updatedOrder: Order = { 
      ...order, 
      status,
      updatedAt: new Date()
    };
    this.ordersMap.set(id, updatedOrder);
    return updatedOrder;
  }

  // ORDER ITEMS
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItemsMap.values())
      .filter(item => item.orderId === orderId)
      .map(item => {
        // Enrich order item with product data
        const product = this.productsMap.get(item.productId);
        const variant = item.variantId ? this.productVariantsMap.get(item.variantId) : undefined;
        
        return {
          ...item,
          product: product,
          variant: variant
        } as any;
      });
  }
  
  async addOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemIdCounter++;
    const newOrderItem: OrderItem = { ...item, id };
    this.orderItemsMap.set(id, newOrderItem);
    return newOrderItem;
  }

  // REVIEWS
  async getProductReviews(productId: number): Promise<Review[]> {
    return Array.from(this.reviewsMap.values())
      .filter(review => review.productId === productId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(review => {
        // Enrich review with user data
        const user = this.usersMap.get(review.userId);
        return {
          ...review,
          username: user?.username,
          userFullName: user?.fullName
        } as any;
      });
  }
  
  async getUserProductReview(userId: number, productId: number): Promise<Review | undefined> {
    return Array.from(this.reviewsMap.values())
      .find(review => review.userId === userId && review.productId === productId);
  }
  
  async createReview(review: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const now = new Date();
    const newReview: Review = { ...review, id, createdAt: now };
    this.reviewsMap.set(id, newReview);
    return newReview;
  }
}

export const storage = new MemStorage();
