<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class VoyageurController extends Controller
{
    // 1. Fonction pour enregistrer une réservation
    public function book(Request $request): JsonResponse
    {
        try {
            $rawId = $request->input('tripId');
            $id_voyage = (int) filter_var($rawId, FILTER_SANITIZE_NUMBER_INT);
            if ($id_voyage <= 0) $id_voyage = 1;

            $id_res = DB::table('reservation')->insertGetId([
                'date_creation'  => now(),
                'nombre_places'  => $request->input('passengers') ?? 1,
                'statut'         => 'en_attente',
                'id_utilisateur' => 2,
                'id_voyage'      => $id_voyage,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Réservation enregistrée avec succès !',
                'id' => $id_res
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur SQL : ' . $e->getMessage()
            ], 500);
        }
    }

    // 2. Fonction pour récupérer les stations
    public function getStations(): JsonResponse {
        $stations = DB::table('station')->pluck('nom_station');
        return response()->json($stations);
    }

    // 3. Liste des voyageurs pour l'admin
    public function index(): JsonResponse {
        $voyageurs = DB::table('utilisateur')->where('role', 'voyageur')->get();
        return response()->json($voyageurs->map(fn($v) => [
            'id' => (string)$v->id_utilisateur,
            'name' => $v->prenom . ' ' . $v->nom,
            'email' => $v->email,
            'phone' => '+212 6 XX XX XX XX', // Si tu as une vraie colonne tel, mets $v->telephone
            'registeredDate' => '2026-03-09',
            'totalTrips' => 0
        ]));
    }

    // 4. CRÉER un nouveau voyageur (LA FONCTION QUI MANQUAIT)
    public function store(Request $request): JsonResponse
    {
        try {
            // On sépare "Nom complet" en Prénom et Nom
            $nomComplet = $request->input('name') ?? 'Nouveau Voyageur';
            $parts = explode(' ', $nomComplet, 2);
            $prenom = $parts[0];
            $nom = $parts[1] ?? '';

            // Insertion dans la DB
            $id = DB::table('utilisateur')->insertGetId([
                'prenom' => $prenom,
                'nom' => $nom,
                'email' => $request->input('email'),
                'role' => 'voyageur',
                'mot_de_passe' => bcrypt('123456'), // Mot de passe par défaut
                // 'telephone' => $request->input('phone'), // Décommente si la colonne existe dans phpMyAdmin
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Voyageur créé avec succès !',
                'id' => $id
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur SQL : ' . $e->getMessage()
            ], 500);
        }
    }

    // 5. SUPPRIMER un voyageur (Pour la route DELETE dans ton api.php)
    public function destroy($id): JsonResponse
    {
        try {
            DB::table('utilisateur')->where('id_utilisateur', $id)->delete();
            return response()->json(['success' => true, 'message' => 'Voyageur supprimé avec succès']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur SQL : ' . $e->getMessage()], 500);
        }
    }
    // Fonction pour récupérer l'activité récente
    public function getRecentActivities(): JsonResponse
    {
        try {
            // On récupère les 4 dernières réservations avec le nom de l'utilisateur
            $activities = DB::table('reservation')
                ->join('utilisateur', 'reservation.id_utilisateur', '=', 'utilisateur.id_utilisateur')
                ->orderBy('reservation.date_creation', 'desc')
                ->limit(4)
                ->get()
                ->map(function ($res) {
                    return [
                        'action' => 'Nouvelle réservation',
                        'user' => $res->prenom . ' ' . $res->nom,
                        // On formate un peu la date pour que ce soit propre
                        'time' => date('d/m/Y H:i', strtotime($res->date_creation)),
                        'color' => 'bg-emerald-500' // Couleur de la puce
                    ];
                });

            return response()->json($activities);
        } catch (\Exception $e) {
            return response()->json([], 500); // Retourne un tableau vide en cas d'erreur
        }
    }

    // Fonction pour récupérer les statistiques du tableau de bord
    public function getDashboardStats(): JsonResponse
    {
        try {
            // 1. Nombre de voyageurs
            $voyageursCount = DB::table('utilisateur')->where('role', 'voyageur')->count();

            // 2. Nombre de voyages total (ou programmés aujourd'hui)
            $voyagesCount = DB::table('voyage')->count();

            // 3. Nombre total de réservations
            $reservationsCount = DB::table('reservation')->count();

            // 4. Taux d'occupation (Calcul simulé : ex. 50 places max par voyage)
            $placesReservees = DB::table('reservation')->sum('nombre_places');
            $placesTotales = $voyagesCount > 0 ? $voyagesCount * 50 : 1;
            $tauxOccupation = min(100, round(($placesReservees / $placesTotales) * 100));

            return response()->json([
                'voyageurs' => $voyageursCount,
                'voyages' => $voyagesCount,
                'reservations' => $reservationsCount,
                'taux_occupation' => $tauxOccupation . '%'
            ]);

        } catch (\Exception $e) {
            // En cas d'erreur, on renvoie des zéros pour ne pas bloquer l'affichage
            return response()->json([
                'voyageurs' => 0,
                'voyages' => 0,
                'reservations' => 0,
                'taux_occupation' => '0%'
            ]);
        }
    }
}