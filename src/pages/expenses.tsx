import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { localApi, fmtCOP, fmtDate, todayStr } from "@/lib/localApi";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EXPENSE_TYPES = ["Gastos de personal", "Honorarios", "Impuestos y tasas", "Arrendamientos", "Contribuciones y afiliaciones", "Seguros", "Servicios", "Legales", "Mantenimiento y reparación", "Adecuaciones e instalaciones", "Acueducto y alcantarillado", "Energía eléctrica", "Teléfono", "Correo, portes y telegramas", "Combustibles y lubricantes", "Transporte", "Publicidad, propaganda y promoción", "Gastos de representación", "Útiles, papelería y fotocopias", "Viáticos y gastos de viaje", "Otros gastos"];

function ExpenseForm({ onSubmit, onClose, initial }: { onSubmit: (d: Record<string, unknown>) => void; onClose: () => void; initial?: any }) {
  const accounts = useQuery({ queryKey: ["accounts"], queryFn: () => localApi<any[]>("/accounts") });
  const allCategories = useQuery({ queryKey: ["categories", "expense"], queryFn: () => localApi<any[]>("/categories?type=expense") });
  const beneficiaries = useQuery({ queryKey: ["beneficiaries"], queryFn: () => localApi<any[]>("/beneficiaries") });
  const paymentMethods = useQuery({ queryKey: ["payment-methods"], queryFn: () => localApi<any[]>("/payment-methods") });

  const [form, setForm] = useState({
    accountId: initial?.accountId ?? "", categoryId: initial?.categoryId ?? "",
    subcategoryId: initial?.subcategoryId ?? "", expenseType: initial?.expenseType ?? "",
    beneficiaryId: initial?.beneficiaryId ?? "", paymentMethodId: initial?.paymentMethodId ?? "",
    amount: initial?.amount ? String(initial.amount) : "", date: initial?.date ?? todayStr(), description: initial?.description ?? "",
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const mainCats = allCategories.data?.filter(c => !c.parentId) ?? [];
  const subCats = allCategories.data?.filter(c => c.parentId === form.categoryId) ?? [];

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2"><Label>Cuenta *</Label>
          <Select value={form.accountId} onValueChange={v => set("accountId", v)}>
            <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
            <SelectContent>{accounts.data?.filter(a => a.active).map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
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
        <div className="space-y-2">
          <Label>Tipo de gasto</Label>
          <Select value={form.expenseType || "__none__"} onValueChange={v => set("expenseType", v === "__none__" ? "" : v)}>
            <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Sin especificar</SelectItem>
              {EXPENSE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2"><Label>Monto *</Label><Input type="number" value={form.amount} onChange={e => set("amount", e.target.value)} /></div>
        <div className="space-y-2"><Label>Fecha *</Label><Input type="date" value={form.date} onChange={e => set("date", e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2"><Label>Beneficiario</Label>
          <Select value={form.beneficiaryId || "__none__"} onValueChange={v => set("beneficiaryId", v === "__none__" ? "" : v)}>
            <SelectTrigger><SelectValue placeholder="Sin beneficiario" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Sin beneficiario</SelectItem>
              {beneficiaries.data?.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
            </SelectContent>
          </Select>
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
      </div>
      <div className="space-y-2"><Label>Descripción</Label><Input value={form.description} onChange={e => set("description", e.target.value)} /></div>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
        <Button className="flex-1" onClick={() => onSubmit({
          ...form,
          amount: parseFloat(form.amount),
          subcategoryId: form.subcategoryId || null,
          expenseType: form.expenseType || null,
          beneficiaryId: form.beneficiaryId || null,
          paymentMethodId: form.paymentMethodId || null,
        })} disabled={!form.accountId || !form.categoryId || !form.amount}>
          {initial ? "Guardar cambios" : "Registrar gasto"}
        </Button>
      </div>
    </div>
  );
}

export default function Expenses() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const expenses = useQuery({ queryKey: ["expenses"], queryFn: () => localApi<any[]>("/expenses") });
  const create = useMutation({
    mutationFn: (d: Record<string, unknown>) => localApi("/expenses", { method: "POST", body: JSON.stringify(d) }),
    onSuccess: () => { qc.invalidateQueries(); setOpen(false); toast({ title: "Gasto registrado" }); },
    onError: e => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });
  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => localApi(`/expenses/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries(); setEditing(null); toast({ title: "Gasto actualizado" }); },
    onError: e => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });
  const del = useMutation({
    mutationFn: (id: string) => localApi(`/expenses/${id}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries(); toast({ title: "Eliminado" }); },
    onError: e => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });
  const total = expenses.data?.reduce((s, e) => s + e.amount, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Gastos</h1><p className="text-sm text-muted-foreground">Total: <span className="font-semibold text-red-500">{fmtCOP(total)}</span></p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Registrar gasto</Button></DialogTrigger>
          <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Nuevo gasto</DialogTitle></DialogHeader>
            <ExpenseForm onSubmit={d => create.mutate(d)} onClose={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <Card><CardContent className="p-0">
        {expenses.isLoading ? <div className="p-6"><Skeleton className="h-48 w-full" /></div> : (
          <div className="overflow-x-auto"><Table>
            <TableHeader><TableRow>
              <TableHead>Fecha</TableHead><TableHead>Cuenta</TableHead><TableHead>Categoría</TableHead>
              <TableHead>Beneficiario</TableHead><TableHead>Método de pago</TableHead>
              <TableHead>Descripción</TableHead><TableHead className="text-right">Monto</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {(expenses.data?.length ?? 0) === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">Sin gastos</TableCell></TableRow>
              ) : expenses.data?.map(e => (
                <TableRow key={e.id}>
                  <TableCell className="text-sm">{fmtDate(e.date)}</TableCell>
                  <TableCell className="text-sm">{e.accountName}</TableCell>
                  <TableCell className="text-sm">{e.categoryName}{e.subcategoryName ? ` / ${e.subcategoryName}` : ""}</TableCell>
                  <TableCell className="text-sm">{e.beneficiaryName ?? "—"}</TableCell>
                  <TableCell className="text-sm">{e.paymentMethodName ?? "—"}</TableCell>
                  <TableCell className="text-sm max-w-[140px] truncate">{e.description ?? "—"}</TableCell>
                  <TableCell className="text-right font-medium text-red-500">{fmtCOP(e.amount)}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(e)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => del.mutate(e.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></div>
        )}
      </CardContent></Card>
      <Dialog open={!!editing} onOpenChange={o => !o && setEditing(null)}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Editar gasto</DialogTitle></DialogHeader>
          {editing && <ExpenseForm initial={editing} onSubmit={d => update.mutate({ id: editing.id, data: d })} onClose={() => setEditing(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
