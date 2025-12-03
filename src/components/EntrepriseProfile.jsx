import React, { useContext, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { UserContext } from "../contexts/UserContext";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

const categories = [
  "Plombier",
  "Menuisier",
  "Couturier",
  "Electricien",
  "Déménageur",
  "Taxi",
  "Peintre",
  "Coiffeuse"
];

function EntrepriseProfile() {
  const { user, setUser } = useContext(UserContext);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    companyName: user?.companyName || "",
    companyDescription: user?.companyDescription || "",
    companyDomains: user?.companyDomains || [],
    companyLogo: user?.companyLogo || "",
    telephone: user?.telephone || "",
    latitude: user?.latitude || 9.6412,
    longitude: user?.longitude || -13.5784,
    email: user?.email || ""
  });
  const [message, setMessage] = useState("");

  if (!user || user.role !== "entreprise") {
    return (
      <>
        <Header />
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="alert alert-warning">Vous devez être connecté en tant qu'entreprise pour accéder à ce profil.</div>
        </div>
        <Footer />
      </>
    );
  }

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (name === "companyDomains") {
      setForm((prev) => ({ ...prev, companyDomains: Array.from(e.target.selectedOptions, opt => opt.value) }));
    } else if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMap = (lat, lng) => {
    setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "companyDomains") {
        formData.append(key, JSON.stringify(value));
      } else if (value) {
        formData.append(key, value);
      }
    });
    try {
      const res = await fetch("http://localhost:5000/api/auth/update-profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setMessage("✅ Profil entreprise mis à jour !");
        setEditMode(false);
      } else {
        setMessage("❌ " + (data.msg || "Erreur lors de la mise à jour."));
      }
    } catch {
      setMessage("❌ Erreur serveur");
    }
  };

  return (
    <>
      <Header />
      <div className="container" style={{ maxWidth: 700, margin: "100px auto 40px", background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px #2563eb22", padding: 32 }}>
        <h2 className="mb-4 fw-bold text-primary">Profil Entreprise</h2>
        <div className="d-flex align-items-center mb-4">
          <img
            src={form.companyLogo ? (typeof form.companyLogo === "string" ? (form.companyLogo.startsWith("http") ? form.companyLogo : `http://localhost:5000${form.companyLogo}`) : URL.createObjectURL(form.companyLogo)) : "/logo192.png"}
            alt="Logo entreprise"
            style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", border: "2px solid #2563eb" }}
          />
          {!editMode && (
            <button className="btn btn-outline-primary ms-4" onClick={() => setEditMode(true)}>
              Modifier
            </button>
          )}
        </div>
        {editMode ? (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-3">
              <label className="form-label">Logo de l'entreprise</label>
              <input type="file" name="companyLogo" className="form-control" accept="image/*" onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Nom de l'entreprise</label>
              <input type="text" name="companyName" className="form-control" value={form.companyName} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea name="companyDescription" className="form-control" value={form.companyDescription} onChange={handleChange} rows={3} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Domaines d'activité</label>
              <select name="companyDomains" className="form-select" multiple value={form.companyDomains} onChange={handleChange} required>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="form-text">Maintenez Ctrl (Windows) ou Cmd (Mac) pour sélectionner plusieurs domaines.</div>
            </div>
            <div className="mb-3">
              <label className="form-label">Téléphone</label>
              <input type="tel" name="telephone" className="form-control" value={form.telephone} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Localisation</label>
              <MapContainer center={[form.latitude, form.longitude]} zoom={12} style={{ height: "220px", width: "100%", borderRadius: "12px", overflow: "hidden" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker setLatitude={lat => handleMap(lat, form.longitude)} setLongitude={lng => handleMap(form.latitude, lng)} />
                <Marker position={[form.latitude, form.longitude]}></Marker>
              </MapContainer>
              <div className="mt-2 text-primary fw-bold small">
                Latitude : {form.latitude.toFixed(4)} | Longitude : {form.longitude.toFixed(4)}
              </div>
            </div>
            <button type="submit" className="btn btn-primary me-2">Enregistrer</button>
            <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>Annuler</button>
          </form>
        ) : (
          <div>
            <div className="mb-2"><strong>Nom :</strong> {form.companyName}</div>
            <div className="mb-2"><strong>Description :</strong> {form.companyDescription}</div>
            <div className="mb-2"><strong>Domaines :</strong> {Array.isArray(form.companyDomains) ? form.companyDomains.join(", ") : form.companyDomains}</div>
            <div className="mb-2"><strong>Email :</strong> {form.email}</div>
            <div className="mb-2"><strong>Téléphone :</strong> {form.telephone}</div>
            <div className="mb-2"><strong>Localisation :</strong> Lat {form.latitude} / Lng {form.longitude}</div>
          </div>
        )}
        {message && <div className={`alert mt-3 ${message.includes("✅") ? "alert-success" : "alert-danger"}`}>{message}</div>}
      </div>
      <Footer />
    </>
  );
}

// Gestion du clic sur la carte
function LocationMarker({ setLatitude, setLongitude }) {
  useMapEvents({
    click(e) {
      setLatitude(e.latlng.lat);
      setLongitude(e.latlng.lng);
    }
  });
  return null;
}

export default EntrepriseProfile;
