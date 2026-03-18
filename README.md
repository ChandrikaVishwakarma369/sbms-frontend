# SBMS - Smart Business Management System

## Project Overview
SBMS is a Smart Business Management System designed to streamline business operations through an intuitive interface. This project focuses on the Invoices module, providing users with a comprehensive view of their invoices, including detailed statistics and management features.

## Tech Stack
- **React** (Vite)
- **Tailwind CSS**
- **JavaScript**
- **Mock Data** (no backend yet, backend will be integrated later)

## Features
1. **Invoices List Table**  
   - Displays invoice data from a mock file.  
   - Columns: Invoice ID, Customer (with avatar), Date, Amount, Status, Actions.  
   - Customer avatar shows the first letter of the name with color.  
   - Status badges with color coding: PAID (green), PENDING (yellow), OVERDUE (red).

2. **Stats Cards**  
   - Total Paid (Month)  
   - Total Pending  
   - Total Overdue  
   - All calculated dynamically from invoice data.

3. **Search & Filter**  
   - Search by Invoice ID or Customer Name.  
   - Filter by Status: All Status / PAID / PENDING / OVERDUE.

4. **CSV Download**  
   - Downloads currently filtered invoices as a CSV file.  
   - Filename includes today's date.

5. **Create Invoice (Modal Popup)**  
   - Fields: Customer Name, Invoice Date, Subtotal, GST % (0/5/12/18/28), Status.  
   - GST and Total auto-calculated in real time.  
   - Form validation with error messages.  
   - New invoice added to the list on submit.

6. **View Invoice (Modal Popup)**  
   - Click eye icon to view full invoice details.  
   - Shows: Invoice ID, Customer, Date, Status, Subtotal, GST, Total Amount.

7. **Edit Invoice (Modal Popup)**  
   - Click edit icon to edit existing invoice.  
   - Form pre-filled with existing data.  
   - GST and Total auto-calculated on change.  
   - Updates invoice in the list on save.

## Project Structure
```
SBMS-Frontend/
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── vite.config.js
├── public/
│   └── mock/
│       └── invoices.js
└── src/
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── assets/
    ├── pages/
    │   └── Invoices.jsx
    └── services/
        └── invoice.service.js
```

## How to Run
1. Clone the repository:  
   ```bash
   git clone <repository-url>
   cd SBMS-Frontend
   ```  
2. Install dependencies:  
   ```bash
   npm install
   ```  
3. Start the development server:  
   ```bash
   npm run dev
   ```  
4. Open your browser and navigate to `http://localhost:5173`.

## Mock Data Format
The mock data is located in `public/mock/invoices.js` and contains sample invoices with the following fields:
- `id`
- `customerName`
- `subtotal`
- `gst`
- `total`
- `status`
- `date`

## Future Scope
- Integrate a backend API for dynamic data handling.
- Implement user authentication and authorization.
- Expand the application to include additional modules such as Payments, Customers, and Reports.
- Enhance the UI/UX based on user feedback.