# 🎯 ROADMAP DE MEJORAS - Finanzas Premium v8

## 📋 Resumen Ejecutivo

Documento de mejoras solicitadas estructurado en **4 fases de implementación** con prioridad y dependencias. Estimación total: **~40-50 horas de desarrollo**.

---

## 🔐 FASE 1: AUTENTICACIÓN Y ACCESO (CRÍTICA - 8-10 horas)

### 1.1 Pantalla de Login - Nuevo Usuario
- [ ] Agregar opción "Otro" en campo usuario de bienvenida
- [ ] Modal para crear nuevo usuario con campos:
  - Nombre
  - Apellido
  - Clave
  - Confirmar clave
- [ ] **Regla**: Rol automático = "Standard" (no admin)
- **Archivo afectado**: `src/pages/login.tsx`

### 1.2 Master-Admin Control
- [ ] Desbloquear todos los módulos de configuración para Master-Admin
- [ ] Permitir cambio de clave Master-Admin en cualquier momento
- [ ] **Regla**: Master-Admin NO pasa por Asistente de Configuración (Wizard)
- [ ] Usuario Standard SÍ debe pasar por Wizard
- **Archivos afectados**: `src/lib/store.ts`, `src/App.tsx`, `src/pages/login.tsx`

### 1.3 Cambio de Contraseña
- [ ] Endpoint en configuración para cambio de clave
- [ ] Validación de clave anterior
- [ ] Confirmación de nueva clave
- **Archivo afectado**: `src/pages/config/users.tsx` (nuevo)

---

## 🌍 FASE 2: GEOGRAFÍA Y CONFIGURACIÓN (IMPORTANTE - 6-8 horas)

### 2.1 Selectors de Ubicación (Dropdowns)
- [ ] Reemplazar campos texto por selects/dropdowns
- [ ] **País**: Cargar lista completa de países
- [ ] **Departamento/Estado**: Cargar según país seleccionado
  - **REGLA ESPECIAL**: Solo Colombia carga TODOS los departamentos + municipios
  - Otros países: automático o manual
- [ ] **Ciudad/Municipio**: Cargar según departamento seleccionado
- **Archivos afectados**: 
  - `src/lib/geography.ts` (expandir con lista completa)
  - `src/pages/wizard.tsx` (actualizar selectors)
  - `src/pages/config/` (aplicar en configuración)

### 2.2 Sidebar con Scroll
- [ ] Agregar barra de desplazamiento al panel izquierdo
- [ ] Mejorar UX en dispositivos pequeños
- **Archivo afectado**: `src/components/layout.tsx`

---

## 💰 FASE 3: DATOS BASE - CATEGORÍAS Y BANCOS (CRÍTICA - 4-6 horas)

### 3.1 Reemplazar Categorías Completas
- [ ] Eliminar categorías antiguas
- [ ] Insertar **89 nuevas categorías** (Ingresos + Gastos)
- [ ] Estructura: `Grupo → Subcategoría → Tipo (Ingreso/Gasto)`
- [ ] Categorías incluyen: Independiente, Inversiones, Laborales, Ocasionales, etc.
- **Archivo afectado**: `src/lib/store.ts` (seed data o migration)

### 3.2 Reemplazar Lista de Bancos
- [ ] Eliminar bancos actuales
- [ ] Insertar **30 bancos colombianos** con:
  - Nombre
  - Grupo propietario
  - Web
  - Email
  - Teléfonos
  - Línea 018000
- **Archivo afectado**: `src/lib/store.ts` (seed data)

---

## 📦 FASE 4: MÓDULOS NUEVOS Y MEJORAS (COMPLEJA - 22-28 horas)

### 4.1 Módulo COMPROMISOS (Mejorado)
**Archivo**: `src/pages/commitments.tsx` (refactor)

#### Campos requeridos:
- [ ] Nombre/Descripción
- [ ] Monto
- [ ] **Cuenta de pago**: Cargar cuentas + "Sin cuenta"
- [ ] **Método de Pago**: Con lógica especial para tarjeta de crédito
  - Si es **Tarjeta de Crédito** → Habilitar:
    - Número de cuotas
    - Tipo de tasa (Fija/Variable)
    - % de interés
    - Fecha de pago real (auto-actualiza)
    - Saldo restante (calculado automático)
