import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { ZodError } from "zod";
import { 
  insertProductSchema, 
  insertCategorySchema, 
  insertAddressSchema,
  insertCartItemSchema,
  insertOrderSchema,
  insertReviewSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure authentication routes
  setupAuth(app);

  // Error handling middleware
  const handleError = (err: any, res: any) => {
    console.error(err);
    if (err instanceof ZodError) {
      return res.status(400).json({ 
        message: "Datos inválidos", 
        errors: err.errors 
      });
    }
    return res.status(500).json({ message: err.message || "Error interno del servidor" });
  };

  // Categories API
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      const category = await storage.getCategoryById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Categoría no encontrada" });
      }
      res.json(category);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(403).json({ message: "Acceso denegado" });
      }
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Products API
  app.get("/api/products", async (req, res) => {
    try {
      const { 
        category, 
        search, 
        minPrice, 
        maxPrice, 
        sort, 
        page = "1", 
        limit = "12",
        featured
      } = req.query;
      
      const filters: any = {};
      
      if (category) filters.categoryId = parseInt(category as string);
      if (search) filters.search = search as string;
      if (minPrice) filters.minPrice = parseFloat(minPrice as string);
      if (maxPrice) filters.maxPrice = parseFloat(maxPrice as string);
      if (featured) filters.featured = featured === "true";
      
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;
      
      const [products, total] = await storage.getProducts(filters, {
        sort: sort as string,
        limit: limitNum,
        offset
      });
      
      res.json({
        products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      });
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      res.json(product);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(403).json({ message: "Acceso denegado" });
      }
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Addresses API
  app.get("/api/addresses", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "No autorizado" });
      }
      const addresses = await storage.getAddressesByUserId(req.user.id);
      res.json(addresses);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post("/api/addresses", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "No autorizado" });
      }
      const addressData = insertAddressSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const address = await storage.createAddress(addressData);
      res.status(201).json(address);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Cart API
  app.get("/api/cart", async (req, res) => {
    try {
      const sessionId = req.sessionID;
      const userId = req.isAuthenticated() ? req.user.id : null;
      
      // Get cart or create one if it doesn't exist
      const cart = await storage.getOrCreateCart(userId, sessionId);
      
      // Get cart items with product details
      const cartItems = await storage.getCartItems(cart.id);
      
      res.json({
        cart,
        items: cartItems
      });
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post("/api/cart/items", async (req, res) => {
    try {
      const sessionId = req.sessionID;
      const userId = req.isAuthenticated() ? req.user.id : null;
      
      // Get cart or create one if it doesn't exist
      const cart = await storage.getOrCreateCart(userId, sessionId);
      
      const cartItemData = insertCartItemSchema.parse({
        ...req.body,
        cartId: cart.id
      });
      
      const cartItem = await storage.addCartItem(cartItemData);
      res.status(201).json(cartItem);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.put("/api/cart/items/:id", async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const { quantity } = req.body;
      
      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ message: "Cantidad inválida" });
      }
      
      const updatedItem = await storage.updateCartItemQuantity(itemId, quantity);
      res.json(updatedItem);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.delete("/api/cart/items/:id", async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      await storage.removeCartItem(itemId);
      res.status(204).send();
    } catch (err) {
      handleError(err, res);
    }
  });

  // Orders API
  app.get("/api/orders", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "No autorizado" });
      }
      const orders = await storage.getOrdersByUserId(req.user.id);
      res.json(orders);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "No autorizado" });
      }
      
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrderById(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Pedido no encontrado" });
      }
      
      // Check if order belongs to the authenticated user
      if (order.userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "Acceso denegado" });
      }
      
      // Get order items
      const orderItems = await storage.getOrderItems(orderId);
      
      res.json({
        order,
        items: orderItems
      });
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "No autorizado" });
      }
      
      const orderData = insertOrderSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      // Check if cart exists and has items
      const sessionId = req.sessionID;
      const cart = await storage.getOrCreateCart(req.user.id, sessionId);
      const cartItems = await storage.getCartItems(cart.id);
      
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "El carrito está vacío" });
      }
      
      // Create order and move items from cart to order
      const order = await storage.createOrderFromCart(orderData, cart.id);
      
      res.status(201).json(order);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Reviews API
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const reviews = await storage.getProductReviews(productId);
      res.json(reviews);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post("/api/products/:id/reviews", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "No autorizado" });
      }
      
      const productId = parseInt(req.params.id);
      
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        userId: req.user.id,
        productId
      });
      
      // Check if user already reviewed this product
      const existingReview = await storage.getUserProductReview(req.user.id, productId);
      
      if (existingReview) {
        return res.status(400).json({ message: "Ya has revisado este producto" });
      }
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Create and return the HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
