import { invoicesMock } from "../../public/mock/invoices.js";

// ✅ Same logic jo frontend pe hai — agar dueDate nikal gayi aur PENDING hai toh OVERDUE
const getEffectiveStatus = (inv) => {
  if (
    inv.status === "PENDING" &&
    inv.dueDate &&
    new Date(inv.dueDate) < new Date(new Date().toDateString())
  ) {
    return "OVERDUE";
  }
  return inv.status;
};

// Mock data return
export const getInvoices = () => {
  return invoicesMock;
};

// Stats calculate — ab effective status se hoga, sirf stored status se nahi
export const getInvoiceStats = (invoices) => {
  const totalPaid = invoices
    .filter((inv) => getEffectiveStatus(inv) === "PAID")
    .reduce((sum, inv) => sum + inv.total, 0);

  const totalPending = invoices
    .filter((inv) => getEffectiveStatus(inv) === "PENDING")
    .reduce((sum, inv) => sum + inv.total, 0);

  const totalOverdue = invoices
    .filter((inv) => getEffectiveStatus(inv) === "OVERDUE")
    .reduce((sum, inv) => sum + inv.total, 0);

  return { totalPaid, totalPending, totalOverdue };
};