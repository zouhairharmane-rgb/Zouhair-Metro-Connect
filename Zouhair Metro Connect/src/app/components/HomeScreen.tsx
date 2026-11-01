import { MapPin, Calendar, Clock, Users, Search, Train } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState, useEffect } from "react"; // Ajout de useEffect
import axios from "axios"; // Ajout d'axios

import logoImage from "../../assets/3ca1d185e4c8ad3af2f51f725e3881c800b7f4f0.png";

interface HomeScreenProps {
  onSearch: (searchData: SearchData) => void;
}

export interface SearchData {
  departure: string;
  arrival: string;
  date: string;
  time: string;
  passengers: number;
}

export function HomeScreen({ onSearch }: HomeScreenProps) {
  // --- NOUVEAUX ÉTATS ---
  const [stations, setStations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [passengers, setPassengers] = useState(1);

  // --- APPEL API POUR LES STATIONS ---
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/stations")
      .then((response) => {
        setStations(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erreur stations:", error);
        setIsLoading(false);
      });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (departure && arrival && date && time) {
      onSearch({ departure, arrival, date, time, passengers });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-white py-4 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logoImage}
              alt="Zouhair Metro Connect"
              className="h-12 object-contain"
            />
          </div>
          <button className="text-[14px] hover:underline">Mon compte</button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/5 to-transparent py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-[32px] font-bold text-foreground mb-2">
              Trouvez votre trajet
            </h2>
            <p className="text-muted-foreground text-[16px]">
              Réservez vos billets de métro en quelques clics
            </p>
          </div>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-5 max-w-2xl mx-auto border border-border"
          >
            <div className="grid md:grid-cols-2 gap-5">
              {/* Departure Station */}
              <div className="space-y-2">
                <Label className="text-[14px] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Station de départ
                </Label>
                <Select value={departure} onValueChange={setDeparture} disabled={isLoading}>
                  <SelectTrigger className="h-14 border-2 rounded-xl">
                    <SelectValue placeholder={isLoading ? "Chargement..." : "Choisir une station"} />
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

              {/* Arrival Station */}
              <div className="space-y-2">
                <Label className="text-[14px] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  Station d'arrivée
                </Label>
                <Select value={arrival} onValueChange={setArrival} disabled={isLoading}>
                  <SelectTrigger className="h-14 border-2 rounded-xl">
                    <SelectValue placeholder={isLoading ? "Chargement..." : "Choisir une station"} />
                  </SelectTrigger>
                  <SelectContent>
                    {stations
                      .filter((s) => s !== departure)
                      .map((station) => (
                        <SelectItem key={station} value={station}>
                          {station}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {/* Date, Time, Passengers restent identiques... */}
              <div className="space-y-2">
                <Label className="text-[14px] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Date
                </Label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-14 px-4 border-2 border-border rounded-xl focus:border-primary focus:outline-none"
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[14px] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Heure
                </Label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full h-14 px-4 border-2 border-border rounded-xl focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[14px] flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Passagers
                </Label>
                <div className="flex items-center h-14 border-2 border-border rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setPassengers(Math.max(1, passengers - 1))}
                    className="px-4 h-full hover:bg-muted transition-colors text-[20px] font-bold"
                  >
                    −
                  </button>
                  <div className="flex-1 text-center font-semibold text-[16px]">
                    {passengers}
                  </div>
                  <button
                    type="button"
                    onClick={() => setPassengers(Math.min(10, passengers + 1))}
                    className="px-4 h-full hover:bg-muted transition-colors text-[20px] font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-xl text-[18px] font-semibold shadow-lg flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Rechercher mon métro
            </Button>
          </form>
          {/* ... Features restent identiques */}
        </div>
      </div>
    </div>
  );
}