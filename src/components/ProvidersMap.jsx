
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import ReservationModal from "./ReservationModal";
import { apiClient } from "../utils/apiClient";



const ProvidersMap = ({ providers }) => {
  const defaultPosition = [9.6412, -13.5784];
  const { user } = useContext(UserContext);
  const [showReservation, setShowReservation] = useState(false);
  const [selectedPrestataire, setSelectedPrestataire] = useState(null);
  const [reservedPrestataires, setReservedPrestataires] = useState([]);

  useEffect(() => {
    // Charger toutes les réservations (pour tous les clients)
    const fetchReservations = async () => {
      try {
        const data = await apiClient("/api/reservations/all", { method: "GET", auth: true });
        // Extraire les IDs des prestataires réservés avec statut 'Validée'
        const ids = data
          .filter(r => r.status === "Validée")
          .map(r => r.prestataire?._id || r.prestataire)
          .filter(Boolean);
        setReservedPrestataires(ids);
      } catch {
        setReservedPrestataires([]);
      }
    };
    fetchReservations();
  }, []);

  const handleOpenReservation = (prestataire) => {
    setSelectedPrestataire(prestataire);
    setShowReservation(true);
  };

  const handleReserve = async (reservationData) => {
    await apiClient("/api/reservations", {
      method: "POST",
      body: {
        ...reservationData,
        prestataireId: selectedPrestataire._id,
      },
      auth: true,
    });
    setShowReservation(false);
  };

  // Icônes personnalisés
  const reservedIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });
  const defaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });

  return (
    <>
      <MapContainer center={defaultPosition} zoom={12} style={{ height: "400px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {(providers || []).map(p => (
          p.latitude && p.longitude && (
            <Marker
              key={p._id || p.id}
              position={[p.latitude, p.longitude]}
              icon={reservedPrestataires.includes(p._id || p.id) ? reservedIcon : defaultIcon}
            >
              <Popup>
                <div style={{ minWidth: 180 }}>
                  {p.photo && (
                    <img
                      src={p.photo.startsWith('http') ? p.photo : `http://localhost:5000${p.photo}`}
                      alt={p.nom || 'Photo prestataire'}
                      style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: '50%', marginBottom: 8, border: '2px solid #2563eb' }}
                    />
                  )}
                  <strong>{p.nom} {p.prenom}</strong><br />
                  {p.category && <span>{p.category}</span>}<br />
                  {p.commune && <span>{p.commune}</span>}<br />
                  {reservedPrestataires.includes(p._id || p.id) && (
                    <span style={{ color: "#d00", fontWeight: 600 }}>Déjà réservé</span>
                  )}
                  {user && user.role === "client" && !reservedPrestataires.includes(p._id || p.id) && (
                    <button
                      className="btn btn-primary btn-sm mt-2"
                      onClick={() => handleOpenReservation(p)}
                    >
                      Réserver ce prestataire
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
      <ReservationModal
        show={showReservation}
        onHide={() => setShowReservation(false)}
        prestataire={selectedPrestataire}
        onReserve={handleReserve}
      />
    </>
  );
};
export default ProvidersMap;
