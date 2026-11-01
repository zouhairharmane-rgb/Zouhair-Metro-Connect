import { Clock, MapPin, Users, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import type { SearchData } from "./HomeScreen";
import { useState, useEffect } from "react"; // Ajouté
import axios from "axios"; // Ajouté
import logoImage from "../../assets/3ca1d185e4c8ad3af2f51f725e3881c800b7f4f0.png";

interface ResultsScreenProps {
  searchData: SearchData;
  onBack: () => void;
  onSelectTrip: (trip: TripOption) => void;
}

export interface TripOption {
  id: string;
  line: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  availableSeats: number;
  maxSeats: number;
  price: number;
}

export function ResultsScreen({
  searchData,
  onBack,
  onSelectTrip,
}: ResultsScreenProps) {
  const [trips, setTrips] = useState<TripOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // APPEL API FILTRÉ
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/voyages/search", {
      params: {
        departure: searchData.departure,
        arrival: searchData.arrival,
        date: searchData.date
      }
    })
    .then(res => {
      setTrips(res.data);
      setIsLoading(false);
    })
    .catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, [searchData]);

  const getAvailabilityColor = (available: number, max: number) => {
    const percentage = (available / max) * 100;
    if (percentage > 50) return "text-green-600 bg-green-50";
    if (percentage > 20) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const getAvailabilityBorderColor = (available: number, max: number) => {
    const percentage = (available / max) * 100;
    if (percentage > 50) return "border-green-200";
    if (percentage > 20) return "border-orange-200";
    return "border-red-200";
  };

  if (isLoading) return <div className="p-20 text-center font-bold">Recherche des meilleurs trajets...</div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-muted rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <img src={logoImage} alt="Logo" className="h-10 object-contain" />
            <div className="flex-1 ml-2">
              <div className="flex items-center gap-2 text-[16px] font-semibold">
                <span>{searchData.departure}</span>
                <span className="text-muted-foreground">→</span>
                <span>{searchData.arrival}</span>
              </div>
              <p className="text-[14px] text-muted-foreground">
                {searchData.date} • {searchData.passengers} passager{searchData.passengers > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-[24px] font-bold mb-2">Voyages disponibles</h2>
          <p className="text-muted-foreground text-[14px]">
            {trips.length === 0 ? "Désolé, aucun métro ne correspond à votre recherche." : `${trips.length} options trouvées pour votre trajet`}
          </p>
        </div>

        <div className="space-y-4">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className={`bg-white rounded-2xl shadow-md border-2 ${getAvailabilityBorderColor(trip.availableSeats, trip.maxSeats)} p-6 hover:shadow-lg transition-shadow`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex px-3 py-1 bg-primary/10 text-primary rounded-full text-[12px] font-semibold">{trip.line}</span>
                    <span className="text-[14px] text-muted-foreground">{trip.duration}</span>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <div>
                        <div className="text-[20px] font-bold">{trip.departureTime}</div>
                        <div className="text-[12px] text-muted-foreground">Départ</div>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center">
                      <div className="flex-1 h-[2px] bg-border relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-accent rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-accent" />
                      <div>
                        <div className="text-[20px] font-bold">{trip.arrivalTime}</div>
                        <div className="text-[12px] text-muted-foreground">Arrivée</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-3 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                  <div className="flex-1 md:flex-none text-center md:text-right">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getAvailabilityColor(trip.availableSeats, trip.maxSeats)}`}>
                      <Users className="w-4 h-4" />
                      <span className="font-semibold text-[14px]">{trip.availableSeats} places</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[24px] font-bold text-primary">{trip.price * searchData.passengers} DH</div>
                      <div className="text-[12px] text-muted-foreground">{searchData.passengers} x {trip.price} DH</div>
                    </div>
                    <Button
                      onClick={() => onSelectTrip(trip)}
                      disabled={trip.availableSeats < searchData.passengers}
                      className="h-14 px-8 bg-primary hover:bg-primary/90 rounded-xl font-semibold shadow-md"
                    >
                      Réserver
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}