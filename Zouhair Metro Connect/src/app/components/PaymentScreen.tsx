import {
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  MapPin,
  Clock,
  Users,
  QrCode,
  Download,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import type { SearchData } from "./HomeScreen";
import type { TripOption } from "./ResultsScreen";
import { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf"; // Importation pour le PDF
import logoImage from "../../assets/6bb1bf4af511394138b5489e98459465e7ee4122.png";

interface PaymentScreenProps {
  searchData: SearchData;
  selectedTrip: TripOption;
  onBack: () => void;
}

export function PaymentScreen({
  searchData,
  selectedTrip,
  onBack,
}: PaymentScreenProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ticketNumber] = useState(`ZMC-${Date.now().toString().slice(-8)}`);

  // --- FONCTION DE PAIEMENT ET ENREGISTREMENT DB ---
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const reservationData = {
      tripId: selectedTrip.id,
      userId: 1, // ID temporaire
      passengers: searchData.passengers,
    };

    try {
      // Enregistrement dans la table RESERVATION via Laravel
      await axios.post("http://127.0.0.1:8000/api/reservations", reservationData);
      setShowConfirmation(true);
    } catch (error) {
      console.error("Erreur DB:", error);
      alert("Erreur lors de l'enregistrement de la réservation.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- FONCTION DE GÉNÉRATION PDF ---
const downloadTicketPDF = () => {
    // Format "Ticket de caisse / Billet" (80mm x 150mm)
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [80, 150] });

    // Cadre extérieur
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(5, 5, 70, 140);

    // En-tête sombre professionnel
    doc.setFillColor(15, 23, 42); // Bleu nuit très foncé
    doc.rect(5, 5, 70, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("ZOUHAIR METRO CONNECT", 40, 17, { align: "center" });

    // Section Numéro de Billet (Fond gris clair)
    doc.setFillColor(241, 245, 249);
    doc.rect(5, 25, 70, 10, "F");
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("TICKET N°:", 10, 31);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text(ticketNumber, 28, 31);

    // Section Trajet
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("De", 10, 45);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(searchData.departure, 10, 50);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("À", 40, 45);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(searchData.arrival, 40, 50);

    // Ligne de séparation
    doc.setDrawColor(226, 232, 240);
    doc.line(10, 58, 70, 58);

    // Détails (Date, Heure, Ligne)
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Date", 10, 68);
    doc.setFont("helvetica", "bold");
    doc.text(searchData.date, 10, 73);

    doc.setFont("helvetica", "normal");
    doc.text("Heure", 40, 68);
    doc.setFont("helvetica", "bold");
    doc.text(selectedTrip.departureTime, 40, 73);

    doc.setFont("helvetica", "normal");
    doc.text("Ligne", 10, 83);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235); // Bleu primaire
    doc.text(selectedTrip.line, 10, 88);

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "normal");
    doc.text("Passagers", 40, 83);
    doc.setFont("helvetica", "bold");
    doc.text(searchData.passengers.toString(), 40, 88);

    // Bloc Total Payé
    doc.setFillColor(241, 245, 249);
    doc.rect(10, 98, 60, 12, "F");
    doc.setFontSize(11);
    doc.text("TOTAL PAYÉ :", 15, 106);
    doc.setTextColor(37, 99, 235);
    doc.text(`${totalPrice} DH`, 50, 106);

    // Simulation d'un petit QR Code (Dessin de carrés)
    doc.setDrawColor(0, 0, 0);
    doc.setFillColor(0, 0, 0);
    doc.rect(30, 115, 20, 20); // Contour
    doc.setFillColor(255, 255, 255);
    doc.rect(31, 116, 18, 18, "F"); // Intérieur blanc
    doc.setFillColor(0, 0, 0);
    doc.rect(33, 118, 4, 4, "F");
    doc.rect(43, 118, 4, 4, "F");
    doc.rect(33, 128, 4, 4, "F");
    doc.rect(40, 125, 3, 3, "F");

    // Message de fin
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "normal");
    doc.text("Scan obligatoire au portillon d'accès", 40, 142, { align: "center" });

    // Sauvegarde
    doc.save(`Ticket_ZMC_${ticketNumber}.pdf`);
  };

  const totalPrice = selectedTrip.price * searchData.passengers;

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-[28px] font-bold text-foreground mb-2">Réservation confirmée !</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-border">
            <div className="bg-gradient-to-r from-primary to-accent text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <img src={logoImage} alt="Logo" className="h-12 object-contain "/>
                <div className="text-right">
                  <div className="text-[12px] text-white/80">Numéro</div>
                  <div className="text-[16px] font-bold">{ticketNumber}</div>
                </div>
              </div>
              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm text-center font-bold">
                {searchData.departure} → {searchData.arrival}
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-[12px] text-muted-foreground">Départ</div>
                  <div className="text-[18px] font-bold">{selectedTrip.departureTime}</div>
                </div>
                <div>
                  <div className="text-[12px] text-muted-foreground">Ligne</div>
                  <div className="text-[18px] font-bold text-primary">{selectedTrip.line}</div>
                </div>
              </div>

              <div className="flex justify-center py-4">
                <div className="w-40 h-40 bg-muted rounded-xl flex items-center justify-center border-2 border-dashed border-border">
                  <QrCode className="w-16 h-16 text-muted-foreground" />
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={downloadTicketPDF} variant="outline" className="flex-1 h-12 rounded-xl border-2">
                  <Download className="w-4 h-4 mr-2" /> Télécharger PDF
                </Button>
                <Button onClick={() => window.location.reload()} className="flex-1 h-12 bg-primary hover:bg-primary/90 rounded-xl text-white font-bold">
                  Nouvelle réservation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <img src={logoImage} alt="Logo" className="h-10 object-contain" />
          <h1 className="text-[20px] font-bold">Paiement sécurisé</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl shadow-md border border-border p-6">
              <h2 className="text-[20px] font-bold mb-6">Mode de paiement</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button type="button" onClick={() => setPaymentMethod("card")} className={`p-4 border-2 rounded-xl ${paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <CreditCard className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === "card" ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="text-[14px] font-semibold">Carte Bancaire</div>
                </button>
                <button type="button" onClick={() => setPaymentMethod("paypal")} className={`p-4 border-2 rounded-xl ${paymentMethod === "paypal" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <div className="text-[20px] font-bold mb-2">PP</div>
                  <div className="text-[14px] font-semibold">PayPal</div>
                </button>
              </div>

              <form onSubmit={handlePayment} className="space-y-4">
                <div className="space-y-2">
                  <Label>Numéro de carte</Label>
                  <Input type="text" placeholder="1234 5678 9012 3456" className="h-12 border-2 rounded-xl" required />
                </div>
                <Button type="submit" disabled={isProcessing} className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold shadow-lg">
                  {isProcessing ? "Traitement..." : `Payer & Réserver • ${totalPrice} DH`}
                </Button>
              </form>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-md border border-border p-6 sticky top-24">
              <h2 className="text-[18px] font-bold mb-4">Résumé</h2>
              <div className="space-y-4 border-b pb-4 text-[14px]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary mt-1" />
                  <div className="font-semibold">{searchData.departure} → {searchData.arrival}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-primary" />
                  <div>{selectedTrip.departureTime} ({searchData.date})</div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-primary" />
                  <div>{searchData.passengers} passager(s)</div>
                </div>
              </div>
              <div className="pt-4 flex justify-between text-[18px] font-bold">
                <span>Total</span>
                <span className="text-primary">{totalPrice} DH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}