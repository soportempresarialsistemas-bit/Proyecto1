import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { localApi, fmtCOP } from "@/lib/localApi";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Archive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function AccountForm({ onSubmit, initial }: { onSubmit: (d: Record<string, unknown>) => void; initial?: any }) {
  const types = useQuery({ queryKey: ["account-types"], queryFn: () => localApi<any[]>("/account-types") });
  const banks = useQuery({ queryKey: ["banks"], queryFn: () => localApi<any[]>("/banks") });
  const [form, setForm] = useState({
    name: initial?.name ?? "", typeId: initial?.typeId ?? "", bankId: initial?.bankId ?? "",
    openingBalance: initial?.openingBalance ?? 0, creditLimit: initial?.creditLimit ?? "",
    notes: initial?.notes ?? "",
  });
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Nombre *</Label>
        <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ej: Ahorros Bancolombia" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Tipo *</Label>
          <Select value={form.typeId} onValueChange={(v) => set("typeId", v)}>
            <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
            <SelectContent>{types.data?.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Banco</Label>
          <Select value={form.bankId || "__none__"} onValueChange={(v) => set("bankId", v === "__none__" ? "" : v)}>
            <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Sin banco</SelectItem>
              {banks.data?.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      {!initial?.id && (
        <div className="space-y-2">
          <Label>Saldo inicial (COP)</Label>
          <Input type="number" value={form.openingBalance} onChange={(e) => set("openingBalance", parseFloat(e.target.value) || 0)} />
        </div>
      )}
      <div className="space-y-2">
        <Label>Cupo crédito (tarjetas)</Label>
        <Input type="number" value={form.creditLimit as string} onChange={(e) => set("creditLimit", e.target.value ? parseFloat(e.target.value) : "")} />
      </div>
      <div className="space-y-2">
        <Label>Notas</Label>
        <Input value={form.notes} onChange={(e) => set("notes", e.target.value)} />
      </div>
      <Button onClick={() => onSubmit({ ...form, bankId: form.bankId || null, creditLimit: form.creditLimit !== "" ? form.creditLimit : null })} className="w-full">
        {initial?.id ? "Guardar cambios" : "Crear cuenta"}
      </Button>
    </div>
  );
}

export default function Accounts() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const accounts = useQuery({ queryKey: ["accounts"], queryFn: () => localApi<any[]>("/accounts") });

  const create = useMutation({
    mutationFn: (d: Record<string, unknown>) => localApi("/accounts", { method: "POST", body: JSON.stringify(d) }),
    onSuccess: () => { qc.invalidateQueries(); setOpen(false); toast({ title: "Cuenta creada" }); },
    onError: (e) => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });
  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      localApi(`/accounts/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries(); setEditing(null); toast({ title: "Cuenta actualizada" }); },
    onError: (e) => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });
  const archive = useMutation({
    mutationFn: (id: string) => localApi(`/accounts/${id}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries(); toast({ title: "Cuenta archivada" }); },
    onError: (e) => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });

  const slugColor: Record<string, string> = {
    cash: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    savings: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    checking: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    digital_wallet: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    credit_card: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    investment: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
    loan: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Cuentas</h1><p className="text-sm text-muted-foreground">Administra tus cuentas financieras</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nueva cuenta</Button></DialogTrigger>
          <DialogContent><DialogHeader><DialogTitle>Nueva cuenta</DialogTitle></DialogHeader>
            <AccountForm onSubmit={(d) => create.mutate(d)} />
          </DialogContent>
        </Dialog>
      </div>

      {accounts.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-36" />)}</div>
      ) : (accounts.data?.length ?? 0) === 0 ? (
        <p className="text-center text-muted-foreground py-16">Sin cuentas. Haz clic en <strong>Nueva cuenta</strong> para comenzar.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.data?.filter((a) => a.active).map((account) => (
            <Card key={account.id}>
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-base">{account.name}</CardTitle>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${slugColor[account.typeSlug] ?? ""}`}>{account.typeName}</span>
                  {account.bankName && <p className="text-xs text-muted-foreground mt-1">{account.bankName}</p>}
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(account)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => archive.mutate(account.id)}><Archive className="h-3.5 w-3.5" /></Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${account.currentBalance < 0 ? "text-red-500" : "text-green-600"}`}>
                  {fmtCOP(account.currentBalance)}
                </div>
                {account.creditLimit != null && (
                  <p className="text-xs text-muted-foreground mt-1">Cupo: {fmtCOP(account.creditLimit)} · Disponible: {fmtCOP(account.availableCredit ?? 0)}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent><DialogHeader><DialogTitle>Editar cuenta</DialogTitle></DialogHeader>
          {editing && <AccountForm initial={editing} onSubmit={(d) => update.mutate({ id: editing.id, data: d })} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
