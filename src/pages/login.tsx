import { useState } from "react";
import { localApi } from "@/lib/localApi";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, LogIn } from "lucide-react";

interface LoginProps { onLogin: () => void }

export default function Login({ onLogin }: LoginProps) {
  const { toast } = useToast();
  const [userId, setUserId] = useState("master-admin");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await localApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ userId, password }),
      });
      onLogin();
    } catch {
      toast({ title: "Acceso denegado", description: "Credenciales incorrectas", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  const users: { id: string; label: string }[] = [{ id: "master-admin", label: "Master-Admin" }];
  try {
    const stored = JSON.parse(localStorage.getItem("fp8:users") ?? "[]");
    for (const u of stored) {
      if (!users.find(x => x.id === u.id)) {
        users.push({ id: u.id, label: `${u.firstName} ${u.lastName}` });
      }
    }
  } catch {}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/40">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Wallet className="h-8 w-8" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Finanzas Premium</h1>
            <p className="text-sm text-muted-foreground">Gestión financiera personal</p>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Iniciar Sesión</CardTitle>
            <CardDescription>Selecciona tu usuario e ingresa tu clave</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label>Usuario</Label>
                <Select value={userId} onValueChange={setUserId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(u => (
                      <SelectItem key={u.id} value={u.id}>{u.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Contraseña</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={userId === "master-admin" ? "Sin contraseña — solo presiona Entrar" : "Ingresa tu contraseña"}
                  autoFocus
                />
                {userId === "master-admin" && (
                  <p className="text-xs text-muted-foreground">El usuario Master-Admin no requiere contraseña.</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                <LogIn className="h-4 w-4 mr-2" />
                {loading ? "Ingresando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Finanzas Premium v8.0 — Gestión financiera personal
        </p>
      </div>
    </div>
  );
}