- [ ] Fecha vencimiento
- [ ] **Frecuencia**: Una sola vez, Semanal, Quincenal, Mensual, Trimestral, Semestral, Anual
- [ ] **Estado**: Pendiente, Pagado, Vencido, Cancelado
- [ ] **Beneficiario**: Cargar beneficiarios + "Sin beneficiario"
- [ ] Categoría y Subcategoría
- [ ] **Recordatorio**: 1d, 3d, 1sem, personalizado
- [ ] Nota (opcional)

#### Reglas de Integración:
- Préstamos → Cada cuota genera compromiso automático
- Tarjetas → Estado de cuenta genera compromiso de pago
- Compras → Si es financiada, genera compromisos de cuotas
- Movimientos → Al pagar, convierte compromiso en movimiento
- Transferencias → Soporta pago entre cuentas
- Reportes → Muestra cumplidos, pendientes, impacto
- Dashboard → Próximos pagos + nivel cumplimiento

---

### 4.2 Módulo PRÉSTAMOS (Nuevo)
**Archivo**: `src/pages/loans.tsx` (refactor/mejorar)

#### Campos requeridos:
- [ ] Nombre/Descripción
- [ ] **Tipo**: Hipotecario, Vehicular, Educativo, Libre Inversión, Tarjeta, Personal/Familiar, Sin especificar
- [ ] Monto inicial
- [ ] **Tipo de Tasa**: Mensual (mes vencido), Anual (Nominal), No Aplica
- [ ] Tasa de interés (%)
- [ ] Número de cuotas
- [ ] Plazo (Meses / Años)
- [ ] **Valor cuota** (CALCULADO automáticamente)
- [ ] Fecha inicio
- [ ] Fecha Pago
- [ ] **Estado**: Activo, Pagado, Vencido
- [ ] **Cuenta Destino** (donde entra dinero)
- [ ] **Emisor** (de donde sale dinero - entidad o persona)
- [ ] **Método de Consignación** (cargar medios de pago)
- [ ] **Recordatorio de Pago**: 1d, 3d, 1sem, personalizado
- [ ] Nota (opcional)

#### Reglas de Integración:
- Compromisos → Cada cuota agenda automáticamente
- Movimientos → Cada pago registra como movimiento
- Transferencias → Soporte pago entre cuentas
- Beneficiarios → Banco/persona vinculado como receptor
- Reportes → Saldo pendiente, intereses pagados, proyección
- Dashboard → Nivel endeudamiento + próximos pagos

---

### 4.3 Módulo COMPRAS (Nuevo)
**Archivo**: `src/pages/purchases.tsx` (crear)

#### Campos requeridos:
- [ ] Artículo/Servicio
- [ ] **Tipo de Compra**: Cargar categorías predefinidas
- [ ] Monto total
- [ ] **Estado**: Planeada, Pagada, Financiada
  - Si **Planeada** → Habilitar:
    - Tiempo estimado (meses)
    - Meta de Ahorro (CALCULADO auto)
  - Si **Financiada** → Habilitar:
    - Número de cuotas
    - Valor cuota (CALCULADO)
    - Tasa de interés (%)
    - Compromisos generados (IDs)
- [ ] **Método de Pago**: Cargar cuentas predeterminadas
- [ ] **Cuenta/Tarjeta**: Cargar cuentas predeterminadas
- [ ] **Beneficiario**: Cargar beneficiarios + "Sin beneficiario"
- [ ] Fecha de compra
- [ ] Observaciones (opcional)
- [ ] **Prioridad**: Alta, Media, Baja, No aplica

#### Reglas de Integración:
- Presupuesto → Controla límite mensual
- Movimientos → Registra gasto real cuando se paga
- Reportes → Impacto en gastos, compromisos, flujo
- Dashboard → Compras planeadas vs ejecutadas

---

## 🔧 DEPENDENCIAS Y ORDEN DE IMPLEMENTACIÓN

```
FASE 1: Autenticación
├─ 1.1 Login nuevo usuario
├─ 1.2 Master-Admin control
└─ 1.3 Cambio contraseña

FASE 2: Geografía
├─ 2.1 Selectors ubicación (necesita geography.ts expandido)
└─ 2.2 Sidebar scroll

FASE 3: Datos Base
├─ 3.1 Categorías (ANTES de módulos)
└─ 3.2 Bancos

FASE 4: Módulos Nuevos
├─ 4.1 Compromisos (usa categorías + bancos)
├─ 4.2 Préstamos (usa categorías + bancos)
└─ 4.3 Compras (depende de Compromisos)
```

