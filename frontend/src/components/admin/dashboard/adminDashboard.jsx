import { useEffect } from "react";
import StatCards from "./statCards";
import AdminCharts from "./adminCharts";

export default function AdminDashboard() {
  useEffect(() => {
    document.title = "Tableau de bord | Admin";
  }, []);

  return (
    <div className="flex flex-col gap-3 min-h-full md:overflow-y-auto animate-[text-appear-bottom_0.5s_ease-in]">
      <StatCards />
      <AdminCharts />
    </div>
  );
}
