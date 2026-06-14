import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { localApi } from "@/lib/localApi";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_BANKS = [
  { name: "Bancolombia", group: "Bancolombia S.A.", web: "www.bancolombia.com", email: "serviciocliente@bancolombia.com.co", phone: "01 8000 931 987", line018: "01 8000 931 987" },
  { name: "Davivienda", group: "Davivienda S.A.", web: "www.davivienda.com", email: "serviciocliente@davivienda.com", phone: "01 8000 517 333", line018: "01 8000 517 333" },
  { name: "Banco de Bogotá", group: "Grupo Aval", web: "www.bancodebogota.com", email: "servicioalcliente@bancodebogota.com.co", phone: "01 8000 912 345", line018: "01 8000 912 345" },
  { name: "BBVA Colombia", group: "BBVA", web: "www.bbva.com.co", email: "atencioncliente@bbva.com.co", phone: "01 8000 912 227", line018: "01 8000 912 227" },
  { name: "Banco de Occidente", group: "Grupo Aval", web: "www.bancodeoccidente.com.co", phone: "01 8000 518 989", line018: "01 8000 518 989" },
  { name: "Scotiabank Colpatria", group: "Scotiabank", web: "www.colpatria.com", phone: "01 8000 523 232", line018: "01 8000 523 232" },
  { name: "Nequi", group: "Bancolombia S.A.", web: "www.nequi.com.co", email: "soporte@nequi.com.co" },
  { name: "Daviplata", group: "Davivienda S.A.", web: "www.daviplata.com", email: "daviplata@davivienda.com" },
  { name: "Nubank Colombia", group: "Nu Holdings", web: "nu.com.co", email: "soporte@nu.com.co" },
  { name: "Lulo Bank", group: "Lulo Bank S.A.", web: "www.lulobank.com", email: "hola@lulobank.com" },
];

function BankForm({ initial, onSubmit, onClose }: { initial?: any; onSubmit: (d: Record<string, unknown>) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    name: initial?.name ?? "", group: initial?.group ?? "", web: initial?.web ?? "",
    email: initial?.email ?? "", phone: initial?.phone ?? "", line018: initial?.line018 ?? "",
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2"><Label>Nombre *</Label><Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Ej: Bancolombia" /></div>
        <div className="space-y-2"><Label>Grupo / Propietario</Label><Input value={form.group} onChange={e => set("group", e.target.value)} placeholder="Ej: Grupo Bancolombia" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2"><Label>Sitio Web</Label><Input value={form.web} onChange={e => set("web", e.target.value)} placeholder="www.banco.com" /></div>
        <div className="space-y-2"><Label>Email de contacto</Label><Input type="email" value={form.email} onChange={e => set("email", e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2"><Label>Teléfonos de contacto</Label><Input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="60X XXXXXXX" /></div>
        <div className="space-y-2"><Label>Línea 018000</Label><Input value={form.line018} onChange={e => set("line018", e.target.value)} placeholder="01 8000..." /></div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
        <Button className="flex-1" onClick={() => onSubmit(form)} disabled={!form.name}>{initial?.id ? "Guardar" : "Crear"}</Button>
      </div>
    </div>
  );
}

export default function ConfigBanks() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const banks = useQuery({ queryKey: ["banks"], queryFn: () => localApi<any[]>("/banks") });
  const create = useMutation({
    mutationFn: (d: Record<string, unknown>) => localApi("/banks", { method: "POST", body: JSON.stringify(d) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["banks"] }); setOpen(false); toast({ title: "Banco creado" }); },
    onError: e => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });
  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => localApi(`/banks/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["banks"] }); setEditing(null); toast({ title: "Banco actualizado" }); },
    onError: e => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });
  const del = useMutation({
    mutationFn: (id: string) => localApi(`/banks/${id}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["banks"] }); toast({ title: "Banco eliminado" }); },
    onError: e => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });

  async function loadDefaults() {
    for (const b of DEFAULT_BANKS) {
      await localApi("/banks", { method: "POST", body: JSON.stringify(b) });
    }
    qc.invalidateQueries({ queryKey: ["banks"] });
    toast({ title: "Bancos cargados correctamente" });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Bancos y Entidades</h1><p className="text-sm text-muted-foreground">Entidades financieras registradas</p></div>
        <div className="flex gap-2">
          {(banks.data?.length ?? 0) === 0 && (
            <Button variant="outline" size="sm" onClick={loadDefaults}>Cargar bancos predeterminados</Button>
          )}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nuevo banco</Button></DialogTrigger>
            <DialogContent><DialogHeader><DialogTitle>Nuevo banco</DialogTitle></DialogHeader>
              <BankForm onSubmit={d => create.mutate(d)} onClose={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card><CardContent className="p-0">
        {banks.isLoading ? <div className="p-6"><Skeleton className="h-32 w-full" /></div> : (
          <Table><TableHeader><TableRow>
            <TableHead>Nombre</TableHead><TableHead>Grupo</TableHead><TableHead>Web</TableHead><TableHead>Línea 018000</TableHead><TableHead></TableHead>
          </TableRow></TableHeader>
            <TableBody>
              {(banks.data?.length ?? 0) === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Sin bancos registrados</TableCell></TableRow>
              ) : banks.data?.map(b => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{b.group ?? "—"}</TableCell>
                  <TableCell className="text-sm">{b.web ? <a href={`https://${b.web}`} target="_blank" className="text-blue-500 hover:underline">{b.web}</a> : "—"}</TableCell>
                  <TableCell className="text-sm">{b.line018 ?? "—"}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(b)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => del.mutate(b.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent></Card>
      <Dialog open={!!editing} onOpenChange={o => !o && setEditing(null)}>
        <DialogContent><DialogHeader><DialogTitle>Editar banco</DialogTitle></DialogHeader>
          {editing && <BankForm initial={editing} onSubmit={d => update.mutate({ id: editing.id, data: d })} onClose={() => setEditing(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
