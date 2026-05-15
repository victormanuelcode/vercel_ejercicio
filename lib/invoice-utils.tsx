// Utility functions for invoice export and printing

export interface InvoiceData {
  id: string
  client: string
  cedula: string
  address?: string
  phone?: string
  date: string
  items: {
    name: string
    price: number
    quantity: number
    subtotal: number
  }[]
  subtotal: number
  tax: number
  total: number
}

// Generate PDF invoice
export const generateInvoicePDF = async (invoice: InvoiceData) => {
  // Dynamic import to avoid SSR issues
  const { jsPDF } = await import("jspdf")

  const doc = new jsPDF()

  // Header
  doc.setFontSize(20)
  doc.setTextColor(46, 125, 50) // Primary green
  doc.text("TRIUNFOGO", 20, 20)

  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text("Sistema de Gestión Agrícola", 20, 27)

  // Invoice info
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text(`Factura ${invoice.id}`, 150, 20)

  doc.setFontSize(10)
  doc.text(`Fecha: ${new Date(invoice.date).toLocaleDateString()}`, 150, 27)

  // Divider
  doc.setDrawColor(200, 200, 200)
  doc.line(20, 35, 190, 35)

  // Client info
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text("Cliente:", 20, 45)

  doc.setFontSize(10)
  doc.text(`Nombre: ${invoice.client}`, 20, 52)
  doc.text(`Cédula: ${invoice.cedula}`, 20, 58)
  if (invoice.address) doc.text(`Dirección: ${invoice.address}`, 20, 64)
  if (invoice.phone) doc.text(`Teléfono: ${invoice.phone}`, 20, 70)

  // Items table header
  let yPos = invoice.phone ? 85 : 75
  doc.setFillColor(46, 125, 50)
  doc.rect(20, yPos, 170, 8, "F")

  doc.setTextColor(255, 255, 255)
  doc.text("Producto", 22, yPos + 5)
  doc.text("Precio", 110, yPos + 5)
  doc.text("Cantidad", 135, yPos + 5)
  doc.text("Subtotal", 165, yPos + 5)

  // Items
  yPos += 10
  doc.setTextColor(0, 0, 0)

  invoice.items.forEach((item) => {
    doc.text(item.name, 22, yPos)
    doc.text(`$${item.price.toFixed(2)}`, 110, yPos)
    doc.text(item.quantity.toString(), 140, yPos)
    doc.text(`$${item.subtotal.toFixed(2)}`, 165, yPos)
    yPos += 7
  })

  // Totals
  yPos += 5
  doc.line(20, yPos, 190, yPos)
  yPos += 8

  doc.text("Subtotal:", 130, yPos)
  doc.text(`$${invoice.subtotal.toFixed(2)}`, 165, yPos)

  yPos += 7
  doc.text("IVA (19%):", 130, yPos)
  doc.text(`$${invoice.tax.toFixed(2)}`, 165, yPos)

  yPos += 7
  doc.setFontSize(12)
  doc.setFont(undefined, "bold")
  doc.text("Total:", 130, yPos)
  doc.text(`$${invoice.total.toFixed(2)}`, 165, yPos)

  // Footer
  doc.setFontSize(8)
  doc.setFont(undefined, "normal")
  doc.setTextColor(100, 100, 100)
  doc.text("Gracias por su compra - TRIUNFOGO", 105, 280, { align: "center" })

  // Save
  doc.save(`factura_${invoice.id}.pdf`)
}

// Generate Excel export
export const generateInvoiceExcel = (invoice: InvoiceData) => {
  const rows = [
    ["TRIUNFOGO - Factura", invoice.id],
    ["Fecha:", new Date(invoice.date).toLocaleDateString()],
    [],
    ["Cliente:", invoice.client],
    ["Cédula:", invoice.cedula],
    ...(invoice.address ? [["Dirección:", invoice.address]] : []),
    ...(invoice.phone ? [["Teléfono:", invoice.phone]] : []),
    [],
    ["Producto", "Precio", "Cantidad", "Subtotal"],
    ...invoice.items.map((item) => [
      item.name,
      `$${item.price.toFixed(2)}`,
      item.quantity,
      `$${item.subtotal.toFixed(2)}`,
    ]),
    [],
    ["", "", "Subtotal:", `$${invoice.subtotal.toFixed(2)}`],
    ["", "", "IVA (19%):", `$${invoice.tax.toFixed(2)}`],
    ["", "", "Total:", `$${invoice.total.toFixed(2)}`],
  ]

  let csvContent = "data:text/csv;charset=utf-8,"
  rows.forEach((row) => {
    csvContent += row.join(",") + "\n"
  })

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `factura_${invoice.id}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Print invoice
export const printInvoice = (invoice: InvoiceData) => {
  const printWindow = window.open("", "_blank")

  if (!printWindow) {
    alert("Por favor, permita las ventanas emergentes para imprimir")
    return
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Factura ${invoice.id}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #2E7D32;
        }
        .company {
          color: #2E7D32;
        }
        .company h1 {
          margin: 0;
          font-size: 28px;
        }
        .company p {
          margin: 5px 0 0 0;
          color: #666;
        }
        .invoice-info {
          text-align: right;
        }
        .invoice-info h2 {
          margin: 0;
          font-size: 24px;
        }
        .client-info {
          margin-bottom: 30px;
          background: #f5f5f5;
          padding: 15px;
          border-radius: 8px;
        }
        .client-info h3 {
          margin: 0 0 10px 0;
          color: #2E7D32;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        thead {
          background: #2E7D32;
          color: white;
        }
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          font-weight: bold;
        }
        .totals {
          text-align: right;
          margin-top: 20px;
        }
        .totals table {
          margin-left: auto;
          width: 300px;
        }
        .totals .total-row {
          font-size: 18px;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #666;
        }
        @media print {
          body {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company">
          <h1>TRIUNFOGO</h1>
          <p>Sistema de Gestión Agrícola</p>
        </div>
        <div class="invoice-info">
          <h2>Factura ${invoice.id}</h2>
          <p>Fecha: ${new Date(invoice.date).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div class="client-info">
        <h3>Información del Cliente</h3>
        <p><strong>Nombre:</strong> ${invoice.client}</p>
        <p><strong>Cédula:</strong> ${invoice.cedula}</p>
        ${invoice.address ? `<p><strong>Dirección:</strong> ${invoice.address}</p>` : ""}
        ${invoice.phone ? `<p><strong>Teléfono:</strong> ${invoice.phone}</p>` : ""}
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items
            .map(
              (item) => `
            <tr>
              <td>${item.name}</td>
              <td>$${item.price.toFixed(2)}</td>
              <td>${item.quantity}</td>
              <td>$${item.subtotal.toFixed(2)}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
      
      <div class="totals">
        <table>
          <tr>
            <td>Subtotal:</td>
            <td>$${invoice.subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td>IVA (19%):</td>
            <td>$${invoice.tax.toFixed(2)}</td>
          </tr>
          <tr class="total-row">
            <td>Total:</td>
            <td>$${invoice.total.toFixed(2)}</td>
          </tr>
        </table>
      </div>
      
      <div class="footer">
        <p>Gracias por su compra - TRIUNFOGO</p>
      </div>
      
      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `

  printWindow.document.write(html)
  printWindow.document.close()
}
