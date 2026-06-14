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
import { Plus, Shield, Trash2, Eye, EyeOff, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { store } from "@/lib/store";

function UserForm({ onSubmit, onClose }: { onSubmit: (d: Record<string, unknown>) => void; onClose: () => void }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", role: "standard", password: "", confirmPassword: "", permissions: "readonly" });
  const [showPw, setShowPw] = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  function handleSubmit() {
    if (!form.firstName) return;
    if (form.password !== form.confirmPassword) return;
    onSubmit({ firstName: form.firstName, lastName: form.lastName, role: form.role, password: form.password, permissions: form.permissions });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2"><Label>Nombres *</Label><Input value={form.firstName} onChange={e => set("firstName", e.target.value)} /></div>
        <div className="space-y-2"><Label>Apellidos *</Label><Input value={form.lastName} onChange={e => set("lastName", e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Rol</Label>
          <Select value={form.role} onValueChange={v => { set("role", v); set("permissions", v === "admin" ? "full" : "readonly"); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="standard">Estándar</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Permisos</Label>
          <Select value={form.permissions} onValueChange={v => set("permissions", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Administrador (control total)</SelectItem>
              <SelectItem value="readonly">Estándar (solo lectura)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Contraseña</Label>
        <div className="relative">
          <Input type={showPw ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)} />
          <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 h-7 w-7" onClick={() => setShowPw(p => !p)}>
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Confirmar contraseña</Label>
        <Input type={showPw ? "text" : "password"} value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} />
        {form.password !== form.confirmPassword && form.confirmPassword && (
          <p className="text-xs text-red-500">Las contraseñas no coinciden</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
        <Button className="flex-1" onClick={handleSubmit} disabled={!form.firstName || (form.password !== form.confirmPassword)}>Crear usuario</Button>
      </div>
    </div>
  );
}

function ChangePasswordForm({ userId, userName, onSubmit, onClose }: { userId: string; userName: string; onSubmit: (d: Record<string, unknown>) => void; onClose: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  function handleSubmit() {
    if (!form.currentPassword) {
      toast({ title: "Error", description: "Debes ingresar la contraseña actual", variant: "destructive" });
      return;
    }
    if (form.newPassword.length < 4) {
      toast({ title: "Error", description: "La nueva contraseña debe tener al menos 4 caracteres", variant: "destructive" });
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast({ title: "Error", description: "Las nuevas contraseñas no coinciden", variant: "destructive" });
      return;
    }
    onSubmit({ userId, currentPassword: form.currentPassword, newPassword: form.newPassword });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-3 text-sm text-blue-900 dark:text-blue-100">
        <p><strong>Cambiando contraseña para:</strong> {userName}</p>
      </div>
      
      <div className="space-y-2">
        <Label>Contraseña actual *</Label>
        <div className="relative">
          <Input 
            type={showPw ? "text" : "password"} 
            value={form.currentPassword} 
            onChange={e => set("currentPassword", e.target.value)} 
            placeholder="Ingresa tu contraseña actual"
          />
          <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 h-7 w-7" onClick={() => setShowPw(p => !p)}>
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Nueva contraseña *</Label>
        <Input 
          type={showPw ? "text" : "password"} 
          value={form.newPassword} 
          onChange={e => set("newPassword", e.target.value)} 
          placeholder="Mínimo 4 caracteres"
        />
      </div>

      <div className="space-y-2">
        <Label>Confirmar nueva contraseña *</Label>
        <Input 
          type={showPw ? "text" : "password"} 
          value={form.confirmPassword} 
          onChange={e => set("confirmPassword", e.target.value)} 
          placeholder="Repite tu nueva contraseña"
        />
        {form.newPassword !== form.confirmPassword && form.confirmPassword && (
          <p className="text-xs text-red-500">Las contraseñas no coinciden</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
        <Button className="flex-1" onClick={handleSubmit}>Cambiar contraseña</Button>
      </div>
    </div>
  );
}

export default function ConfigUsers() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const currentUser = store.getCurrentUser();
  const [openNewUser, setOpenNewUser] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState<any>(null);

  const list = useQuery({ queryKey: ["users"], queryFn: () => localApi<any[]>("/users") });
  
  const create = useMutation({
    mutationFn: (d: Record<string, unknown>) => localApi("/users", { method: "POST", body: JSON.stringify(d) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["users"] }); setOpenNewUser(false); toast({ title: "Usuario creado" }); },
    onError: e => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: (id: string) => localApi(`/users/${id}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["users"] }); toast({ title: "Usuario eliminado" }); },
    onError: e => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });

  const changePassword = useMutation({
    mutationFn: (d: Record<string, unknown>) => localApi("/users/change-password", { method: "POST", body: JSON.stringify(d) }),
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ["users"] }); 
      setOpenChangePassword(false);
      setSelectedUserForPassword(null);
      toast({ title: "Contraseña actualizada", description: "La contraseña ha sido cambiada exitosamente" }); 
    },
    onError: e => toast({ title: "Error", description: String(e), variant: "destructive" }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Usuarios</h1><p className="text-sm text-muted-foreground">Gestión de acceso al sistema</p></div>
        <Dialog open={openNewUser} onOpenChange={setOpenNewUser}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nuevo usuario</Button></DialogTrigger>
          <DialogContent><DialogHeader><DialogTitle>Nuevo usuario</DialogTitle></DialogHeader>
            <UserForm onSubmit={d => create.mutate(d)} onClose={() => setOpenNewUser(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 p-3 text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2">
        <Shield className="h-4 w-4 mt-0.5 shrink-0" />
        <div>
          <p>El usuario <strong>Master-Admin</strong> está protegido y no puede ser modificado ni eliminado.</p>
          <p className="text-xs mt-1">✓ Master-Admin tiene <strong>control total</strong> sobre todos los módulos de configuración</p>
        </div>
      </div>

      <Card><CardContent className="p-0">
        {list.isLoading ? <div className="p-6"><Skeleton className="h-32 w-full" /></div> : (
          <Table><TableHeader><TableRow>
            <TableHead>Nombre</TableHead><TableHead>Rol</TableHead><TableHead>Permisos</TableHead><TableHead className="text-right">Acciones</TableHead>
          </TableRow></TableHeader>
            <TableBody>
              {list.data?.map(u => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.firstName} {u.lastName} {u.isProtected && <span className="ml-2 text-xs text-muted-foreground">(protegido)</span>}</TableCell>
                  <TableCell><Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role === "admin" ? "Administrador" : "Estándar"}</Badge></TableCell>
                  <TableCell><span className="text-sm text-muted-foreground">{u.permissions === "full" ? "Control total" : "Solo lectura"}</span></TableCell>
                  <TableCell className="text-right space-x-1">
                    {/* Mostrar botón de cambiar contraseña si es Master-Admin o el usuario actual */}
                    {currentUser?.role === "admin" && (
                      <Dialog open={openChangePassword && selectedUserForPassword?.id === u.id} onOpenChange={(open) => {
                        if (open) {
                          setSelectedUserForPassword(u);
                          setOpenChangePassword(true);
                        } else {
                          setOpenChangePassword(false);
                          setSelectedUserForPassword(null);
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-7 w-7 text-blue-600 dark:text-blue-400"
                            title="Cambiar contraseña"
                          >
                            <Key className="h-3.5 w-3.5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Cambiar contraseña</DialogTitle></DialogHeader>
                          {selectedUserForPassword && (
                            <ChangePasswordForm 
                              userId={u.id}
                              userName={`${u.firstName} ${u.lastName}`}
                              onSubmit={d => changePassword.mutate(d)} 
                              onClose={() => setOpenChangePassword(false)} 
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                    )}
                    
                    {!u.isProtected && (
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => del.mutate(u.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    )}
                    {u.isProtected && <Shield className="h-4 w-4 text-muted-foreground ml-auto" />}
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
