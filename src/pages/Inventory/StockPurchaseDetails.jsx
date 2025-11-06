import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Download, Package, Warehouse, AlertTriangle, TrendingUp, MapPin, Edit, Trash2, Eye, MoreVertical, RefreshCw, Store } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const mockStockData = [
  {
    id: 1,
    itemCode: "ITM001",
    itemName: "Wireless Mouse",
    openingStock: 50,
    purchaseRate: 480,
    sellingPrice: 750,
    wholesalePrice: 650,
    location: "Main Warehouse",
    minStockLevel: 10,
  },
  {
    id: 2,
    itemCode: "ITM002",
    itemName: "Cotton T-Shirt",
    openingStock: 200,
    purchaseRate: 280,
    sellingPrice: 499,
    wholesalePrice: 420,
    location: "Store Room A",
    minStockLevel: 50,
  },
  {
    id: 3,
    itemCode: "ITM003",
    itemName: "Basmati Rice",
    openingStock: 500,
    purchaseRate: 145,
    sellingPrice: 220,
    wholesalePrice: null,
    location: "Cold Storage",
    minStockLevel: 100,
  },
];

const StockPurchaseDetails = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredStock = mockStockData.filter((item) =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.itemCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = () => {
    toast.success("Stock & purchase report downloaded!");
  };

  const handleSaveStock = () => {
    toast.success("Stock details saved successfully!");
    setIsAddOpen(false);
  };

  const handleEdit = (itemId) => {
    toast.success(`Editing stock entry #${itemId}`);
  };

  const handleDelete = (itemId) => {
    toast.error(`Deleting stock entry #${itemId}`);
  };

  const handleView = (itemId) => {
    toast.info(`Viewing stock details for #${itemId}`);
  };

  const handleRestock = (itemId) => {
    toast.success(`Initiating restock for #${itemId}`);
  };

  const getStockStatus = (stock, minStock) => {
    if (stock <= minStock) return "critical";
    if (stock <= minStock * 2) return "warning";
    return "healthy";
  };

  const getLocationColor = (location) => {
    const locationMap = {
      "Main Warehouse": "bg-blue-50 text-blue-700 border-blue-200",
      "Store Room A": "bg-purple-50 text-purple-700 border-purple-200",
      "Cold Storage": "bg-cyan-50 text-cyan-700 border-cyan-200",
    };
    return locationMap[location] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Stock & Purchase Details
            </h1>
            <p className="text-muted-foreground mt-2 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Manage opening stock, pricing, and stock alerts
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownload}
              className="border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 shadow-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Stock Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-sm border-0 shadow-2xl">
                <DialogHeader className="border-b border-border/50 pb-4">
                  <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-foreground">
                    <Plus className="w-5 h-5 text-primary" />
                    Add Stock & Purchase Details
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                  {/* Item Code & Name */}
                  <div className="grid grid-cols-2 gap-4">

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Item Name</Label>
                      <Select>
                        <SelectTrigger className="bg-muted/50 border-2 focus:ring-2 focus:ring-primary/20 transition-all duration-200">
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="item1">Item 1</SelectItem>
                          <SelectItem value="item2">Item 2</SelectItem>
                          <SelectItem value="item3">Item 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Opening Stock */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Opening Stock Quantity
                      </Label>
                      <Input
                        type="number"
                        placeholder="0"
                        className="border-2 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Warehouse className="w-4 h-4" />
                        Stores in Consignment
                      </Label>
                      <Select>
                        <SelectTrigger className="bg-muted/50 border-2 focus:ring-2 focus:ring-primary/20 transition-all duration-200">
                          <SelectValue placeholder="Select stock location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="main-warehouse" className="hover:bg-blue-500 hover:text-white">
                            Main Warehouse
                          </SelectItem>
                          <SelectItem value="secondary-warehouse" className="hover:bg-blue-500 hover:text-white">
                            Secondary Warehouse
                          </SelectItem>
                          <SelectItem value="consignment-store" className="hover:bg-blue-500 hover:text-white">
                            Consignment Store
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Purchase Rate (excl. VAT)</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="border-2 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Selling / Retail Price</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="border-2 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Wholesale Price (Optional)</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="border-2 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Min Stock Level */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Minimum Stock Level (Alert Trigger)
                    </Label>
                    <Input
                      type="number"
                      placeholder="0"
                      className="border-2 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 py-3 text-base font-medium"
                    onClick={handleSaveStock}
                  >
                    Save Stock Details
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Items</p>
                  <p className="text-2xl font-bold text-blue-900">{mockStockData.length}</p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Total Stock Value</p>
                  <p className="text-2xl font-bold text-green-900">
                    PKR {mockStockData.reduce((sum, item) => sum + (item.openingStock * item.purchaseRate), 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700">Low Stock Items</p>
                  <p className="text-2xl font-bold text-amber-900">
                    {mockStockData.filter(item => item.openingStock <= item.minStockLevel).length}
                  </p>
                </div>
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Stores in Consignment</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {new Set(mockStockData.map(item => item.location)).size}
                  </p>
                </div>
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Store className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Section */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/60" />
              <Input
                placeholder="Search by item code or name..."
                className="pl-12 pr-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary/50 bg-background/80 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Stock Table with Actions Field */}
        <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-background to-muted/5 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent flex items-center gap-2">
                <Warehouse className="w-5 h-5 text-primary" />
                Stock Inventory
              </CardTitle>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                {filteredStock.length} items
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-muted/40 to-muted/20 border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80 uppercase tracking-wider">Item Code</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80 uppercase tracking-wider">Item Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80 uppercase tracking-wider">Opening Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80 uppercase tracking-wider">Purchase Rate</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80 uppercase tracking-wider">Selling Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80 uppercase tracking-wider">Wholesale Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80 uppercase tracking-wider">Min Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredStock.map((item, index) => (
                    <tr
                      key={item.id}
                      className="group hover:bg-primary/5 transition-all duration-300 ease-in-out transform hover:scale-[1.002]"
                    >
                      <td className="px-6 py-4">
                        <div className="font-mono text-sm font-semibold bg-primary/10 text-primary px-2 py-1 rounded-md border border-primary/20 inline-block">
                          {item.itemCode}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                          {item.itemName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-lg ${getStockStatus(item.openingStock, item.minStockLevel) === "critical"
                            ? "text-red-600"
                            : getStockStatus(item.openingStock, item.minStockLevel) === "warning"
                              ? "text-amber-600"
                              : "text-green-600"
                            }`}>
                            {item.openingStock}
                          </span>
                          {getStockStatus(item.openingStock, item.minStockLevel) === "critical" && (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground bg-blue-50 px-3 py-1 rounded-full text-sm border border-blue-200">
                          PKR {item.purchaseRate}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm border border-green-200">
                          PKR {item.sellingPrice}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {item.wholesalePrice ? (
                          <div className="font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full text-sm border border-purple-200">
                            PKR {item.wholesalePrice}
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic text-sm bg-muted/30 px-3 py-1 rounded-full border border-dashed border-muted-foreground/30">
                            Not set
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className={`${getLocationColor(item.location)} border-2 font-medium text-xs px-2 py-1 rounded-full flex items-center gap-1`}
                        >
                          <MapPin className="w-3 h-3" />
                          {item.location}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`font-bold ${item.openingStock <= item.minStockLevel
                          ? "text-red-600 bg-red-50 border-red-200"
                          : "text-green-600 bg-green-50 border-green-200"
                          } px-3 py-1 rounded-full text-sm border inline-block`}>
                          {item.minStockLevel}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(item.id)}
                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 rounded-lg"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item.id)}
                            className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600 transition-all duration-200 rounded-lg"
                            title="Edit Stock"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {getStockStatus(item.openingStock, item.minStockLevel) === "critical" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRestock(item.id)}
                              className="h-8 w-8 p-0 hover:bg-amber-50 hover:text-amber-600 transition-all duration-200 rounded-lg"
                              title="Quick Restock"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-all duration-200 rounded-lg"
                            title="Delete Entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredStock.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground font-medium text-lg">No stock items found</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your search terms or add a new stock entry
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StockPurchaseDetails;