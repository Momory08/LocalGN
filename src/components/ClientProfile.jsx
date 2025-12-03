import React, { useContext, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { UserContext } from "../contexts/UserContext";

function ClientProfile() {
  const { user, setUser } = useContext(UserContext);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    email: user?.email || "",
    telephone: user?.telephone || "",
    photo: user?.photo || "",
  });
  const [message, setMessage] = useState("");

  if (!user || user.role !== "client") {
    return (
      <>
        <Header />
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="alert alert-warning">Vous devez être connecté en tant que client pour accéder à votre profil.</div>
        </div>
        <Footer />
      </>
    );
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
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
        setMessage("✅ Profil mis à jour !");
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
      <div className="container" style={{ maxWidth: 600, margin: "100px auto 40px", background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px #2563eb22", padding: 32 }}>
        <h2 className="mb-4 fw-bold text-primary">Mon profil</h2>
        <div className="d-flex align-items-center mb-4">
          <img
            src={form.photo ? (typeof form.photo === "string" ? (form.photo.startsWith("http") ? form.photo : `http://localhost:5000${form.photo}`) : URL.createObjectURL(form.photo)) : "/logo192.png"}
            alt="Profil"
            style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "2px solid #2563eb" }}
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
              <label className="form-label">Photo de profil</label>
              <input type="file" name="photo" className="form-control" accept="image/*" onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Nom</label>
              <input type="text" name="nom" className="form-control" value={form.nom} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Prénom</label>
              <input type="text" name="prenom" className="form-control" value={form.prenom} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Téléphone</label>
              <input type="tel" name="telephone" className="form-control" value={form.telephone} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-primary me-2">Enregistrer</button>
            <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>Annuler</button>
          </form>
        ) : (
          <div>
            <div className="mb-2"><strong>Nom :</strong> {user.nom}</div>
            <div className="mb-2"><strong>Prénom :</strong> {user.prenom}</div>
            <div className="mb-2"><strong>Email :</strong> {user.email}</div>
            <div className="mb-2"><strong>Téléphone :</strong> {user.telephone || <span className="text-muted">Non renseigné</span>}</div>
          </div>
        )}
        {message && <div className={`alert mt-3 ${message.includes("✅") ? "alert-success" : "alert-danger"}`}>{message}</div>}
      </div>
      <Footer />
    </>
  );
}

export default ClientProfile;
