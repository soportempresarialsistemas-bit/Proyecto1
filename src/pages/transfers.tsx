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
import { Plus, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Transfers() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ sourceAccountId: "", destinationAccountId: "", amount: "", transferDate: todayStr(), notes: "" });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const accounts = useQuery({ queryKey: ["accounts"], queryFn: () => localApi<any[]>("/accounts") });
  const transfers = useQuery({ queryKey: ["transfers"], queryFn: () => localApi<any[]>("/transfers") });
  const create = useMutation({
    mutationFn: (d: Record<string, unknown>) => localApi("/transfers", { method: "POST", body: JSON.stringify(d) }),
    onSuccess: () => {
      qc.invalidateQueries();
      setOpen(false);
      setForm({ sourceAccountId: "", destinationAccountId: "", amount: "", transferDate: todayStr(), notes: "" });
      toast({ title: "Transferencia registrada" });
    },
    onError: (e) => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Transferencias</h1><p className="text-sm text-muted-foreground">Movimientos entre cuentas</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nueva transferencia</Button></DialogTrigger>
          <DialogContent><DialogHeader><DialogTitle>Nueva transferencia</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Origen *</Label>
                  <Select value={form.sourceAccountId} onValueChange={(v) => set("sourceAccountId", v)}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                    <SelectContent>{accounts.data?.filter((a) => a.active).map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Destino *</Label>
                  <Select value={form.destinationAccountId} onValueChange={(v) => set("destinationAccountId", v)}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                    <SelectContent>{accounts.data?.filter((a) => a.active).map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Monto (COP) *</Label><Input type="number" value={form.amount} onChange={(e) => set("amount", e.target.value)} /></div>
                <div className="space-y-2"><Label>Fecha *</Label><Input type="date" value={form.transferDate} onChange={(e) => set("transferDate", e.target.value)} /></div>
              </div>
              <div className="space-y-2"><Label>Notas</Label><Input value={form.notes} onChange={(e) => set("notes", e.target.value)} /></div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button className="flex-1" onClick={() => create.mutate({ ...form, amount: parseFloat(form.amount), notes: form.notes || null })}>Transferir</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card><CardContent className="p-0">
        {transfers.isLoading ? <div className="p-6"><Skeleton className="h-48 w-full" /></div> : (
          <div className="overflow-x-auto"><Table>
            <TableHeader><TableRow>
              <TableHead>Fecha</TableHead><TableHead>Origen</TableHead><TableHead></TableHead>
              <TableHead>Destino</TableHead><TableHead className="text-right">Monto</TableHead><TableHead>Notas</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {(transfers.data?.length ?? 0) === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Sin transferencias</TableCell></TableRow>
              ) : transfers.data?.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{fmtDate(t.transferDate)}</TableCell>
                  <TableCell className="font-medium">{t.sourceAccountName}</TableCell>
                  <TableCell><ArrowRight className="h-4 w-4 text-muted-foreground" /></TableCell>
                  <TableCell className="font-medium">{t.destAccountName}</TableCell>
                  <TableCell className="text-right font-medium">{fmtCOP(t.amount)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.notes ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></div>
        )}
      </CardContent></Card>
    </div>
  );
}
