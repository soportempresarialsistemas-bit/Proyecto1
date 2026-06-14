import { useQuery } from "@tanstack/react-query";
import { localApi, fmtCOP, fmtDate } from "@/lib/localApi";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, Legend, PieChart, Pie, Cell,
} from "recharts";
import { Download, TrendingUp, TrendingDown, Wallet, BarChart3, FileText, FileSpreadsheet } from "lucide-react";

const COLORS = ["#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#8b5cf6","#ec4899","#06b6d4","#84cc16","#a855f7"];

function StatCard({ title, value, icon: Icon, color }: { title: string; value: string; icon: any; color?: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Icon className={`h-4 w-4 ${color ?? "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

// ─── Export helpers ─────────────────────────────────────────────────────────────
function exportCSV(filename: string, rows: any[], headers: string[], keys: string[]) {
  const lines = [headers.join(","), ...rows.map(r => keys.map(k => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(","))];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename + ".csv"; a.click();
  URL.revokeObjectURL(url);
}

function exportJSON(filename: string, data: any) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename + ".json"; a.click();
  URL.revokeObjectURL(url);
}

function exportHTML(filename: string, content: string, title: string) {
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title>
<style>body{font-family:Arial,sans-serif;padding:20px;color:#333}h1{color:#1a1a1a}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f4f4f4;font-weight:bold}.positive{color:#16a34a}.negative{color:#dc2626}</style>
</head><body>${content}</body></html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename + ".html"; a.click();
  URL.revokeObjectURL(url);
}

function exportXLSV(filename: string, rows: any[], headers: string[], keys: string[]) {
  // Generate tab-separated values that Excel opens natively
  const lines = [headers.join("\t"), ...rows.map(r => keys.map(k => String(r[k] ?? "")).join("\t"))];
  const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/tab-separated-values;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename + ".xls"; a.click();
  URL.revokeObjectURL(url);
}

function printReport() {
  window.print();
}

export default function Reports() {
  const [tab, setTab] = useState<"overview" | "statement" | "full">("overview");
  const [accountId, setAccountId] = useState("");
  const today = new Date();
  const [dateFrom, setDateFrom] = useState(`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-01`);
  const [dateTo, setDateTo] = useState(today.toISOString().slice(0,10));
  const [run, setRun] = useState(false);

  const accounts = useQuery({ queryKey: ["accounts"], queryFn: () => localApi<any[]>("/accounts") });
  const netWorthHistory = useQuery({ queryKey: ["net-worth-history"], queryFn: () => localApi<any[]>("/reports/net-worth-history?months=12") });
  const cashFlow = useQuery({ queryKey: ["cash-flow-6"], queryFn: () => localApi<any[]>("/dashboard/cash-flow?months=6") });
  const byCategory = useQuery({ queryKey: ["expense-by-cat"], queryFn: () => localApi<any[]>("/dashboard/expense-by-category") });
  const summary = useQuery({ queryKey: ["dashboard-summary"], queryFn: () => localApi<any>("/dashboard/summary") });

  const qs = accountId && run ? new URLSearchParams({ accountId, dateFrom, dateTo }).toString() : null;
  const statement = useQuery({
    queryKey: ["statement", accountId, dateFrom, dateTo],
    queryFn: () => localApi<any>(`/reports/account-statement?${qs}`),
    enabled: !!qs,
  });

  const fullQs = run ? new URLSearchParams({ dateFrom, dateTo }).toString() : null;
  const fullReport = useQuery({
    queryKey: ["full-report", dateFrom, dateTo],
    queryFn: () => localApi<any>(`/reports/full?${fullQs}`),
    enabled: !!fullQs && tab === "full",
  });

  const s = summary.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Reportes</h1><p className="text-sm text-muted-foreground">Análisis e histórico financiero</p></div>
        <Button variant="outline" size="sm" onClick={printReport}><FileText className="h-4 w-4 mr-1" />Imprimir / PDF</Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Patrimonio Neto" value={fmtCOP(s?.netWorth ?? 0)} icon={Wallet} color="text-primary" />
        <StatCard title="Activos Totales" value={fmtCOP(s?.totalAssets ?? 0)} icon={TrendingUp} color="text-green-500" />
        <StatCard title="Pasivos Totales" value={fmtCOP(s?.totalLiabilities ?? 0)} icon={TrendingDown} color="text-red-500" />
        <StatCard title="Ingresos MTD" value={fmtCOP(s?.totalIncomeMtd ?? 0)} icon={BarChart3} color="text-green-500" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {([["overview","Resumen General"],["statement","Estado de Cuenta"],["full","Informe Completo"]] as const).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${tab === id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Evolución del Patrimonio — 12 meses</CardTitle>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => exportCSV("patrimonio", netWorthHistory.data ?? [], ["Mes","Activos","Pasivos","Patrimonio"], ["month","assets","liabilities","netWorth"])}>
                      <FileSpreadsheet className="h-3 w-3 mr-1" />CSV
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => exportJSON("patrimonio", netWorthHistory.data)}>
                      <Download className="h-3 w-3 mr-1" />JSON
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {netWorthHistory.isLoading ? <Skeleton className="h-48 w-full" /> : (
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={netWorthHistory.data ?? []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tickFormatter={v => `$${(v/1e6).toFixed(0)}M`} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v: number) => fmtCOP(v)} />
                      <Legend />
                      <Line type="monotone" dataKey="assets" stroke="#22c55e" name="Activos" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="liabilities" stroke="#ef4444" name="Pasivos" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="netWorth" stroke="#3b82f6" name="Patrimonio" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Flujo de Caja — 6 meses</CardTitle>
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => exportCSV("cashflow", cashFlow.data ?? [], ["Mes","Ingresos","Gastos"], ["month","income","expenses"])}>
                    <FileSpreadsheet className="h-3 w-3 mr-1" />CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {cashFlow.isLoading ? <Skeleton className="h-48 w-full" /> : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={cashFlow.data ?? []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tickFormatter={v => `$${(v/1e6).toFixed(1)}M`} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v: number) => fmtCOP(v)} />
                      <Bar dataKey="income" fill="#22c55e" name="Ingresos" radius={[3,3,0,0]} />
                      <Bar dataKey="expenses" fill="#ef4444" name="Gastos" radius={[3,3,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Gastos por Categoría — Mes actual</CardTitle></CardHeader>
              <CardContent>
                {byCategory.isLoading ? <Skeleton className="h-48 w-full" /> : (byCategory.data?.length ?? 0) === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-12">Sin gastos este mes</p>
                ) : (
                  <div className="space-y-2">
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie data={byCategory.data} dataKey="total" nameKey="categoryName" cx="50%" cy="50%" outerRadius={70}
                          label={e => `${e.percentage?.toFixed(0)}%`} labelLine={false}>
                          {byCategory.data?.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(v: number) => fmtCOP(v)} />
                      </PieChart>
                    </ResponsiveContainer>
                    {byCategory.data?.slice(0, 5).map((c: any, i: number) => (
                      <div key={c.categoryId} className="flex items-center gap-2 text-sm">
                        <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="flex-1 truncate">{c.categoryName}</span>
                        <span className="font-medium">{fmtCOP(c.total)}</span>
                        <Badge variant="outline" className="text-xs">{c.percentage.toFixed(1)}%</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Saldos por Cuenta</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {(s?.accountSummaries ?? []).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">Sin cuentas</p>
                )}
                {s?.accountSummaries?.map((a: any) => (
                  <div key={a.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{a.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{a.typeName}</p>
                    </div>
                    <span className={`font-semibold text-sm ${a.currentBalance < 0 ? "text-red-500" : "text-green-600"}`}>{fmtCOP(a.currentBalance)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Statement Tab */}
      {tab === "statement" && (
        <Card>
          <CardHeader><CardTitle className="text-base">Estado de Cuenta</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <Label className="text-xs">Cuenta *</Label>
                <Select value={accountId || "__none__"} onValueChange={v => setAccountId(v === "__none__" ? "" : v)}>
                  <SelectTrigger className="h-8"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Seleccionar...</SelectItem>
                    {accounts.data?.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Desde</Label><Input type="date" className="h-8" value={dateFrom} onChange={e => setDateFrom(e.target.value)} /></div>
              <div><Label className="text-xs">Hasta</Label><Input type="date" className="h-8" value={dateTo} onChange={e => setDateTo(e.target.value)} /></div>
              <div className="flex items-end"><Button className="h-8 w-full" onClick={() => setRun(true)} disabled={!accountId}>Generar</Button></div>
            </div>

            {statement.isFetching && <Skeleton className="h-48 w-full" />}
            {statement.data && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-4 bg-muted rounded p-3 text-sm items-center">
                  <span>Saldo inicial: <strong>{fmtCOP(statement.data.openingBalance)}</strong></span>
                  <span>Saldo final: <strong className={statement.data.closingBalance < 0 ? "text-red-500" : "text-green-600"}>{fmtCOP(statement.data.closingBalance)}</strong></span>
                  <span className="text-muted-foreground">{statement.data.movements.length} movimientos</span>
                  <div className="flex gap-1 ml-auto">
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => exportCSV("estado-cuenta", statement.data.movements, ["Fecha","Descripción","Tipo","Monto","Saldo"], ["movementDate","description","movementTypeId","amount","runningBalance"])}>
                      <FileSpreadsheet className="h-3 w-3 mr-1" />CSV
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => exportXLSV("estado-cuenta", statement.data.movements, ["Fecha","Descripción","Tipo","Monto","Saldo"], ["movementDate","description","movementTypeId","amount","runningBalance"])}>
                      <FileSpreadsheet className="h-3 w-3 mr-1" />XLS
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => exportJSON("estado-cuenta", statement.data)}>
                      <Download className="h-3 w-3 mr-1" />JSON
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => exportHTML("estado-cuenta", `<h1>Estado de Cuenta</h1><p>Del ${dateFrom} al ${dateTo}</p><table><tr><th>Fecha</th><th>Descripción</th><th>Tipo</th><th>Monto</th><th>Saldo</th></tr>${statement.data.movements.map((m: any) => `<tr><td>${m.movementDate}</td><td>${m.description}</td><td>${m.movementTypeId}</td><td>${m.amount}</td><td>${m.runningBalance}</td></tr>`).join("")}</table>`, "Estado de Cuenta")}>
                      <FileText className="h-3 w-3 mr-1" />HTML
                    </Button>
                  </div>
                </div>
                <div className="overflow-x-auto max-h-96">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Fecha</TableHead><TableHead>Descripción</TableHead>
                      <TableHead className="text-right">Monto</TableHead><TableHead className="text-right">Saldo</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {statement.data.movements.map((m: any) => (
                        <TableRow key={m.id}>
                          <TableCell className="text-sm">{fmtDate(m.movementDate)}</TableCell>
                          <TableCell className="text-sm">{m.description}</TableCell>
                          <TableCell className={`text-right text-sm font-medium ${m.movementTypeId === "credit" ? "text-green-600" : "text-red-500"}`}>
                            {m.movementTypeId === "credit" ? "+" : "-"}{fmtCOP(m.amount)}
                          </TableCell>
                          <TableCell className={`text-right text-sm font-semibold ${m.runningBalance < 0 ? "text-red-500" : ""}`}>
                            {fmtCOP(m.runningBalance)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Full Report Tab */}
      {tab === "full" && (
        <Card>
          <CardHeader><CardTitle className="text-base">Informe Completo de Ingresos y Gastos</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div><Label className="text-xs">Desde</Label><Input type="date" className="h-8" value={dateFrom} onChange={e => setDateFrom(e.target.value)} /></div>
              <div><Label className="text-xs">Hasta</Label><Input type="date" className="h-8" value={dateTo} onChange={e => setDateTo(e.target.value)} /></div>
              <div className="flex items-end"><Button className="h-8 w-full" onClick={() => setRun(true)}>Generar</Button></div>
            </div>

            {fullReport.isFetching && <Skeleton className="h-48 w-full" />}
            {fullReport.data && (
              <div className="space-y-4">
                <div className="grid gap-3 grid-cols-3">
                  <div className="rounded-lg bg-green-50 dark:bg-green-950 p-3 text-center">
                    <p className="text-xs text-muted-foreground">Total Ingresos</p>
                    <p className="font-bold text-green-600 text-lg">{fmtCOP(fullReport.data.totalIncome)}</p>
                  </div>
                  <div className="rounded-lg bg-red-50 dark:bg-red-950 p-3 text-center">
                    <p className="text-xs text-muted-foreground">Total Gastos</p>
                    <p className="font-bold text-red-500 text-lg">{fmtCOP(fullReport.data.totalExpense)}</p>
                  </div>
                  <div className={`rounded-lg p-3 text-center ${fullReport.data.balance >= 0 ? "bg-blue-50 dark:bg-blue-950" : "bg-orange-50 dark:bg-orange-950"}`}>
                    <p className="text-xs text-muted-foreground">Balance</p>
                    <p className={`font-bold text-lg ${fullReport.data.balance >= 0 ? "text-blue-600" : "text-orange-600"}`}>{fmtCOP(fullReport.data.balance)}</p>
                  </div>
                </div>

                <div className="flex gap-1 flex-wrap">
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => exportCSV("informe-ingresos", fullReport.data.incomes, ["Fecha","Cuenta","Categoría","Pagador","Descripción","Monto"], ["date","accountName","categoryName","payerName","description","amount"])}>
                    <FileSpreadsheet className="h-3 w-3 mr-1" />CSV Ingresos
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => exportCSV("informe-gastos", fullReport.data.expenses, ["Fecha","Cuenta","Categoría","Beneficiario","Descripción","Monto"], ["date","accountName","categoryName","beneficiaryName","description","amount"])}>
                    <FileSpreadsheet className="h-3 w-3 mr-1" />CSV Gastos
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => exportXLSV("informe-completo", [...fullReport.data.incomes.map((i: any) => ({...i, tipo: "Ingreso"})), ...fullReport.data.expenses.map((e: any) => ({...e, tipo: "Gasto"}))], ["Tipo","Fecha","Cuenta","Categoría","Descripción","Monto"], ["tipo","date","accountName","categoryName","description","amount"])}>
                    <FileSpreadsheet className="h-3 w-3 mr-1" />XLS
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => exportJSON("informe-completo", fullReport.data)}>
                    <Download className="h-3 w-3 mr-1" />JSON
                  </Button>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-green-700">Ingresos ({fullReport.data.incomes.length})</h3>
                  <div className="overflow-x-auto max-h-64">
                    <Table>
                      <TableHeader><TableRow><TableHead>Fecha</TableHead><TableHead>Cuenta</TableHead><TableHead>Categoría</TableHead><TableHead>Pagador</TableHead><TableHead className="text-right">Monto</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {fullReport.data.incomes.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-4">Sin ingresos</TableCell></TableRow> :
                        fullReport.data.incomes.map((i: any) => (
                          <TableRow key={i.id}>
                            <TableCell className="text-sm">{fmtDate(i.date)}</TableCell>
                            <TableCell className="text-sm">{i.accountName}</TableCell>
                            <TableCell className="text-sm">{i.categoryName}</TableCell>
                            <TableCell className="text-sm">{i.payerName ?? "—"}</TableCell>
                            <TableCell className="text-right text-sm font-medium text-green-600">{fmtCOP(i.amount)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-red-700">Gastos ({fullReport.data.expenses.length})</h3>
                  <div className="overflow-x-auto max-h-64">
                    <Table>
                      <TableHeader><TableRow><TableHead>Fecha</TableHead><TableHead>Cuenta</TableHead><TableHead>Categoría</TableHead><TableHead>Beneficiario</TableHead><TableHead className="text-right">Monto</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {fullReport.data.expenses.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-4">Sin gastos</TableCell></TableRow> :
                        fullReport.data.expenses.map((e: any) => (
                          <TableRow key={e.id}>
                            <TableCell className="text-sm">{fmtDate(e.date)}</TableCell>
                            <TableCell className="text-sm">{e.accountName}</TableCell>
                            <TableCell className="text-sm">{e.categoryName}</TableCell>
                            <TableCell className="text-sm">{e.beneficiaryName ?? "—"}</TableCell>
                            <TableCell className="text-right text-sm font-medium text-red-500">{fmtCOP(e.amount)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
