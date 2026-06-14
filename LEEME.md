# Finanzas Premium v7 — App de Escritorio (Electron)

App de finanzas personales para Colombia. Funciona **100% sin internet** — todos los datos se guardan localmente en tu computador.

## Requisitos

- **Node.js LTS** → [nodejs.org](https://nodejs.org) (solo necesario para instalar)
- Windows 10/11

---

## Opción A: Usar directamente (más rápido)

1. Instala Node.js LTS
2. Haz doble clic en **`instalar.bat`** — espera a que termine
3. Haz doble clic en **`dev.bat`** — se abre la app

Eso es todo. La próxima vez solo necesitas abrir `dev.bat`.

---

## Opción B: Crear instalador .exe (sin Node.js en el futuro)

1. Instala Node.js LTS
2. Haz doble clic en **`build-instalador.bat`**
3. Espera ~10 minutos
4. Busca el instalador en la carpeta `release/`
5. Instala con doble clic y ya no necesitas Node.js más

---

## ¿Dónde se guardan los datos?

Los datos se guardan en el **almacenamiento local de Electron** en tu computador. No se envía nada a internet. Si desinstala la app, los datos se mantienen en el perfil de usuario de Windows.

## Módulos incluidos

| Módulo | Función |
|--------|---------|
| Dashboard | KPIs, flujo de caja, gastos por categoría |
| Cuentas | Efectivo, ahorros, corriente, digital, inversión, tarjeta, préstamo |
| Movimientos | Libro completo de movimientos |
| Ingresos | Registro con categoría y pagador |
| Gastos | Registro con categoría y beneficiario |
| Transferencias | Entre cuentas propias |
| Tarjetas | Compras en cuotas, seguimiento de pagos |
| Compromisos | Obligaciones periódicas con alertas |
| Reportes | Estado de cuenta, evolución patrimonio 12 meses |
| Config | Bancos, categorías, beneficiarios, pagadores |
