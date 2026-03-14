import { invoicesMock } from "../../public/mock/invoices.js";

// Mock data return 
export const getInvoices = () => {
  return invoicesMock;
};

// Stats calculate 
export const getInvoiceStats = (invoices) => {
  const totalPaid = invoices
    .filter((inv) => inv.status === "PAID")
    .reduce((sum, inv) => sum + inv.total, 0);

  const totalPending = invoices
    .filter((inv) => inv.status === "PENDING")
    .reduce((sum, inv) => sum + inv.total, 0);

  const totalOverdue = invoices
    .filter((inv) => inv.status === "OVERDUE")
    .reduce((sum, inv) => sum + inv.total, 0);

  return { totalPaid, totalPending, totalOverdue };
};