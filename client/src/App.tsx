import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ProductPage from "@/pages/product-page";
import ProductDetailsPage from "@/pages/product-details-page";
import CartPage from "@/pages/cart-page";
import CheckoutPage from "@/pages/checkout-page";
import AccountPage from "@/pages/account-page";
import OrderDetailsPage from "@/pages/order-details-page";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/products" component={ProductPage} />
      <Route path="/products/:id" component={ProductDetailsPage} />
      <Route path="/cart" component={CartPage} />
      <ProtectedRoute path="/checkout" component={CheckoutPage} />
      <ProtectedRoute path="/account" component={AccountPage} />
      <ProtectedRoute path="/orders/:id" component={OrderDetailsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
