import {
  ArrowLeft,
  Plus,
  Search,
  Calendar,
  Clock,
  MapPin,
  Users,
  XCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
// LIGNE CORRIGÉE : On utilise ton image locale
import logoImage from "../../assets/3ca1d185e4c8ad3af2f51f725e3881c800b7f4f0.png";

interface TripsManagementProps {
  onBack: () => void;
}

interface Trip {
  id: string;
  line: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  maxSeats: number;
  bookedSeats: number;
  status: "active" | "cancelled" | "completed";
}

const stations = [
  "Gare Centrale",
  "Place Mohammed V",
  "Quartier Hassan",
  "Medina",
  "Agdal",
  "Jardin Zoologique",
  "Aéroport",
  "Université",
  "Stade",
  "Corniche",
];

const lines = ["A", "B", "C", "D"];

export function TripsManagement({ onBack }: TripsManagementProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // On commence avec un tableau vide
  const [trips, setTrips] = useState<Trip[]>([]);
  // On ajoute un indicateur de chargement
  const [isLoading, setIsLoading] = useState(true);

  // React va appeler Laravel dès que la page s'affiche
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/voyages")
      .then((response) => {
        setTrips(response.data); // On remplit React avec les données de MySQL !
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erreur de connexion à l'API Laravel :", error);
        setIsLoading(false);
      });
  }, []);

  const [newTrip, setNewTrip] = useState({
    line: "",
    departure: "",
    arrival: "",
    departureTime: "",
    arrivalTime: "",
    date: "",
    maxSeats: 150,
  });

  // --- NOUVELLE FONCTION CORRIGÉE ---
  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    // 1. On prépare les données du formulaire à envoyer
    const voyageAEnvoyer = {
      line: newTrip.line,
      departure: newTrip.departure,
      arrival: newTrip.arrival,
      departureTime: newTrip.departureTime,
      arrivalTime: newTrip.arrivalTime,
      date: newTrip.date,
      maxSeats: newTrip.maxSeats
    };

    // 2. On envoie les données à Laravel avec la méthode POST
    axios.post("http://127.0.0.1:8000/api/voyages", voyageAEnvoyer)
      .then((response) => {
        console.log("Réponse du serveur :", response.data);
        alert("Voyage enregistré !");
        // 3. On recharge la page pour afficher les nouvelles données de MySQL
        window.location.reload();
      })
      .catch((error) => {
        console.error("Erreur lors de la sauvegarde :", error);
        alert("Erreur lors de la sauvegarde du voyage.");
      });
  };
  // ------------------------------------

  const handleCancelTrip = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir annuler ce voyage ?")) {
      setTrips(
        trips.map((trip) =>
          trip.id === id ? { ...trip, status: "cancelled" as const } : trip
        )
      );
    }
  };

  const handleActivateTrip = (id: string) => {
    setTrips(
      trips.map((trip) =>
        trip.id === id ? { ...trip, status: "active" as const } : trip
      )
    );
  };

  const filteredTrips = trips.filter(
    (trip) =>
      trip.line.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.departure.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.arrival.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: Trip["status"]) => {
    switch (status) {
      case "active":
        return {
          text: "Actif",
          className: "bg-green-100 text-green-700 border-green-200",
          icon: CheckCircle,
        };
      case "cancelled":
        return {
          text: "Annulé",
          className: "bg-red-100 text-red-700 border-red-200",
          icon: XCircle,
        };
      case "completed":
        return {
          text: "Terminé",
          className: "bg-gray-100 text-gray-700 border-gray-200",
          icon: CheckCircle,
        };
    }
  };

  const getOccupancyColor = (booked: number, max: number) => {
    const percentage = (booked / max) * 100;
    if (percentage >= 90) return "text-red-600 bg-red-50";
    if (percentage >= 70) return "text-orange-600 bg-orange-50";
    return "text-green-600 bg-green-50";
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold">Connexion à la base de données...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <img
              src={logoImage}
              alt="Zouhair Metro Connect"
              className="h-10 object-contain"
            />
            <h1 className="text-[20px] font-bold">Gestion des voyages</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher un voyage..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 border-2 rounded-xl"
            />
          </div>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="h-12 px-6 bg-primary hover:bg-primary/90 rounded-xl font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouveau voyage
          </Button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-primary p-6 mb-6">
            <h3 className="text-[20px] font-bold mb-4">
              Créer un nouveau voyage
            </h3>
            <form onSubmit={handleCreateTrip} className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-[14px]">Ligne</Label>
                  <Select
                    value={newTrip.line}
                    onValueChange={(value) =>
                      setNewTrip({ ...newTrip, line: value })
                    }
                  >
                    <SelectTrigger className="h-12 border-2 rounded-xl">
                      <SelectValue placeholder="Choisir une ligne" />
                    </SelectTrigger>
                    <SelectContent>
                      {lines.map((line) => (
                        <SelectItem key={line} value={line}>
                          Ligne {line}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[14px]">Station de départ</Label>
                  <Select
                    value={newTrip.departure}
                    onValueChange={(value) =>
                      setNewTrip({ ...newTrip, departure: value })
                    }
                  >
                    <SelectTrigger className="h-12 border-2 rounded-xl">
                      <SelectValue placeholder="Choisir une station" />
                    </SelectTrigger>
                    <SelectContent>
                      {stations.map((station) => (
                        <SelectItem key={station} value={station}>
                          {station}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[14px]">Station d'arrivée</Label>
                  <Select
                    value={newTrip.arrival}
                    onValueChange={(value) =>
                      setNewTrip({ ...newTrip, arrival: value })
                    }
                  >
                    <SelectTrigger className="h-12 border-2 rounded-xl">
                      <SelectValue placeholder="Choisir une station" />
                    </SelectTrigger>
                    <SelectContent>
                      {stations
                        .filter((s) => s !== newTrip.departure)
                        .map((station) => (
                          <SelectItem key={station} value={station}>
                            {station}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-[14px]">
                    Date
                  </Label>
                  <input
                    type="date"
                    id="date"
                    value={newTrip.date}
                    onChange={(e) =>
                      setNewTrip({ ...newTrip, date: e.target.value })
                    }
                    className="w-full h-12 px-4 border-2 border-border rounded-xl focus:border-primary focus:outline-none"
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departureTime" className="text-[14px]">
                    Heure de départ
                  </Label>
                  <input
                    type="time"
                    id="departureTime"
                    value={newTrip.departureTime}
                    onChange={(e) =>
                      setNewTrip({ ...newTrip, departureTime: e.target.value })
                    }
                    className="w-full h-12 px-4 border-2 border-border rounded-xl focus:border-primary focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arrivalTime" className="text-[14px]">
                    Heure d'arrivée
                  </Label>
                  <input
                    type="time"
                    id="arrivalTime"
                    value={newTrip.arrivalTime}
                    onChange={(e) =>
                      setNewTrip({ ...newTrip, arrivalTime: e.target.value })
                    }
                    className="w-full h-12 px-4 border-2 border-border rounded-xl focus:border-primary focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxSeats" className="text-[14px]">
                    Capacité max
                  </Label>
                  <Input
                    id="maxSeats"
                    type="number"
                    value={newTrip.maxSeats}
                    onChange={(e) =>
                      setNewTrip({
                        ...newTrip,
                        maxSeats: parseInt(e.target.value),
                      })
                    }
                    className="h-12 border-2 rounded-xl"
                    required
                    min={1}
                    max={300}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="h-12 px-8 bg-primary hover:bg-primary/90 rounded-xl font-semibold"
                >
                  Créer le voyage
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="h-12 px-8 rounded-xl border-2"
                >
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Trips List */}
        <div className="space-y-4">
          {filteredTrips.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md border border-border p-12 text-center text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-[16px]">Aucun voyage trouvé</p>
            </div>
          ) : (
            filteredTrips.map((trip) => {
              const statusBadge = getStatusBadge(trip.status);
              const StatusIcon = statusBadge.icon;

              return (
                <div
                  key={trip.id}
                  className="bg-white rounded-2xl shadow-md border-2 border-border p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Trip Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="inline-flex px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[14px] font-bold">
                          {trip.line}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold border ${statusBadge.className}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusBadge.text}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <div>
                            <div className="text-[12px] text-muted-foreground">
                              Départ
                            </div>
                            <div className="text-[14px] font-semibold">
                              {trip.departure}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-accent" />
                          <div>
                            <div className="text-[12px] text-muted-foreground">
                              Arrivée
                            </div>
                            <div className="text-[14px] font-semibold">
                              {trip.arrival}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-[14px]">
                            {new Date(trip.date).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-[14px]">
                            {trip.departureTime} - {trip.arrivalTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex lg:flex-col items-center lg:items-end gap-4 lg:gap-3 border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-6">
                      <div className="flex-1 lg:flex-none text-center lg:text-right">
                        <div
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getOccupancyColor(
                            trip.bookedSeats,
                            trip.maxSeats
                          )}`}
                        >
                          <Users className="w-4 h-4" />
                          <span className="font-semibold text-[14px]">
                            {trip.bookedSeats} / {trip.maxSeats}
                          </span>
                        </div>
                        <div className="text-[12px] text-muted-foreground mt-1">
                          {Math.round((trip.bookedSeats / trip.maxSeats) * 100)}%
                          occupé
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {trip.status === "active" ? (
                          <Button
                            onClick={() => handleCancelTrip(trip.id)}
                            variant="outline"
                            className="h-12 px-6 rounded-xl border-2 border-destructive text-destructive hover:bg-destructive hover:text-white font-semibold"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Annuler
                          </Button>
                        ) : trip.status === "cancelled" ? (
                          <Button
                            onClick={() => handleActivateTrip(trip.id)}
                            variant="outline"
                            className="h-12 px-6 rounded-xl border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Réactiver
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}