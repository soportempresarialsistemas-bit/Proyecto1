// ─── Types ────────────────────────────────────────────────────────────────────

export interface CurrencyConfig {
  name: string;
  code: string;
  symbol: string;
  symbolAlign: "left" | "right";
  decimals: number;
}

export interface Bank {
  id: string;
  name: string;
  group?: string;
  web?: string;
  email?: string;
  phone?: string;
  line018?: string;
  createdAt: string;
}

export interface AccountType { id: string; name: string; slug: string }

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  color?: string;
  parentId?: string | null;
  createdAt: string;
}

export interface Beneficiary {
  id: string;
  type: string;
  firstName: string;
  lastName?: string;
  idType?: string;
  idNumber?: string;
  email?: string;
  web?: string;
  phone1?: string;
  phone2?: string;
  phone3?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  notes?: string;
  createdAt: string;
}

export interface Payer {
  id: string;
  type: string;
  firstName: string;
  lastName?: string;
  idType?: string;
  idNumber?: string;
  email?: string;
  web?: string;
  phone1?: string;
  phone2?: string;
  phone3?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  notes?: string;
  createdAt: string;
}

export interface PaymentMethod { id: string; name: string; isDefault?: boolean; createdAt: string }

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: "admin" | "standard";
  password: string;
  permissions: "full" | "readonly";
  isProtected?: boolean;
  createdAt: string;
}

export interface Account {
  id: string;
  name: string;
  typeId: string;
  bankId?: string | null;
  currency?: string;
  openingBalance: number;
  creditLimit?: number | null;
  active: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Movement {
  id: string;
  accountId: string;
  movementTypeId: "debit" | "credit";
  amount: number;
  description: string;
  movementDate: string;
  referenceModule: string;
  referenceId?: string;
  status: "active" | "voided";
  voidReason?: string;
  createdAt: string;
}

export interface Income {
  id: string;
  accountId: string;
  categoryId: string;
  subcategoryId?: string | null;
  payerId?: string | null;
  paymentMethodId?: string | null;
  amount: number;
  date: string;
  description?: string;
  movementId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Expense {
  id: string;
  accountId: string;
  categoryId: string;
  subcategoryId?: string | null;
  expenseType?: string | null;
  beneficiaryId?: string | null;
  paymentMethodId?: string | null;
  amount: number;
  date: string;
  description?: string;
  movementId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Transfer {
  id: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  transferDate: string;
  notes?: string | null;
  outMovementId: string;
  inMovementId: string;
  createdAt: string;
}

export interface CreditPurchase {
  id: string;
  accountId: string;
  categoryId: string;
  subcategoryId?: string | null;
  beneficiaryId?: string | null;
  paymentMethodId?: string | null;
  description: string;
  amount: number;
  installments: number;
  purchaseDate: string;
  outMovementId: string;
  createdAt: string;
}

export interface CreditInstallment {
  id: string;
  purchaseId: string;
  installmentNumber: number;
  totalInstallments: number;
  amount: number;
  dueDate: string;
  paid: boolean;
  paidDate?: string;
  commitmentId?: string;
}

export interface Loan {
  id: string;
  name: string;
  loanType: string;
  bankId?: string | null;
  beneficiaryId?: string | null;
  principalAmount: number;
  interestRate: number;
  termMonths: number;
  startDate: string;
  paymentDay: number;
  destinationAccountId?: string | null;
  paymentAccountId?: string | null;
  categoryId?: string | null;
  notes?: string;
  movementId?: string;
  active: boolean;
  createdAt: string;
}

export interface Commitment {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  type?: string;
  categoryId?: string | null;
  accountId?: string | null;
  beneficiaryId?: string | null;
  paid: boolean;
  paidDate?: string;
  sourceType: string;
  sourceId?: string;
  createdAt: string;
}

// ─── Default seed data ────────────────────────────────────────────────────────

const DEFAULT_ACCOUNT_TYPES: AccountType[] = [
  { id: "at-cash", name: "Efectivo", slug: "cash" },
  { id: "at-savings", name: "Ahorros", slug: "savings" },
  { id: "at-checking", name: "Corriente", slug: "checking" },
  { id: "at-wallet", name: "Billetera Digital", slug: "digital_wallet" },
  { id: "at-invest", name: "Inversión", slug: "investment" },
  { id: "at-cc", name: "Tarjeta de Crédito", slug: "credit_card" },
  { id: "at-loan", name: "Préstamo", slug: "loan" },
];

const DEFAULT_CATEGORIES: Omit<Category, "createdAt">[] = [
  { id: "cat-salary", name: "Salario", type: "income", color: "#22c55e", parentId: null },
  { id: "cat-freelance", name: "Freelance", type: "income", color: "#16a34a", parentId: null },
  { id: "cat-rental", name: "Arrendamiento recibido", type: "income", color: "#4ade80", parentId: null },
  { id: "cat-investment-i", name: "Rendimientos", type: "income", color: "#86efac", parentId: null },
  { id: "cat-other-i", name: "Otros ingresos", type: "income", color: "#bbf7d0", parentId: null },
  { id: "cat-rent", name: "Arriendo", type: "expense", color: "#ef4444", parentId: null },
  { id: "cat-food", name: "Alimentación", type: "expense", color: "#f97316", parentId: null },
  { id: "cat-food-rest", name: "Restaurantes", type: "expense", color: "#f59e0b", parentId: "cat-food" },
  { id: "cat-food-mkt", name: "Supermercado", type: "expense", color: "#10b981", parentId: "cat-food" },
  { id: "cat-transport", name: "Transporte", type: "expense", color: "#eab308", parentId: null },
  { id: "cat-transport-fuel", name: "Combustible", type: "expense", color: "#ca8a04", parentId: "cat-transport" },
  { id: "cat-transport-taxi", name: "Taxi/App", type: "expense", color: "#d97706", parentId: "cat-transport" },
  { id: "cat-health", name: "Salud", type: "expense", color: "#ec4899", parentId: null },
  { id: "cat-health-med", name: "Medicamentos", type: "expense", color: "#db2777", parentId: "cat-health" },
  { id: "cat-health-doc", name: "Consultas médicas", type: "expense", color: "#be185d", parentId: "cat-health" },
  { id: "cat-edu", name: "Educación", type: "expense", color: "#8b5cf6", parentId: null },
  { id: "cat-entertainment", name: "Entretenimiento", type: "expense", color: "#06b6d4", parentId: null },
  { id: "cat-clothes", name: "Ropa", type: "expense", color: "#f43f5e", parentId: null },
  { id: "cat-services", name: "Servicios públicos", type: "expense", color: "#64748b", parentId: null },
  { id: "cat-services-water", name: "Agua", type: "expense", color: "#0284c7", parentId: "cat-services" },
  { id: "cat-services-elec", name: "Energía eléctrica", type: "expense", color: "#eab308", parentId: "cat-services" },
  { id: "cat-services-gas", name: "Gas", type: "expense", color: "#78716c", parentId: "cat-services" },
  { id: "cat-phone", name: "Teléfono/Internet", type: "expense", color: "#6366f1", parentId: null },
  { id: "cat-travel", name: "Viajes", type: "expense", color: "#0ea5e9", parentId: null },
  { id: "cat-other-e", name: "Otros gastos", type: "expense", color: "#94a3b8", parentId: null },
];

const DEFAULT_PAYMENT_METHODS: Omit<PaymentMethod, "createdAt">[] = [
  { id: "pm-debit", name: "Tarjeta débito", isDefault: true },
  { id: "pm-commerce", name: "Tarjetas de comercio", isDefault: true },
  { id: "pm-electronic", name: "Pago electrónico", isDefault: true },
  { id: "pm-check", name: "Cheque", isDefault: true },
  { id: "pm-transfer", name: "Transferencia bancaria", isDefault: true },
  { id: "pm-debit-auto", name: "Domiciliación bancaria", isDefault: true },
  { id: "pm-crypto", name: "Pagos con criptomonedas", isDefault: true },
  { id: "pm-deposit", name: "Consignación/Depósito", isDefault: true },
  { id: "pm-cash", name: "Efectivo", isDefault: true },
  { id: "pm-credit", name: "Tarjetas de crédito", isDefault: true },
];

// ─── Storage keys ─────────────────────────────────────────────────────────────
const K = {
  banks: "fp8:banks",
  accountTypes: "fp8:account-types",
  categories: "fp8:categories",
  beneficiaries: "fp8:beneficiaries",
  payers: "fp8:payers",
  accounts: "fp8:accounts",
  movements: "fp8:movements",
  incomes: "fp8:incomes",
  expenses: "fp8:expenses",
  transfers: "fp8:transfers",
  creditPurchases: "fp8:credit-purchases",
  creditInstallments: "fp8:credit-installments",
  commitments: "fp8:commitments",
  loans: "fp8:loans",
  paymentMethods: "fp8:payment-methods",
  users: "fp8:users",
  currentUser: "fp8:current-user",
  currency: "fp8:currency",
  wizardDone: "fp8:wizard-done",
  initialized: "fp8:initialized",
};

function uid(): string { return crypto.randomUUID(); }
function now(): string { return new Date().toISOString(); }
function ls<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) ?? "[]"); } catch { return []; }
}
function lsObj<T>(key: string, def: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; }
}
function save<T>(key: string, data: T[]): void { localStorage.setItem(key, JSON.stringify(data)); }

