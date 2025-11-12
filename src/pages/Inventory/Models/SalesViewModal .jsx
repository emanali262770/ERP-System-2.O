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
  DollarSign,
  User,
  TrendingUp,
  Package,
} from "lucide-react";

const SalesViewModal = ({ isOpen, onClose, sale }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg sm:max-w-xl w-[95vw] bg-background/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader className="border-b border-border/40 pb-3">
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-foreground flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Sales history Details
          </DialogTitle>
        </DialogHeader>

        {sale ? (
          <div className="space-y-5 pt-4">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold text-primary">
                {sale.invoiceNo || "N/A"}
              </h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(sale.saleDate).toLocaleDateString()}
              </p>
            </div>

            {/* Info */}
            <div className="space-y-3 text-sm sm:text-base px-1 sm:px-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                <p className="font-medium text-muted-foreground">Invoice No:</p>
                <p className="font-semibold">{sale.invoiceNo || "—"}</p>

                <p className="font-medium text-muted-foreground">Customer Name:</p>
                <p className="font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  {sale.customerName || "—"}
                </p>

                <p className="font-medium text-muted-foreground">Quantity Sold:</p>
                <p className="font-semibold text-blue-700">
                  {sale.quantitySold ?? 0}
                </p>

                <p className="font-medium text-muted-foreground">Sale Price:</p>
                <p className="font-semibold text-green-700">
                  € {sale.salePrice?.toLocaleString() ?? 0}
                </p>

                <p className="font-medium text-muted-foreground">Profit:</p>
                <p
                  className={`font-semibold ${
                    sale.profit >= 0 ? "text-amber-700" : "text-red-700"
                  }`}
                >
                  € {sale.profit?.toLocaleString() ?? 0}
                </p>

                

              
              </div>

              <div className="mt-3">
                <p className="font-medium text-muted-foreground mb-1">
                  Notes / Description:
                </p>
                <p className="bg-muted/80 rounded-md p-3 text-foreground text-sm sm:text-base break-words">
                  Sales record generated from ERP — Invoice {sale.invoiceNo}
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
              <div className="flex flex-col items-center justify-center bg-blue-50 border border-blue-100 rounded-xl p-3 shadow-sm">
                <Package className="w-5 h-5 text-blue-600 mb-1" />
                <p className="text-xs text-muted-foreground">Quantity</p>
                <p className="font-semibold text-blue-700">
                  {sale.quantitySold ?? 0}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center bg-green-50 border border-green-100 rounded-xl p-3 shadow-sm">
                <DollarSign className="w-5 h-5 text-green-600 mb-1" />
                <p className="text-xs text-muted-foreground">Total Sale</p>
                <p className="font-semibold text-green-700">
                  € {sale.salePrice?.toLocaleString() ?? 0}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center bg-amber-50 border border-amber-100 rounded-xl p-3 shadow-sm">
                <TrendingUp className="w-5 h-5 text-amber-600 mb-1" />
                <p className="text-xs text-muted-foreground">Profit</p>
                <p className="font-semibold text-amber-700">
                  € {sale.profit?.toLocaleString() ?? 0}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-10">
            <Loader className="w-6 h-6 animate-spin mx-auto mb-3 text-primary" />
            Loading sales details...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SalesViewModal;
