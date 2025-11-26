import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import useSWR from "swr";

const fetcher = (url) =>
  fetch(url, { credentials: "include" }).then((res) => res.json());

export default function AdminCharts() {
  const apiUrl = import.meta.env.PROD
    ? import.meta.env.VITE_PROD_API_URL
    : import.meta.env.VITE_API_URL;
  const { data, error, isLoading } = useSWR(`${apiUrl}/stats`, fetcher);

  if (isLoading) return <div className="text-center py-10">Chargement des statistiques...</div>;
  if (error) return <div className="text-center py-10 text-red-600">Erreur lors du chargement.</div>;

  const stats = data?.data || {};

  // Candidatures par profil
  const profilsData = stats.candidaturesByProfil?.map((item) => ({
    name: item.profil || "Non défini",
    total: parseInt(item.total),
  }));

  // Candidatures par statut
  const statutData = stats.candidaturesByStatut?.map((item) => ({
    name: item.statut,
    value: parseInt(item.count),
  }));

  // Candidatures par mois
  const monthLabels = [
    "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
    "Juil", "Août", "Sep", "Oct", "Nov", "Déc"
  ];
  const monthData = stats.candidaturesByMonth?.map((m) => ({
    name: monthLabels[m.mois - 1],
    value: m.total,
  }));

  // Couleurs
  const COLORS = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff8042",
    "#0088FE", "#00C49F", "#FFBB28", "#FF4444",
    "#B39DDB", "#4DB6AC", "#F06292", "#A1887F",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-7  bg-white rounded-xl shadow-md grow hover:scale-1.8 hover:cursor-default hover:shadow-lg duration-300">

      {/* BAR CHART */}
      <div className="md:col-span-2 h-80">
        <h2 className="text-center font-semibold mb-3">Candidature par profil</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={profilsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#82ca9d" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* PIE CHART STATUT */}
      <div className="md:col-span-1 h-80 flex flex-col items-center justify-center">
        <h2 className="text-center font-semibold mb-3">Taux d'acceptation / refus</h2>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statutData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={60}
              paddingAngle={3}
            >
              {statutData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* PIE CHART PAR MOIS */}
      <div className="md:col-span-1 h-80 flex flex-col items-center justify-center">
        <h2 className="text-center font-semibold mb-3">Évolution des candidatures dans l'année</h2>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={monthData}
              dataKey="value"
              nameKey="name"
              cx="40%"
              cy="50%"
              outerRadius={80}
              innerRadius={50}
              paddingAngle={2}
            >
              {monthData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="left" 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
