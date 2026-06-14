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
import { Plus, Trash2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ConfigPaymentMethods() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const list = useQuery({ queryKey: ["payment-methods"], queryFn: () => localApi<any[]>("/payment-methods") });
  const create = useMutation({
    mutationFn: (n: string) => localApi("/payment-methods", { method: "POST", body: JSON.stringify({ name: n }) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["payment-methods"] }); setOpen(false); setName(""); toast({ title: "Método creado" }); },
    onError: e => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });
  const del = useMutation({
    mutationFn: (id: string) => localApi(`/payment-methods/${id}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["payment-methods"] }); toast({ title: "Eliminado" }); },
    onError: e => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Métodos de pago</h1><p className="text-sm text-muted-foreground">Formas de pago disponibles en el sistema</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nuevo</Button></DialogTrigger>
          <DialogContent><DialogHeader><DialogTitle>Nuevo método de pago</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Nombre *</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Nequi" /></div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button className="flex-1" onClick={() => create.mutate(name)} disabled={!name}>Crear</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card><CardContent className="p-0">
        {list.isLoading ? <div className="p-6"><Skeleton className="h-32 w-full" /></div> : (
          <Table><TableHeader><TableRow><TableHead>Método de pago</TableHead><TableHead>Tipo</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>
              {list.data?.map(m => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>{m.isDefault ? <Badge variant="secondary">Predeterminado</Badge> : <Badge variant="outline">Personalizado</Badge>}</TableCell>
                  <TableCell className="text-right">
                    {!m.isDefault ? (
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => del.mutate(m.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground ml-auto" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent></Card>
    </div>
  );
}
