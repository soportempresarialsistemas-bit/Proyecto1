import { useTheme } from "./theme-provider";
import { Moon, Sun, Monitor, Menu, Wallet, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, ArrowLeftRight, TrendingUp, TrendingDown,
  CreditCard, CalendarDays, PieChart, Building2, Tags, Users, UserCircle,
  Landmark, CreditCard as PayIcon, ShieldCheck,
} from "lucide-react";
import { store } from "@/lib/store";

export function ModeToggle() {
  const { setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Cambiar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}><Sun className="mr-2 h-4 w-4" />Claro</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}><Moon className="mr-2 h-4 w-4" />Oscuro</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}><Monitor className="mr-2 h-4 w-4" />Sistema</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const navGroups = [
  {
    title: "Overview",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/accounts", label: "Cuentas", icon: Wallet },
      { href: "/movements", label: "Movimientos", icon: ArrowLeftRight },
    ],
  },
  {
    title: "Transacciones",
    items: [
      { href: "/incomes", label: "Ingresos", icon: TrendingUp },
      { href: "/expenses", label: "Gastos", icon: TrendingDown },
      { href: "/transfers", label: "Transferencias", icon: ArrowLeftRight },
    ],
  },
  {
    title: "Obligaciones",
    items: [
      { href: "/credit-cards", label: "Tarjetas", icon: CreditCard },
      { href: "/loans", label: "Préstamos", icon: Landmark },
      { href: "/commitments", label: "Compromisos", icon: CalendarDays },
    ],
  },
  {
    title: "Análisis",
    items: [{ href: "/reports", label: "Reportes", icon: PieChart }],
  },
  {
    title: "Configuración",
    items: [
      { href: "/config/banks", label: "Bancos", icon: Building2 },
      { href: "/config/categories", label: "Categorías", icon: Tags },
      { href: "/config/beneficiaries", label: "Beneficiarios", icon: Users },
      { href: "/config/payers", label: "Pagadores", icon: UserCircle },
      { href: "/config/payment-methods", label: "Métodos de pago", icon: PayIcon },
      { href: "/config/users", label: "Usuarios", icon: ShieldCheck },
    ],
  },
];

function NavContent() {
  const [location] = useLocation();
  return (
    <div className="flex h-full flex-col border-r bg-sidebar">
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Wallet className="h-4 w-4" />
          </div>
          Finanzas Premium
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-5 px-4">
          {navGroups.map((group, i) => (
            <div key={i} className="space-y-1.5">
              <h4 className="text-xs font-semibold tracking-tight text-sidebar-foreground/50 uppercase">{group.title}</h4>
              <div className="grid gap-0.5">
                {group.items.map((item) => {
                  const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
                  return (
                    <Link key={item.href} href={item.href}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
      {/* User info at bottom */}
      {(() => {
        const user = store.getCurrentUser();
        if (!user) return null;
        return (
          <div className="border-t border-sidebar-border px-4 py-3">
            <p className="text-xs font-medium text-sidebar-foreground">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-sidebar-foreground/50">{user.role === "admin" ? "Administrador" : "Estándar"}</p>
          </div>
        );
      })()}
    </div>
  );
}

export function Layout({ children, onLogout }: { children: React.ReactNode; onLogout?: () => void }) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  useEffect(() => { setOpen(false); }, [location]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background md:flex-row">
      <aside className="hidden w-64 flex-col md:flex"><NavContent /></aside>
      <div className="flex flex-1 flex-col sm:gap-4 sm:py-4">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0"><NavContent /></SheetContent>
          </Sheet>
          <div className="flex w-full items-center justify-end gap-2">
            <ModeToggle />
            {onLogout && (
              <Button variant="ghost" size="icon" onClick={onLogout} title="Cerrar sesión">
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
      </div>
    </div>
  );
}
