import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Download, Warehouse, MapPin, User, Phone, Mail, Edit, Trash2, Eye, MoreVertical, Building2, Users, AlertCircle, List } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockWarehouseData = [
  {
    id: 1,
    name: "Main Warehouse",
    address: "Plot 45, Industrial Zone, Karachi, Pakistan",
    incharge: {
      name: "Ahmed Khan",
      contact: "+92 300 1234567",
      email: "ahmed.khan@company.com",
    },
    itemsInStock: 1250,
    PurchaseValue: 2450000,
  },
  {
    id: 2,
    name: "North Branch Storage",
    address: "Sector F-8, Near Ring Road, Lahore",
    incharge: {
      name: "Saba Ali",
      contact: "+92 321 9876543",
      email: "saba.ali@company.com",
    },
    itemsInStock: 890,
    PurchaseValue: 1780000,
  },
  {
    id: 3,
    name: "Cold Storage Facility",
    address: "Food Park, Multan Road, Faisalabad",
    incharge: {
      name: "Omar Farooq",
      contact: "+92 333 5550192",
      email: "omar@company.com",
    },
    itemsInStock: 620,
    PurchaseValue: 3120000,
  },
];

const WareHouse = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredWarehouses = mockWarehouseData.filter((warehouse) =>
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.incharge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.itemsInStock.toString().includes(searchTerm) ||
    warehouse.PurchaseValue.toString().includes(searchTerm)
  );

  const handleDownload = () => {
    toast.success("Warehouse report downloaded!");
  };

  const handleSaveWarehouse = () => {
    toast.success("Warehouse added successfully!");
    setIsAddOpen(false);
  };

  const handleEdit = (id) => {
    toast.success(`Editing warehouse #${id}`);
  };

  const handleDelete = (id) => {
    toast.error(`Deleting warehouse #${id}`);
  };

  const handleView = (id) => {
    toast.info(`Viewing warehouse details #${id}`);
  };

  const totalStockValue = mockWarehouseData.reduce((sum, w) => sum + w.PurchaseValue, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Warehouse Management
            </h1>
            <p className="text-muted-foreground mt-2 flex items-center gap-2">
              <Warehouse className="w-4 h-4" />
              Manage warehouses, addresses, and incharge details
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
                  Add Warehouse
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-sm border-0 shadow-2xl">
                <DialogHeader className="border-b border-border/50 pb-4">
                  <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-foreground">
                    <Plus className="w-5 h-5 text-primary" />
                    Add New Warehouse
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                  {/* Warehouse Name */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Warehouse Name
                    </Label>
                    <Input
                      placeholder="e.g., Main Warehouse"
                      className="border-2 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Warehouse Address
                    </Label>
                    <Input
                      placeholder="Full address with city"
                      className="border-2 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>

                  {/* Incharge Group */}
                  <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                    <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Incharge Details
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Name</Label>
                        <Input
                          placeholder="Full name"
                          className="border focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" /> Contact
                        </Label>
                        <Input
                          placeholder="+92 3XX XXXXXXX"
                          className="border focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" /> Email
                        </Label>
                        <Input
                          type="email"
                          placeholder="incharge@company.com"
                          className="border focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 py-3 text-base font-medium"
                    onClick={handleSaveWarehouse}
                  >
                    Save Warehouse
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 gap-y-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Warehouses</p>
                  <p className="text-2xl font-bold text-blue-900">{mockWarehouseData.length}</p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Warehouse className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Active Incharges</p>
                  <p className="text-2xl font-bold text-green-900">
                    {new Set(mockWarehouseData.map(w => w.incharge.name)).size}
                  </p>
                </div>
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700">Total Items</p>
                  <p className="text-2xl font-bold text-amber-900">
                    {new Set(mockWarehouseData.map(w => w.address.split(",").pop().trim())).size}
                  </p>
                </div>
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <List className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Total Stock Value</p>
                  <p className="text-2xl font-bold text-purple-900">
                    PKR {totalStockValue.toLocaleString()}
                  </p>
                </div>
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Section */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
              <Input
                placeholder="Search by warehouse name, address, incharge, stock, or value..."
                className="pl-12 pr-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary/50 bg-background/80 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Warehouse Table */}
        <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-background to-muted/5 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent flex items-center gap-2">
                <Warehouse className="w-5 h-5 text-primary" />
                Warehouse Directory
              </CardTitle>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                {filteredWarehouses.length} warehouses
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-muted/40 to-muted/20 border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80 uppercase tracking-wider">Sr</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80 uppercase tracking-wider">Warehouse</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80 uppercase tracking-wider">Address</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80 uppercase tracking-wider">Incharge</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80 uppercase tracking-wider">Items in Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80 uppercase tracking-wider"> Value</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredWarehouses.map((warehouse, index) => (
                    <tr
                      key={warehouse.id}
                      className="group hover:bg-primary/5 transition-all duration-300 ease-in-out transform hover:scale-[1.002]"
                    >
                      <td className="px-6 py-4 font-semibold">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 flex items-center gap-2">
                          <Warehouse className="w-4 h-4 text-primary/60" />
                          {warehouse.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 text-amber-600" />
                          <span>{warehouse.address}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{warehouse.incharge.name}</span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-60 hover:opacity-100 transition-opacity"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Phone className="w-3 h-3" />
                                {warehouse.incharge.contact}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Mail className="w-3 h-3" />
                                {warehouse.incharge.email}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                            {warehouse.itemsInStock.toLocaleString()}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">
                          PKR {warehouse.PurchaseValue.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(warehouse.id)}
                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 rounded-lg"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(warehouse.id)}
                            className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600 transition-all duration-200 rounded-lg"
                            title="Edit Warehouse"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(warehouse.id)}
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-all duration-200 rounded-lg"
                            title="Delete Warehouse"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredWarehouses.length === 0 && (
                <div className="text-center py-12">
                  <Warehouse className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground font-medium text-lg">No warehouses found</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your search or add a new warehouse
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

export default WareHouse;