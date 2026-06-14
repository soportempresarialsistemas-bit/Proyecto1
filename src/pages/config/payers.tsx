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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { COUNTRIES, getStatesForCountry, getCitiesForState } from "@/lib/geography";

const PAYER_TYPES = ["Personas", "Negocios", "Entidades financieras", "Entidades de Gobierno", "Clientes", "Empleador", "Cuenta propia"];
const ID_TYPES = ["Cédula de ciudadanía (C.C.)", "Número de identificación tributaria (NIT)", "Cédula de extranjería (CE)", "Tarjeta de identidad (T.I.)", "Sin especificar"];

function PayerForm({ initial, onSubmit, onClose }: { initial?: any; onSubmit: (d: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    type: initial?.type ?? "Personas",
    firstName: initial?.firstName ?? "", lastName: initial?.lastName ?? "",
    idType: initial?.idType ?? "Sin especificar", idNumber: initial?.idNumber ?? "",
    email: initial?.email ?? "", web: initial?.web ?? "",
    phone1: initial?.phone1 ?? "", phone2: initial?.phone2 ?? "", phone3: initial?.phone3 ?? "",
    address: initial?.address ?? "",
    country: initial?.country ?? "Colombia", state: initial?.state ?? "", city: initial?.city ?? "",
    notes: initial?.notes ?? "",
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const showLastName = form.type === "Personas" || form.type === "Clientes";
  const noId = form.idType === "Sin especificar";
  const states = getStatesForCountry(form.country);
  const cities = getCitiesForState(form.country, form.state);

  return (
    <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-2">
          <Label>Tipo *</Label>
          <Select value={form.type} onValueChange={v => set("type", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{PAYER_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>{showLastName ? "Nombres *" : "Nombre / Razón Social *"}</Label><Input value={form.firstName} onChange={e => set("firstName", e.target.value)} /></div>
        <div className="space-y-2">
          <Label>Apellidos</Label>
          <Input value={form.lastName} onChange={e => set("lastName", e.target.value)} disabled={!showLastName} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Tipo de identificación</Label>
          <Select value={form.idType} onValueChange={v => set("idType", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{ID_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Número de identificación</Label>
          <Input value={form.idNumber} onChange={e => set("idNumber", e.target.value)} disabled={noId} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={e => set("email", e.target.value)} /></div>
        <div className="space-y-2"><Label>Sitio Web</Label><Input value={form.web} onChange={e => set("web", e.target.value)} /></div>
      </div>
      <div className="space-y-2">
        <Label>Teléfono Principal</Label>
        <Input value={form.phone1} onChange={e => set("phone1", e.target.value)} placeholder="Teléfono principal" />
      </div>
      {form.phone1 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2"><Label>Teléfono alternativo 1</Label><Input value={form.phone2} onChange={e => set("phone2", e.target.value)} /></div>
          <div className="space-y-2"><Label>Teléfono alternativo 2</Label><Input value={form.phone3} onChange={e => set("phone3", e.target.value)} /></div>
        </div>
      )}
      <div className="space-y-2"><Label>Dirección</Label><Input value={form.address} onChange={e => set("address", e.target.value)} /></div>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label>País</Label>
          <Select value={form.country} onValueChange={v => { set("country", v); set("state", ""); set("city", ""); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{COUNTRIES.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Departamento/Estado</Label>
          <Select value={form.state} onValueChange={v => { set("state", v); set("city", ""); }} disabled={states.length === 0}>
            <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
            <SelectContent>{states.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Ciudad/Municipio</Label>
          <Select value={form.city} onValueChange={v => set("city", v)} disabled={cities.length === 0}>
            <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
            <SelectContent>{cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2"><Label>Notas</Label><Input value={form.notes} onChange={e => set("notes", e.target.value)} /></div>
      <div className="flex gap-2 pt-2">
        <Button variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
        <Button className="flex-1" onClick={() => onSubmit({ ...form, idNumber: noId ? "" : form.idNumber })} disabled={!form.firstName}>
          {initial?.id ? "Guardar" : "Crear"}
        </Button>
      </div>
    </div>
  );
}

export default function ConfigPayers() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const list = useQuery({ queryKey: ["payers"], queryFn: () => localApi<any[]>("/payers") });
  const create = useMutation({
    mutationFn: (d: any) => localApi("/payers", { method: "POST", body: JSON.stringify(d) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["payers"] }); setOpen(false); toast({ title: "Pagador creado" }); },
    onError: e => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });
  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => localApi(`/payers/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["payers"] }); setEditing(null); toast({ title: "Actualizado" }); },
    onError: e => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });
  const del = useMutation({
    mutationFn: (id: string) => localApi(`/payers/${id}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["payers"] }); toast({ title: "Eliminado" }); },
    onError: e => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Pagadores</h1><p className="text-sm text-muted-foreground">Quienes te realizan pagos</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nuevo</Button></DialogTrigger>
          <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Nuevo pagador</DialogTitle></DialogHeader>
            <PayerForm onSubmit={d => create.mutate(d)} onClose={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <Card><CardContent className="p-0">
        {list.isLoading ? <div className="p-6"><Skeleton className="h-32 w-full" /></div> : (
          <Table><TableHeader><TableRow>
            <TableHead>Nombre</TableHead><TableHead>Tipo</TableHead><TableHead>País</TableHead><TableHead>Teléfono</TableHead><TableHead></TableHead>
          </TableRow></TableHeader>
            <TableBody>
              {(list.data?.length ?? 0) === 0 ? <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Sin pagadores</TableCell></TableRow> :
              list.data?.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.type}</TableCell>
                  <TableCell className="text-sm">{p.city ? `${p.city}, ` : ""}{p.country ?? "—"}</TableCell>
                  <TableCell className="text-sm">{p.phone1 ?? "—"}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => del.mutate(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent></Card>
      <Dialog open={!!editing} onOpenChange={o => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Editar pagador</DialogTitle></DialogHeader>
          {editing && <PayerForm initial={editing} onSubmit={d => update.mutate({ id: editing.id, data: d })} onClose={() => setEditing(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
