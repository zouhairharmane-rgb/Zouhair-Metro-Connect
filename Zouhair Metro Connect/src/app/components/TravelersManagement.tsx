import { ArrowLeft, UserPlus, Search, Edit, Trash2, Mail, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState, useEffect } from "react";
import axios from "axios";
import logoImage from "../../assets/3ca1d185e4c8ad3af2f51f725e3881c800b7f4f0.png";

interface TravelersManagementProps {
  onBack: () => void;
}

interface Traveler {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredDate: string;
  totalTrips: number;
}

export function TravelersManagement({ onBack }: TravelersManagementProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // On commence avec un tableau vide, les fausses données sont supprimées
  const [travelers, setTravelers] = useState<Traveler[]>([]);
  // Indicateur de chargement
  const [isLoading, setIsLoading] = useState(true);

  // 1. Récupération des voyageurs depuis MySQL via Laravel
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/voyageurs")
      .then((response) => {
        setTravelers(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erreur de connexion à l'API Laravel :", error);
        setIsLoading(false);
      });
  }, []);

  const [newTraveler, setNewTraveler] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // 2. Enregistrement d'un nouveau voyageur dans MySQL
  const handleCreateTraveler = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post("http://127.0.0.1:8000/api/voyageurs", newTraveler)
      .then((response) => {
        console.log("Réponse du serveur :", response.data);
        alert("Voyageur ajouté avec succès dans la base de données !");
        // On recharge la page pour voir le nouveau voyageur
        window.location.reload();
      })
      .catch((error) => {
        console.error("Erreur lors de la création :", error);
        alert("Erreur lors de la création du voyageur.");
      });
  };
  const handleDeleteTraveler = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce voyageur définitivement de la base de données ?")) {
      // On envoie la requête DELETE à Laravel avec l'ID du voyageur
      axios.delete(`http://127.0.0.1:8000/api/voyageurs/${id}`)
        .then((response) => {
          console.log(response.data.message);
          // Magie de React : on met à jour l'affichage instantanément
          // en retirant le voyageur supprimé de la liste, sans même recharger la page !
          setTravelers(travelers.filter((t) => t.id !== id));
          // Petite notification discrète (optionnel)
          // alert("Voyageur supprimé !");
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression :", error);
          alert("Erreur : Impossible de supprimer ce voyageur.");
        });
    }
  };

  const filteredTravelers = travelers.filter(
    (traveler) =>
      traveler.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      traveler.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      traveler.phone.includes(searchQuery)
  );
  // 3. Affichage du chargement
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold">Chargement des voyageurs depuis la base de données...</div>;
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
            <h1 className="text-[20px] font-bold">Gestion des voyageurs</h1>
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
              placeholder="Rechercher un voyageur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 border-2 rounded-xl"
            />
          </div>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="h-12 px-6 bg-primary hover:bg-primary/90 rounded-xl font-semibold"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Nouveau voyageur
          </Button>
        </div>
        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-primary p-6 mb-6">
            <h3 className="text-[20px] font-bold mb-4">
              Créer un nouveau voyageur
            </h3>
            <form onSubmit={handleCreateTraveler} className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[14px]">
                    Nom complet
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ex: Ahmed El Fassi"
                    value={newTraveler.name}
                    onChange={(e) =>
                      setNewTraveler({ ...newTraveler, name: e.target.value })
                    }
                    className="h-12 border-2 rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[14px]">
                    Adresse e-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemple@email.com"
                    value={newTraveler.email}
                    onChange={(e) =>
                      setNewTraveler({ ...newTraveler, email: e.target.value })
                    }
                    className="h-12 border-2 rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[14px]">
                    Téléphone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+212 6 12 34 56 78"
                    value={newTraveler.phone}
                    onChange={(e) =>
                      setNewTraveler({ ...newTraveler, phone: e.target.value })
                    }
                    className="h-12 border-2 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="h-12 px-8 bg-primary hover:bg-primary/90 rounded-xl font-semibold"
                >
                  Créer le voyageur
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

        {/* Travelers List */}
        <div className="bg-white rounded-2xl shadow-md border border-border overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30">
            <h3 className="text-[18px] font-bold">
              {filteredTravelers.length} voyageur
              {filteredTravelers.length > 1 ? "s" : ""}
            </h3>
          </div>

          {filteredTravelers.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-[16px]">Aucun voyageur trouvé</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredTravelers.map((traveler) => (
                <div
                  key={traveler.id}
                  className="p-6 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <h4 className="text-[18px] font-bold mb-2">
                        {traveler.name}
                      </h4>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-[14px] text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {traveler.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {traveler.phone}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-[24px] font-bold text-primary">
                          {traveler.totalTrips}
                        </div>
                        <div className="text-[12px] text-muted-foreground">
                          Voyages
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-[14px] font-semibold">
                          {traveler.registeredDate}
                        </div>
                        <div className="text-[12px] text-muted-foreground">
                          Inscrit le
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-lg border-2"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteTraveler(traveler.id)}
                          className="h-10 w-10 rounded-lg border-2 hover:bg-destructive hover:text-white hover:border-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}