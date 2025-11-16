import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import api from "../../Api/AxiosInstance";
import { Package } from "lucide-react";

const StockPosition = () => {
  const [loading, setLoading] = useState(false);
  const [stockPositionData, setStockPositionData] = useState([]);

  const sizeColors = {
    SM: "from-green-50 to-green-100 border-green-200 text-green-900",
    M: "from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-900",
    L: "from-orange-50 to-orange-100 border-orange-200 text-orange-900",
    XL: "from-red-50 to-red-100 border-red-200 text-red-900",
    "2XL": "from-purple-50 to-purple-100 border-purple-200 text-purple-900",
  };

  // Fetch stock data from API
  const fetchStockPosition = async () => {
    try {
      setLoading(true);
      const res = await api.get("/categories");
      setStockPositionData(res.data.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast.error("Error fetching stock data");
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  useEffect(() => {
    fetchStockPosition();
  }, []);

  // Helper to normalize size
  const getSizeName = (sizeObj) => {
    if (sizeObj.size) return sizeObj.size;
    // join numbered keys into a string (handles weird API format)
    return Object.keys(sizeObj)
      .filter((key) => !["_id", "stock"].includes(key))
      .map((key) => sizeObj[key])
      .join("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Package className="w-8 h-8 text-primary" />
          <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Stock Position
          </span>
        </h1>

        {loading ? (
          <p className="text-center py-20 text-muted-foreground">
            Loading stock data...
          </p>
        ) : stockPositionData.length === 0 ? (
          <p className="text-center py-20 text-muted-foreground">
            No stock data available
          </p>
        ) : (
          <div className="space-y-12">
            {stockPositionData.map((category, index) => (
              <div key={category._id}>
                {/* Category Name */}
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  {index + 1}. {category.categoryName}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
                  {category.sizes.map((sizeObj) => {
                    const size = getSizeName(sizeObj).toUpperCase();
                    const count = sizeObj.stock || 0;

                    return (
                      <Card
                        key={sizeObj._id}
                        className={`bg-gradient-to-br ${
                          sizeColors[size] || "from-gray-50 to-gray-100 border-gray-200 text-gray-900"
                        } border hover:shadow-md transition-shadow duration-300`}
                      >
                        <CardContent className="p-4 text-center">
                          <p className="text-sm font-medium">{size}</p>
                          <p className="text-2xl font-bold">{count}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StockPosition;
