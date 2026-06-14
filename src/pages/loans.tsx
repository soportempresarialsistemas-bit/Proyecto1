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
import { Badge } from "@/components/ui/badge";
import { Plus, Building2, Calendar, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LOAN_TYPES = ["Personal", "Hipotecario", "Vehicular", "Educativo", "Microcrédito", "Nómina", "Libre inversión", "Otro"];

function LoanForm({ onSubmit, onClose }: { onSubmit: (d: Record<string, unknown>) => void; onClose: () => void }) {
  const accounts = useQuery({ queryKey: ["accounts"], queryFn: () => localApi<any[]>("/accounts") });
  const banks = useQuery({ queryKey: ["banks"], queryFn: () => localApi<any[]>("/banks") });
  const categories = useQuery({ queryKey: ["categories", "expense"], queryFn: () => localApi<any[]>("/categories?type=expense") });
  const [form, setForm] = useState({
    name: "", loanType: "Personal", bankId: "", beneficiaryId: "",
    principalAmount: "", interestRate: "", termMonths: "12",
    startDate: todayStr(), paymentDay: "1",
    destinationAccountId: "", paymentAccountId: "", categoryId: "", notes: "",
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const monthlyRate = parseFloat(form.interestRate) / 100 / 12;
  const principal = parseFloat(form.principalAmount) || 0;
  const months = parseInt(form.termMonths) || 1;
  let monthlyPayment = 0;
  if (monthlyRate > 0 && principal > 0) {
    monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  } else if (principal > 0) {
    monthlyPayment = principal / months;
  }

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Nombre / Descripción *</Label>
          <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Ej: Crédito libre inversión" />
        </div>
        <div className="space-y-2">
          <Label>Tipo de préstamo</Label>
          <Select value={form.loanType} onValueChange={v => set("loanType", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{LOAN_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Entidad / Banco</Label>
          <Select value={form.bankId || "__none__"} onValueChange={v => set("bankId", v === "__none__" ? "" : v)}>
            <SelectTrigger><SelectValue placeholder="Sin entidad" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Sin entidad</SelectItem>
              {banks.data?.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Categoría de gasto</Label>
          <Select value={form.categoryId || "__none__"} onValueChange={v => set("categoryId", v === "__none__" ? "" : v)}>
            <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Sin categoría</SelectItem>
              {categories.data?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label>Monto del préstamo *</Label>
          <Input type="number" value={form.principalAmount} onChange={e => set("principalAmount", e.target.value)} placeholder="0" />
        </div>
        <div className="space-y-2">
          <Label>Tasa interés anual (%)</Label>
          <Input type="number" value={form.interestRate} onChange={e => set("interestRate", e.target.value)} placeholder="0" step="0.01" />
        </div>
        <div className="space-y-2">
          <Label>Plazo (meses) *</Label>
          <Input type="number" value={form.termMonths} onChange={e => set("termMonths", e.target.value)} min="1" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Fecha de inicio *</Label>
          <Input type="date" value={form.startDate} onChange={e => set("startDate", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Día de pago mensual</Label>
          <Select value={form.paymentDay} onValueChange={v => set("paymentDay", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{Array.from({ length: 28 }, (_, i) => i + 1).map(d => <SelectItem key={d} value={String(d)}>{d}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Cuenta destino (donde entra el dinero)</Label>
          <Select value={form.destinationAccountId || "__none__"} onValueChange={v => set("destinationAccountId", v === "__none__" ? "" : v)}>
            <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Sin cuenta</SelectItem>
              {accounts.data?.filter(a => a.active).map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Cuenta de pago (de donde sale)</Label>
          <Select value={form.paymentAccountId || "__none__"} onValueChange={v => set("paymentAccountId", v === "__none__" ? "" : v)}>
            <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Sin cuenta</SelectItem>
              {accounts.data?.filter(a => a.active).map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Notas</Label>
        <Input value={form.notes} onChange={e => set("notes", e.target.value)} />
      </div>
      {monthlyPayment > 0 && (
        <div className="rounded-lg bg-muted p-3 text-sm space-y-1">
          <p>Cuota mensual estimada: <strong>{fmtCOP(monthlyPayment)}</strong></p>
          <p className="text-muted-foreground">Total a pagar: {fmtCOP(monthlyPayment * months)} · Intereses: {fmtCOP(monthlyPayment * months - principal)}</p>
        </div>
      )}
      <div className="flex gap-2 pt-2">
        <Button variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
        <Button className="flex-1" onClick={() => onSubmit({
          ...form,
          principalAmount: parseFloat(form.principalAmount) || 0,
          interestRate: parseFloat(form.interestRate) || 0,
          termMonths: parseInt(form.termMonths) || 12,
          paymentDay: parseInt(form.paymentDay) || 1,
          bankId: form.bankId || null,
          destinationAccountId: form.destinationAccountId || null,
          paymentAccountId: form.paymentAccountId || null,
          categoryId: form.categoryId || null,
        })}>
          Registrar préstamo
        </Button>
      </div>
    </div>
  );
}

export default function Loans() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const loans = useQuery({ queryKey: ["loans"], queryFn: () => localApi<any[]>("/loans") });
  const create = useMutation({
    mutationFn: (d: Record<string, unknown>) => localApi("/loans", { method: "POST", body: JSON.stringify(d) }),
    onSuccess: () => { qc.invalidateQueries(); setOpen(false); toast({ title: "Préstamo registrado" }); },
    onError: e => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });

  const totalPrincipal = loans.data?.reduce((s, l) => s + l.principalAmount, 0) ?? 0;
  const totalPending = loans.data?.reduce((s, l) => s + l.totalPending, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Préstamos</h1>
          <p className="text-sm text-muted-foreground">
            Total: {fmtCOP(totalPrincipal)} · Pendiente: <span className="text-red-500 font-semibold">{fmtCOP(totalPending)}</span>
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nuevo préstamo</Button></DialogTrigger>
          <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Registrar préstamo</DialogTitle></DialogHeader>
            <LoanForm onSubmit={d => create.mutate(d)} onClose={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {loans.isLoading ? <Skeleton className="h-48 w-full" /> :
        (loans.data?.length ?? 0) === 0 ? (
          <p className="text-center text-muted-foreground py-16">Sin préstamos registrados</p>
        ) : (
          <div className="space-y-3">
            {loans.data?.map(loan => {
              const pct = loan.principalAmount > 0 ? (loan.totalPaid / loan.principalAmount) * 100 : 0;
              return (
                <Card key={loan.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base">{loan.name}</CardTitle>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{loan.bankName ?? "Sin entidad"}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{fmtDate(loan.startDate)}</span>
                          <Badge variant="outline">{loan.loanType}</Badge>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold">{fmtCOP(loan.principalAmount)}</p>
                        <p className="text-xs text-muted-foreground">{loan.termMonths} meses · {loan.interestRate}% anual</p>
                      </div>
                    </div>
                    <Progress value={Math.min(pct, 100)} className="h-1.5 mt-2" />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div><p className="text-xs text-muted-foreground">Pagado</p><p className="font-medium text-green-600">{fmtCOP(loan.totalPaid)}</p></div>
                      <div><p className="text-xs text-muted-foreground">Pendiente</p><p className="font-medium text-red-500">{fmtCOP(loan.totalPending)}</p></div>
                      <div><p className="text-xs text-muted-foreground">Cuenta destino</p><p className="font-medium">{loan.destinationAccountName ?? "—"}</p></div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )
      }
    </div>
  );
}
