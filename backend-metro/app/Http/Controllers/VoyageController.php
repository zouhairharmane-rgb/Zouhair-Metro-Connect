<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class VoyageController extends Controller
{
    // 1. Fonction pour LIRE les voyages (Celle qu'on a déjà faite)
    public function index(): JsonResponse
    {
        $voyages = DB::table('VOYAGE')
            ->join('METRO', 'VOYAGE.id_metro', '=', 'METRO.id_metro')
            ->join('STATION as dep', 'VOYAGE.id_station_depart', '=', 'dep.id_station')
            ->join('STATION as arr', 'VOYAGE.id_station_arrivee', '=', 'arr.id_station')
            ->select(
                'VOYAGE.id_voyage as id',
                'METRO.numero_metro as line',
                'dep.nom_station as departure',
                'arr.nom_station as arrival',
                'VOYAGE.heure_depart as departureTime',
                'VOYAGE.heure_arrivee as arrivalTime',
                'VOYAGE.date_voyage as date',
                'METRO.capacite_max as maxSeats'
            )
            ->get();

        foreach ($voyages as $voyage) {
            $voyage->bookedSeats = rand(0, $voyage->maxSeats); // Faux calcul temporaire
            $voyage->status = 'active';
        }

        return response()->json($voyages);
    }

    // 2. NOUVELLE Fonction pour SAUVEGARDER un voyage
    public function store(Request $request): JsonResponse
    {
        $donnees = $request->all();

        // Étape A : Trouver ou créer la station de DÉPART
        $stationDepart = DB::table('STATION')->where('nom_station', $donnees['departure'])->first();
        if (!$stationDepart) {
            $idDepart = DB::table('STATION')->insertGetId(['nom_station' => $donnees['departure']]);
        } else {
            $idDepart = $stationDepart->id_station;
        }

        // Étape B : Trouver ou créer la station d'ARRIVÉE
        $stationArrivee = DB::table('STATION')->where('nom_station', $donnees['arrival'])->first();
        if (!$stationArrivee) {
            $idArrivee = DB::table('STATION')->insertGetId(['nom_station' => $donnees['arrival']]);
        } else {
            $idArrivee = $stationArrivee->id_station;
        }

        // Étape C : Trouver ou créer le MÉTRO
        $metro = DB::table('METRO')->where('numero_metro', $donnees['line'])->first();
        if (!$metro) {
            $idMetro = DB::table('METRO')->insertGetId([
                'numero_metro' => $donnees['line'],
                'capacite_max' => $donnees['maxSeats']
            ]);
        } else {
            $idMetro = $metro->id_metro;
        }

        // Étape D : Enfin, on enregistre le VOYAGE avec les bons IDs !
        $idVoyage = DB::table('VOYAGE')->insertGetId([
            'date_voyage' => $donnees['date'],
            'heure_depart' => $donnees['departureTime'],
            'heure_arrivee' => $donnees['arrivalTime'],
            'id_metro' => $idMetro,
            'id_station_depart' => $idDepart,
            'id_station_arrivee' => $idArrivee,
        ]);

        return response()->json([
            'message' => 'Voyage créé avec succès dans MySQL !',
            'id_voyage' => $idVoyage
        ]);
    }
    // 3. Fonction pour SUPPRIMER un voyageur
    public function destroy($id): JsonResponse
    {
        // On cherche le voyageur par son ID et on le supprime de MySQL
        $supprime = DB::table('utilisateur')->where('id_utilisateur', $id)->delete();

        if ($supprime) {
            return response()->json(['message' => 'Voyageur supprimé avec succès de la base de données.']);
        } else {
            // Code 404 si l'ID n'existe pas
            return response()->json(['message' => 'Voyageur introuvable.'], 404);
        }
    }
    public function search(Request $request): JsonResponse
{
    $departure = $request->query('departure');
    $arrival = $request->query('arrival');
    $date = $request->query('date');

    $voyages = DB::table('voyage')
        ->join('metro', 'voyage.id_metro', '=', 'metro.id_metro')
        ->join('station as dep', 'voyage.id_station_depart', '=', 'dep.id_station')
        ->join('station as arr', 'voyage.id_station_arrivee', '=', 'arr.id_station')
        ->where('dep.nom_station', $departure)
        ->where('arr.nom_station', $arrival)
        ->where('voyage.date_voyage', $date)
        ->select(
            'voyage.id_voyage as id',
            'metro.numero_metro as line',
            'voyage.heure_depart as departureTime',
            'voyage.heure_arrivee as arrivalTime',
            'metro.capacite_max as maxSeats'
        )
        ->get();

    foreach ($voyages as $v) {
        // On calcule les places RÉELLEMENT occupées dans la table RESERVATION
        $occupées = DB::table('reservation')->where('id_voyage', $v->id)->count();
        $v->availableSeats = $v->maxSeats - $occupées;
        $v->duration = "25 min"; // Ou calcul entre heure_dep et heure_arr
        $v->price = 15;
    }

    return response()->json($voyages);
}
}