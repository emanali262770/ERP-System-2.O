import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
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

import api from "../../Api/AxiosInstance";

const CompanySwitcher = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get("/companies"); // your API route
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
    navigate("/");
  };

  const getBadgeVariant = (role) => {
    switch (role) {
      case "Admin":
        return "success";
      case "Accountant":
        return "destructive";
      case "Manager":
        return "outline";
      case "Supervisor":
        return "default";
      case "Sales Head":
        return "outline";
      case "Finance Officer":
      case "Operations Manager":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen flex justify-center bg-gradient-to-br from-background via-secondary to-background p-4">
        <div className="w-full max-w-8xl justify-between">
          <div className="text-left mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Select Company
            </h1>
            <p className="text-muted-foreground mt-2 flex items-center gap-2 justify-left">
              <Building2 className="w-4 h-4" />
              Choose a company to access
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {companies.map((company) => (
              <Card
                key={company.id}
                className="cursor-pointer transform transition-all duration-500 ease-out hover:scale-105 hover:shadow-2xl hover:border-primary/50 hover:bg-background/50"
                onClick={() => selectCompany(company)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between w-full">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
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
                  <CardTitle>{company.companyName}</CardTitle>

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
    </DashboardLayout>
  );
};

export default CompanySwitcher;
