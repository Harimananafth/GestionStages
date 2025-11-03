import useSWR from 'swr'
import { FileUser, CalendarDays, BriefcaseBusiness, UserCheck } from "lucide-react"
import { useState, useEffect } from 'react';

const fetcher = (url) => fetch(url, { credentials: 'include' }).then((res) => res.json());

export default function StatCards() {

  const ApiUrl = import.meta.env.PROD
    ? import.meta.env.VITE_PROD_API_URL
    : import.meta.env.VITE_API_URL;
  const { data, error, isLoading } = useSWR(`${ApiUrl}/stats`, fetcher);

  const [stats, setStats] = useState({
    totalCandidatures: 0,
    candidaturesThisYear: 0,
    totalOffres: 0,
    totalEtudiants: 0,
  });

  useEffect(() => {
    if (data && data.data) {
      const d = data.data;

      const totalCandidatures = d.totalCandidatures || 0;
      const candidaturesThisYear = d.candidaturesByMonth?.reduce((acc, m) => acc + (m.total || 0), 0) || 0;

      const totalOffres = d.totalOffres || 0;
      const totalEtudiants = d.totalEtudiants || 0;

      setStats({ totalCandidatures, candidaturesThisYear, totalOffres, totalEtudiants });
    }
    if (error) console.error(error);
  }, [data, error]);

  if (isLoading) {
    return (
      <div className="h-fit grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 flex justify-center items-center">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
            { icon: <FileUser strokeWidth={1.5} className="text-yellow-500 w-10 h-10" />, value: stats.totalCandidatures, label: "Total candidatures" },
            { icon: <CalendarDays strokeWidth={1.5} className="text-purple-500 w-10 h-10" />, value: stats.candidaturesThisYear, label: "Candidatures cette année" },
            { icon: <BriefcaseBusiness strokeWidth={1.5} className="text-emerald-500 w-10 h-10" />, value: stats.totalOffres, label: "Total offres" },
            { icon: <UserCheck strokeWidth={1.5} className="text-pink-500 w-10 h-10" />, value: stats.totalEtudiants, label: "Total étudiants" },
        ].map((item, i) => (
            <div
            key={i}
            className="bg-white rounded-xl p-5 flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-4 min-h-[100px] shadow-sm hover:scale-1.8 hover:cursor-default hover:shadow-lg duration-300"
            >
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12">
                    {item.icon}
                </div>
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                    <h2 className="text-2xl font-bold sm:text-3xl">{item.value}</h2>
                    <p className="text-sm text-[#4F5D75] sm:text-base">{item.label}</p>
                </div>
            </div>
        ))}
    </div>

  );
}