---

## 📊 CÁLCULO AUTOMÁTICO - Fórmulas Requeridas

### Préstamo - Valor Cuota
```
Si Tipo Tasa = "Mensual (vencido)":
  Cuota = (Monto × (r × (1+r)^n)) / ((1+r)^n - 1)
  donde: r = tasa_anual/12, n = numero_cuotas

Si Tipo Tasa = "Anual (Nominal)":
  Cuota = Monto / numero_cuotas × (1 + (tasa% / 100) × (años/12))

Si Tipo Tasa = "No Aplica":
  Cuota = Monto / numero_cuotas
```

### Compra - Meta de Ahorro
```
Meta Ahorro = Monto Total / Tiempo Estimado (meses)
```

### Compra - Valor Cuota (Financiada)
```
Cuota = Monto Total / Numero Cuotas
(sin interés por defecto, agregar si aplica)
```

### Compromiso - Saldo Restante (Tarjeta)
```
Saldo Restante = Monto Original - Suma(Pagos Realizados)
(actualizar automático tras cada movimiento)
```

---

## 🗄️ CAMBIOS EN BASE DE DATOS (store.ts)

### Nuevas Tablas/Colecciones

#### Categories (expandir)
```json
{
  "id": "cat-001",
  "grupo": "Independiente",
  "nombre": "Consultoría",
  "tipo": "ingreso",
  "icono": "icon-name"
}
```

#### Banks (nueva)
```json
{
  "id": "bank-001",
  "nombre": "Bancolombia",
  "grupo": "Grupo Cibest",
  "web": "https://bancolombia.com",
  "email": "email@bancolombia.com",
  "telefonos": ["604-510-9000"],
  "linea018": "018000 912 345"
}
```

#### Purchases (nueva)
```json
{
  "id": "purchase-001",
  "articulo": "Portátil",
  "tipo": "cat-id",
  "montoTotal": 1500000,
  "estado": "planeada|pagada|financiada",
  "tiempoEstimado": 6,
  "metaAhorro": 250000,
  "numeroCuotas": null,
  "valorCuota": null,
  "tasaInteres": null,
  "metodoPago": "account-id",
  "cuenta": "account-id",
  "beneficiario": "beneficiary-id",
  "fechaCompra": "2026-06-14",
  "observaciones": "",
  "prioridad": "media",
  "compromisos": ["comp-001", "comp-002"],
  "createdAt": "2026-06-14"
}
```

---

## 🎯 MÉTRICAS DE ÉXITO

- ✅ Master-Admin con acceso completo a configuración
- ✅ Nuevo usuario puede crearse desde login
- ✅ Wizard SOLO para usuario Standard
- ✅ 89 categorías correctas (test data)
- ✅ 30 bancos cargados
- ✅ Módulo Compromisos con cálculos automáticos
- ✅ Módulo Préstamos con cálculo de cuotas
- ✅ Módulo Compras integrado
- ✅ Integración entre módulos funcionando
- ✅ Dashboard refleja cambios en tiempo real

---

## 📝 NOTAS IMPORTANTES

### Sobre TypeScript
- Crear interfaces para cada nueva entidad (Loan, Purchase, Commitment)
- Mantener `any` al mínimo
- Usar tipos discriminados (discriminated unions) para estados

### Sobre State Management
- `store.ts` es muy grande (52KB) - considerar modularizar
- Crear `hooks/useLoans.ts`, `hooks/usePurchases.ts`, etc.
- React Query para datos derivados (cálculos)

### Sobre UI/UX
- Usar Radix UI Dialog para modal de nuevo usuario
- Select/Combo components para dropdowns geográficos
- Validación en tiempo real

### Sobre Integración
- Los módulos dependen unos de otros
- Necesario sistema de eventos o callbacks
- Transacciones atómicas para operaciones complejas

---

## 🚀 PRÓXIMOS PASOS

1. **Aprobación del roadmap** ✓
2. **Iniciar FASE 1** - Autenticación
3. **Branch de feature**: `feat/auth-improvements`
4. **PR con cada subfase**
5. **Testing manual en dev.bat**

---

*Documento actualizado: 2026-06-14*
*Versión: 1.0*
