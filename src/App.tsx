import { useCallback, useEffect, useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Layout } from "@/components/layout";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import Accounts from "@/pages/accounts";
import Movements from "@/pages/movements";
import Incomes from "@/pages/incomes";
import Expenses from "@/pages/expenses";
import Transfers from "@/pages/transfers";
import CreditCards from "@/pages/credit-cards";
import Commitments from "@/pages/commitments";
import Loans from "@/pages/loans";
import Reports from "@/pages/reports";
import ConfigBanks from "@/pages/config/banks";
import ConfigCategories from "@/pages/config/categories";
import ConfigBeneficiaries from "@/pages/config/beneficiaries";
import ConfigPayers from "@/pages/config/payers";
import ConfigUsers from "@/pages/config/users";
import ConfigPaymentMethods from "@/pages/config/payment-methods";
import Login from "@/pages/login";
import Wizard from "@/pages/wizard";
import { store, initStore } from "@/lib/store";

function useHashLocation(): [string, (to: string, options?: { replace?: boolean }) => void] {
  const getHash = () => window.location.hash.replace(/^#/, "") || "/";
  const [loc, setLoc] = useState(getHash);
  useEffect(() => {
    const handler = () => setLoc(getHash());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    if (options?.replace) window.location.replace("#" + to);
    else window.location.hash = to;
  }, []);
  return [loc, navigate];
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 0, gcTime: 0 } },
});

export default function App() {
  const [authState, setAuthState] = useState<"loading" | "logged-out" | "wizard" | "ready">("loading");

  useEffect(() => {
    initStore();
    const user = store.getCurrentUser();
    if (!user) { setAuthState("logged-out"); return; }
    
    // ✅ REGLA: Master-Admin NUNCA ve el Wizard
    if (user.role === "admin") { 
      setAuthState("ready"); 
      return; 
    }
    
    // ✅ REGLA: Usuario Standard VE el Wizard si no está completado
    if (!store.isWizardDone()) { 
      setAuthState("wizard"); 
      return; 
    }
    
    setAuthState("ready");
  }, []);

  function handleLogin() {
    const user = store.getCurrentUser();
    // Master-Admin va directo a ready
    if (user?.role === "admin") {
      setAuthState("ready");
    } else if (!store.isWizardDone()) {
      setAuthState("wizard");
    } else {
      setAuthState("ready");
    }
  }

  function handleWizardDone() {
    setAuthState("ready");
  }

  if (authState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Cargando...</div>
      </div>
    );
  }

  if (authState === "logged-out") {
    return (
      <ThemeProvider defaultTheme="system" storageKey="finanzas-theme">
        <TooltipProvider>
          <Login onLogin={handleLogin} />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    );
  }

  if (authState === "wizard") {
    return (
      <ThemeProvider defaultTheme="system" storageKey="finanzas-theme">
        <TooltipProvider>
          <Wizard onFinish={handleWizardDone} />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="finanzas-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter hook={useHashLocation}>
            <Layout onLogout={() => { store.logout(); setAuthState("logged-out"); }}>
              <Switch>
                <Route path="/" component={Dashboard} />
                <Route path="/accounts" component={Accounts} />
                <Route path="/movements" component={Movements} />
                <Route path="/incomes" component={Incomes} />
                <Route path="/expenses" component={Expenses} />
                <Route path="/transfers" component={Transfers} />
                <Route path="/credit-cards" component={CreditCards} />
                <Route path="/commitments" component={Commitments} />
                <Route path="/loans" component={Loans} />
                <Route path="/reports" component={Reports} />
                <Route path="/config/banks" component={ConfigBanks} />
                <Route path="/config/categories" component={ConfigCategories} />
                <Route path="/config/beneficiaries" component={ConfigBeneficiaries} />
                <Route path="/config/payers" component={ConfigPayers} />
                <Route path="/config/users" component={ConfigUsers} />
                <Route path="/config/payment-methods" component={ConfigPaymentMethods} />
              </Switch>
            </Layout>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}