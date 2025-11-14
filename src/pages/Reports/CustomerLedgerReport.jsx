import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, FileText, Table } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const reportData = [
  {
    date: "2024-03-01",
    customer: "Customer A",
    invoice: "INV-1001",
    total: 25000,
    profit: 4500,
    vat: 4250,
  },
  {
    date: "2024-03-02",
    customer: "Customer B",
    invoice: "INV-1002",
    total: 18000,
    profit: 3200,
    vat: 3060,
  },
  {
    date: "2024-03-03",
    customer: "Customer C",
    invoice: "INV-1003",
    total: 32000,
    profit: 5800,
    vat: 5440,
  },
];

const CustomerLedgerReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleExportPDF = () => {
    toast.success("Exporting report as PDF...");
  };

  const handleExportExcel = () => {
    toast.success("Exporting report as Excel...");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Generate and export business reports
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Customer</Label>
                <Select onValueChange={(v) => setSelectedCustomer(v)}>
                  <SelectTrigger className="border-2">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="cust001">John Doe</SelectItem>
                    <SelectItem value="cust002">ABC Traders</SelectItem>
                    <SelectItem value="cust003">XYZ Pvt Ltd</SelectItem>
                  </SelectContent>
                </Select>
              </div>

             {/*  */}
            </div>
          </CardContent>
        </Card>

      

        {/* Report Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sales Report</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleExportPDF}>
                <FileText className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button size="sm" variant="outline" onClick={handleExportExcel}>
                <Table className="w-4 h-4 mr-2" />
                Excel
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Invoice
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Profit
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      VAT
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {reportData.map((row, i) => (
                    <tr key={i} className="hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm">{row.date}</td>
                      <td className="px-4 py-3">{row.customer}</td>
                      <td className="px-4 py-3 font-mono text-sm">
                        {row.invoice}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        PKR {row.total.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-success">
                        PKR {row.profit.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        PKR {row.vat.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-muted/30 font-semibold">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right">
                      Total:
                    </td>
                    <td className="px-4 py-3">PKR 75,000</td>
                    <td className="px-4 py-3">PKR 13,500</td>
                    <td className="px-4 py-3">PKR 12,750</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CustomerLedgerReport;