// ─── Initialize default data ──────────────────────────────────────────────────
export function initStore() {
  if (localStorage.getItem(K.initialized)) return;
  save(K.accountTypes, DEFAULT_ACCOUNT_TYPES);
  save(K.categories, DEFAULT_CATEGORIES.map(c => ({ ...c, createdAt: now() })));
  save(K.banks, []);
  save(K.beneficiaries, []);
  save(K.payers, []);
  save(K.accounts, []);
  save(K.movements, []);
  save(K.incomes, []);
  save(K.expenses, []);
  save(K.transfers, []);
  save(K.creditPurchases, []);
  save(K.creditInstallments, []);
  save(K.commitments, []);
  save(K.loans, []);
  save(K.paymentMethods, DEFAULT_PAYMENT_METHODS.map(p => ({ ...p, createdAt: now() })));
  // Master-Admin user
  save(K.users, [{
    id: "master-admin",
    firstName: "Master",
    lastName: "Admin",
    role: "admin",
    password: "",
    permissions: "full",
    isProtected: true,
    createdAt: now(),
  }]);
  localStorage.setItem(K.initialized, "1");
}

// ─── Balance helpers ──────────────────────────────────────────────────────────
function getBalance(accountId: string, movementsAll?: Movement[]): number {
  const movements = (movementsAll ?? ls<Movement>(K.movements)).filter(
    m => m.accountId === accountId && m.status === "active"
  );
  const credits = movements.filter(m => m.movementTypeId === "credit").reduce((s, m) => s + m.amount, 0);
  const debits = movements.filter(m => m.movementTypeId === "debit").reduce((s, m) => s + m.amount, 0);
  return credits - debits;
}

function enrichAccount(a: Account, movements: Movement[], types: AccountType[], banks: Bank[]) {
  const type = types.find(t => t.id === a.typeId);
  const bank = banks.find(b => b.id === a.bankId);
  const currentBalance = getBalance(a.id, movements);
  const availableCredit = a.creditLimit != null ? a.creditLimit + currentBalance : null;
  return { ...a, typeName: type?.name ?? "", typeSlug: type?.slug ?? "", bankName: bank?.name ?? null, currentBalance, availableCredit };
}

function getBeneficiaryName(b: Beneficiary): string {
  if (b.type === "Personas") return [b.firstName, b.lastName].filter(Boolean).join(" ");
  return b.firstName;
}

