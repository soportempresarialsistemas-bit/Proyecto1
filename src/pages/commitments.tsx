import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { localApi, fmtCOP, fmtDate, todayStr } from "@/lib/localApi";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, CreditCard, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const COMMITMENT_TYPES = ["Cuota préstamo", "Cuota tarjeta de crédito", "Suscripción", "Arriendo", "Servicio público", "Impuesto", "Seguro", "Deuda personal", "Otro"];

function NewCommitmentForm({ onSubmit, onClose }: { onSubmit: (d: any) => void; onClose: () => void }) {
  const accounts = useQuery({ queryKey: ["accounts"], queryFn: () => localApi<any[]>("/accounts") });
  const categories = useQuery({ queryKey: ["categories", "expense"], queryFn: () => localApi<any[]>("/categories?type=expense") });
  const beneficiaries = useQuery({ queryKey: ["beneficiaries"], queryFn: () => localApi<any[]>("/beneficiaries") });
  const [form, setForm] = useState({
    description: "", amount: "", dueDate: todayStr(),
    type: "", categoryId: "", accountId: "", beneficiaryId: "",
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="space-y-2"><Label>Descripción *</Label><Input value={form.description} onChange={e => set("description", e.target.value)} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2"><Label>Monto *</Label><Input type="number" value={form.amount} onChange={e => set("amount", e.target.value)} /></div>
        <div className="space-y-2"><Label>Vence *</Label><Input type="date" value={form.dueDate} onChange={e => set("dueDate", e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Tipo</Label>
          <Select value={form.type || "__none__"} onValueChange={v => set("type", v === "__none__" ? "" : v)}>
            <SelectTrigger><SelectValue placeholder="Sin tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Sin tipo</SelectItem>
              {COMMITMENT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Categoría</Label>
          <Select value={form.categoryId || "__none__"} onValueChange={v => set("categoryId", v === "__none__" ? "" : v)}>
            <SelectTrigger><SelectValue placeholder="Sin categoría" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Sin categoría</SelectItem>
              {categories.data?.filter(c => !c.parentId).map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Cuenta sugerida de pago</Label>
          <Select value={form.accountId || "__none__"} onValueChange={v => set("accountId", v === "__none__" ? "" : v)}>
            <SelectTrigger><SelectValue placeholder="Sin cuenta" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Sin cuenta</SelectItem>
              {accounts.data?.filter(a => a.active).map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Beneficiario</Label>
          <Select value={form.beneficiaryId || "__none__"} onValueChange={v => set("beneficiaryId", v === "__none__" ? "" : v)}>
            <SelectTrigger><SelectValue placeholder="Sin beneficiario" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Sin beneficiario</SelectItem>
              {beneficiaries.data?.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
        <Button className="flex-1" onClick={() => onSubmit({
          description: form.description, amount: parseFloat(form.amount),
          dueDate: form.dueDate, type: form.type || undefined,
          categoryId: form.categoryId || null, accountId: form.accountId || null,
          beneficiaryId: form.beneficiaryId || null, sourceType: "manual",
        })} disabled={!form.description || !form.amount}>Guardar</Button>
      </div>
    </div>
  );
}

function PayCommitmentDialog({ commitment, onClose }: { commitment: any; onClose: () => void }) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const accounts = useQuery({ queryKey: ["accounts"], queryFn: () => localApi<any[]>("/accounts") });
  const categories = useQuery({ queryKey: ["categories", "expense"], queryFn: () => localApi<any[]>("/categories?type=expense") });
  const [accountId, setAccountId] = useState(commitment.accountId ?? "");
  const [categoryId, setCategoryId] = useState(commitment.categoryId ?? "");

  const pay = useMutation({
    mutationFn: () => localApi(`/commitments/${commitment.id}/pay`, {
      method: "PATCH",
      body: JSON.stringify({ accountId, categoryId: categoryId || null }),
    }),
    onSuccess: () => { qc.invalidateQueries(); toast({ title: "Compromiso pagado", description: "Se registró el gasto y se descontó del saldo de la cuenta" }); onClose(); },
    onError: e => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-muted p-3 text-sm space-y-1">
        <p className="font-medium">{commitment.description}</p>
        <p className="text-muted-foreground">Monto a pagar: <strong className="text-red-500">{fmtCOP(commitment.amount)}</strong></p>
        <p className="text-xs text-amber-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" />Esta acción registrará un gasto y descontará el monto del saldo de la cuenta seleccionada.</p>
      </div>
      <div className="space-y-2">
        <Label>Cuenta desde la que se paga *</Label>
        <Select value={accountId || "__none__"} onValueChange={v => setAccountId(v === "__none__" ? "" : v)}>
          <SelectTrigger><SelectValue placeholder="Seleccionar cuenta..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">Seleccionar...</SelectItem>
            {accounts.data?.filter(a => a.active).map(a => (
              <SelectItem key={a.id} value={a.id}>{a.name} ({fmtCOP(a.currentBalance)})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Categoría del gasto</Label>
        <Select value={categoryId || "__none__"} onValueChange={v => setCategoryId(v === "__none__" ? "" : v)}>
          <SelectTrigger><SelectValue placeholder="Sin categoría" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">Sin categoría</SelectItem>
            {categories.data?.filter(c => !c.parentId).map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
        <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => pay.mutate()} disabled={!accountId || pay.isPending}>
          <CreditCard className="h-4 w-4 mr-1" />{pay.isPending ? "Pagando..." : "Pagar compromiso"}
        </Button>
      </div>
    </div>
  );
}

export default function Commitments() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [paying, setPaying] = useState<any>(null);
  const [filter, setFilter] = useState<"pending" | "all" | "paid">("pending");

  const qs = new URLSearchParams();
  if (filter === "pending") qs.append("paid", "false");
  if (filter === "paid") qs.append("paid", "true");

  const commitments = useQuery({
    queryKey: ["commitments", filter],
    queryFn: () => localApi<any[]>(`/commitments?${qs}`),
  });
  const create = useMutation({
    mutationFn: (d: any) => localApi("/commitments", { method: "POST", body: JSON.stringify(d) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["commitments"] }); setOpen(false); toast({ title: "Compromiso creado" }); },
    onError: e => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });
  const del = useMutation({
    mutationFn: (id: string) => localApi(`/commitments/${id}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["commitments"] }); toast({ title: "Eliminado" }); },
    onError: e => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });

  const total = commitments.data?.filter(c => !c.paid).reduce((s, c) => s + c.amount, 0) ?? 0;
  const today = todayStr();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Compromisos</h1>
          <p className="text-sm text-muted-foreground">Pendiente: <span className="font-semibold text-red-500">{fmtCOP(total)}</span></p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nuevo</Button></DialogTrigger>
          <DialogContent><DialogHeader><DialogTitle>Nuevo compromiso</DialogTitle></DialogHeader>
            <NewCommitmentForm onSubmit={d => create.mutate(d)} onClose={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        {(["pending", "all", "paid"] as const).map(f => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>
            {f === "pending" ? "Pendientes" : f === "all" ? "Todos" : "Pagados"}
          </Button>
        ))}
      </div>

      <Card><CardContent className="p-0">
        {commitments.isLoading ? <div className="p-6"><Skeleton className="h-48 w-full" /></div> : (
          <div className="overflow-x-auto"><Table>
            <TableHeader><TableRow>
              <TableHead>Descripción</TableHead><TableHead>Vence</TableHead>
              <TableHead>Tipo</TableHead><TableHead>Cuenta</TableHead><TableHead>Categoría</TableHead>
              <TableHead className="text-right">Monto</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {(commitments.data?.length ?? 0) === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Sin compromisos</TableCell></TableRow>
              ) : commitments.data?.map(c => (
                <TableRow key={c.id} className={c.paid ? "opacity-50" : ""}>
                  <TableCell className={`font-medium ${c.paid ? "line-through" : ""}`}>{c.description}</TableCell>
                  <TableCell>
                    <span className={`text-sm ${!c.paid && c.dueDate < today ? "text-red-500 font-semibold" : ""}`}>
                      {fmtDate(c.dueDate)}{!c.paid && c.dueDate < today && " ⚠️"}
                    </span>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{c.type ?? c.sourceType ?? "manual"}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.accountName ?? "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.categoryName ?? "—"}</TableCell>
                  <TableCell className="text-right font-medium">{fmtCOP(c.amount)}</TableCell>
                  <TableCell className="text-right space-x-1">
                    {!c.paid && (
                      <Button size="sm" variant="outline" className="h-7 text-xs text-green-600 border-green-200 hover:bg-green-50" onClick={() => setPaying(c)}>
                        <CreditCard className="h-3 w-3 mr-1" />Pagar
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => del.mutate(c.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></div>
        )}
      </CardContent></Card>

      <Dialog open={!!paying} onOpenChange={o => !o && setPaying(null)}>
        <DialogContent><DialogHeader><DialogTitle>Pagar compromiso</DialogTitle></DialogHeader>
          {paying && <PayCommitmentDialog commitment={paying} onClose={() => setPaying(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
