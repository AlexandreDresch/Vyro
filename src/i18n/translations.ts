import { Language } from "@/src/types";

export interface Translations {
  // Common
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  close: string;
  confirm: string;
  loading: string;
  search: string;
  filters: string;
  all: string;
  paidSingular: string;
  pendingSingular: string;
  cancelledSingular: string;

  // Navigation
  dashboard: string;
  sales: string;
  products: string;
  clients: string;

  // Dashboard
  overview: string;
  totalRevenue: string;
  totalOrders: string;
  paid: string;
  pending: string;
  cancelled: string;
  revenueChart: string;
  recentSales: string;
  topProducts: string;
  vsLastPeriod: string;
  thisMonth: string;
  ofOrders: string;
  awaiting: string;
  allClear: string;
  units: string;

  // Sales
  transactions: string;
  searchSales: string;
  noSalesFound: string;
  tryAdjustingSearch: string;
  saleDetails: string;
  product: string;
  client: string;
  date: string;
  quantity: string;
  unitPrice: string;
  total: string;
  status: string;
  newSale: string;
  addSale: string;
  deleteSale: string;

  // Products
  items: string;
  searchProducts: string;
  noProductsFound: string;
  productDetails: string;
  category: string;
  price: string;
  stock: string;
  revenue: string;
  paidOrders: string;
  totalStock: string;
  lowStock: string;
  outOfStock: string;
  critical: string;
  lowStockStatus: string;
  goodStock: string;
  newProduct: string;
  addProduct: string;
  productName: string;
  stockQuantity: string;
  deleteProduct: string;
  historicalData: string;
  historicalSales: string;
  futureSales: string;
  productColor: string;

  // Clients
  contacts: string;
  searchClients: string;
  noClientsFound: string;
  clientDetails: string;
  email: string;
  phone: string;
  totalSpent: string;
  orders: string;
  totalClients: string;
  averageSpent: string;
  topSpender: string;
  newClient: string;
  addClient: string;
  fullName: string;
  deleteClient: string;
  clientColor: string;
  lastOrder: string;

  // Actions
  importExport: string;
  export: string;
  import: string;
  importExcel: string;
  exportExcel: string;
  resetData: string;
  dangerZone: string;

  // Messages
  deleteConfirmation: string;
  deleteWarning: string;
  deleteSuccess: string;
  saveSuccess: string;
  importSuccess: string;
  importFailed: string;
  exportFailed: string;
  noDataToExport: string;
  confirmChanges: string;
  changesAffectHistoricalData: string;
  continue: string;

  // Setup
  welcome: string;
  setupDashboard: string;
  chooseLanguage: string;
  chooseCurrency: string;
  sampleData: string;
  useSampleData: string;
  sampleDataHelp: string;
  startFresh: string;
  freshHelp: string;
  next: string;
  back: string;
  start: string;
  step: string;
  of: string;
  yourSelection: string;
  language: string;
  currency: string;
  data: string;

  // Edit Modals
  editSale: string;
  editProduct: string;
  editClient: string;
  saveChanges: string;
  cancelEdit: string;
  preview: string;
  subtotal: string;
  randomColor: string;
  salesStatistics: string;
  totalSales: string;
  averageOrder: string;

  // Product Edit Specific
  importantNotice: string;
  productHasHistoricalSales: string;
  changesAffectFutureSalesOnly: string;
  historicalPrice: string;
  currentNameInSales: string;
  historicalRevenueData: string;
  note: string;

  // Client Edit Specific
  clientHasExistingSales: string;
  changingNameAffectsHistoricalData: string;

  // Stock related
  availableStock: string;
  lowStockWarning: string;
  lowStockWarningSubtext: string;
  outOfStockWarning: string;
  outOfStockWarningSubtext: string;
  insufficientStock: string;
  onlyXUnitsAvailable: string;
  pleaseReduceQuantity: string;
  addMoreStockFirst: string;
  stockInformation: string;

  // Product/Client empty states
  noProductsAvailable: string;
  noClientsAvailable: string;
  pleaseAddProductFirst: string;
  pleaseAddClientFirst: string;

  // Sale form
  selectProduct: string;
  selectClient: string;
  enterQuantity: string;
  enterDate: string;
  selectStatus: string;

  // Preview
  totalPreview: string;

  // Add any missing from above
  productRequired: string;
  clientRequired: string;
  quantityRequired: string;
  dateRequired: string;
  quantityMinOne: string;
}

