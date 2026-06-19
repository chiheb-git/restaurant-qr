import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import DishDetail from "@/pages/DishDetail";
import ARViewer from "@/pages/ARViewer";
import About from "@/pages/About";
import ARList from "@/pages/ARList";
import Cart from "@/pages/Cart";
import CartSuccess from "@/pages/CartSuccess";
import { CartProvider } from "@/context/CartContext";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/">
        <Layout><Home /></Layout>
      </Route>
      <Route path="/dish/:id">
        <Layout><DishDetail /></Layout>
      </Route>
      <Route path="/ar">
        <Layout><ARList /></Layout>
      </Route>
      <Route path="/ar/:id" component={ARViewer} />
      <Route path="/about">
        <Layout><About /></Layout>
      </Route>
      <Route path="/cart">
        <Layout><Cart /></Layout>
      </Route>
      <Route path="/cart/success">
        <Layout><CartSuccess /></Layout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
