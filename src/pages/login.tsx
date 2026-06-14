import { useState } from "react";
import { localApi } from "@/lib/localApi";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Wallet, LogIn, UserPlus } from "lucide-react";
import { store } from "@/lib/store";

interface LoginProps { onLogin: () => void }

interface NewUserForm {
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export default function Login({ onLogin }: LoginProps) {
  const { toast } = useToast();
  const [userId, setUserId] = useState("master-admin");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewUserDialog, setShowNewUserDialog] = useState(false);
  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [creatingUser, setCreatingUser] = useState(false);

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

  async function handleCreateNewUser(e: React.FormEvent) {
    e.preventDefault();
    
    // Validaciones
    if (!newUserForm.firstName.trim()) {
      toast({ title: "Error", description: "El nombre es requerido", variant: "destructive" });
      return;
    }
    if (!newUserForm.lastName.trim()) {
      toast({ title: "Error", description: "El apellido es requerido", variant: "destructive" });
      return;
    }
    if (newUserForm.password.length < 4) {
      toast({ title: "Error", description: "La contraseña debe tener al menos 4 caracteres", variant: "destructive" });
      return;
    }
    if (newUserForm.password !== newUserForm.confirmPassword) {
      toast({ title: "Error", description: "Las contraseñas no coinciden", variant: "destructive" });
      return;
    }

    setCreatingUser(true);
    try {
      // Crear usuario con rol "standard"
      const newUser = store.createUser({
        firstName: newUserForm.firstName.trim(),
        lastName: newUserForm.lastName.trim(),
        role: "standard",
        password: newUserForm.password,
        permissions: "readonly",
      });

      toast({ 
        title: "Usuario creado", 
        description: `${newUser.firstName} ${newUser.lastName} ha sido registrado exitosamente`,
        variant: "default"
      });

      // Limpiar formulario y cerrar diálogo
      setNewUserForm({ firstName: "", lastName: "", password: "", confirmPassword: "" });
      setShowNewUserDialog(false);

      // Actualizar lista de usuarios recargando la página
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "No se pudo crear el usuario", 
        variant: "destructive" 
      });
    } finally {
      setCreatingUser(false);
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
                    <SelectItem value="__new__">➕ Otro (crear nuevo usuario)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {userId !== "__new__" && (
                <>
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
                </>
              )}

              {userId === "__new__" && (
                <Button 
                  type="button" 
                  className="w-full" 
                  onClick={() => setShowNewUserDialog(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Crear nuevo usuario
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Finanzas Premium v8.0 — Gestión financiera personal
        </p>
      </div>

      {/* Dialog para crear nuevo usuario */}
      <Dialog open={showNewUserDialog} onOpenChange={setShowNewUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear nuevo usuario</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateNewUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre *</Label>
              <Input
                id="firstName"
                value={newUserForm.firstName}
                onChange={e => setNewUserForm({ ...newUserForm, firstName: e.target.value })}
                placeholder="Ej: Juan"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido *</Label>
              <Input
                id="lastName"
                value={newUserForm.lastName}
                onChange={e => setNewUserForm({ ...newUserForm, lastName: e.target.value })}
                placeholder="Ej: Pérez"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                type="password"
                value={newUserForm.password}
                onChange={e => setNewUserForm({ ...newUserForm, password: e.target.value })}
                placeholder="Mínimo 4 caracteres"
              />
              <p className="text-xs text-muted-foreground">Mínimo 4 caracteres</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={newUserForm.confirmPassword}
                onChange={e => setNewUserForm({ ...newUserForm, confirmPassword: e.target.value })}
                placeholder="Repite tu contraseña"
              />
            </div>

            <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-3 text-sm text-blue-900 dark:text-blue-100">
              <p className="font-medium">ℹ️ Rol asignado</p>
              <p>Este usuario será creado con rol <strong>Standard</strong> y deberá completar la configuración inicial.</p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowNewUserDialog(false)}
                disabled={creatingUser}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={creatingUser}
              >
                {creatingUser ? "Creando..." : "Crear usuario"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
