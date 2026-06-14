import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { localApi } from "@/lib/localApi";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ConfigCategories() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [form, setForm] = useState({ name: "", type: "expense", color: "#94a3b8", kind: "category", parentId: "" });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const qs = filterType !== "all" ? `?type=${filterType}` : "";
  const categories = useQuery({ queryKey: ["categories", filterType], queryFn: () => localApi<any[]>(`/categories${qs}`) });
  const allCategories = useQuery({ queryKey: ["categories", "all"], queryFn: () => localApi<any[]>("/categories") });

  const parentCats = allCategories.data?.filter(c => !c.parentId && c.type === form.type) ?? [];

  const create = useMutation({
    mutationFn: (d: Record<string, unknown>) => localApi("/categories", { method: "POST", body: JSON.stringify(d) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["categories"] }); setOpen(false); toast({ title: "Categoría creada" }); },
    onError: e => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });
  const del = useMutation({
    mutationFn: (id: string) => localApi(`/categories/${id}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["categories"] }); toast({ title: "Eliminada" }); },
    onError: e => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });

  const typeVariant: Record<string, string> = {
    income: "text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-200",
    expense: "text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-200",
  };

  const mainCats = categories.data?.filter(c => !c.parentId) ?? [];
  const subCats = categories.data?.filter(c => c.parentId) ?? [];

  function handleCreate() {
    const data: Record<string, unknown> = {
      name: form.name, type: form.type, color: form.color,
      parentId: form.kind === "subcategory" && form.parentId ? form.parentId : null,
    };
    create.mutate(data);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Categorías</h1><p className="text-sm text-muted-foreground">Organiza tus transacciones</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nueva</Button></DialogTrigger>
          <DialogContent><DialogHeader><DialogTitle>Nueva categoría</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Nombre *</Label><Input value={form.name} onChange={e => set("name", e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Tipo de transacción *</Label>
                  <Select value={form.type} onValueChange={v => set("type", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="income">Ingreso</SelectItem><SelectItem value="expense">Gasto</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>¿Es categoría o subcategoría?</Label>
                  <Select value={form.kind} onValueChange={v => set("kind", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="category">Categoría principal</SelectItem>
                      <SelectItem value="subcategory">Subcategoría</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {form.kind === "subcategory" && (
                <div className="space-y-2">
                  <Label>Categoría padre *</Label>
                  <Select value={form.parentId} onValueChange={v => set("parentId", v)}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar categoría..." /></SelectTrigger>
                    <SelectContent>
                      {parentCats.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={form.color} onChange={e => set("color", e.target.value)} className="h-8 w-8 rounded border cursor-pointer" />
                  <Input value={form.color} onChange={e => set("color", e.target.value)} className="flex-1" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button className="flex-1" onClick={handleCreate} disabled={!form.name || (form.kind === "subcategory" && !form.parentId)}>Crear</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex gap-2">
        {["all", "income", "expense"].map(t => (
          <Button key={t} variant={filterType === t ? "default" : "outline"} size="sm" onClick={() => setFilterType(t)}>
            {t === "all" ? "Todas" : t === "income" ? "Ingresos" : "Gastos"}
          </Button>
        ))}
      </div>
      <Card><CardContent className="p-0">
        {categories.isLoading ? <div className="p-6"><Skeleton className="h-32 w-full" /></div> : (
          <Table><TableHeader><TableRow><TableHead>Color</TableHead><TableHead>Nombre</TableHead><TableHead>Tipo</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>
              {/* Main categories */}
              {mainCats.map(c => {
                const subs = subCats.filter(s => s.parentId === c.id);
                return (
                  <>
                    <TableRow key={c.id} className="font-medium">
                      <TableCell><div className="h-5 w-5 rounded" style={{ backgroundColor: c.color ?? "#94a3b8" }} /></TableCell>
                      <TableCell className="font-semibold">{c.name}</TableCell>
                      <TableCell><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeVariant[c.type] ?? ""}`}>{c.type === "income" ? "Ingreso" : "Gasto"}</span></TableCell>
                      <TableCell className="text-right"><Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => del.mutate(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button></TableCell>
                    </TableRow>
                    {subs.map(s => (
                      <TableRow key={s.id} className="bg-muted/30">
                        <TableCell className="pl-8"><div className="h-4 w-4 rounded" style={{ backgroundColor: s.color ?? "#94a3b8" }} /></TableCell>
                        <TableCell className="pl-8 text-sm flex items-center gap-1"><ChevronRight className="h-3 w-3 text-muted-foreground" />{s.name}</TableCell>
                        <TableCell><span className="text-xs text-muted-foreground">Subcategoría</span></TableCell>
                        <TableCell className="text-right"><Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => del.mutate(s.id)}><Trash2 className="h-3.5 w-3.5" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent></Card>
    </div>
  );
}
