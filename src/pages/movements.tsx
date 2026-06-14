import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { localApi, fmtCOP, fmtDate } from "@/lib/localApi";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { XCircle, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MODULE_LABELS: Record<string, string> = {
  income: "Ingreso", expense: "Gasto", transfer_in: "Transferencia (+)",
  transfer_out: "Transferencia (-)", credit_purchase: "Compra TC",
  installment_payment: "Cuota TC", opening: "Saldo inicial",
};

export default function Movements() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [accountId, setAccountId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [voidTarget, setVoidTarget] = useState<any>(null);
  const [voidReason, setVoidReason] = useState("");

  const accounts = useQuery({ queryKey: ["accounts"], queryFn: () => localApi<any[]>("/accounts") });

  const qsObj = new URLSearchParams();
  if (accountId && accountId !== "__none__") qsObj.append("accountId", accountId);
  if (dateFrom) qsObj.append("dateFrom", dateFrom);
  if (dateTo) qsObj.append("dateTo", dateTo);
  qsObj.append("limit", "100");

  const movements = useQuery({
    queryKey: ["movements", accountId, dateFrom, dateTo],
    queryFn: () => localApi<{ data: any[]; total: number }>(`/movements?${qsObj}`),
  });

  const voidMov = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      localApi(`/movements/${id}/void`, { method: "PATCH", body: JSON.stringify({ reason }) }),
    onSuccess: () => {
      qc.invalidateQueries();
      setVoidTarget(null);
      toast({ title: "Movimiento anulado" });
    },
    onError: (e) => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Movimientos</h1><p className="text-sm text-muted-foreground">Libro de movimientos de todas las cuentas</p></div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Filter className="h-4 w-4" /> Filtros</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <Label className="text-xs">Cuenta</Label>
              <Select value={accountId || "__none__"} onValueChange={(v) => setAccountId(v === "__none__" ? "" : v)}>
                <SelectTrigger className="h-8"><SelectValue placeholder="Todas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Todas</SelectItem>
                  {accounts.data?.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Desde</Label><Input type="date" className="h-8" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} /></div>
            <div><Label className="text-xs">Hasta</Label><Input type="date" className="h-8" value={dateTo} onChange={(e) => setDateTo(e.target.value)} /></div>
            <div className="flex items-end">
              <Button variant="outline" className="h-8 w-full" onClick={() => { setAccountId(""); setDateFrom(""); setDateTo(""); }}>Limpiar</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {movements.isLoading ? <div className="p-6"><Skeleton className="h-48 w-full" /></div> : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead><TableHead>Cuenta</TableHead><TableHead>Descripción</TableHead>
                    <TableHead>Módulo</TableHead><TableHead className="text-right">Monto</TableHead>
                    <TableHead>Estado</TableHead><TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(movements.data?.data ?? []).length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Sin movimientos</TableCell></TableRow>
                  ) : movements.data?.data.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="text-sm">{fmtDate(m.movementDate)}</TableCell>
                      <TableCell className="text-sm">{m.accountName}</TableCell>
                      <TableCell className="text-sm max-w-[200px] truncate">{m.description}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{MODULE_LABELS[m.referenceModule] ?? m.referenceModule}</Badge></TableCell>
                      <TableCell className={`text-right font-medium ${m.movementTypeId === "credit" ? "text-green-600" : "text-red-500"}`}>
                        {m.movementTypeId === "credit" ? "+" : "-"}{fmtCOP(m.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={m.status === "active" ? "default" : "secondary"} className="text-xs">
                          {m.status === "active" ? "Activo" : "Anulado"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {m.status === "active" && (
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive"
                            onClick={() => { setVoidTarget(m); setVoidReason(""); }}>
                            <XCircle className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!voidTarget} onOpenChange={(o) => !o && setVoidTarget(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Anular movimiento</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Esta acción es irreversible.</p>
          <div className="space-y-2">
            <Label>Motivo</Label>
            <Input value={voidReason} onChange={(e) => setVoidReason(e.target.value)} placeholder="Ej: Duplicado" />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setVoidTarget(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => voidMov.mutate({ id: voidTarget.id, reason: voidReason })}>Anular</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
