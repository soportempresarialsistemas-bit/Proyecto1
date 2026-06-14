import { useQuery } from "@tanstack/react-query";
import { localApi, fmtCOP, fmtDate } from "@/lib/localApi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Wallet, CreditCard, AlertCircle, BarChart3 } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#8b5cf6","#ec4899","#06b6d4","#84cc16","#a855f7"];

function StatCard({ title, value, sub, icon: Icon, color }: {
  title: string; value: string; sub?: string; icon: React.ComponentType<{ className?: string }>; color?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color ?? "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const summary = useQuery({ queryKey: ["dashboard-summary"], queryFn: () => localApi<any>("/dashboard/summary") });
  const cashFlow = useQuery({ queryKey: ["cash-flow"], queryFn: () => localApi<any[]>("/dashboard/cash-flow?months=6") });
  const byCategory = useQuery({ queryKey: ["expense-by-cat"], queryFn: () => localApi<any[]>("/dashboard/expense-by-category") });
  const upcoming = useQuery({ queryKey: ["upcoming-commitments"], queryFn: () => localApi<any[]>("/dashboard/upcoming-commitments?days=30") });

  const s = summary.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Resumen financiero al día de hoy</p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Patrimonio Neto" value={fmtCOP(s?.netWorth ?? 0)} icon={Wallet} color="text-primary" />
        <StatCard title="Activos Totales" value={fmtCOP(s?.totalAssets ?? 0)} icon={TrendingUp} color="text-green-500" />
        <StatCard title="Pasivos Totales" value={fmtCOP(s?.totalLiabilities ?? 0)} icon={TrendingDown} color="text-red-500" />
        <StatCard title="Liquidez" value={fmtCOP(s?.liquidAssets ?? 0)} sub="Efectivo + Corriente" icon={CreditCard} />
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Ingresos MTD" value={fmtCOP(s?.totalIncomeMtd ?? 0)} icon={TrendingUp} color="text-green-500" />
        <StatCard title="Gastos MTD" value={fmtCOP(s?.totalExpenseMtd ?? 0)} icon={TrendingDown} color="text-red-500" />
        <StatCard title="Balance MTD" value={fmtCOP((s?.totalIncomeMtd ?? 0) - (s?.totalExpenseMtd ?? 0))} icon={BarChart3}
          color={(s?.totalIncomeMtd ?? 0) >= (s?.totalExpenseMtd ?? 0) ? "text-green-500" : "text-red-500"} />
        <StatCard title="Cuentas Activas" value={String(s?.accountSummaries?.length ?? 0)} icon={Wallet} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Flujo de Caja — 6 meses</CardTitle></CardHeader>
          <CardContent>
            {cashFlow.isLoading ? <Skeleton className="h-48 w-full" /> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={cashFlow.data ?? []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `$${(v/1e6).toFixed(1)}M`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => fmtCOP(v)} />
                  <Bar dataKey="income" fill="#22c55e" name="Ingresos" radius={[3,3,0,0]} />
                  <Bar dataKey="expenses" fill="#ef4444" name="Gastos" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Gastos por Categoría — Mes actual</CardTitle></CardHeader>
          <CardContent>
            {byCategory.isLoading ? <Skeleton className="h-48 w-full" /> : (byCategory.data?.length ?? 0) === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">Sin gastos este mes</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={byCategory.data} dataKey="total" nameKey="categoryName" cx="50%" cy="50%" outerRadius={75}
                    label={(e) => `${e.percentage?.toFixed(0)}%`} labelLine={false}>
                    {byCategory.data?.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => fmtCOP(v)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Saldos por Cuenta</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {(s?.accountSummaries ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">Sin cuentas. Crea una en <strong>Cuentas</strong>.</p>
            )}
            {(s?.accountSummaries ?? []).map((a: any) => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium">{a.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{a.typeName}</p>
                </div>
                <span className={`font-semibold text-sm ${a.currentBalance < 0 ? "text-red-500" : "text-green-600"}`}>
                  {fmtCOP(a.currentBalance)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Próximos Compromisos</CardTitle>
            <CardDescription>Próximos 30 días</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {(upcoming.data?.length ?? 0) === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Sin compromisos próximos</p>
            ) : upcoming.data?.map((c: any) => (
              <div key={c.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium line-clamp-1">{c.description}</p>
                    <p className="text-xs text-muted-foreground">Vence: {fmtDate(c.dueDate)}</p>
                  </div>
                </div>
                <span className="font-semibold text-sm text-red-500 shrink-0">{fmtCOP(c.amount)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