export const translations: Record<Language, Translations> = {
  pt: {
    // Common
    save: "Salvar",
    cancel: "Cancelar",
    delete: "Excluir",
    edit: "Editar",
    close: "Fechar",
    confirm: "Confirmar",
    loading: "Carregando...",
    search: "Pesquisar",
    filters: "Filtros",
    all: "Todos",
    paidSingular: "Pago",
    pendingSingular: "Pendente",
    cancelledSingular: "Cancelado",

    // Navigation
    dashboard: "Painel",
    sales: "Vendas",
    products: "Produtos",
    clients: "Clientes",

    // Dashboard
    overview: "Visão Geral",
    totalRevenue: "Receita Total",
    totalOrders: "Total de Pedidos",
    paid: "Pagos",
    pending: "Pendentes",
    cancelled: "Cancelados",
    revenueChart: "Receita · Ultimos 6 meses",
    recentSales: "Vendas Recentes",
    topProducts: "Produtos Mais Vendidos",
    vsLastPeriod: "vs período anterior",
    thisMonth: "este mês",
    ofOrders: "dos pedidos",
    awaiting: "aguardando",
    allClear: "Tudo certo",
    units: "unidades",

    // Sales
    transactions: "transações",
    searchSales: "Pesquisar vendas...",
    noSalesFound: "Nenhuma venda encontrada",
    tryAdjustingSearch: "Tente ajustar sua pesquisa",
    saleDetails: "Detalhes da Venda",
    product: "Produto",
    client: "Cliente",
    date: "Data",
    quantity: "Quantidade",
    unitPrice: "Preço Unitário",
    total: "Total",
    status: "Status",
    newSale: "Nova Venda",
    addSale: "Adicionar Venda",
    editSale: "Editar Venda",
    deleteSale: "Excluir Venda",

    // Products
    items: "itens",
    searchProducts: "Pesquisar produtos...",
    noProductsFound: "Nenhum produto encontrado",
    productDetails: "Detalhes do Produto",
    category: "Categoria",
    price: "Preço",
    stock: "Estoque",
    revenue: "Receita",
    paidOrders: "Pedidos Pagos",
    totalStock: "Estoque Total",
    lowStock: "Estoque Baixo",
    outOfStock: "Sem Estoque",
    critical: "Crítico",
    lowStockStatus: "Estoque Baixo",
    goodStock: "Bom Estoque",
    newProduct: "Novo Produto",
    addProduct: "Adicionar Produto",
    productName: "Nome do Produto",
    stockQuantity: "Quantidade em Estoque",
    editProduct: "Editar Produto",
    deleteProduct: "Excluir Produto",
    historicalData: "Dados Históricos",
    historicalSales: "Vendas Históricas",
    futureSales: "Vendas Futuras",
    productColor: "Cor do Produto",

    // Clients
    contacts: "contatos",
    searchClients: "Pesquisar clientes...",
    noClientsFound: "Nenhum cliente encontrado",
    clientDetails: "Detalhes do Cliente",
    email: "E-mail",
    phone: "Telefone",
    totalSpent: "Total Gasto",
    orders: "pedidos",
    totalClients: "Total de Clientes",
    averageSpent: "Médio Gasto",
    topSpender: "Maior Comprador",
    newClient: "Novo Cliente",
    addClient: "Adicionar Cliente",
    fullName: "Nome Completo",
    editClient: "Editar Cliente",
    deleteClient: "Excluir Cliente",
    clientColor: "Cor do Cliente",
    lastOrder: "Último Pedido",

    // Actions
    importExport: "Importar/Exportar",
    export: "Exportar",
    import: "Importar",
    importExcel: "Importar Arquivo Excel",
    exportExcel: "Exportar como Excel",
    resetData: "Resetar Todos os Dados",
    dangerZone: "Zona de Perigo",

    // Messages
    deleteConfirmation: "Confirmar Exclusão",
    deleteWarning:
      "Tem certeza que deseja excluir? Esta ação não pode ser desfeita.",
    deleteSuccess: "Excluído com sucesso",
    saveSuccess: "Salvo com sucesso",
    importSuccess: "Dados importados com sucesso",
    importFailed: "Falha na importação",
    exportFailed: "Falha na exportação",
    noDataToExport: "Nenhum dado para exportar",
    confirmChanges: "Confirmar Alterações",
    changesAffectHistoricalData: "Esta alteração afetará dados históricos",
    continue: "Continuar",

    // Setup
    welcome: "Bem-vindo ao Vyro",
    setupDashboard: "Configure seu painel de vendas",
    chooseLanguage: "Escolha seu idioma",
    chooseCurrency: "Escolha sua moeda",
    sampleData: "Dados de Exemplo",
    useSampleData: "Usar dados de exemplo para começar",
    sampleDataHelp:
      "Isso criará produtos, clientes e vendas de exemplo para você explorar",
    startFresh: "Começar do zero",
    freshHelp:
      "Comece com um banco de dados vazio e adicione seus próprios dados",
    next: "Próximo",
    back: "Voltar",
    start: "Começar",
    step: "Passo",
    of: "de",
    yourSelection: "Sua seleção",
    language: "Idioma",
    currency: "Moeda",
    data: "Dados",

    // Edit Modals
    saveChanges: "Salvar Alterações",
    cancelEdit: "Cancelar",
    preview: "Pré-visualização",
    subtotal: "Subtotal",
    randomColor: "Cor Aleatória",
    salesStatistics: "Estatísticas de Vendas",
    totalSales: "Total de Vendas",
    averageOrder: "Pedido Médio",

    // Product Edit Specific
    importantNotice: "Aviso Importante",
    productHasHistoricalSales:
      "Este produto possui {count} venda(s) histórica(s).",
    changesAffectFutureSalesOnly:
      "Alterações no nome ou preço afetarão APENAS vendas futuras. Vendas existentes manterão seus valores originais para relatórios históricos precisos.",
    historicalPrice:
      "Preço histórico: {price} (afeta {count} venda(s) existente(s))",
    currentNameInSales: 'Nome atual em {count} venda(s): "{name}"',
    historicalRevenueData: "Dados históricos de faturamento (não afetados)",
    note: "Nota:",

    // Client Edit Specific
    clientHasExistingSales: "Este cliente possui {count} venda(s).",
    changingNameAffectsHistoricalData:
      "Alterar o nome afetará dados históricos. Continue?",

    // Stock related
    availableStock: "Estoque Disponível",
    lowStockWarning: "⚠️ Estoque Baixo",
    lowStockWarningSubtext:
      "Apenas {stock} unidades restantes. Considere reabastecer em breve.",
    outOfStockWarning: "⚠️ Sem Estoque",
    outOfStockWarningSubtext:
      "Adicione mais estoque ao produto antes de fazer uma venda paga.",
    insufficientStock: "Estoque Insuficiente",
    onlyXUnitsAvailable: "Apenas {stock} unidades disponíveis em estoque",
    pleaseReduceQuantity:
      "Por favor, reduza a quantidade ou altere o status para pendente.",
    addMoreStockFirst: "Adicione mais estoque primeiro.",
    stockInformation: "Informações de Estoque",
    noProductsAvailable: "Nenhum produto disponível.",
    noClientsAvailable: "Nenhum cliente disponível.",
    pleaseAddProductFirst: "Por favor, adicione um produto primeiro.",
    pleaseAddClientFirst: "Por favor, adicione um cliente primeiro.",
    selectProduct: "Selecione um produto",
    selectClient: "Selecione um cliente",
    enterQuantity: "Digite a quantidade",
    enterDate: "Digite a data (YYYY-MM-DD)",
    selectStatus: "Selecione o status",
    totalPreview: "Total:",
    productRequired: "Produto é obrigatório",
    clientRequired: "Cliente é obrigatório",
    quantityRequired: "Quantidade é obrigatória",
    dateRequired: "Data é obrigatória",
    quantityMinOne: "A quantidade deve ser pelo menos 1",
  },

  en: {
    // Common
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    close: "Close",
    confirm: "Confirm",
    loading: "Loading...",
    search: "Search",
    filters: "Filters",
    all: "All",
    paidSingular: "Paid",
    pendingSingular: "Pending",
    cancelledSingular: "Cancelled",

    // Navigation
    dashboard: "Dashboard",
    sales: "Sales",
    products: "Products",
    clients: "Clients",

    // Dashboard
    overview: "Overview",
    totalRevenue: "Total Revenue",
    totalOrders: "Total Orders",
    paid: "Paid",
    pending: "Pending",
    cancelled: "Cancelled",
    revenueChart: "Revenue · Last 6 months",
    recentSales: "Recent Sales",
    topProducts: "Top Products",
    vsLastPeriod: "vs last period",
    thisMonth: "this month",
    ofOrders: "of orders",
    awaiting: "awaiting",
    allClear: "All clear",
    units: "units",

    // Sales
    transactions: "transactions",
    searchSales: "Search sales...",
    noSalesFound: "No sales found",
    tryAdjustingSearch: "Try adjusting your search",
    saleDetails: "Sale Details",
    product: "Product",
    client: "Client",
    date: "Date",
    quantity: "Quantity",
    unitPrice: "Unit Price",
    total: "Total",
    status: "Status",
    newSale: "New Sale",
    addSale: "Add Sale",
    editSale: "Edit Sale",
    deleteSale: "Delete Sale",

    // Products
    items: "items",
    searchProducts: "Search products...",
    noProductsFound: "No products found",
    productDetails: "Product Details",
    category: "Category",
    price: "Price",
    stock: "Stock",
    revenue: "Revenue",
    paidOrders: "Paid Orders",
    totalStock: "Total Stock",
    lowStock: "Low Stock",
    outOfStock: "Out of Stock",
    critical: "Critical",
    lowStockStatus: "Low Stock",
    goodStock: "Good Stock",
    newProduct: "New Product",
    addProduct: "Add Product",
    productName: "Product Name",
    stockQuantity: "Stock Quantity",
    editProduct: "Edit Product",
    deleteProduct: "Delete Product",
    historicalData: "Historical Data",
    historicalSales: "Historical Sales",
    futureSales: "Future Sales",
    productColor: "Product Color",

    // Clients
    contacts: "contacts",
    searchClients: "Search clients...",
    noClientsFound: "No clients found",
    clientDetails: "Client Details",
    email: "Email",
    phone: "Phone",
    totalSpent: "Total Spent",
    orders: "orders",
    totalClients: "Total Clients",
    averageSpent: "Average Spent",
    topSpender: "Top Spender",
    newClient: "New Client",
    addClient: "Add Client",
    fullName: "Full Name",
    editClient: "Edit Client",
    deleteClient: "Delete Client",
    clientColor: "Client Color",
    lastOrder: "Last Order",

    // Actions
    importExport: "Import/Export",
    export: "Export",
    import: "Import",
    importExcel: "Import Excel File",
    exportExcel: "Export as Excel",
    resetData: "Reset All Data",
    dangerZone: "Danger Zone",

    // Messages
    deleteConfirmation: "Confirm Delete",
    deleteWarning:
      "Are you sure you want to delete? This action cannot be undone.",
    deleteSuccess: "Deleted successfully",
    saveSuccess: "Saved successfully",
    importSuccess: "Data imported successfully",
    importFailed: "Import failed",
    exportFailed: "Export failed",
    noDataToExport: "No data to export",
    confirmChanges: "Confirm Changes",
    changesAffectHistoricalData: "This change will affect historical data",
    continue: "Continue",

    // Setup
    welcome: "Welcome to Vyro",
    setupDashboard: "Set up your sales dashboard",
    chooseLanguage: "Choose your language",
    chooseCurrency: "Choose your currency",
    sampleData: "Sample Data",
    useSampleData: "Use sample data to get started",
    sampleDataHelp:
      "This will create sample products, clients, and sales for you to explore",
    startFresh: "Start from scratch",
    freshHelp: "Start with an empty database and add your own data",
    next: "Next",
    back: "Back",
    start: "Start",
    step: "Step",
    of: "of",
    yourSelection: "Your selection",
    language: "Language",
    currency: "Currency",
    data: "Data",

    // Edit Modals
    saveChanges: "Save Changes",
    cancelEdit: "Cancel",
    preview: "Preview",
    subtotal: "Subtotal",
    randomColor: "Random Color",
    salesStatistics: "Sales Statistics",
    totalSales: "Total Sales",
    averageOrder: "Average Order",

    // Product Edit Specific
    importantNotice: "Important Notice",
    productHasHistoricalSales: "This product has {count} historical sale(s).",
    changesAffectFutureSalesOnly:
      "Changes to the product name or price will ONLY affect future sales. Existing sales will retain their original name and price for accurate historical reporting.",
    historicalPrice:
      "Historical price: {price} (affects {count} existing sale(s))",
    currentNameInSales: 'Current name in {count} sale(s): "{name}"',
    historicalRevenueData: "Historical Revenue Data (Unaffected)",
    note: "Note:",

    // Client Edit Specific
    clientHasExistingSales: "This client has {count} sale(s).",
    changingNameAffectsHistoricalData:
      "Changing their name will affect historical data. Continue?",

    // Stock related
    availableStock: "Available Stock",
    lowStockWarning: "⚠️ Low Stock Warning",
    lowStockWarningSubtext:
      "Only {stock} units remaining. Consider restocking soon.",
    outOfStockWarning: "⚠️ Out of Stock",
    outOfStockWarningSubtext:
      "Please add more stock to the product before making a paid sale.",
    insufficientStock: "Insufficient Stock",
    onlyXUnitsAvailable: "Only {stock} units available in stock",
    pleaseReduceQuantity:
      "Please reduce the quantity or change status to pending.",
    addMoreStockFirst: "Please add more stock first.",
    stockInformation: "Stock Information",
    noProductsAvailable: "No products available.",
    noClientsAvailable: "No clients available.",
    pleaseAddProductFirst: "Please add a product first.",
    pleaseAddClientFirst: "Please add a client first.",
    selectProduct: "Select a product",
    selectClient: "Select a client",
    enterQuantity: "Enter quantity",
    enterDate: "Enter date (YYYY-MM-DD)",
    selectStatus: "Select status",
    totalPreview: "Total:",
    productRequired: "Product is required",
    clientRequired: "Client is required",
    quantityRequired: "Quantity is required",
    dateRequired: "Date is required",
    quantityMinOne: "Quantity must be at least 1",
  },

  "es-AR": {
    // Common
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    close: "Cerrar",
    confirm: "Confirmar",
    loading: "Cargando...",
    search: "Buscar",
    filters: "Filtros",
    all: "Todos",
    paidSingular: "Pagado",
    pendingSingular: "Pendiente",
    cancelledSingular: "Cancelado",

    // Navigation
    dashboard: "Panel",
    sales: "Ventas",
    products: "Productos",
    clients: "Clientes",

    // Dashboard
    overview: "Resumen",
    totalRevenue: "Ingresos Totales",
    totalOrders: "Pedidos Totales",
    paid: "Pagados",
    pending: "Pendientes",
    cancelled: "Cancelados",
    revenueChart: "Ingresos · Últimos 6 meses",
    recentSales: "Ventas Recientes",
    topProducts: "Productos Destacados",
    vsLastPeriod: "vs período anterior",
    thisMonth: "este mes",
    ofOrders: "de pedidos",
    awaiting: "pendientes",
    allClear: "Todo bien",
    units: "unidades",

    // Sales
    transactions: "transacciones",
    searchSales: "Buscar ventas...",
    noSalesFound: "No se encontraron ventas",
    tryAdjustingSearch: "Intente ajustar su búsqueda",
    saleDetails: "Detalles de Venta",
    product: "Producto",
    client: "Cliente",
    date: "Fecha",
    quantity: "Cantidad",
    unitPrice: "Precio Unitario",
    total: "Total",
    status: "Estado",
    newSale: "Nueva Venta",
    addSale: "Agregar Venta",
    editSale: "Editar Venta",
    deleteSale: "Eliminar Venta",

    // Products
    items: "artículos",
    searchProducts: "Buscar productos...",
    noProductsFound: "No se encontraron productos",
    productDetails: "Detalles del Producto",
    category: "Categoría",
    price: "Precio",
    stock: "Stock",
    revenue: "Ingresos",
    paidOrders: "Pedidos Pagados",
    totalStock: "Stock Total",
    lowStock: "Stock Bajo",
    outOfStock: "Sin Stock",
    critical: "Crítico",
    lowStockStatus: "Stock Bajo",
    goodStock: "Buen Stock",
    newProduct: "Nuevo Producto",
    addProduct: "Agregar Producto",
    productName: "Nombre del Producto",
    stockQuantity: "Cantidad en Stock",
    editProduct: "Editar Producto",
    deleteProduct: "Eliminar Producto",
    historicalData: "Datos Históricos",
    historicalSales: "Ventas Históricas",
    futureSales: "Ventas Futuras",
    productColor: "Color del Producto",

    // Clients
    contacts: "contactos",
    searchClients: "Buscar clientes...",
    noClientsFound: "No se encontraron clientes",
    clientDetails: "Detalles del Cliente",
    email: "Correo",
    phone: "Teléfono",
    totalSpent: "Total Gastado",
    orders: "pedidos",
    totalClients: "Total de Clientes",
    averageSpent: "Gasto Promedio",
    topSpender: "Mayor Comprador",
    newClient: "Nuevo Cliente",
    addClient: "Agregar Cliente",
    fullName: "Nombre Completo",
    editClient: "Editar Cliente",
    deleteClient: "Eliminar Cliente",
    clientColor: "Color del Cliente",
    lastOrder: "Último Pedido",

    // Actions
    importExport: "Importar/Exportar",
    export: "Exportar",
    import: "Importar",
    importExcel: "Importar Archivo Excel",
    exportExcel: "Exportar como Excel",
    resetData: "Restablecer Todos los Datos",
    dangerZone: "Zona de Peligro",

    // Messages
    deleteConfirmation: "Confirmar Eliminación",
    deleteWarning:
      "¿Estás seguro de que quieres eliminar? Esta acción no se puede deshacer.",
    deleteSuccess: "Eliminado exitosamente",
    saveSuccess: "Guardado exitosamente",
    importSuccess: "Datos importados exitosamente",
    importFailed: "Error al importar",
    exportFailed: "Error al exportar",
    noDataToExport: "No hay datos para exportar",
    confirmChanges: "Confirmar Cambios",
    changesAffectHistoricalData: "Este cambio afectará datos históricos",
    continue: "Continuar",

    // Setup
    welcome: "Bienvenido a Vyro",
    setupDashboard: "Configure su panel de ventas",
    chooseLanguage: "Elija su idioma",
    chooseCurrency: "Elija su moneda",
    sampleData: "Datos de Ejemplo",
    useSampleData: "Usar datos de ejemplo para comenzar",
    sampleDataHelp:
      "Esto creará productos, clientes y ventas de ejemplo para que explore",
    startFresh: "Comenzar desde cero",
    freshHelp:
      "Comience con una base de datos vacía y agregue sus propios datos",
    next: "Siguiente",
    back: "Atrás",
    start: "Comenzar",
    step: "Paso",
    of: "de",
    yourSelection: "Su selección",
    language: "Idioma",
    currency: "Moneda",
    data: "Datos",

    // Edit Modals
    saveChanges: "Guardar Cambios",
    cancelEdit: "Cancelar",
    preview: "Vista Previa",
    subtotal: "Subtotal",
    randomColor: "Color Aleatorio",
    salesStatistics: "Estadísticas de Ventas",
    totalSales: "Ventas Totales",
    averageOrder: "Pedido Promedio",

    // Product Edit Specific
    importantNotice: "Aviso Importante",
    productHasHistoricalSales:
      "Este producto tiene {count} venta(s) histórica(s).",
    changesAffectFutureSalesOnly:
      "Los cambios en el nombre o precio del producto solo afectarán las ventas FUTURAS. Las ventas existentes conservarán su nombre y precio originales para informes históricos precisos.",
    historicalPrice:
      "Precio histórico: {price} (afecta {count} venta(s) existente(s))",
    currentNameInSales: 'Nombre actual en {count} venta(s): "{name}"',
    historicalRevenueData: "Datos históricos de ingresos (no afectados)",
    note: "Nota:",

    // Client Edit Specific
    clientHasExistingSales: "Este cliente tiene {count} venta(s).",
    changingNameAffectsHistoricalData:
      "Cambiar su nombre afectará los datos históricos. ¿Continuar?",

    // Stock related
    availableStock: "Stock Disponible",
    lowStockWarning: "⚠️ Stock Bajo",
    lowStockWarningSubtext:
      "Solo {stock} unidades restantes. Considere reabastecer pronto.",
    outOfStockWarning: "⚠️ Sin Stock",
    outOfStockWarningSubtext:
      "Agregue más stock al producto antes de hacer una venta pagada.",
    insufficientStock: "Stock Insuficiente",
    onlyXUnitsAvailable: "Solo {stock} unidades disponibles en stock",
    pleaseReduceQuantity:
      "Por favor, reduzca la cantidad o cambie el estado a pendiente.",
    addMoreStockFirst: "Agregue más stock primero.",
    stockInformation: "Información de Stock",
    noProductsAvailable: "No hay productos disponibles.",
    noClientsAvailable: "No hay clientes disponibles.",
    pleaseAddProductFirst: "Por favor, agregue un producto primero.",
    pleaseAddClientFirst: "Por favor, agregue un cliente primero.",
    selectProduct: "Seleccione un producto",
    selectClient: "Seleccione un cliente",
    enterQuantity: "Ingrese la cantidad",
    enterDate: "Ingrese la fecha (AAAA-MM-DD)",
    selectStatus: "Seleccione el estado",
    totalPreview: "Total:",
    productRequired: "El producto es obligatorio",
    clientRequired: "El cliente es obligatorio",
    quantityRequired: "La cantidad es obligatoria",
    dateRequired: "La fecha es obligatoria",
    quantityMinOne: "La cantidad debe ser al menos 1",
  },
};
