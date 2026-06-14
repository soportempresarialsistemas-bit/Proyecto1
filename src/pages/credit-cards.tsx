import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { localApi, fmtCOP, fmtDate, todayStr } from "@/lib/localApi";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function PurchaseForm({ onSubmit, onClose }: { onSubmit: (d: Record<string, unknown>) => void; onClose: () => void }) {
  const accounts = useQuery({ queryKey: ["accounts"], queryFn: () => localApi<any[]>("/accounts") });
  const allCategories = useQuery({ queryKey: ["categories", "expense"], queryFn: () => localApi<any[]>("/categories?type=expense") });
  const beneficiaries = useQuery({ queryKey: ["beneficiaries"], queryFn: () => localApi<any[]>("/beneficiaries") });
  const paymentMethods = useQuery({ queryKey: ["payment-methods"], queryFn: () => localApi<any[]>("/payment-methods") });

  const [form, setForm] = useState({
    accountId: "", categoryId: "", subcategoryId: "",
    beneficiaryId: "", paymentMethodId: "",
    description: "", amount: "", installments: "1", purchaseDate: todayStr(),
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const ccAccounts = accounts.data?.filter(a => a.typeSlug === "credit_card" && a.active) ?? [];
  const mainCats = allCategories.data?.filter(c => !c.parentId) ?? [];
  const subCats = allCategories.data?.filter(c => c.parentId === form.categoryId) ?? [];

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2"><Label>Tarjeta *</Label>
          <Select value={form.accountId} onValueChange={v => set("accountId", v)}>
            <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
            <SelectContent>{ccAccounts.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Categoría *</Label>
          <Select value={form.categoryId} onValueChange={v => { set("categoryId", v); set("subcategoryId", ""); }}>
            <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
            <SelectContent>{mainCats.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Subcategoría</Label>
          <Select value={form.subcategoryId || "__none__"} onValueChange={v => set("subcategoryId", v === "__none__" ? "" : v)} disabled={subCats.length === 0}>
            <SelectTrigger><SelectValue placeholder={subCats.length === 0 ? "Sin subcategorías" : "Seleccionar..."} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Sin subcategoría</SelectItem>
              {subCats.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Beneficiario</Label>
          <Select value={form.beneficiaryId || "__none__"} onValueChange={v => set("beneficiaryId", v === "__none__" ? "" : v)}>
            <SelectTrigger><SelectValue placeholder="Sin beneficiario" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Sin beneficiario</SelectItem>
              {beneficiaries.data?.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2"><Label>Descripción *</Label><Input value={form.description} onChange={e => set("description", e.target.value)} /></div>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2"><Label>Monto total *</Label><Input type="number" value={form.amount} onChange={e => set("amount", e.target.value)} /></div>
        <div className="space-y-2"><Label>Cuotas *</Label><Input type="number" min="1" max="36" value={form.installments} onChange={e => set("installments", e.target.value)} /></div>
        <div className="space-y-2"><Label>Fecha *</Label><Input type="date" value={form.purchaseDate} onChange={e => set("purchaseDate", e.target.value)} /></div>
      </div>
      <div className="space-y-2"><Label>Método de pago</Label>
        <Select value={form.paymentMethodId || "__none__"} onValueChange={v => set("paymentMethodId", v === "__none__" ? "" : v)}>
          <SelectTrigger><SelectValue placeholder="Sin especificar" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">Sin especificar</SelectItem>
            {paymentMethods.data?.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      {form.amount && form.installments && (
        <p className="text-sm bg-muted rounded p-2">Cuota mensual: <strong>{fmtCOP(parseFloat(form.amount) / parseInt(form.installments) || 0)}</strong></p>
      )}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
        <Button className="flex-1" onClick={() => onSubmit({
          accountId: form.accountId, categoryId: form.categoryId,
          subcategoryId: form.subcategoryId || null,
          beneficiaryId: form.beneficiaryId || null,
          paymentMethodId: form.paymentMethodId || null,
          description: form.description,
          amount: parseFloat(form.amount), installments: parseInt(form.installments),
          purchaseDate: form.purchaseDate,
        })} disabled={!form.accountId || !form.categoryId || !form.description || !form.amount}>
          Registrar compra
        </Button>
      </div>
    </div>
  );
}

function InstallmentList({ purchaseId }: { purchaseId: string }) {
  const inst = useQuery({ queryKey: ["installments", purchaseId], queryFn: () => localApi<any[]>(`/credit-purchases/${purchaseId}/installments`) });
  if (inst.isLoading) return <Skeleton className="h-24 w-full mt-2" />;
  return (
    <div className="mt-2 space-y-1">
      {inst.data?.map(i => (
        <div key={i.id} className={`flex items-center justify-between px-3 py-2 rounded text-sm ${i.paid ? "opacity-50" : ""}`}>
          <div className="flex items-center gap-2">
            {i.paid ? <CheckCircle className="h-4 w-4 text-green-500" /> : <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />}
            <span>Cuota {i.installmentNumber}/{i.totalInstallments}</span>
            <span className="text-muted-foreground">· vence {fmtDate(i.dueDate)}</span>
          </div>
          <span className={`font-medium ${i.paid ? "text-green-600" : ""}`}>{fmtCOP(i.amount)}</span>
        </div>
      ))}
    </div>
  );
}

export default function CreditCards() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const purchases = useQuery({ queryKey: ["credit-purchases"], queryFn: () => localApi<any[]>("/credit-purchases") });
  const create = useMutation({
    mutationFn: (d: Record<string, unknown>) => localApi("/credit-purchases", { method: "POST", body: JSON.stringify(d) }),
    onSuccess: () => { qc.invalidateQueries(); setOpen(false); toast({ title: "Compra registrada" }); },
    onError: e => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Tarjetas de Crédito</h1><p className="text-sm text-muted-foreground">Compras en cuotas</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nueva compra</Button></DialogTrigger>
          <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Registrar compra en cuotas</DialogTitle></DialogHeader>
            <PurchaseForm onSubmit={d => create.mutate(d)} onClose={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      {purchases.isLoading ? <Skeleton className="h-48 w-full" /> :
        (purchases.data?.length ?? 0) === 0 ? <p className="text-center text-muted-foreground py-16">Sin compras registradas</p> : (
          <div className="space-y-3">
            {purchases.data?.map(p => {
              const pct = (p.paidCount / p.installments) * 100;
              const isExp = expanded === p.id;
              return (
                <Card key={p.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base">{p.description}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {p.accountName} · {p.categoryName} · {fmtDate(p.purchaseDate)}
                          {p.beneficiaryName && ` · ${p.beneficiaryName}`}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold">{fmtCOP(p.amount)}</p>
                        <p className="text-xs text-muted-foreground">{p.paidCount}/{p.installments} cuotas</p>
                      </div>
                    </div>
                    <Progress value={pct} className="h-1.5 mt-2" />
                    {p.pendingAmount > 0 && <p className="text-xs text-amber-600 mt-1">Pendiente: {fmtCOP(p.pendingAmount)}</p>}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setExpanded(isExp ? null : p.id)}>
                      {isExp ? <><ChevronUp className="h-3 w-3 mr-1" />Ocultar</> : <><ChevronDown className="h-3 w-3 mr-1" />Ver cuotas</>}
                    </Button>
                    {isExp && <InstallmentList purchaseId={p.id} />}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
    </div>
  );
}
