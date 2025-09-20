import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";



const Invoice = () => {
  const [invoices, setInvoices] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    companyLogo: "",
    customerName: "",
    customerMobile: "",
    customerAddress: "",
    items: [{
      productName: "",
      quantity: "",
      unit: "kg",
      description: "",
      price: "",
      offerPrice: "",
      hsn: ""
    }]
  });

  const handleDownload = async (invoice) => {
    try {
      // Create a printable HTML version of the invoice
      const printWindow = window.open('', '_blank');
      const htmlContent = generatePrintableHTML(invoice);

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Auto-trigger print dialog after content loads
      printWindow.onload = () => {
        printWindow.print();
      };

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const generatePrintableHTML = (invoice) => {
    const subtotal = invoice.items?.reduce((total, item) => {
      return total + (parseFloat(item.offerPrice) || 0) * (parseInt(item.quantity) || 0);
    }, 0) || 0;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Invoice ${invoice.invoiceNumber}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Helvetica', Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            background: white;
        }
        
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
        }
        
        /* Header Styles */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #2563eb;
        }
        
        .company-info h1 {
            font-size: 28px;
            color: #1e40af;
            margin-bottom: 8px;
        }
        
        .company-details {
            color: #6b7280;
            line-height: 1.5;
        }
        
        .invoice-info {
            text-align: right;
        }
        
        .invoice-title {
            font-size: 32px;
            color: #dc2626;
            font-weight: bold;
            margin-bottom: 8px;
        }
        
        .invoice-number {
            font-size: 16px;
            font-weight: bold;
            color: #374151;
        }
        
        .status-badge {
            background: #dcfce7;
            color: #166534;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
            display: inline-block;
            margin-top: 8px;
        }
        
        /* Date Info */
        .date-info {
            display: flex;
            justify-content: space-between;
            background: #f1f5f9;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        
        .date-item {
            text-align: center;
        }
        
        .date-label {
            font-size: 10px;
            color: #64748b;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 4px;
        }
        
        .date-value {
            font-size: 14px;
            font-weight: bold;
            color: #0f172a;
        }
        
        /* Billing Info */
        .billing-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        
        .bill-to, .ship-to {
            flex: 1;
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        
        .bill-to {
            margin-right: 20px;
        }
        
        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #1e40af;
            text-transform: uppercase;
            margin-bottom: 12px;
            letter-spacing: 0.5px;
        }
        
        .customer-name {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 6px;
        }
        
        /* Table Styles */
        .items-section {
            margin: 30px 0;
        }
        
        .items-title {
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            background: #dbeafe;
            color: #1e40af;
            padding: 12px;
            border-radius: 8px 8px 0 0;
            margin-bottom: 0;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #e5e7eb;
            border-top: none;
        }
        
        .items-table th {
            background: #1e40af;
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-weight: bold;
            font-size: 10px;
        }
        
        .items-table td {
            padding: 12px 8px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 11px;
        }
        
        .items-table tr:nth-child(even) {
            background: #f9fafb;
        }
        
        .product-name {
            font-weight: bold;
        }
        
        .product-desc {
            font-size: 9px;
            color: #6b7280;
            margin-top: 4px;
        }
        
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        
        /* Totals */
        .totals-section {
            margin-top: 30px;
            background: #f0f9ff;
            border: 2px solid #0ea5e9;
            border-radius: 8px;
            padding: 20px;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        
        .total-row.final {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 2px solid #0ea5e9;
        }
        
        .total-label {
            font-weight: bold;
        }
        
        .total-value {
            font-weight: bold;
        }
        
        .final .total-label {
            font-size: 16px;
            color: #0c4a6e;
        }
        
        .final .total-value {
            font-size: 18px;
            color: #0c4a6e;
        }
        
        /* Footer */
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #d1d5db;
            display: flex;
            justify-content: space-between;
        }
        
        .footer-section {
            flex: 1;
        }
        
        .footer-section:first-child {
            margin-right: 20px;
        }
        
        .footer-title {
            font-weight: bold;
            margin-bottom: 8px;
            color: #374151;
        }
        
        .footer-text {
            font-size: 10px;
            color: #6b7280;
            line-height: 1.4;
        }
        
        @media print {
            .invoice-container {
                margin: 0;
                padding: 20px;
            }
            
            .header {
                margin-bottom: 20px;
                padding-bottom: 15px;
            }
            
            .date-info, .billing-info, .items-section, .totals-section {
                margin-bottom: 20px;
            }
            
            .footer {
                margin-top: 30px;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <!-- Header -->
        <div class="header">
            <div class="company-info">
                ${invoice.companyLogo ? `<img src="${invoice.companyLogo}" alt="Company Logo" style="max-height: 60px; margin-bottom: 10px;">` : ''}
                <h1>${invoice.companyName || 'Your Company Name'}</h1>
                <div class="company-details">
                    123 Business Street<br>
                    City, State 12345<br>
                    Phone: (555) 123-4567<br>
                    Email: info@company.com
                </div>
            </div>
            <div class="invoice-info">
                <div class="invoice-title">INVOICE</div>
                <div class="invoice-number">${invoice.invoiceNumber}</div>
                <div class="status-badge">PENDING</div>
            </div>
        </div>

        <!-- Date Information -->
        <div class="date-info">
            <div class="date-item">
                <div class="date-label">Issue Date</div>
                <div class="date-value">${invoice.issuedDate}</div>
            </div>
            <div class="date-item">
                <div class="date-label">Due Date</div>
                <div class="date-value">${invoice.dueDate}</div>
            </div>
            <div class="date-item">
                <div class="date-label">Payment Terms</div>
                <div class="date-value">Net 30</div>
            </div>
        </div>

        <!-- Billing Information -->
        <div class="billing-info">
            <div class="bill-to">
                <div class="section-title">Bill To</div>
                <div class="customer-name">${invoice.customerName}</div>
                <div>Mobile: ${invoice.customerMobile}</div>
                <div>${invoice.customerAddress}</div>
            </div>
            <div class="ship-to">
                <div class="section-title">Ship To</div>
                <div class="customer-name">${invoice.customerName}</div>
                <div>${invoice.customerAddress}</div>
            </div>
        </div>

        <!-- Items -->
        <div class="items-section">
            <div class="items-title">ITEMS & SERVICES</div>
            <table class="items-table">
                <thead>
                    <tr>
                        <th style="width: 35%;">PRODUCT/SERVICE</th>
                        <th style="width: 10%;" class="text-center">QTY</th>
                        <th style="width: 10%;" class="text-center">UNIT</th>
                        <th style="width: 15%;" class="text-right">PRICE</th>
                        <th style="width: 15%;" class="text-right">OFFER PRICE</th>
                        <th style="width: 15%;" class="text-center">HSN CODE</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoice.items?.map(item => `
                        <tr>
                            <td>
                                <div class="product-name">${item.productName}</div>
                                ${item.description ? `<div class="product-desc">${item.description}</div>` : ''}
                            </td>
                            <td class="text-center">${item.quantity}</td>
                            <td class="text-center">${item.unit}</td>
                            <td class="text-right">${parseFloat(item.price).toFixed(2)}</td>
                            <td class="text-right">${parseFloat(item.offerPrice).toFixed(2)}</td>
                            <td class="text-center">${item.hsn || 'N/A'}</td>
                        </tr>
                    `).join('') || '<tr><td colspan="6" class="text-center">No items found</td></tr>'}
                </tbody>
            </table>
        </div>

        <!-- Totals -->
        <div class="totals-section">
            <div class="total-row">
                <span class="total-label">Subtotal:</span>
                <span class="total-value">${subtotal.toFixed(2)}</span>
            </div>
            <div class="total-row">
                <span class="total-label">Tax (0%):</span>
                <span class="total-value">$0.00</span>
            </div>
            <div class="total-row">
                <span class="total-label">Discount:</span>
                <span class="total-value">$0.00</span>
            </div>
            <div class="total-row final">
                <span class="total-label">TOTAL AMOUNT:</span>
                <span class="total-value">${invoice.amount?.toFixed(2) || subtotal.toFixed(2)}</span>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-section">
                <div class="footer-title">Payment Information</div>
                <div class="footer-text">
                    Please make payment within 30 days.<br>
                    Bank: Your Bank Name<br>
                    Account: 1234-5678-9012<br>
                    Routing: 987654321
                </div>
            </div>
            <div class="footer-section">
                <div class="footer-title">Terms & Conditions</div>
                <div class="footer-text">
                    Payment is due within 30 days.<br>
                    Late payments may incur additional charges.<br>
                    Thank you for your business!
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
  };

  const handleInputChange = (e, index = null, field = null) => {
    if (index !== null && field !== null) {
      // Handle item field changes
      const newItems = [...formData.items];
      newItems[index][field] = e.target.value;
      setFormData({ ...formData, items: newItems });
    } else {
      // Handle customer field changes
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB.');
        return;
      }

      // Create a FileReader to convert image to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, companyLogo: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setFormData({ ...formData, companyLogo: "" });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          productName: "",
          quantity: "",
          unit: "kg",
          description: "",
          price: "",
          offerPrice: "",
          hsn: ""
        }
      ]
    });
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = [...formData.items];
      newItems.splice(index, 1);
      setFormData({ ...formData, items: newItems });
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.companyName || !formData.customerName || !formData.customerMobile || !formData.customerAddress) {
      alert('Please fill in all company and customer information fields.');
      return;
    }

    // Validate items
    const validItems = formData.items.filter(item =>
      item.productName && item.quantity && item.price && item.offerPrice
    );

    if (validItems.length === 0) {
      alert('Please add at least one valid item with all required fields.');
      return;
    }

    // Calculate total amount
    const totalAmount = validItems.reduce((total, item) => {
      return total + (parseFloat(item.offerPrice) || 0) * (parseInt(item.quantity) || 0);
    }, 0);

    // Generate invoice number
    const invoiceNumber = `INV-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    // Create new invoice
    const newInvoice = {
      id: invoices.length + 1,
      invoiceNumber,
      companyName: formData.companyName,
      companyLogo: formData.companyLogo,
      customerName: formData.customerName,
      customerMobile: formData.customerMobile,
      customerAddress: formData.customerAddress,
      issuedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      amount: totalAmount,
      items: validItems
    };

    // Add to invoices list
    setInvoices([...invoices, newInvoice]);

    // Reset form and close modal
    setFormData({
      companyName: "",
      companyLogo: "",
      customerName: "",
      customerMobile: "",
      customerAddress: "",
      items: [{
        productName: "",
        quantity: "",
        unit: "kg",
        description: "",
        price: "",
        offerPrice: "",
        hsn: ""
      }]
    });
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-2 text-lg" />

          </button>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>

          {/* Placeholder div for spacing to keep title centered */}
          <div className="w-20"></div>
        </div>


        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Invoices</h2>

          {invoices && invoices.length > 0 ? (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="mb-3 md:mb-0">
                      <p className="font-bold text-lg text-blue-600">{invoice.invoiceNumber}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mt-2">
                        <div>
                          <span className="font-semibold">Issued</span>
                          <p>{invoice.issuedDate}</p>
                        </div>
                        <div>
                          <span className="font-semibold">Due Date</span>
                          <p>{invoice.dueDate}</p>
                        </div>
                        <div>
                          <span className="font-semibold">Customer</span>
                          <p>{invoice.customerName}</p>
                        </div>
                        <div>
                          <span className="font-semibold">Amount</span>
                          <p className="text-green-600 font-bold">${invoice.amount?.toFixed(2) || '0.00'}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(invoice)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors self-start md:self-auto"
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No invoices found. Create your first invoice to get started!</p>
            </div>
          )}
        </div>

        {/* Create Invoice Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Create New Invoice</h2>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-gray-700">Company Information</h3>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your company name"
                        required
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo (Optional)</label>

                      {!formData.companyLogo ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          <div className="space-y-2">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="text-sm text-gray-600">
                              <label className="cursor-pointer">
                                <span className="font-medium text-blue-600 hover:text-blue-500">Upload a logo</span>
                                <input
                                  type="file"
                                  className="sr-only"
                                  accept="image/*"
                                  onChange={handleLogoUpload}
                                />
                              </label>
                              <p className="text-gray-500">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <img
                                src={formData.companyLogo}
                                alt="Company Logo"
                                className="h-12 w-12 object-contain border rounded"
                              />
                              <div className="text-sm">
                                <p className="font-medium text-gray-900">Logo uploaded</p>
                                <p className="text-gray-500">Ready to use in invoice</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={removeLogo}
                              className="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="text-center">
                            <label className="cursor-pointer">
                              <span className="text-sm text-blue-600 hover:text-blue-500 font-medium">Change logo</span>
                              <input
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleLogoUpload}
                              />
                            </label>
                          </div>
                        </div>
                      )}
                    </div>

                    <h3 className="text-lg font-medium mb-4 text-gray-700">Customer Information</h3>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                      <input
                        type="text"
                        name="customerMobile"
                        value={formData.customerMobile}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <textarea
                        name="customerAddress"
                        value={formData.customerAddress}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      ></textarea>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4 text-gray-700">Items</h3>

                    {formData.items && formData.items.map((item, index) => (
                      <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input
                              type="text"
                              value={item.productName}
                              onChange={(e) => handleInputChange(e, index, 'productName')}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleInputChange(e, index, 'quantity')}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                            <select
                              value={item.unit}
                              onChange={(e) => handleInputChange(e, index, 'unit')}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="kg">Kg</option>
                              <option value="pcs">Pieces</option>
                              <option value="box">Box</option>
                              <option value="unit">Unit</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">HSN Code</label>
                            <input
                              type="text"
                              value={item.hsn}
                              onChange={(e) => handleInputChange(e, index, 'hsn')}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                            <input
                              type="number"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => handleInputChange(e, index, 'price')}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Offer Price</label>
                            <input
                              type="number"
                              step="0.01"
                              value={item.offerPrice}
                              onChange={(e) => handleInputChange(e, index, 'offerPrice')}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={item.description}
                            onChange={(e) => handleInputChange(e, index, 'description')}
                            rows="2"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          ></textarea>
                        </div>

                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-500 text-sm font-medium hover:text-red-700"
                          >
                            Remove Item
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addItem}
                      className="flex items-center text-blue-500 font-medium hover:text-blue-700"
                    >
                      <span className="text-lg mr-1">+</span> Add More Items
                    </button>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Create Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Create Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg flex items-center space-x-2 hover:bg-blue-600 transition-colors z-40"
        >
          <span className="text-2xl font-bold">+</span>
          <span className="font-semibold hidden sm:inline">New Invoice</span>
        </button>
      </div>
    </div>
  );
};

export default Invoice;