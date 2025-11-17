import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import api from "../Api/AxiosInstance";

const CompanySelection = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get("/companies"); // same API as upper page
        setCompanies(res.data.data || []);
      } catch (error) {
        console.error("Error fetching companies", error);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const navigate = useNavigate();

  const selectCompany = (company) => {
    toast.success(`Switched to ${company.companyName}`);
    localStorage.setItem("selectedCompany", JSON.stringify(company));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4">
      <div className="w-full max-w-3xl">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Select Company
          </h1>
          <p className="text-muted-foreground">Choose a company to access</p>
        </div>

        {/* Companies Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {companies.map((company) => (
            <Card
              key={company._id}
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 hover:border-primary"
              onClick={() => selectCompany(company)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  {/* Icon or Logo */}
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>

                  {/* Status Badge */}
                  <Badge
                    className={
                      company.status === "Active"
                        ? "bg-green-500/15 text-green-600"
                        : "bg-red-500/15 text-red-600"
                    }
                  >
                    {company.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                {/* Company Name */}
                <CardTitle className="text-xl mb-2">
                  {company.companyName}
                </CardTitle>

                <CardDescription className="flex items-center justify-between">
                  <span>Access dashboard</span>
                  <ChevronRight className="w-4 h-4" />
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanySelection;
