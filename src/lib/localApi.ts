import { store, initStore } from "./store";

initStore();

function body(init?: RequestInit) {
  if (!init?.body) return {};
  return JSON.parse(init.body as string);
}

export async function localApi<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const method = (init?.method ?? "GET").toUpperCase();
  const url = endpoint.replace(/^\//, "");
  const parts = url.split("?")[0].split("/");
  const qs = new URLSearchParams(url.includes("?") ? url.split("?")[1] : "");

  // ─── Currency ───────────────────────────────────────────────────────────────
  if (parts[0] === "currency") {
    if (method === "GET") return store.getCurrency() as T;
    if (method === "POST") { store.setCurrency(body(init)); return store.getCurrency() as T; }
  }

  // ─── Auth ───────────────────────────────────────────────────────────────────
  if (parts[0] === "auth") {
    if (parts[1] === "login" && method === "POST") {
      const b = body(init);
      const user = b.userId
        ? store.loginByUser(b.userId, b.password ?? "")
        : store.login(b.password ?? "");
      if (!user) throw new Error("Credenciales incorrectas");
      store.setCurrentUser(user);
      return user as T;
    }
    if (parts[1] === "logout" && method === "POST") { store.logout(); return undefined as T; }
    if (parts[1] === "me" && method === "GET") return store.getCurrentUser() as T;
  }

  // ─── Users ──────────────────────────────────────────────────────────────────
  if (parts[0] === "users") {
    if (method === "GET") return store.getUsers() as T;
    if (method === "POST") return store.createUser(body(init)) as T;
    if (method === "PATCH" && parts[1]) return store.updateUser(parts[1], body(init)) as T;
    if (method === "DELETE" && parts[1]) { store.deleteUser(parts[1]); return undefined as T; }
  }

  // ─── Payment Methods ────────────────────────────────────────────────────────
  if (parts[0] === "payment-methods") {
    if (method === "GET") return store.getPaymentMethods() as T;
    if (method === "POST") return store.createPaymentMethod(body(init)) as T;
    if (method === "DELETE" && parts[1]) { store.deletePaymentMethod(parts[1]); return undefined as T; }
  }

  // ─── Banks ─────────────────────────────────────────────────────────────────
  if (parts[0] === "banks") {
    if (method === "GET" && !parts[1]) return store.getBanks() as T;
    if (method === "POST") return store.createBank(body(init)) as T;
    if (method === "PATCH" && parts[1]) return store.updateBank(parts[1], body(init)) as T;
    if (method === "DELETE" && parts[1]) { store.deleteBank(parts[1]); return undefined as T; }
  }

  // ─── Account Types ─────────────────────────────────────────────────────────
  if (parts[0] === "account-types" && method === "GET") return store.getAccountTypes() as T;

  // ─── Categories ────────────────────────────────────────────────────────────
  if (parts[0] === "categories") {
    if (method === "GET") return store.getCategories(qs.get("type") ?? undefined) as T;
    if (method === "POST") return store.createCategory(body(init)) as T;
    if (method === "DELETE" && parts[1]) { store.deleteCategory(parts[1]); return undefined as T; }
  }

  // ─── Beneficiaries ─────────────────────────────────────────────────────────
  if (parts[0] === "beneficiaries") {
    if (method === "GET") return store.getBeneficiaries() as T;
    if (method === "POST") return store.createBeneficiary(body(init)) as T;
    if (method === "PATCH" && parts[1]) return store.updateBeneficiary(parts[1], body(init)) as T;
    if (method === "DELETE" && parts[1]) { store.deleteBeneficiary(parts[1]); return undefined as T; }
  }

  // ─── Payers ────────────────────────────────────────────────────────────────
  if (parts[0] === "payers") {
    if (method === "GET") return store.getPayers() as T;
    if (method === "POST") return store.createPayer(body(init)) as T;
    if (method === "PATCH" && parts[1]) return store.updatePayer(parts[1], body(init)) as T;
    if (method === "DELETE" && parts[1]) { store.deletePayer(parts[1]); return undefined as T; }
  }

  // ─── Accounts ──────────────────────────────────────────────────────────────
  if (parts[0] === "accounts") {
    if (method === "GET" && !parts[1]) return store.getAccounts() as T;
    if (method === "POST") return store.createAccount(body(init)) as T;
    if (method === "PATCH" && parts[1]) return store.updateAccount(parts[1], body(init)) as T;
    if (method === "DELETE" && parts[1]) { store.archiveAccount(parts[1]); return undefined as T; }
  }

  // ─── Movements ─────────────────────────────────────────────────────────────
  if (parts[0] === "movements") {
    if (method === "GET") return store.getMovements({
      accountId: qs.get("accountId") ?? undefined,
      dateFrom: qs.get("dateFrom") ?? undefined,
      dateTo: qs.get("dateTo") ?? undefined,
      limit: qs.get("limit") ? parseInt(qs.get("limit")!) : undefined,
    }) as T;
    if (method === "PATCH" && parts[1] && parts[2] === "void") {
      store.voidMovement(parts[1], body(init).reason ?? "");
      return undefined as T;
    }
  }

  // ─── Incomes ───────────────────────────────────────────────────────────────
  if (parts[0] === "incomes") {
    if (method === "GET") return store.getIncomes() as T;
    if (method === "POST") return store.createIncome(body(init)) as T;
    if (method === "PATCH" && parts[1]) return store.updateIncome(parts[1], body(init)) as T;
    if (method === "DELETE" && parts[1]) { store.deleteIncome(parts[1]); return undefined as T; }
  }

  // ─── Expenses ──────────────────────────────────────────────────────────────
  if (parts[0] === "expenses") {
    if (method === "GET") return store.getExpenses() as T;
    if (method === "POST") return store.createExpense(body(init)) as T;
    if (method === "PATCH" && parts[1]) return store.updateExpense(parts[1], body(init)) as T;
    if (method === "DELETE" && parts[1]) { store.deleteExpense(parts[1]); return undefined as T; }
  }

  // ─── Transfers ─────────────────────────────────────────────────────────────
  if (parts[0] === "transfers") {
    if (method === "GET") return store.getTransfers() as T;
    if (method === "POST") return store.createTransfer(body(init)) as T;
  }

  // ─── Credit Purchases ──────────────────────────────────────────────────────
  if (parts[0] === "credit-purchases") {
    if (method === "GET" && !parts[1]) return store.getCreditPurchases() as T;
    if (method === "POST") return store.createCreditPurchase(body(init)) as T;
    if (method === "GET" && parts[1] && parts[2] === "installments") return store.getInstallments(parts[1]) as T;
  }

  // ─── Loans ─────────────────────────────────────────────────────────────────
  if (parts[0] === "loans") {
    if (method === "GET") return store.getLoans() as T;
    if (method === "POST") return store.createLoan(body(init)) as T;
  }

  // ─── Commitments ───────────────────────────────────────────────────────────
  if (parts[0] === "commitments") {
    if (method === "GET") return store.getCommitments({ paid: qs.get("paid") ?? undefined }) as T;
    if (method === "POST") return store.createCommitment(body(init)) as T;
    if (method === "PATCH" && parts[1] && parts[2] === "pay") return store.payCommitment(parts[1], body(init).accountId, body(init).categoryId) as T;
    if (method === "PATCH" && parts[1]) return store.updateCommitment(parts[1], body(init)) as T;
    if (method === "DELETE" && parts[1]) { store.deleteCommitment(parts[1]); return undefined as T; }
  }

  // ─── Dashboard ─────────────────────────────────────────────────────────────
  if (parts[0] === "dashboard") {
    if (parts[1] === "summary") return store.getDashboardSummary() as T;
    if (parts[1] === "cash-flow") return store.getCashFlow(parseInt(qs.get("months") ?? "6")) as T;
    if (parts[1] === "expense-by-category") return store.getExpenseByCategory() as T;
    if (parts[1] === "upcoming-commitments") return store.getUpcomingCommitments(parseInt(qs.get("days") ?? "30")) as T;
  }

  // ─── Reports ───────────────────────────────────────────────────────────────
  if (parts[0] === "reports") {
    if (parts[1] === "net-worth-history") return store.getNetWorthHistory(parseInt(qs.get("months") ?? "12")) as T;
    if (parts[1] === "account-statement") return store.getAccountStatement({
      accountId: qs.get("accountId")!,
      dateFrom: qs.get("dateFrom")!,
      dateTo: qs.get("dateTo")!,
    }) as T;
    if (parts[1] === "full") return store.getFullReport({
      dateFrom: qs.get("dateFrom")!,
      dateTo: qs.get("dateTo")!,
    }) as T;
  }

  throw new Error(`localApi: unhandled route ${method} /${endpoint}`);
}

export function formatAmount(value: number): string {
  const cfg = store.getCurrency();
  const formatted = new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: cfg.decimals,
    maximumFractionDigits: cfg.decimals,
  }).format(value);
  return cfg.symbolAlign === "left"
    ? `${cfg.symbol}${cfg.symbol.endsWith(" ") ? "" : " "}${formatted}`
    : `${formatted} ${cfg.symbol}`;
}

export function fmtCOP(value: number): string {
  return formatAmount(value);
}

export function fmtDate(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}
