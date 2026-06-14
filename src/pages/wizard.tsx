import { useState } from "react";
import { localApi } from "@/lib/localApi";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Wallet, ChevronRight, CheckCircle, Plus, Trash2 } from "lucide-react";
import { store } from "@/lib/store";

const CURRENCIES = [
  { name: "Peso Colombiano", code: "COP", symbol: "$" },
  { name: "Dólar Estadounidense", code: "USD", symbol: "$" },
  { name: "Euro", code: "EUR", symbol: "€" },
  { name: "Peso Mexicano", code: "MXN", symbol: "$" },
  { name: "Real Brasileño", code: "BRL", symbol: "R$" },
  { name: "Peso Argentino", code: "ARS", symbol: "$" },
  { name: "Sol Peruano", code: "PEN", symbol: "S/" },
  { name: "Peso Chileno", code: "CLP", symbol: "$" },
  { name: "Bolívar Venezolano", code: "VEF", symbol: "Bs" },
  { name: "Otro", code: "", symbol: "" },
];

const SYMBOLS = ["$", "€", "£", "¥", "₩", "₹", "R$", "S/", "Bs", "₿", "COP", "USD", "EUR"];

const DEFAULT_ACCOUNTS = [
  { name: "Ahorros", typeSlug: "savings" },
  { name: "Corriente", typeSlug: "checking" },
  { name: "Inversión", typeSlug: "investment" },
  { name: "Préstamo", typeSlug: "loan" },
  { name: "Billetera Digital", typeSlug: "digital_wallet" },
  { name: "Efectivo", typeSlug: "cash" },
  { name: "Tarjeta de Crédito", typeSlug: "credit_card" },
];

interface WizardProps { onFinish: () => void }