function getPayerName(p: Payer): string {
  if (p.type === "Personas" || p.type === "Clientes") return [p.firstName, p.lastName].filter(Boolean).join(" ");
  return p.firstName;
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const store = {

  // ─── Currency ───────────────────────────────────────────────────────────────
  getCurrency: (): CurrencyConfig => lsObj<CurrencyConfig>(K.currency, {
    name: "Peso Colombiano", code: "COP", symbol: "$", symbolAlign: "left", decimals: 0,
  }),
  setCurrency: (cfg: CurrencyConfig) => localStorage.setItem(K.currency, JSON.stringify(cfg)),

  // ─── Wizard ─────────────────────────────────────────────────────────────────
  isWizardDone: () => !!localStorage.getItem(K.wizardDone),
  setWizardDone: () => localStorage.setItem(K.wizardDone, "1"),

  // ─── Auth ───────────────────────────────────────────────────────────────────
  getCurrentUser: (): User | null => lsObj<User | null>(K.currentUser, null),
  setCurrentUser: (user: User | null) => localStorage.setItem(K.currentUser, JSON.stringify(user)),
  login: (password: string): User | null => {
    // Master-Admin has no password, just press enter
    const users = ls<User>(K.users);
    const master = users.find(u => u.isProtected);
    if (master && password === (master.password ?? "")) return master;
    const found = users.find(u => !u.isProtected && u.password === password);
    return found ?? null;
  },
  loginByUser: (userId: string, password: string): User | null => {
    const users = ls<User>(K.users);
    const user = users.find(u => u.id === userId);
    if (!user) return null;
    if (user.password !== password) return null;
    return user;
  },
  logout: () => localStorage.removeItem(K.currentUser),

  // ─── Users ──────────────────────────────────────────────────────────────────
  getUsers: () => ls<User>(K.users),
  createUser: (data: Omit<User, "id" | "createdAt" | "isProtected">) => {
    const users = ls<User>(K.users);
    const user: User = { id: uid(), ...data, createdAt: now() };
    save(K.users, [...users, user]);
    return user;
  },
  updateUser: (id: string, data: Partial<User>) => {
    const users = ls<User>(K.users);
    const target = users.find(u => u.id === id);
    if (target?.isProtected) throw new Error("No se puede modificar el usuario Master-Admin");
    const updated = users.map(u => u.id === id ? { ...u, ...data } : u);
    save(K.users, updated);
    return updated.find(u => u.id === id);
  },
  deleteUser: (id: string) => {
    const users = ls<User>(K.users);
    const target = users.find(u => u.id === id);
    if (target?.isProtected) throw new Error("No se puede eliminar el usuario Master-Admin");
    save(K.users, users.filter(u => u.id !== id));
  },

  // ─── Payment Methods ────────────────────────────────────────────────────────
  getPaymentMethods: () => ls<PaymentMethod>(K.paymentMethods).sort((a, b) => a.name.localeCompare(b.name)),
  createPaymentMethod: (data: { name: string }) => {
    const list = ls<PaymentMethod>(K.paymentMethods);
    const item: PaymentMethod = { id: uid(), name: data.name, createdAt: now() };
    save(K.paymentMethods, [...list, item]);
    return item;
  },
  deletePaymentMethod: (id: string) => {
    const item = ls<PaymentMethod>(K.paymentMethods).find(p => p.id === id);
    if (item?.isDefault) throw new Error("No se puede eliminar un método de pago predeterminado");
    save(K.paymentMethods, ls<PaymentMethod>(K.paymentMethods).filter(p => p.id !== id));
  },

  // ─── Banks ──────────────────────────────────────────────────────────────────
  getBanks: () => ls<Bank>(K.banks).sort((a, b) => a.name.localeCompare(b.name)),
  createBank: (data: Omit<Bank, "id" | "createdAt">) => {
    const banks = ls<Bank>(K.banks);
    const bank: Bank = { id: uid(), ...data, createdAt: now() };
    save(K.banks, [...banks, bank]);
    return bank;
  },
  updateBank: (id: string, data: Partial<Bank>) => {
    const banks = ls<Bank>(K.banks).map(b => b.id === id ? { ...b, ...data } : b);
    save(K.banks, banks);
    return banks.find(b => b.id === id);
  },
  deleteBank: (id: string) => { save(K.banks, ls<Bank>(K.banks).filter(b => b.id !== id)); },

  // ─── Account Types ──────────────────────────────────────────────────────────
  getAccountTypes: () => ls<AccountType>(K.accountTypes),

  // ─── Categories ─────────────────────────────────────────────────────────────
  getCategories: (type?: string) => {
    const cats = ls<Category>(K.categories);
    return type ? cats.filter(c => c.type === type) : cats;
  },
  createCategory: (data: { name: string; type: "income" | "expense"; color?: string; parentId?: string | null }) => {
    const cats = ls<Category>(K.categories);
    const cat: Category = { id: uid(), ...data, parentId: data.parentId ?? null, createdAt: now() };
    save(K.categories, [...cats, cat]);
    return cat;
  },
  deleteCategory: (id: string) => {
    // Also remove subcategories that reference this
    save(K.categories, ls<Category>(K.categories).filter(c => c.id !== id && c.parentId !== id));
  },

  // ─── Beneficiaries ──────────────────────────────────────────────────────────
  getBeneficiaries: () => ls<Beneficiary>(K.beneficiaries)
    .map(b => ({ ...b, name: getBeneficiaryName(b) }))
    .sort((a, b) => a.name.localeCompare(b.name)),
  createBeneficiary: (data: Omit<Beneficiary, "id" | "createdAt">) => {
    const list = ls<Beneficiary>(K.beneficiaries);
    const item: Beneficiary = { id: uid(), ...data, createdAt: now() };
    save(K.beneficiaries, [...list, item]);
    return { ...item, name: getBeneficiaryName(item) };
  },
  updateBeneficiary: (id: string, data: Partial<Beneficiary>) => {
    const list = ls<Beneficiary>(K.beneficiaries).map(b => b.id === id ? { ...b, ...data } : b);
    save(K.beneficiaries, list);
    const found = list.find(b => b.id === id);
    return found ? { ...found, name: getBeneficiaryName(found) } : undefined;
  },
  deleteBeneficiary: (id: string) => { save(K.beneficiaries, ls<Beneficiary>(K.beneficiaries).filter(b => b.id !== id)); },

  // ─── Payers ─────────────────────────────────────────────────────────────────
  getPayers: () => ls<Payer>(K.payers)
    .map(p => ({ ...p, name: getPayerName(p) }))
    .sort((a, b) => a.name.localeCompare(b.name)),
  createPayer: (data: Omit<Payer, "id" | "createdAt">) => {
    const list = ls<Payer>(K.payers);
    const item: Payer = { id: uid(), ...data, createdAt: now() };
    save(K.payers, [...list, item]);
    return { ...item, name: getPayerName(item) };
  },
  updatePayer: (id: string, data: Partial<Payer>) => {
    const list = ls<Payer>(K.payers).map(p => p.id === id ? { ...p, ...data } : p);
    save(K.payers, list);
    const found = list.find(p => p.id === id);
    return found ? { ...found, name: getPayerName(found) } : undefined;
  },
  deletePayer: (id: string) => { save(K.payers, ls<Payer>(K.payers).filter(p => p.id !== id)); },

  // ─── Accounts ────────────────────────────────────────────────────────────────
  getAccounts: (includeInactive = false) => {
    const accounts = ls<Account>(K.accounts).filter(a => includeInactive || a.active);
    const movements = ls<Movement>(K.movements);
    const types = ls<AccountType>(K.accountTypes);
    const banks = ls<Bank>(K.banks);
    return accounts.map(a => enrichAccount(a, movements, types, banks));
  },
  getAccountById: (id: string) => ls<Account>(K.accounts).find(a => a.id === id),
  createAccount: (data: {
    name: string; typeId: string; bankId?: string | null; currency?: string;
    openingBalance?: number; creditLimit?: number | null; notes?: string;
  }) => {
    const accounts = ls<Account>(K.accounts);
    const account: Account = {
      id: uid(), name: data.name, typeId: data.typeId,
      bankId: data.bankId ?? null, currency: data.currency,
      openingBalance: data.openingBalance ?? 0,
      creditLimit: data.creditLimit ?? null, active: true,
      notes: data.notes, createdAt: now(), updatedAt: now(),
    };
    save(K.accounts, [...accounts, account]);
    if ((data.openingBalance ?? 0) !== 0) {
      const movements = ls<Movement>(K.movements);
      const mov: Movement = {
        id: uid(), accountId: account.id, movementTypeId: "credit",
        amount: Math.abs(data.openingBalance ?? 0), description: "Saldo inicial",
        movementDate: new Date().toISOString().slice(0, 10),
        referenceModule: "opening", status: "active", createdAt: now(),
      };
      save(K.movements, [...movements, mov]);
    }
    return account;
  },
  updateAccount: (id: string, data: Partial<Account>) => {
    const accounts = ls<Account>(K.accounts).map(a => a.id === id ? { ...a, ...data, updatedAt: now() } : a);
    save(K.accounts, accounts);
    return accounts.find(a => a.id === id);
  },
  archiveAccount: (id: string) => {
    const accounts = ls<Account>(K.accounts).map(a =>
      a.id === id ? { ...a, active: false, updatedAt: now() } : a
    );
    save(K.accounts, accounts);
  },

  // ─── Movements ───────────────────────────────────────────────────────────────
  getMovements: (params: { accountId?: string; dateFrom?: string; dateTo?: string; limit?: number }) => {
    const accounts = ls<Account>(K.accounts);
    let list = ls<Movement>(K.movements);
    if (params.accountId) list = list.filter(m => m.accountId === params.accountId);
    if (params.dateFrom) list = list.filter(m => m.movementDate >= params.dateFrom!);
    if (params.dateTo) list = list.filter(m => m.movementDate <= params.dateTo!);
    list.sort((a, b) => b.movementDate.localeCompare(a.movementDate));
    const total = list.length;
    if (params.limit) list = list.slice(0, params.limit);
    return {
      total,
      data: list.map(m => {
        const acct = accounts.find(a => a.id === m.accountId);
        return { ...m, accountName: acct?.name ?? "" };
      }),
    };
  },
  voidMovement: (id: string, reason: string) => {
    const movements = ls<Movement>(K.movements).map(m =>
      m.id === id ? { ...m, status: "voided" as const, voidReason: reason } : m
    );
    save(K.movements, movements);
  },

  // ─── Incomes ─────────────────────────────────────────────────────────────────
  getIncomes: () => {
    const incomes = ls<Income>(K.incomes);
    const accounts = ls<Account>(K.accounts);
    const categories = ls<Category>(K.categories);
    const payers = ls<Payer>(K.payers);
    const paymentMethods = ls<PaymentMethod>(K.paymentMethods);
    return incomes.map(i => ({
      ...i,
      accountName: accounts.find(a => a.id === i.accountId)?.name ?? "",
      categoryName: categories.find(c => c.id === i.categoryId)?.name ?? "",
      subcategoryName: categories.find(c => c.id === i.subcategoryId)?.name ?? null,
      payerName: payers.find(p => p.id === i.payerId) ? getPayerName(payers.find(p => p.id === i.payerId)!) : null,
      paymentMethodName: paymentMethods.find(p => p.id === i.paymentMethodId)?.name ?? null,
    })).sort((a, b) => b.date.localeCompare(a.date));
  },
  createIncome: (data: {
    accountId: string; categoryId: string; subcategoryId?: string | null;
    payerId?: string | null; paymentMethodId?: string | null;
    amount: number; date: string; description?: string;
  }) => {
    const movId = uid();
    const income: Income = { id: uid(), ...data, movementId: movId, createdAt: now() };
    const mov: Movement = {
      id: movId, accountId: data.accountId, movementTypeId: "credit",
      amount: data.amount, description: data.description ?? "Ingreso",
      movementDate: data.date, referenceModule: "income",
      referenceId: income.id, status: "active", createdAt: now(),
    };
    save(K.incomes, [...ls<Income>(K.incomes), income]);
    save(K.movements, [...ls<Movement>(K.movements), mov]);
    return income;
  },
  updateIncome: (id: string, data: Partial<Income>) => {
    const incomes = ls<Income>(K.incomes);
    const income = incomes.find(i => i.id === id);
    if (!income) throw new Error("Ingreso no encontrado");
    const updated = incomes.map(i => i.id === id ? { ...i, ...data, updatedAt: now() } : i);
    save(K.incomes, updated);
    // Update the movement amount if changed
    if (data.amount !== undefined || data.description !== undefined || data.date !== undefined || data.accountId !== undefined) {
      const movements = ls<Movement>(K.movements).map(m => {
        if (m.id === income.movementId) {
          return {
            ...m,
            amount: data.amount ?? m.amount,
            description: data.description ?? m.description,
            movementDate: data.date ?? m.movementDate,
            accountId: data.accountId ?? m.accountId,
          };
        }
        return m;
      });
      save(K.movements, movements);
    }
    return updated.find(i => i.id === id);
  },
  deleteIncome: (id: string) => {
    const income = ls<Income>(K.incomes).find(i => i.id === id);
    if (income) {
      save(K.movements, ls<Movement>(K.movements).map(m =>
        m.id === income.movementId ? { ...m, status: "voided" as const, voidReason: "Eliminado" } : m
      ));
    }
    save(K.incomes, ls<Income>(K.incomes).filter(i => i.id !== id));
  },

  // ─── Expenses ────────────────────────────────────────────────────────────────
  getExpenses: () => {
    const expenses = ls<Expense>(K.expenses);
    const accounts = ls<Account>(K.accounts);
    const categories = ls<Category>(K.categories);
    const beneficiaries = ls<Beneficiary>(K.beneficiaries);
    const paymentMethods = ls<PaymentMethod>(K.paymentMethods);
    return expenses.map(e => ({
      ...e,
      accountName: accounts.find(a => a.id === e.accountId)?.name ?? "",
      categoryName: categories.find(c => c.id === e.categoryId)?.name ?? "",
      subcategoryName: categories.find(c => c.id === e.subcategoryId)?.name ?? null,
      beneficiaryName: beneficiaries.find(b => b.id === e.beneficiaryId) ? getBeneficiaryName(beneficiaries.find(b => b.id === e.beneficiaryId)!) : null,
      paymentMethodName: paymentMethods.find(p => p.id === e.paymentMethodId)?.name ?? null,
    })).sort((a, b) => b.date.localeCompare(a.date));
  },
  createExpense: (data: {
    accountId: string; categoryId: string; subcategoryId?: string | null;
    expenseType?: string | null; beneficiaryId?: string | null; paymentMethodId?: string | null;
    amount: number; date: string; description?: string;
  }) => {
    const movId = uid();
    const expense: Expense = { id: uid(), ...data, movementId: movId, createdAt: now() };
    const mov: Movement = {
      id: movId, accountId: data.accountId, movementTypeId: "debit",
      amount: data.amount, description: data.description ?? "Gasto",
      movementDate: data.date, referenceModule: "expense",
      referenceId: expense.id, status: "active", createdAt: now(),
    };
    save(K.expenses, [...ls<Expense>(K.expenses), expense]);
    save(K.movements, [...ls<Movement>(K.movements), mov]);
    return expense;
  },
  updateExpense: (id: string, data: Partial<Expense>) => {
    const expenses = ls<Expense>(K.expenses);
    const expense = expenses.find(e => e.id === id);
    if (!expense) throw new Error("Gasto no encontrado");
    const updated = expenses.map(e => e.id === id ? { ...e, ...data, updatedAt: now() } : e);
    save(K.expenses, updated);
    if (data.amount !== undefined || data.description !== undefined || data.date !== undefined || data.accountId !== undefined) {
      const movements = ls<Movement>(K.movements).map(m => {
        if (m.id === expense.movementId) {
          return {
            ...m,
            amount: data.amount ?? m.amount,
            description: data.description ?? m.description,
            movementDate: data.date ?? m.movementDate,
            accountId: data.accountId ?? m.accountId,
          };
        }
        return m;
      });
      save(K.movements, movements);
    }
    return updated.find(e => e.id === id);
  },
  deleteExpense: (id: string) => {
    const expense = ls<Expense>(K.expenses).find(e => e.id === id);
    if (expense) {
      save(K.movements, ls<Movement>(K.movements).map(m =>
        m.id === expense.movementId ? { ...m, status: "voided" as const, voidReason: "Eliminado" } : m
      ));
    }
    save(K.expenses, ls<Expense>(K.expenses).filter(e => e.id !== id));
  },

  // ─── Transfers ───────────────────────────────────────────────────────────────
  getTransfers: () => {
    const transfers = ls<Transfer>(K.transfers);
    const accounts = ls<Account>(K.accounts);
    return transfers.map(t => ({
      ...t,
      sourceAccountName: accounts.find(a => a.id === t.sourceAccountId)?.name ?? "",
      destAccountName: accounts.find(a => a.id === t.destinationAccountId)?.name ?? "",
    })).sort((a, b) => b.transferDate.localeCompare(a.transferDate));
  },
  createTransfer: (data: {
    sourceAccountId: string; destinationAccountId: string;
    amount: number; transferDate: string; notes?: string | null;
  }) => {
    const outId = uid(); const inId = uid();
    const transfer: Transfer = { id: uid(), ...data, outMovementId: outId, inMovementId: inId, createdAt: now() };
    const outMov: Movement = {
      id: outId, accountId: data.sourceAccountId, movementTypeId: "debit",
      amount: data.amount, description: data.notes ?? "Transferencia",
      movementDate: data.transferDate, referenceModule: "transfer_out",
      referenceId: transfer.id, status: "active", createdAt: now(),
    };
    const inMov: Movement = {
      id: inId, accountId: data.destinationAccountId, movementTypeId: "credit",
      amount: data.amount, description: data.notes ?? "Transferencia",
      movementDate: data.transferDate, referenceModule: "transfer_in",
      referenceId: transfer.id, status: "active", createdAt: now(),
    };
    save(K.transfers, [...ls<Transfer>(K.transfers), transfer]);
    save(K.movements, [...ls<Movement>(K.movements), outMov, inMov]);
    return transfer;
  },

  // ─── Credit Purchases ────────────────────────────────────────────────────────
  getCreditPurchases: () => {
    const purchases = ls<CreditPurchase>(K.creditPurchases);
    const installments = ls<CreditInstallment>(K.creditInstallments);
    const accounts = ls<Account>(K.accounts);
    const categories = ls<Category>(K.categories);
    const beneficiaries = ls<Beneficiary>(K.beneficiaries);
    const paymentMethods = ls<PaymentMethod>(K.paymentMethods);
    return purchases.map(p => {
      const inst = installments.filter(i => i.purchaseId === p.id);
      const paidCount = inst.filter(i => i.paid).length;
      const pendingAmount = inst.filter(i => !i.paid).reduce((s, i) => s + i.amount, 0);
      const ben = beneficiaries.find(b => b.id === p.beneficiaryId);
      return {
        ...p,
        accountName: accounts.find(a => a.id === p.accountId)?.name ?? "",
        categoryName: categories.find(c => c.id === p.categoryId)?.name ?? "",
        beneficiaryName: ben ? getBeneficiaryName(ben) : null,
        paymentMethodName: paymentMethods.find(m => m.id === p.paymentMethodId)?.name ?? null,
        paidCount, pendingAmount,
      };
    }).sort((a, b) => b.purchaseDate.localeCompare(a.purchaseDate));
  },
  createCreditPurchase: (data: {
    accountId: string; categoryId: string; subcategoryId?: string | null;
    beneficiaryId?: string | null; paymentMethodId?: string | null;
    description: string; amount: number; installments: number; purchaseDate: string;
  }) => {
    const movId = uid();
    const purchase: CreditPurchase = { id: uid(), ...data, outMovementId: movId, createdAt: now() };
    const mov: Movement = {
      id: movId, accountId: data.accountId, movementTypeId: "debit",
      amount: data.amount, description: data.description,
      movementDate: data.purchaseDate, referenceModule: "credit_purchase",
      referenceId: purchase.id, status: "active", createdAt: now(),
    };
    const installmentAmount = Math.round((data.amount / data.installments) * 100) / 100;
    const existingInst = ls<CreditInstallment>(K.creditInstallments);
    const existingCommitments = ls<Commitment>(K.commitments);
    const newInst: CreditInstallment[] = [];
    const newCommitments: Commitment[] = [];
    for (let i = 1; i <= data.installments; i++) {
      const dueDate = addMonths(data.purchaseDate, i);
      const commitId = uid();
      const inst: CreditInstallment = {
        id: uid(), purchaseId: purchase.id, installmentNumber: i,
        totalInstallments: data.installments, amount: installmentAmount,
        dueDate, paid: false, commitmentId: commitId,
      };
      const commitment: Commitment = {
        id: commitId, description: `${data.description} — cuota ${i}/${data.installments}`,
        amount: installmentAmount, dueDate, paid: false,
        sourceType: "credit_installment", sourceId: inst.id, createdAt: now(),
      };
      newInst.push(inst);
      newCommitments.push(commitment);
    }
    save(K.creditPurchases, [...ls<CreditPurchase>(K.creditPurchases), purchase]);
    save(K.movements, [...ls<Movement>(K.movements), mov]);
    save(K.creditInstallments, [...existingInst, ...newInst]);
    save(K.commitments, [...existingCommitments, ...newCommitments]);
    return purchase;
  },
  getInstallments: (purchaseId: string) => {
    return ls<CreditInstallment>(K.creditInstallments)
      .filter(i => i.purchaseId === purchaseId)
      .sort((a, b) => a.installmentNumber - b.installmentNumber);
  },

  // ─── Loans ───────────────────────────────────────────────────────────────────
  getLoans: () => {
    const loans = ls<Loan>(K.loans);
    const banks = ls<Bank>(K.banks);
    const accounts = ls<Account>(K.accounts);
    const commitments = ls<Commitment>(K.commitments);
    return loans.map(l => {
      const paid = commitments.filter(c => c.sourceType === "loan" && c.sourceId === l.id && c.paid).reduce((s, c) => s + c.amount, 0);
      const pending = commitments.filter(c => c.sourceType === "loan" && c.sourceId === l.id && !c.paid).reduce((s, c) => s + c.amount, 0);
      return {
        ...l,
        bankName: banks.find(b => b.id === l.bankId)?.name ?? null,
        destinationAccountName: accounts.find(a => a.id === l.destinationAccountId)?.name ?? null,
        paymentAccountName: accounts.find(a => a.id === l.paymentAccountId)?.name ?? null,
        totalPaid: paid,
        totalPending: pending,
      };
    }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  createLoan: (data: Omit<Loan, "id" | "createdAt" | "active" | "movementId">) => {
    const loan: Loan = { id: uid(), ...data, active: true, createdAt: now() };
    // Create income movement if destination account specified
    if (data.destinationAccountId) {
      const movId = uid();
      loan.movementId = movId;
      const mov: Movement = {
        id: movId, accountId: data.destinationAccountId, movementTypeId: "credit",
        amount: data.principalAmount, description: `Préstamo: ${data.name}`,
        movementDate: data.startDate, referenceModule: "loan",
        referenceId: loan.id, status: "active", createdAt: now(),
      };
      save(K.movements, [...ls<Movement>(K.movements), mov]);
    }
    // Create installment commitments
    const monthlyRate = data.interestRate / 100 / 12;
    let monthlyPayment: number;
    if (monthlyRate === 0) {
      monthlyPayment = data.principalAmount / data.termMonths;
    } else {
      monthlyPayment = data.principalAmount * (monthlyRate * Math.pow(1 + monthlyRate, data.termMonths)) / (Math.pow(1 + monthlyRate, data.termMonths) - 1);
    }
    monthlyPayment = Math.round(monthlyPayment * 100) / 100;
    const newCommitments: Commitment[] = [];
    for (let i = 1; i <= data.termMonths; i++) {
      const dueDate = addMonths(data.startDate, i);
      newCommitments.push({
        id: uid(), description: `${data.name} — cuota ${i}/${data.termMonths}`,
        amount: monthlyPayment, dueDate, paid: false,
        type: "Cuota préstamo",
        accountId: data.paymentAccountId ?? null,
        sourceType: "loan", sourceId: loan.id, createdAt: now(),
      });
    }
    save(K.loans, [...ls<Loan>(K.loans), loan]);
    save(K.commitments, [...ls<Commitment>(K.commitments), ...newCommitments]);
    return loan;
  },

  // ─── Commitments ─────────────────────────────────────────────────────────────
  getCommitments: (params: { paid?: string }) => {
    const commitments = ls<Commitment>(K.commitments);
    const accounts = ls<Account>(K.accounts);
    const categories = ls<Category>(K.categories);
    const beneficiaries = ls<Beneficiary>(K.beneficiaries);
    let list = commitments;
    if (params.paid === "true") list = list.filter(c => c.paid);
    if (params.paid === "false") list = list.filter(c => !c.paid);
    return list.sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map(c => ({
      ...c,
      accountName: accounts.find(a => a.id === c.accountId)?.name ?? null,
      categoryName: categories.find(cat => cat.id === c.categoryId)?.name ?? null,
      beneficiaryName: beneficiaries.find(b => b.id === c.beneficiaryId) ? getBeneficiaryName(beneficiaries.find(b => b.id === c.beneficiaryId)!) : null,
    }));
  },
  createCommitment: (data: {
    description: string; amount: number; dueDate: string;
    type?: string; categoryId?: string | null; accountId?: string | null;
    beneficiaryId?: string | null; sourceType?: string;
  }) => {
    const item: Commitment = {
      id: uid(), description: data.description, amount: data.amount,
      dueDate: data.dueDate, paid: false,
      type: data.type, categoryId: data.categoryId ?? null,
      accountId: data.accountId ?? null, beneficiaryId: data.beneficiaryId ?? null,
      sourceType: data.sourceType ?? "manual", createdAt: now(),
    };
    save(K.commitments, [...ls<Commitment>(K.commitments), item]);
    return item;
  },
  // ─── REGLA DE ORO: Pagar un compromiso ────────────────────────────────────
  payCommitment: (id: string, paymentAccountId: string, categoryId?: string | null) => {
    const commitments = ls<Commitment>(K.commitments);
    const commitment = commitments.find(c => c.id === id);
    if (!commitment) throw new Error("Compromiso no encontrado");
    if (commitment.paid) throw new Error("El compromiso ya está pagado");

    const today = new Date().toISOString().slice(0, 10);

    // 1. Mark commitment as paid
    const updatedCommitments = commitments.map(c =>
      c.id === id ? { ...c, paid: true, paidDate: now() } : c
    );
    save(K.commitments, updatedCommitments);

    // 2. Create expense record
    const expenseCatId = categoryId ?? commitment.categoryId ?? "cat-other-e";
    const expenseId = uid();
    const movId = uid();
    const expense: Expense = {
      id: expenseId, accountId: paymentAccountId,
      categoryId: expenseCatId, amount: commitment.amount,
      date: today, description: commitment.description,
      beneficiaryId: commitment.beneficiaryId ?? null,
      movementId: movId, createdAt: now(),
    };

    // 3. Create debit movement (descontar saldo)
    const mov: Movement = {
      id: movId, accountId: paymentAccountId, movementTypeId: "debit",
      amount: commitment.amount, description: commitment.description,
      movementDate: today, referenceModule: "commitment_payment",
      referenceId: id, status: "active", createdAt: now(),
    };

    save(K.expenses, [...ls<Expense>(K.expenses), expense]);
    save(K.movements, [...ls<Movement>(K.movements), mov]);

    // 4. If source is credit_installment, mark installment as paid
    if (commitment.sourceType === "credit_installment" && commitment.sourceId) {
      const installments = ls<CreditInstallment>(K.creditInstallments).map(i =>
        i.id === commitment.sourceId ? { ...i, paid: true, paidDate: today } : i
      );
      save(K.creditInstallments, installments);
    }

    return { commitment: updatedCommitments.find(c => c.id === id), expense, movement: mov };
  },
  updateCommitment: (id: string, data: { paid?: boolean; description?: string; amount?: number; dueDate?: string }) => {
    const list = ls<Commitment>(K.commitments).map(c =>
      c.id === id ? { ...c, ...data, paidDate: data.paid ? now() : undefined } : c
    );
    save(K.commitments, list);
    return list.find(c => c.id === id);
  },
  deleteCommitment: (id: string) => {
    save(K.commitments, ls<Commitment>(K.commitments).filter(c => c.id !== id));
  },

  // ─── Dashboard ───────────────────────────────────────────────────────────────
  getDashboardSummary: () => {
    const accounts = ls<Account>(K.accounts).filter(a => a.active);
    const types = ls<AccountType>(K.accountTypes);
    const banks = ls<Bank>(K.banks);
    const movements = ls<Movement>(K.movements);
    const allAccounts = accounts.map(a => enrichAccount(a, movements, types, banks));
    const assetSlugs = new Set(["cash", "savings", "checking", "digital_wallet", "investment"]);
    const liabilitySlugs = new Set(["credit_card", "loan"]);
    const liquidSlugs = new Set(["cash", "checking", "digital_wallet"]);
    const totalAssets = allAccounts.filter(a => assetSlugs.has(a.typeSlug) && a.currentBalance > 0).reduce((s, a) => s + a.currentBalance, 0);
    const totalLiabilities = allAccounts.filter(a => liabilitySlugs.has(a.typeSlug) && a.currentBalance < 0).reduce((s, a) => s + Math.abs(a.currentBalance), 0);
    const liquidAssets = allAccounts.filter(a => liquidSlugs.has(a.typeSlug)).reduce((s, a) => s + Math.max(0, a.currentBalance), 0);
    const today = new Date();
    const mtdFrom = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
    const mtdTo = today.toISOString().slice(0, 10);
    const mtdMovements = movements.filter(m => m.status === "active" && m.movementDate >= mtdFrom && m.movementDate <= mtdTo);
    const totalIncomeMtd = mtdMovements.filter(m => m.movementTypeId === "credit" && m.referenceModule === "income").reduce((s, m) => s + m.amount, 0);
    const totalExpenseMtd = mtdMovements.filter(m => m.movementTypeId === "debit" && m.referenceModule === "expense").reduce((s, m) => s + m.amount, 0);
    return { netWorth: totalAssets - totalLiabilities, totalAssets, totalLiabilities, liquidAssets, totalIncomeMtd, totalExpenseMtd, accountSummaries: allAccounts };
  },
  getCashFlow: (months: number) => {
    const movements = ls<Movement>(K.movements).filter(m => m.status === "active");
    const result: Array<{ month: string; income: number; expenses: number }> = [];
    const today = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const prefix = `${year}-${month}`;
      const monthMovs = movements.filter(m => m.movementDate.startsWith(prefix));
      result.push({
        month: `${year}-${month}`,
        income: monthMovs.filter(m => m.movementTypeId === "credit" && m.referenceModule === "income").reduce((s, m) => s + m.amount, 0),
        expenses: monthMovs.filter(m => m.movementTypeId === "debit" && m.referenceModule === "expense").reduce((s, m) => s + m.amount, 0),
      });
    }
    return result;
  },
  getExpenseByCategory: () => {
    const today = new Date();
    const mtdFrom = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
    const expenses = ls<Expense>(K.expenses).filter(e => e.date >= mtdFrom);
    const categories = ls<Category>(K.categories);
    const map = new Map<string, number>();
    for (const e of expenses) { map.set(e.categoryId, (map.get(e.categoryId) ?? 0) + e.amount); }
    const total = Array.from(map.values()).reduce((s, v) => s + v, 0);
    return Array.from(map.entries()).map(([catId, t]) => ({
      categoryId: catId,
      categoryName: categories.find(c => c.id === catId)?.name ?? "Sin categoría",
      total: t, percentage: total > 0 ? (t / total) * 100 : 0,
    })).sort((a, b) => b.total - a.total);
  },
  getUpcomingCommitments: (days: number) => {
    const today = new Date().toISOString().slice(0, 10);
    const limit = new Date(Date.now() + days * 86400_000).toISOString().slice(0, 10);
    return ls<Commitment>(K.commitments)
      .filter(c => !c.paid && c.dueDate >= today && c.dueDate <= limit)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  },

  // ─── Reports ──────────────────────────────────────────────────────────────────
  getNetWorthHistory: (months: number) => {
    const types = ls<AccountType>(K.accountTypes);
    const accounts = ls<Account>(K.accounts);
    const movements = ls<Movement>(K.movements);
    const assetSlugs = new Set(["cash", "savings", "checking", "digital_wallet", "investment"]);
    const liabilitySlugs = new Set(["credit_card", "loan"]);
    const result = [];
    const today = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
      const cutoff = d.toISOString().slice(0, 10);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      let assets = 0; let liabilities = 0;
      for (const acct of accounts) {
        const type = types.find(t => t.id === acct.typeId);
        const movs = movements.filter(m => m.accountId === acct.id && m.status === "active" && m.movementDate <= cutoff);
        const credits = movs.filter(m => m.movementTypeId === "credit").reduce((s, m) => s + m.amount, 0);
        const debits = movs.filter(m => m.movementTypeId === "debit").reduce((s, m) => s + m.amount, 0);
        const bal = credits - debits;
        if (type && assetSlugs.has(type.slug) && bal > 0) assets += bal;
        if (type && liabilitySlugs.has(type.slug) && bal < 0) liabilities += Math.abs(bal);
      }
      result.push({ month: `${year}-${month}`, assets, liabilities, netWorth: assets - liabilities });
    }
    return result;
  },
  getAccountStatement: (params: { accountId: string; dateFrom: string; dateTo: string }) => {
    const account = ls<Account>(K.accounts).find(a => a.id === params.accountId);
    if (!account) throw new Error("Cuenta no encontrada");
    const movements = ls<Movement>(K.movements)
      .filter(m => m.accountId === params.accountId && m.movementDate >= params.dateFrom && m.movementDate <= params.dateTo)
      .sort((a, b) => a.movementDate.localeCompare(b.movementDate));
    const prevMovements = ls<Movement>(K.movements).filter(
      m => m.accountId === params.accountId && m.status === "active" && m.movementDate < params.dateFrom
    );
    let runningBalance = prevMovements.reduce((s, m) => m.movementTypeId === "credit" ? s + m.amount : s - m.amount, 0);
    const openingBalance = runningBalance;
    const enriched = movements.map(m => {
      if (m.status === "active") runningBalance += m.movementTypeId === "credit" ? m.amount : -m.amount;
      return { ...m, runningBalance };
    });
    return { account, openingBalance, closingBalance: runningBalance, movements: enriched };
  },

  getFullReport: (params: { dateFrom: string; dateTo: string }) => {
    const incomes = ls<Income>(K.incomes).filter(i => i.date >= params.dateFrom && i.date <= params.dateTo);
    const expenses = ls<Expense>(K.expenses).filter(e => e.date >= params.dateFrom && e.date <= params.dateTo);
    const categories = ls<Category>(K.categories);
    const accounts = ls<Account>(K.accounts);
    const payers = ls<Payer>(K.payers);
    const beneficiaries = ls<Beneficiary>(K.beneficiaries);
    const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
    const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
    return {
      dateFrom: params.dateFrom, dateTo: params.dateTo,
      totalIncome, totalExpense, balance: totalIncome - totalExpense,
      incomes: incomes.map(i => ({
        ...i,
        accountName: accounts.find(a => a.id === i.accountId)?.name ?? "",
        categoryName: categories.find(c => c.id === i.categoryId)?.name ?? "",
        payerName: payers.find(p => p.id === i.payerId) ? getPayerName(payers.find(p => p.id === i.payerId)!) : null,
      })),
      expenses: expenses.map(e => ({
        ...e,
        accountName: accounts.find(a => a.id === e.accountId)?.name ?? "",
        categoryName: categories.find(c => c.id === e.categoryId)?.name ?? "",
        beneficiaryName: beneficiaries.find(b => b.id === e.beneficiaryId) ? getBeneficiaryName(beneficiaries.find(b => b.id === e.beneficiaryId)!) : null,
      })),
    };
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}
