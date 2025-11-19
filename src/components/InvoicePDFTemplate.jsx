import React from "react";

const InvoicePDFTemplate = React.forwardRef(({ invoice }, ref) => {
  if (!invoice) return null;

  return (
    <div
      ref={ref}
      className="w-[794px] bg-white text-black p-[50px] absolute top-[-9999px] left-[-9999px]"
    >
      {/* ================= HEADER (COMPANY INFO) ================= */}
      <div className="mb-6 leading-tight">
        <h2 className="text-[18px] font-bold">Vestiaire Saint-Honoré</h2>
        <p className="text-[11px]">229 rue Saint-Honoré</p>
        <p className="text-[11px]">75001 Paris</p>
        <p className="text-[11px]">France</p>
        <p className="text-[11px]">VAT FR401234444</p>
      </div>

      {/* ================= BILL TO ================= */}
      <div className="mt-6 mb-5">
        <h3 className="text-[15px] font-bold mb-1">Bill to :</h3>
        <p className="text-[11px]">{invoice.customer?.customerName}</p>
        <p className="text-[11px]">{invoice.customer?.billingAddress}</p>
        <p className="text-[11px]">{invoice.customer?.country}</p>
        <p className="text-[11px]">VAT {invoice.customerVAT}</p>
      </div>

      {/* ================= INVOICE INFO ================= */}
      <div className="mt-5 mb-7 text-[13px] font-bold space-y-1">
        <p>Invoice : {invoice.invoiceNo}</p>
        <p>
          Date{" "}
          {new Date(invoice.invoiceDate).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          })}
        </p>
      </div>

      {/* ================= ITEMS TABLE ================= */}
      <table className="w-full border-collapse text-[11px] mt-3">
        <thead>
          <tr className="border-b border-black">
            <th className="text-left py-2 font-bold">Item Name</th>
            <th className="text-left py-2 font-bold">Size</th>
            <th className="text-left py-2 font-bold">Qty</th>
            <th className="text-left py-2 font-bold">Unit Price</th>
            <th className="text-left py-2 font-bold">VAT</th>
            <th className="text-left py-2 font-bold">Amount</th>
          </tr>
        </thead>

        <tbody>
          {invoice.items?.map((item, index) => (
            <tr key={index} className="border-b border-gray-300">
              <td className="py-2">{item.itemId?.itemName}</td>
              <td className="py-2">{item.size}</td>
              <td className="py-2">{item.quantity}</td>
              <td className="py-2">{item.unitPrice} €</td>
              <td className="py-2">{item.vatRate}%</td>
              <td className="py-2">{item.totalInclVAT} €</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= BANK DETAILS ================= */}
      <div className="mt-10">
        <h3 className="text-[15px] font-bold mb-1">Bank Details</h3>
        <p className="text-[11px]">Bank : HSBC</p>
        <p className="text-[11px]">Account Number : 12345673445</p>
        <p className="text-[11px]">Account Type : Current</p>
        <p className="text-[11px]">Currency : EUR</p>
        <p className="text-[11px]">Payment Reference : {invoice.invoiceNo}</p>
      </div>

      {/* ================= TOTAL BOX ================= */}
      <div className="border border-gray-400 mt-6 p-4 w-[260px] ml-auto text-[12px] space-y-1">
        <div className="flex justify-between">
          <span>Net amount</span>
          <span>{invoice.netTotal} €</span>
        </div>
        <div className="flex justify-between">
          <span>VAT</span>
          <span>{invoice.vatTotal} €</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{invoice.grandTotal} €</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Amount Due</span>
          <span>{invoice.amountDue} €</span>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <p className="text-[10px] mt-10 text-gray-700 leading-[1.35] text-justify">
        No discount will be granted for early settlement. Any late payment shall
        automatically give rise to a penalty calculated at three times the
        statutory interest rate (Article L 441-10, paragraph 12 of the French
        Commercial Code). In addition, for any business customer, any amount not
        paid on its due date shall automatically incur a fixed recovery charge
        of €40 pursuant to Articles L 441-6, I, paragraph 12 and D 441-5 of the
        French Commercial Code.
      </p>

      <p className="text-[10px] text-center mt-5 font-bold">
        VESTIAIRE SAINT-HONORÉ SAS — Share capital of 10,000€ — Company No
        94479826000016
      </p>

      <p className="text-[11px] text-center mt-5">Page 1 / 1</p>
    </div>
  );
});

export default InvoicePDFTemplate;
