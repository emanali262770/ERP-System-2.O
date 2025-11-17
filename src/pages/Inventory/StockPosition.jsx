import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import api from "../../Api/AxiosInstance";
import { Package } from "lucide-react";

const StockPosition = () => {
  const [loading, setLoading] = useState(false);
  const [stockPositionData, setStockPositionData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSizeFilter, setSelectedSizeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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

  // 1) Filter by search text
  const filteredCategories = stockPositionData.filter((cat) =>
    cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2) Filter by category selection
  const visibleCategories = selectedCategory
    ? filteredCategories.filter((cat) => cat.categoryName === selectedCategory)
    : filteredCategories;

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
          <>
            {/* Filters Section */}
            < div className="flex flex-wrap items-center justify-between gap-4 mb-8">

              <div className="flex gap-4">
                {/* Category Select */}
                <div className="w-[250px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setSelectedSizeFilter("");
                    }}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">All Categories</option>
                    {stockPositionData.map((cat) => (
                      <option key={cat._id} value={cat.categoryName}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Size Filter */}
                <div className="w-[250px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Size
                  </label>
                  <select
                    value={selectedSizeFilter}
                    onChange={(e) => setSelectedSizeFilter(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    disabled={!selectedCategory}
                  >
                    <option value="">All Sizes</option>

                    {selectedCategory &&
                      stockPositionData
                        .find((cat) => cat.categoryName === selectedCategory)
                        ?.sizes.map((s) => (
                          <option key={s._id} value={getSizeName(s).toUpperCase()}>
                            {getSizeName(s).toUpperCase()}
                          </option>
                        ))}
                  </select>
                </div>
              </div>
              {/* Search Bar */}
              <div className="w-[300px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Category
                </label>
                <input
                  type="text"
                  placeholder="Search category..."
                  className="w-full p-2 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>


            <div className="space-y-10">
              {visibleCategories.map((category, index) => (
                <div
                  key={category._id}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200"
                >
                  {/* Gradient Header */}
                  <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-primary/20 to-primary/5 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-tr from-primary to-primary/50 text-white font-semibold text-sm shadow-sm">
                        {index + 1}
                      </span>
                      <h2 className="text-xl font-semibold text-gray-900 truncate">
                        {category.categoryName}
                      </h2>
                    </div>
                    <span className="text-xs text-gray-500 italic">
                      {category.sizes.length} sizes
                    </span>
                  </div>

                  {/* Sizes Table */}
                  <div className="p-6 overflow-x-auto">
                    {category.sizes.length > 0 ? (
                      <table className="min-w-full table-auto border-collapse">
                        <thead className="bg-gray-50 text-gray-700 uppercase text-sm tracking-wide">
                          <tr>
                            <th className="p-3 text-left font-semibold">sr</th>
                            <th className="p-3 text-left font-semibold">Size</th>
                            <th className="p-3 text-left font-semibold">Stock</th>
                          </tr>
                        </thead>

                        <tbody>
                          {category.sizes
                            .filter((sz) =>
                              selectedSizeFilter
                                ? getSizeName(sz).toUpperCase() === selectedSizeFilter
                                : true
                            )
                            .map((sizeObj, idx) => {
                              const size = getSizeName(sizeObj).toUpperCase();
                              const count = sizeObj.stock || 0;

                              // Stock color coding
                              let stockBg = "bg-green-100 text-green-800";
                              if (count === 0) stockBg = "bg-red-100 text-red-800";
                              else if (count <= 5) stockBg = "bg-yellow-100 text-yellow-800";

                              return (
                                <tr
                                  key={sizeObj._id}
                                  className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-primary/5 transition`}
                                >
                                  <td className="p-3 font-medium text-gray-800">{idx + 1}.</td>
                                  <td className="p-3 font-medium text-gray-800">{size}</td>
                                  <td className="p-3">
                                    <span
                                      className={`px-3 py-1 rounded-full font-semibold ${stockBg}`}
                                    >
                                      {count}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center p-6 text-gray-500 italic bg-gray-50 rounded-xl">
                        No sizes available
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>



          </>

        )}
      </div>
    </DashboardLayout >
  );
};

export default StockPosition;