export default function Wizard({ onFinish }: WizardProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [currency, setCurrency] = useState({
    name: "Peso Colombiano", code: "COP", symbol: "$", symbolAlign: "left" as "left" | "right", decimals: 0,
  });
  const [accountChoice, setAccountChoice] = useState<"default" | "custom" | null>(null);
  const [customAccounts, setCustomAccounts] = useState<{ name: string; typeId: string; openingBalance: string }[]>([
    { name: "", typeId: "", openingBalance: "0" },
  ]);

  const accountTypes: { id: string; name: string; slug: string }[] = (() => {
    try { return JSON.parse(localStorage.getItem("fp8:account-types") ?? "[]"); } catch { return []; }
  })();

  function handleCurrencySelect(name: string) {
    const found = CURRENCIES.find(c => c.name === name);
    if (found) {
      setCurrency(prev => ({ ...prev, name: found.name, code: found.code, symbol: found.symbol }));
    }
  }

  function handleCodeChange(val: string) {
    setCurrency(prev => ({ ...prev, code: val.toUpperCase().replace(/[^A-Z]/g, "") }));
  }

  async function finishCurrency() {
    await localApi("/currency", { method: "POST", body: JSON.stringify(currency) });
    setStep(2);
  }

  async function createDefaultAccounts() {
    for (const acc of DEFAULT_ACCOUNTS) {
      const typeId = accountTypes.find(t => t.slug === acc.typeSlug)?.id;
      if (typeId) {
        await localApi("/accounts", { method: "POST", body: JSON.stringify({ name: acc.name, typeId, openingBalance: 0 }) });
      }
    }
    await finish();
  }

  async function createCustomAccounts() {
    for (const acc of customAccounts.filter(a => a.name && a.typeId)) {
      await localApi("/accounts", {
        method: "POST",
        body: JSON.stringify({ name: acc.name, typeId: acc.typeId, openingBalance: parseFloat(acc.openingBalance) || 0 }),
      });
    }
    await finish();
  }

  async function finish() {
    store.setWizardDone();
    setStep(4);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/40 p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Wallet className="h-7 w-7" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Bienvenido a Finanzas Premium</h1>
            <p className="text-sm text-muted-foreground">Configuración inicial</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`flex-1 h-1.5 rounded-full transition-colors ${step >= s ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        {/* Step 1 — Currency */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Paso 1: Moneda principal</CardTitle>
              <CardDescription>Configura la moneda que usará la aplicación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Moneda *</Label>
                <Select value={currency.name} onValueChange={handleCurrencySelect}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map(c => <SelectItem key={c.code || c.name} value={c.name}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Código de divisa *</Label>
                  <Input
                    value={currency.code}
                    onChange={e => handleCodeChange(e.target.value)}
                    placeholder="COP"
                    maxLength={5}
                    className="uppercase"
                  />
                  <p className="text-xs text-muted-foreground">Solo letras mayúsculas</p>
                </div>
                <div className="space-y-2">
                  <Label>Símbolo</Label>
                  <Select value={currency.symbol} onValueChange={v => setCurrency(p => ({ ...p, symbol: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SYMBOLS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      <SelectItem value=" ">Sin símbolo (espacio)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Usa espacio para separar símbolo del número</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Alineación del símbolo</Label>
                  <Select value={currency.symbolAlign} onValueChange={v => setCurrency(p => ({ ...p, symbolAlign: v as "left" | "right" }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Izquierda ($1.000)</SelectItem>
                      <SelectItem value="right">Derecha (1.000 $)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Posiciones decimales</Label>
                  <Select value={String(currency.decimals)} onValueChange={v => setCurrency(p => ({ ...p, decimals: parseInt(v) }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[0,1,2,3,4,5,6,7,8,9,10].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="rounded-lg bg-muted p-3 text-sm">
                Vista previa: <strong>{currency.symbolAlign === "left" ? `${currency.symbol} 1.000` : `1.000 ${currency.symbol}`}</strong>
              </div>
              <Button className="w-full" onClick={finishCurrency} disabled={!currency.code}>
                Siguiente <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2 — Accounts choice */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Paso 2: Cuentas iniciales</CardTitle>
              <CardDescription>¿Cómo deseas configurar tus cuentas?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Puedes cargar cuentas predeterminadas o crear las tuyas propias.
              </p>
              <div className="space-y-2">
                {DEFAULT_ACCOUNTS.map(a => (
                  <div key={a.name} className="flex items-center gap-2 text-sm py-1 border-b last:border-0">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{a.name}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep(3)}>
                  Crear mis propias cuentas
                </Button>
                <Button className="flex-1" onClick={createDefaultAccounts}>
                  Usar cuentas predeterminadas
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3 — Custom accounts */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Paso 3: Crea tus cuentas</CardTitle>
              <CardDescription>Agrega las cuentas que deseas gestionar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {customAccounts.map((acc, idx) => (
                <div key={idx} className="grid grid-cols-[1fr,1fr,auto] gap-2 items-end">
                  <div className="space-y-1">
                    <Label className="text-xs">Nombre</Label>
                    <Input
                      value={acc.name}
                      onChange={e => setCustomAccounts(prev => prev.map((a, i) => i === idx ? { ...a, name: e.target.value } : a))}
                      placeholder="Ej: Ahorros"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Tipo</Label>
                    <Select value={acc.typeId} onValueChange={v => setCustomAccounts(prev => prev.map((a, i) => i === idx ? { ...a, typeId: v } : a))}>
                      <SelectTrigger className="h-9"><SelectValue placeholder="Tipo..." /></SelectTrigger>
                      <SelectContent>
                        {accountTypes.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setCustomAccounts(prev => prev.filter((_, i) => i !== idx))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full" onClick={() => setCustomAccounts(prev => [...prev, { name: "", typeId: "", openingBalance: "0" }])}>
                <Plus className="h-4 w-4 mr-1" /> Agregar cuenta
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>Atrás</Button>
                <Button className="flex-1" onClick={createCustomAccounts}>Finalizar</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4 — Done */}
        {step === 4 && (
          <Card>
            <CardContent className="py-8 text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold">¡Configuración completada!</h2>
                <p className="text-muted-foreground mt-1">Finanzas Premium está listo para usar.</p>
              </div>
              <Button className="w-full" onClick={onFinish}>
                Ir al Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
