import { useState, useEffect } from "react";
import axios from "axios";
import { Users, Train, BarChart3, Calendar, ChevronRight, Activity } from "lucide-react";
import { Button } from "./ui/button";
// Assure-toi que ce chemin correspond bien à ton image
import logoImage from "../../assets/3ca1d185e4c8ad3af2f51f725e3881c800b7f4f0.png";

interface AdminDashboardProps {
  onNavigate: (section: "travelers" | "trips") => void;
  onLogout: () => void;
}

export function AdminDashboard({ onNavigate, onLogout }: AdminDashboardProps) {
  // --- ÉTATS POUR LES DONNÉES DYNAMIQUES ---
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    voyageurs: 0,
    voyages: 0,
    reservations: 0,
    taux_occupation: "0%"
  });

  // --- RÉCUPÉRATION DES DONNÉES DEPUIS LARAVEL ---
  useEffect(() => {
    // 1. Récupération des activités récentes
    axios.get("http://127.0.0.1:8000/api/activities")
      .then(response => setRecentActivities(response.data))
      .catch(error => console.error("Erreur de chargement des activités:", error));

    // 2. Récupération des statistiques (KPIs)
    axios.get("http://127.0.0.1:8000/api/dashboard-stats")
      .then(response => setDashboardStats(response.data))
      .catch(error => console.error("Erreur de chargement des stats:", error));
  }, []);

  // --- CONFIGURATION DES CARTES DE STATISTIQUES ---
  const stats = [
    {
      title: "Voyageurs inscrits",
      value: dashboardStats.voyageurs.toString(),
      icon: Users,
      color: "from-blue-500 to-cyan-400",
      trend: "En direct",
      trendColor: "text-emerald-500",
    },
    {
      title: "Voyages au total",
      value: dashboardStats.voyages.toString(),
      icon: Train,
      color: "from-emerald-500 to-teal-400",
      trend: "En direct",
      trendColor: "text-emerald-500",
    },
    {
      title: "Réservations",
      value: dashboardStats.reservations.toString(),
      icon: Calendar,
      color: "from-purple-500 to-indigo-400",
      trend: "En direct",
      trendColor: "text-emerald-500",
    },
    {
      title: "Taux d'occupation",
      value: dashboardStats.taux_occupation,
      icon: BarChart3,
      color: "from-orange-500 to-amber-400",
      trend: "Moyenne",
      trendColor: "text-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* HEADER (Glassmorphism) */}
      <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur-sm text-white py-4 px-4 shadow-sm border-b border-primary-foreground/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
              <img
                src={logoImage}
                alt="Zouhair Metro Connect"
                className="h-10 object-contain drop-shadow-md"
              />
            </div>
            <div className="border-l-2 border-white/20 pl-4 py-1">
              <h1 className="text-xl font-bold tracking-tight">Administration</h1>
              <p className="text-xs font-medium text-blue-100/80 uppercase tracking-wider">Panneau de contrôle</p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="ghost"
            className="text-white hover:bg-white/20 hover:text-white transition-colors rounded-full px-6"
          >
            Déconnexion
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
        {/* TITRE DE LA PAGE */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Tableau de bord</h2>
            <p className="text-slate-500 text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Vue d'ensemble en temps réel de votre réseau
            </p>
          </div>
        </div>

        {/* GRILLE DES STATISTIQUES (KPI) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="w-7 h-7 text-white drop-shadow-sm" />
                </div>
                <div className={`flex items-center gap-1 ${stat.trendColor} bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-bold`}>
                  {stat.trend}
                </div>
              </div>
              <div>
                <div className="text-4xl font-black text-slate-800 tracking-tight mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                  {stat.title}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* BOUTONS D'ACCÈS RAPIDES */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <button
            onClick={() => onNavigate("travelers")}
            className="group relative overflow-hidden bg-white rounded-3xl shadow-sm border border-slate-200 p-8 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 text-left"
          >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
              <ChevronRight className="w-8 h-8 text-primary" />
            </div>
            <div className="flex items-start gap-6 relative z-10">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:rotate-3 transition-all duration-300 shadow-sm">
                <Users className="w-10 h-10 text-primary group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">
                  Gestion des voyageurs
                </h3>
                <p className="text-slate-500 text-base leading-relaxed">
                  Gérez les comptes clients, consultez l'historique et modifiez les profils.
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate("trips")}
            className="group relative overflow-hidden bg-white rounded-3xl shadow-sm border border-slate-200 p-8 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 text-left"
          >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
              <ChevronRight className="w-8 h-8 text-accent" />
            </div>
            <div className="flex items-start gap-6 relative z-10">
              <div className="w-20 h-20 bg-teal-50 rounded-2xl flex items-center justify-center group-hover:bg-accent group-hover:-rotate-3 transition-all duration-300 shadow-sm">
                <Train className="w-10 h-10 text-accent group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-accent transition-colors">
                  Gestion des voyages
                </h3>
                <p className="text-slate-500 text-base leading-relaxed">
                  Planifiez les itinéraires, ajustez les horaires et contrôlez le trafic.
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* TIMELINE : ACTIVITÉ RÉCENTE DYNAMIQUE */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800">Activité récente</h3>
            <Button variant="link" className="text-primary font-medium">Actualiser</Button>
          </div>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="relative flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${activity.color || 'bg-blue-500'}`}></div>
                    <div className="bg-slate-50 rounded-xl px-4 py-2 group-hover:bg-slate-100 transition-colors">
                      <div className="text-sm font-bold text-slate-800">
                        {activity.action}
                      </div>
                      <div className="text-xs font-medium text-slate-500 mt-0.5">
                        {activity.user}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-slate-400 bg-white px-2">
                    {activity.time}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500 py-4 text-center font-medium bg-slate-50 rounded-xl">
                Connexion à la base de données... (ou aucune activité pour le moment)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}