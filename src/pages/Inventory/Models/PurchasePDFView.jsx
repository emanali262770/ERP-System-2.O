import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { Loader } from "lucide-react";
import api from "../../../Api/AxiosInstance";
import { useAuth } from "../../../context/AuthContext";

const PurchasePDFView = () => {
  const { id } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const res = await api.get(`/inventory/purchases/${id}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPdfUrl(res.data.data?.supplierInvoice?.url || null);
      } catch (err) {
        setPdfUrl(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPDF();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size={40} className="animate-spin" />
      </div>
    );

  if (!pdfUrl)
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        No PDF found for this Purchase.
      </div>
    );

  return (
    <iframe
      src={pdfUrl}
      title="Purchase PDF"
      className="w-full h-screen border-none"
    />
  );
};

export default PurchasePDFView;
