import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Package, Loader, Warehouse, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import api from "../../Api/AxiosInstance";
import Pagination from "../../components/Pagination";

const DraftTrack = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch stock data
  const fetchStock = async () => {
    try {
      setLoading(true);
      const res = await api.get("/inventory/items/stock");
      if (res.data.success) {
        setStockData(res.data.data);
      } else {
        toast.error("Failed to fetch inventory data");
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast.error("Error fetching stock data");
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  // Filter
  const filteredStock = stockData.filter(
    (item) =>
      item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStock = filteredStock.slice(startIndex, endIndex);

  const handleReceived = (itemId) => {
    toast.success(`Item #${itemId} marked as Received!`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Draft Track (Received)
            </h1>
            <p className="text-muted-foreground mt-2 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Track all draft received items
            </p>
          </div>
        </div>

        {/* Search Section */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
              <Input
                placeholder="Search by item code or name..."
                className="pl-12 pr-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary/50 bg-background/80 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Stock Table */}
        <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-background to-muted/5 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent flex items-center gap-2">
                <Warehouse className="w-5 h-5 text-primary" />
                Draft Track
              </CardTitle>
              <div className="flex items-center gap-3">
                <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-lg">
                  {filteredStock.length} items
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto max-w-full">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-muted/40 to-muted/20 border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
                      Sr
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
                      Item Code
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
                      Item Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
                      Opening Stock
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
                      Purchase Rate
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border/30">
                  {loading ? (
                    <tr>
                      <td colSpan="10" className="py-20">
                        <div className="flex flex-col items-center justify-center">
                          <Loader className="w-10 h-10 text-primary animate-spin mb-3" />
                         
                        </div>
                      </td>
                    </tr>
                  ) : filteredStock.length > 0 ? (
                    currentStock.map((item, index) => (
                      <tr
                        key={item._id || index}
                        className="group hover:bg-primary/5 transition-all duration-300"
                      >
                        <td className="px-6 py-4 font-semibold">
                          {startIndex + index + 1}
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-mono text-sm font-semibold bg-primary/10 text-primary px-2 py-1 rounded-md border border-primary/20">
                            {item.itemCode || "-"}
                          </div>
                        </td>

                        <td className="px-6 py-4 font-semibold">
                          {item.itemName}
                        </td>

                        <td className="px-6 py-4">{item.openingStock}</td>

                        <td className="px-6 py-4">€{item.purchaseRate}</td>

                        <td className="px-6 py-4">
                          {item?.warehouseId?.warehouseAddress || "-"}
                        </td>

                        <td className="px-6 py-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-800"
                            onClick={() => handleReceived(item._id)}
                          >
                            <CheckCircle className="w-5 h-5 mr-1" />
                            Received
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center py-12">
                        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground font-medium text-lg">
                          No Draft track items found
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <Pagination
                currentPage={currentPage}
                totalItems={filteredStock.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DraftTrack;