import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Eye,
  Loader,
  Calendar,
  User,
  Globe,
  Phone,
} from "lucide-react";

const InvoiceViewModal = ({ isOpen, onClose, invoice }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[95vw] bg-background/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader className="border-b border-border/40 pb-3">
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-foreground flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Invoice Details
          </DialogTitle>
        </DialogHeader>

        {invoice ? (
          <div className="space-y-6 pt-4">
            {/* ==== Top Invoice Info ==== */}
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold text-primary">
                {invoice.invoiceNo}
              </h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(invoice.invoiceDate).toLocaleDateString()}
              </p>
            </div>

            {/* ==== Summary Info ==== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm sm:text-base">

              {/* Customer Name */}
              <p className="font-medium text-muted-foreground">Customer Name:</p>
              <p className="font-semibold flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                {invoice.customer?.customerName || "—"}
              </p>

              {/* Customer Phone */}
              <p className="font-medium text-muted-foreground">Phone:</p>
              <p className="font-semibold flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                {invoice.customer?.phoneNumber || "—"}
              </p>

              {/* Customer Country */}
              <p className="font-medium text-muted-foreground">Country:</p>
              <p className="font-semibold flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                {invoice.customer?.country || "—"}
              </p>

              {/* VAT Number */}
              <p className="font-medium text-muted-foreground">Customer VAT:</p>
              <p className="font-semibold">{invoice.customerVAT || "—"}</p>

              {/* VAT Regime */}
              <p className="font-medium text-muted-foreground">VAT Regime:</p>
              <p className="font-semibold">
                {invoice.items?.[0]?.vatRegime || "—"}
              </p>

              {/* Net Total */}
              <p className="font-medium text-muted-foreground">Net Total:</p>
              <p className="font-semibold text-green-700">
                € {invoice.netTotal?.toLocaleString() ?? 0}
              </p>

              {/* VAT Amount */}
              <p className="font-medium text-muted-foreground">VAT Amount:</p>
              <p className="font-semibold text-amber-700">
                € {invoice.vatTotal?.toLocaleString() ?? 0}
              </p>

              {/* Grand Total */}
              <p className="font-medium text-muted-foreground">Grand Total:</p>
              <p className="font-semibold text-blue-700">
                € {invoice.grandTotal?.toLocaleString() ?? 0}
              </p>

              {/* Amount Due */}
              <p className="font-medium text-muted-foreground">Amount Due:</p>
              <p className="font-semibold text-red-700">
                € {invoice.amountDue?.toLocaleString() ?? 0}
              </p>

            </div>

            {/* ==== Item Table ==== */}
            <div className="mt-6">
              <p className="font-medium text-muted-foreground mb-3 text-lg">
                Item Details:
              </p>

              {invoice.items && invoice.items.length > 0 ? (
                <div className="overflow-x-auto rounded-md border border-border/40">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-muted/30 text-muted-foreground uppercase text-xs tracking-wider">
                      <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3">Qty</th>
                        <th className="px-4 py-3">Unit Price (€)</th>
                        <th className="px-4 py-3">VAT (%)</th>
                        <th className="px-4 py-3">Total (€)</th>
                      </tr>
                    </thead>

                    <tbody>
                      {invoice.items.map((item, idx) => (
                        <tr
                          key={idx}
                          className="border-t border-border/30 hover:bg-muted/10 transition-colors"
                        >
                          <td className="px-4 py-2">{idx + 1}</td>

                          <td className="px-4 py-2 font-medium text-foreground">
                            {item.description}
                          </td>

                          <td className="px-4 py-2">{item.quantity}</td>

                          <td className="px-4 py-2">
                            {item.unitPrice?.toLocaleString()}
                          </td>

                          <td className="px-4 py-2">
                            {(item.vatRate * 100).toFixed(0)}
                          </td>

                          <td className="px-4 py-2 font-semibold">
                            {item.totalInclVAT?.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm mt-2">
                  No items available
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-10">
            <Loader className="w-6 h-6 animate-spin mx-auto mb-3 text-primary" />
            Loading invoice details...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceViewModal;
