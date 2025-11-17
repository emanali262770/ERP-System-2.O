import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Download,
  Package,
  Warehouse,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  DollarSign,
  TrendingUp,
  Loader,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  ShoppingCart,
  Users,
  Target,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import api from "../../Api/AxiosInstance";
import Pagination from "../../components/Pagination";
import SalesViewModal from "./Models/SalesViewModal ";

const SalesHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("records"); // "records" or "analytics"
  const [analyticsPeriod, setAnalyticsPeriod] = useState("month");
  const [analyticsData, setAnalyticsData] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const itemsPerPage = 8;

  const [salesData, setSalesData] = useState([]);
  const [summary, setSummary] = useState({
    totalInvoices: 0,
    totalSalesExclVAT: 0,
    totalVAT: 0,
    totalSalesInclVAT: 0,
    totalCost: 0,
    totalProfit: 0,
    totalQuantitySold: 0,
    averageMarginPercent: 0
  });
  const [loading, setLoading] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const { token } = useAuth();

  // Mock analytics data for demonstration
  const mockAnalyticsData = [
    { period: "Jan 2024", totalSalesInclVAT: 12500, totalProfit: 3200, totalQuantity: 45, marginPercent: 25.6, transactionCount: 12 },
    { period: "Feb 2024", totalSalesInclVAT: 14200, totalProfit: 3800, totalQuantity: 52, marginPercent: 26.8, transactionCount: 15 },
    { period: "Mar 2024", totalSalesInclVAT: 11800, totalProfit: 2950, totalQuantity: 38, marginPercent: 25.0, transactionCount: 10 },
    { period: "Apr 2024", totalSalesInclVAT: 15600, totalProfit: 4200, totalQuantity: 58, marginPercent: 26.9, transactionCount: 16 },
    { period: "May 2024", totalSalesInclVAT: 13200, totalProfit: 3450, totalQuantity: 47, marginPercent: 26.1, transactionCount: 13 },
    { period: "Jun 2024", totalSalesInclVAT: 14800, totalProfit: 3950, totalQuantity: 55, marginPercent: 26.7, transactionCount: 14 },
  ];

  // fetch sales history api
  const fetchSalesHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get("/inventory/sales-history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setSalesData(res.data.data);
        setSummary(res.data.summary || {
          totalInvoices: res.data.count,
          totalSalesExclVAT: 0,
          totalVAT: 0,
          totalSalesInclVAT: 0,
          totalCost: 0,
          totalProfit: 0,
          totalQuantitySold: 0,
          averageMarginPercent: 0
        });
      } else {
        toast.error("Failed to fetch sales history");
      }
    } catch (error) {
      console.error("Error fetching sales history:", error);
      toast.error("Error fetching sales history");
    } finally {
      setLoading(false);
    }
  };

  // fetch sales analytics
  const fetchSalesAnalytics = async (period = "month") => {
    try {
      setAnalyticsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, using mock data
      setAnalyticsData(mockAnalyticsData);
      
      // Uncomment below for real API call
      /*
      const res = await api.get(`/inventory/sales-history/analytics?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setAnalyticsData(res.data.data);
      } else {
        toast.error("Failed to fetch sales analytics");
      }
      */
    } catch (error) {
      console.error("Error fetching sales analytics:", error);
      toast.error("Error fetching sales analytics");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesHistory();
  }, []);

  useEffect(() => {
    if (activeTab === "analytics") {
      fetchSalesAnalytics(analyticsPeriod);
    }
  }, [activeTab, analyticsPeriod]);

  // search
  const filteredSales = salesData.filter(
    (s) =>
      s.invoiceNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.itemId?.itemName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSales = filteredSales.slice(startIndex, endIndex);

  // Columns that will be shown by default
  const [visibleFields, setVisibleFields] = useState([
    "sr",
    "invoiceNo",
    "itemName",
    "saleDate",
    "customerName",
    "quantitySold",
    "salePrice",
    "profit",
    "marginPercent"
  ]);

  // Temporary selection when opening dialog
  const [tempVisibleFields, setTempVisibleFields] = useState(visibleFields);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [fieldLimitAlert, setFieldLimitAlert] = useState(false);

  const handleDownload = () => toast.success("Sales report downloaded!");
  const handleSaveSale = () => {
    toast.success("Sales record saved successfully!");
    setIsAddOpen(false);
  };
  const handleEdit = (id) => toast.success(`Editing record #${id}`);
  const handleDelete = (id) => toast.error(`Deleting record #${id}`);
  
  const handleView = (id) => {
    const sale = salesData.find((s) => s._id === id);
    if (!sale) {
      toast.error("Sale record not found!");
      return;
    }
    setSelectedSale(sale);
    setIsViewOpen(true);
  };

  const handleCustomizeOpen = (open) => {
    setIsCustomizeOpen(open);
    if (open) {
      setTempVisibleFields([...visibleFields]);
    }
  };

  const handleApplyChanges = () => {
    setVisibleFields(tempVisibleFields);
    setIsCustomizeOpen(false);
    toast.success("Display settings updated!");
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0);
  };

  // Format percentage
  const formatPercent = (percent) => {
    return `${Math.round(percent || 0)}%`;
  };

  // Get period label for analytics
  const getPeriodLabel = (period) => {
    switch (period) {
      case 'day': return 'Daily';
      case 'week': return 'Weekly';
      case 'month': return 'Monthly';
      case 'year': return 'Yearly';
      default: return 'Monthly';
    }
  };

  // Calculate analytics summary
  const analyticsSummary = analyticsData.length > 0 ? {
    totalSales: analyticsData.reduce((sum, item) => sum + item.totalSalesInclVAT, 0),
    totalProfit: analyticsData.reduce((sum, item) => sum + item.totalProfit, 0),
    totalItems: analyticsData.reduce((sum, item) => sum + item.totalQuantity, 0),
    avgMargin: analyticsData.reduce((sum, item) => sum + item.marginPercent, 0) / analyticsData.length,
    growth: 12.5, // Mock growth percentage
  } : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Sales History
            </h1>
            <p className="text-muted-foreground mt-2 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Track product-wise sales, quantity, and profit margin
            </p>
          </div>
        </div>

        {/* Stats - Updated to match backend response */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 gap-y-6">
          {/* Total Invoices */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Invoices</p>
                <p className="text-2xl font-bold text-blue-900">
                  {summary.totalInvoices || 0}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {summary.totalQuantitySold || 0} items sold
                </p>
              </div>
              <Package className="w-5 h-5 text-blue-600" />
            </CardContent>
          </Card>

          {/* Total Sales (Excl VAT) */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-green-700">Sales (Excl VAT)</p>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(summary.totalSalesExclVAT)}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  VAT: {formatCurrency(summary.totalVAT)}
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </CardContent>
          </Card>

          {/* Total Profit */}
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-amber-700">Total Profit</p>
                <p className="text-2xl font-bold text-amber-900">
                  {formatCurrency(summary.totalProfit)}
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  Avg Margin: {formatPercent(summary.averageMarginPercent)}
                </p>
              </div>
              <DollarSign className="w-5 h-5 text-amber-600" />
            </CardContent>
          </Card>

          {/* Total Sales (Incl VAT) */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-purple-700">Total Sales</p>
                <p className="text-2xl font-bold text-purple-900">
                  {formatCurrency(summary.totalSalesInclVAT)}
                </p>
                <p className="text-xs text-purple-600 mt-1">Incl. VAT</p>
              </div>
              <DollarSign className="w-5 h-5 text-purple-600" />
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            <div className="flex border-b">
              <button
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-200 ${
                  activeTab === "records"
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-muted-foreground hover:text-primary"
                }`}
                onClick={() => setActiveTab("records")}
              >
                <Warehouse className="w-4 h-4" />
                Sales Records
                <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">
                  {filteredSales.length}
                </Badge>
              </button>
              <button
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-200 ${
                  activeTab === "analytics"
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-muted-foreground hover:text-primary"
                }`}
                onClick={() => setActiveTab("analytics")}
              >
                <BarChart3 className="w-4 h-4" />
                Sales Analytics
                <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">
                  {analyticsData.length}
                </Badge>
              </button>
            </div>
          </CardContent>
        </Card>

        {activeTab === "records" ? (
          <>
            {/* Search */}
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                  <Input
                    placeholder="Search by invoice, customer, or product..."
                    className="pl-12 pr-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary/50
                       bg-background/70 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Table */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-background to-muted/5 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent flex items-center gap-2">
                    <Warehouse className="w-5 h-5 text-primary" />
                    Sales Records
                  </CardTitle>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      {filteredSales.length} entries
                    </Badge>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCustomizeOpen(true)}
                      className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl text-white transition-all duration-200"
                    >
                      Customize
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-muted/40 to-muted/20 border-b border-border/50">
                      <tr>
                        {visibleFields.includes("sr") && (
                          <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                            Sr
                          </th>
                        )}
                        {visibleFields.includes("invoiceNo") && (
                          <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                            Invoice No
                          </th>
                        )}
                        {visibleFields.includes("itemName") && (
                          <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                            Product
                          </th>
                        )}
                        {visibleFields.includes("saleDate") && (
                          <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                            Sale Date
                          </th>
                        )}
                        {visibleFields.includes("customerName") && (
                          <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                            Customer
                          </th>
                        )}
                        {visibleFields.includes("quantitySold") && (
                          <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                            Qty
                          </th>
                        )}
                        {visibleFields.includes("salePrice") && (
                          <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                            Sale Price
                          </th>
                        )}
                        {visibleFields.includes("profit") && (
                          <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                            Profit
                          </th>
                        )}
                        {visibleFields.includes("marginPercent") && (
                          <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                            Margin %
                          </th>
                        )}
                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-border/30">
                      {loading ? (
                        <tr>
                          <td colSpan={visibleFields.length + 2} className="py-12 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <Loader className="w-8 h-8 animate-spin text-primary mb-3" />
                              <p className="text-muted-foreground">Loading sales data...</p>
                            </div>
                          </td>
                        </tr>
                      ) : filteredSales.length > 0 ? (
                        currentSales.map((sale, index) => (
                          <tr
                            key={sale._id}
                            className="group hover:bg-primary/5 transition-all duration-300 ease-in-out"
                          >
                            {visibleFields.includes("sr") && (
                              <td className="px-6 py-4 font-semibold">
                                {startIndex + index + 1}
                              </td>
                            )}
                            {visibleFields.includes("invoiceNo") && (
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-mono text-sm font-semibold bg-primary/10 text-primary px-2 py-1 rounded-md border border-primary/20 inline-block">
                                  {sale.invoiceNo || "-"}
                                </div>
                              </td>
                            )}
                            {visibleFields.includes("itemName") && (
                              <td className="px-6 py-4">
                                <div className="max-w-[150px] truncate" title={sale.itemId?.itemName}>
                                  {sale.itemId?.itemName || "-"}
                                </div>
                              </td>
                            )}
                            {visibleFields.includes("saleDate") && (
                              <td className="px-6 py-4 whitespace-nowrap">
                                {sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : "-"}
                              </td>
                            )}
                            {visibleFields.includes("customerName") && (
                              <td className="px-6 py-4">
                                <div className="max-w-[120px] truncate" title={sale.customerName}>
                                  {sale.customerName || "-"}
                                </div>
                              </td>
                            )}
                            {visibleFields.includes("quantitySold") && (
                              <td className="px-6 py-4 text-center">
                                <Badge variant="outline" className="bg-blue-50">
                                  {sale.quantitySold || 0}
                                </Badge>
                              </td>
                            )}
                            {visibleFields.includes("salePrice") && (
                              <td className="px-6 py-4 whitespace-nowrap text-green-600 font-medium">
                                {formatCurrency(sale.totalSaleInclVAT)}
                                <div className="text-xs text-gray-500">
                                  excl VAT: {formatCurrency(sale.totalSaleExclVAT)}
                                </div>
                              </td>
                            )}
                            {visibleFields.includes("profit") && (
                              <td className="px-6 py-4 whitespace-nowrap font-medium">
                                <div className={`${sale.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatCurrency(sale.profit)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  cost: {formatCurrency(sale.totalCost)}
                                </div>
                              </td>
                            )}
                            {visibleFields.includes("marginPercent") && (
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge 
                                  variant={sale.marginPercent >= 0 ? "default" : "destructive"}
                                  className={sale.marginPercent >= 30 ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}
                                >
                                  {formatPercent(sale.marginPercent)}
                                </Badge>
                              </td>
                            )}
                            <td className="px-6 py-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleView(sale._id)}
                                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={visibleFields.length + 2} className="text-center py-12">
                            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <p className="text-muted-foreground font-medium text-lg">
                              No sales records found
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                              Try adjusting your search terms
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  
                  <Pagination
                    currentPage={currentPage}
                    totalItems={filteredSales.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Analytics Tab */
          <div className="space-y-6">
            {/* Analytics Controls */}
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Label htmlFor="period" className="text-sm font-medium">
                      View Analytics:
                    </Label>
                    <Select value={analyticsPeriod} onValueChange={setAnalyticsPeriod}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Daily</SelectItem>
                        <SelectItem value="week">Weekly</SelectItem>
                        <SelectItem value="month">Monthly</SelectItem>
                        <SelectItem value="year">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => fetchSalesAnalytics(analyticsPeriod)}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Analytics Overview Cards */}
            {analyticsSummary && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {formatCurrency(analyticsSummary.totalSales)}
                        </p>
                        <div className="flex items-center mt-1">
                          <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-sm text-green-600">{analyticsSummary.growth}% growth</span>
                        </div>
                      </div>
                      <ShoppingCart className="w-8 h-8 text-blue-600 opacity-60" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Total Profit</p>
                        <p className="text-2xl font-bold text-green-900">
                          {formatCurrency(analyticsSummary.totalProfit)}
                        </p>
                        <p className="text-sm text-green-700 mt-1">
                          Avg Margin: {formatPercent(analyticsSummary.avgMargin)}
                        </p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-600 opacity-60" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-amber-600">Items Sold</p>
                        <p className="text-2xl font-bold text-amber-900">
                          {analyticsSummary.totalItems}
                        </p>
                        <p className="text-sm text-amber-700 mt-1">
                          {Math.round(analyticsSummary.totalItems / 6)} avg/month
                        </p>
                      </div>
                      <Package className="w-8 h-8 text-amber-600 opacity-60" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Performance</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {formatPercent(analyticsSummary.avgMargin)}
                        </p>
                        <p className="text-sm text-purple-700 mt-1">
                          Profit Margin
                        </p>
                      </div>
                      <Target className="w-8 h-8 text-purple-600 opacity-60" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Analytics Charts */}
            {analyticsLoading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Loader className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading analytics data...</p>
                </CardContent>
              </Card>
            ) : analyticsData.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Trend */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Sales Trend ({getPeriodLabel(analyticsPeriod)})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                          <div>
                            <p className="font-medium">{item.period}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.transactionCount} transactions
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">
                              {formatCurrency(item.totalSalesInclVAT)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatPercent(item.marginPercent)} margin
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Profit Analysis */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <DollarSign className="w-5 h-5 text-amber-600" />
                      Profit Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                          <div>
                            <p className="font-medium">{item.period}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.totalQuantity} items sold
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${item.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(item.totalProfit)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Cost: {formatCurrency(item.totalSalesInclVAT - item.totalProfit)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card className="border-0 shadow-lg lg:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {analyticsData.slice(-4).map((item, index) => (
                        <div key={index} className="space-y-4">
                          <div className="text-center p-4 bg-blue-50 rounded-lg hover:shadow-md transition-shadow">
                            <p className="text-2xl font-bold text-blue-600">
                              {formatCurrency(item.totalSalesInclVAT)}
                            </p>
                            <p className="text-sm text-blue-700">Sales</p>
                            <p className="text-xs text-blue-600">{item.period}</p>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg hover:shadow-md transition-shadow">
                            <p className="text-2xl font-bold text-green-600">
                              {formatCurrency(item.totalProfit)}
                            </p>
                            <p className="text-sm text-green-700">Profit</p>
                            <p className="text-xs text-green-600">{item.period}</p>
                          </div>
                          <div className="text-center p-4 bg-amber-50 rounded-lg hover:shadow-md transition-shadow">
                            <p className="text-2xl font-bold text-amber-600">
                              {item.totalQuantity}
                            </p>
                            <p className="text-sm text-amber-700">Items Sold</p>
                            <p className="text-xs text-amber-600">{item.period}</p>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg hover:shadow-md transition-shadow">
                            <p className="text-2xl font-bold text-purple-600">
                              {formatPercent(item.marginPercent)}
                            </p>
                            <p className="text-sm text-purple-700">Margin %</p>
                            <p className="text-xs text-purple-600">{item.period}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground font-medium text-lg">
                    No analytics data available
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Sales data will appear here once you have completed transactions
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Customize Dialog */}
        <Dialog open={isCustomizeOpen} onOpenChange={handleCustomizeOpen}>
          <DialogContent className="max-w-md bg-gradient-to-b from-white/95 to-white/80 dark:from-gray-900/95 dark:to-gray-900/80 backdrop-blur-xl border border-border/40 shadow-2xl rounded-2xl">
            <DialogHeader className="pb-3 border-b border-border/30">
              <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                  ⚙️
                </span>
                Customize Display
              </DialogTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 pl-10">
                Choose which columns to display in your sales table.
              </p>
            </DialogHeader>

            {fieldLimitAlert && (
              <div className="mb-4 p-3 rounded bg-red-100 border border-red-400 text-red-700 font-medium text-center">
                You can select a maximum of 6 fields only!
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 py-6 px-1">
              {[
                { key: "sr", label: "Sr" },
                { key: "invoiceNo", label: "Invoice No" },
                { key: "itemName", label: "Product" },
                { key: "saleDate", label: "Sale Date" },
                { key: "customerName", label: "Customer" },
                { key: "quantitySold", label: "Quantity" },
                { key: "salePrice", label: "Sale Price" },
                { key: "profit", label: "Profit" },
                { key: "marginPercent", label: "Margin %" },
              ].map(({ key, label }) => (
                <label
                  key={key}
                  className="group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 border border-transparent hover:border-primary/30 hover:bg-primary/5"
                >
                  <input
                    type="checkbox"
                    checked={tempVisibleFields.includes(key)}
                    onChange={() => {
                      setTempVisibleFields((prev) => {
                        if (prev.includes(key)) {
                          return prev.filter((f) => f !== key);
                        } else if (prev.length >= 6) {
                          setFieldLimitAlert(true);
                          setTimeout(() => setFieldLimitAlert(false), 2500);
                          return prev;
                        } else {
                          return [...prev, key];
                        }
                      });
                    }}
                    className="peer appearance-none w-5 h-5 border border-gray-300 dark:border-gray-700 rounded-md checked:bg-primary transition-all duration-200 flex items-center justify-center relative after:content-['✓'] after:text-white after:font-bold after:text-[11px] after:opacity-0 checked:after:opacity-100"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary">
                    {label}
                  </span>
                </label>
              ))}
            </div>

            <Button
              className="w-full mt-2 py-3 bg-gradient-to-r from-primary to-primary/80 text-white font-semibold rounded-xl shadow-lg hover:shadow-primary/40 transition-all duration-300"
              onClick={handleApplyChanges}
            >
              Apply Changes
            </Button>
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <SalesViewModal
          isOpen={isViewOpen}
          onClose={setIsViewOpen}
          sale={selectedSale}
        />
      </div>
    </DashboardLayout>
  );
};

export default SalesHistory;