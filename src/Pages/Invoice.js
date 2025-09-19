import React, { useState, useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Sample data for recent invoices
const sampleInvoices = [
  {
    id: 1,
    invoiceNumber: "INV-001",
    invoiceDate: "2025-09-18",
    customer: {
      name: "John Doe",
      mobile: "1234567890",
      address: "123, Main St, City"
    },
    products: [
      {
        name: "Product A",
        quantity: 2,
        unit: "kg",
        description: "Description of Product A",
        price: 500,
        offerPrice: 450,
        hsn: "1234"
      }
    ],
    subtotal: 900,
    gst: 18,
    grandTotal: 1062
  }
];

// PDF Document Component
const InvoicePDF = ({ invoice }) => {
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontFamily: "Helvetica",
    },
    section: {
      marginBottom: 10,
    },
    heading: {
      fontSize: 18,
      fontWeight: "bold",
    },
    text: {
      fontSize: 12,
    },
    table: {
      marginBottom: 20,
      border: "1px solid black",
      padding: 5,
    },
    tableCell: {
      borderBottom: "1px solid black",
      padding: 5,
    },
  });

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>Invoice: {invoice.invoiceNumber}</Text>
          <Text>Date: {invoice.invoiceDate}</Text>
          <Text>Customer Name: {invoice.customer.name}</Text>
          <Text>Customer Address: {invoice.customer.address}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Product Details:</Text>
          {invoice.products.map((product, index) => (
            <View key={index} style={styles.table}>
              <Text style={styles.tableCell}>Product Name: {product.name}</Text>
              <Text style={styles.tableCell}>Quantity: {product.quantity} {product.unit}</Text>
              <Text style={styles.tableCell}>Description: {product.description}</Text>
              <Text style={styles.tableCell}>Price: ₹{product.price}</Text>
              <Text style={styles.tableCell}>Offer Price: ₹{product.offerPrice}</Text>
              <Text style={styles.tableCell}>HSN: {product.hsn}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Total:</Text>
          <Text>Subtotal: ₹{invoice.subtotal}</Text>
          <Text>GST: ₹{invoice.gst}</Text>
          <Text>Grand Total: ₹{invoice.grandTotal}</Text>
        </View>
      </Page>
    </Document>
  );
};

const Invoice = () => {
  const [invoices, setInvoices] = useState(sampleInvoices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    customerName: "",
    customerMobile: "",
    customerAddress: "",
    productName: "",
    quantity: "",
    unit: "kg",
    description: "",
    price: "",
    offerPrice: "",
    hsn: "",
  });
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceForm({ ...invoiceForm, [name]: value });
  };

  // Handle create invoice form submission
  const handleCreateInvoice = () => {
    const newInvoice = {
      id: invoices.length + 1,
      invoiceNumber: `INV-${invoices.length + 1}`,
      invoiceDate: new Date().toLocaleDateString(),
      customer: {
        name: invoiceForm.customerName,
        mobile: invoiceForm.customerMobile,
        address: invoiceForm.customerAddress,
      },
      products: [
        {
          name: invoiceForm.productName,
          quantity: invoiceForm.quantity,
          unit: invoiceForm.unit,
          description: invoiceForm.description,
          price: invoiceForm.price,
          offerPrice: invoiceForm.offerPrice,
          hsn: invoiceForm.hsn,
        },
      ],
      subtotal: invoiceForm.quantity * invoiceForm.price,
      gst: (invoiceForm.quantity * invoiceForm.price * 18) / 100,
      grandTotal:
        invoiceForm.quantity * invoiceForm.price +
        (invoiceForm.quantity * invoiceForm.price * 18) / 100,
    };

    setInvoices([...invoices, newInvoice]);
    setIsModalOpen(false);
  };

  // Show invoice details
  const handleInvoiceClick = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleDownload = async () => {
    if (selectedInvoice) {
      const blob = await pdf(<InvoicePDF invoice={selectedInvoice} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${selectedInvoice.invoiceNumber}.pdf`;
      link.click();
    }
  };

  useEffect(() => {
    // Fetch invoices from API or localStorage if needed
  }, []);

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md w-80">
      {/* Recent Invoices Section */}
      <h2 className="text-xl font-semibold mb-4">Recent Invoices</h2>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 mb-4"
      >
        Create New Invoice
      </button>

      <div className="bg-white p-4 rounded-lg mb-6">
        {invoices.length === 0 ? (
          <div>No invoices available</div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="border p-2">Invoice #</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Customer Name</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  onClick={() => handleInvoiceClick(invoice)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <td className="border p-2">{invoice.invoiceNumber}</td>
                  <td className="border p-2">{invoice.invoiceDate}</td>
                  <td className="border p-2">{invoice.customer.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Invoice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Create Invoice</h3>
            <form>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block">Customer Name</label>
                  <input
                    type="text"
                    name="customerName"
                    value={invoiceForm.customerName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block">Customer Mobile</label>
                  <input
                    type="text"
                    name="customerMobile"
                    value={invoiceForm.customerMobile}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block">Customer Address</label>
                  <input
                    type="text"
                    name="customerAddress"
                    value={invoiceForm.customerAddress}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              {/* Additional form fields here */}
              <button
                type="button"
                onClick={handleCreateInvoice}
                className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
              >
                Create Invoice
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Single Invoice View */}
      {selectedInvoice && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-2xl font-semibold mb-4">Invoice Details</h2>

          {/* Invoice details go here */}
          
          <div className="flex justify-between mt-4">
            <button
              onClick={handleDownload}
              className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
            >
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;
