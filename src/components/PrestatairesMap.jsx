import React, { useEffect, useRef } from "react";

const PrestatairesMap = ({ prestataires }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Initialisation de la carte Google Maps
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 9.6412, lng: -13.5784 }, // Conakry par défaut
      zoom: 12,
    });

    // Ajout des marqueurs pour chaque prestataire en ligne
    prestataires.forEach((prestataire) => {
      if (prestataire.enLigne) {
        new window.google.maps.Marker({
          position: { lat: prestataire.lat, lng: prestataire.lng },
          map,
          title: prestataire.nom,
        });
      }
    });
  }, [prestataires]);

  return <div ref={mapRef} style={{ width: "100%", height: "500px" }} />;
};

export default PrestatairesMap;
