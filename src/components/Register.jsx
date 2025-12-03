import React, { useState, useContext, } from "react";
import { UserContext } from "../contexts/UserContext";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "./Header";
import { Link } from "react-router-dom";
// import Footer from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";

function Register() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("client");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState(null);
  const [latitude, setLatitude] = useState(9.6412);
  const [longitude, setLongitude] = useState(-13.5784);
  const [telephone, setTelephone] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const categories = [
    "Plombier",
    "Menuisier",
    "Couturier",
    "Electricien",
    "Déménageur",
    "Chauffeur de Taxi",
    "Peintre",
    "Coiffeuse",
    "Coiffeur",
    "Jardinier",
    "Informaticien",
    "Mécanicien",
    "Maçon",
    "Serrurier",
    "Nettoyeur",
    "Photographe",
    "Professeur particulier",
    "Réparateur électroménager",
    "Vétérinaire",
    "Autre"
  ];

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("❌ Les mots de passe ne correspondent pas.");
      return;
    }
    if (role === "prestataire" && !category) {
      setMessage("❌ Veuillez choisir une catégorie de métier.");
      return;
    }
    if (role === "prestataire" && !photo) {
      setMessage("❌ Veuillez ajouter une photo de profil.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("nom", nom);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);
      formData.append("category", category);
  if (photo) formData.append("photo", photo);
  formData.append("latitude", latitude);
  formData.append("longitude", longitude);
  formData.append("telephone", telephone);

      const res = await fetch(`http://localhost:5000/api/auth/register`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Inscription réussie !");
        // Récupérer les infos utilisateur pour connexion auto
        fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${data.token}` },
        })
          .then((res) => res.json())
          .then((userData) => {
            setUser(userData);
            if (userData.role === "prestataire") {
              navigate("/dashboard");
            } else {
              navigate("/");
            }
          });
        localStorage.setItem("token", data.token);
      } else {
        setMessage(`❌ ${data.msg}`);
      }
    } catch (err) {
      setMessage("❌ Erreur de connexion au serveur");
    }
  };

  return (
    <>
      <Header />
  <div className="container my-5" style={{ marginTop: 80 }}>
      <div className="row justify-content-center">
        <motion.div
          className="col-lg-7 col-md-9"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-4 p-md-5">
              <motion.h2
                className="text-center mb-4 fw-bold text-primary"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Créer un compte
              </motion.h2>

              {message && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`alert ${
                    message.includes("✅")
                      ? "alert-success"
                      : "alert-danger"
                  } text-center`}
                >
                  {message}
                </motion.div>
              )}

              <form onSubmit={handleRegister} encType="multipart/form-data">
                {/* Nom */}
                <div className="mb-3">
                  <label className="form-label">Nom complet</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Votre nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                  />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">Adresse email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="exemple@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Mot de passe</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Créer un mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Confirmer</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Confirmer le mot de passe"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Rôle */}
                <div className="mb-3">
                  <label className="form-label">Rôle</label>
                  <select
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="client">Client</option>
                    <option value="prestataire">Prestataire</option>
                  </select>
                </div>

                {/* Catégorie */}
                {role === "prestataire" && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Catégorie</label>
                      <select
                        className="form-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      >
                        <option value="">Choisir une catégorie</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Téléphone */}
                    <div className="mb-3">
                      <label className="form-label">Téléphone</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Numéro de téléphone"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        required
                      />
                    </div>
                    {/* Photo */}
                    <div className="mb-3">
                      <label className="form-label">Photo de profil</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setPhoto(e.target.files[0])}
                        required
                      />
                    </div>

                    {/* Carte */}
                    <motion.div
                      className="card border-primary mb-3 shadow-sm"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="card-body">
                        <h6 className="card-title text-primary mb-2">
                          📍 Choisissez votre position
                        </h6>
                        <p className="text-muted small mb-3">
                          Cliquez sur la carte pour indiquer votre localité
                          exacte. <strong>Astuce :</strong> Zoomez pour plus de
                          précision.
                        </p>
                        <MapContainer
                          center={[latitude, longitude]}
                          zoom={12}
                          style={{
                            height: "260px",
                            width: "100%",
                            borderRadius: "12px",
                            overflow: "hidden"
                          }}
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <LocationMarker
                            setLatitude={setLatitude}
                            setLongitude={setLongitude}
                          />
                          <Marker position={[latitude, longitude]}></Marker>
                        </MapContainer>
                        <div className="mt-2 text-primary fw-bold small">
                          Latitude : {latitude.toFixed(4)} | Longitude :{" "}
                          {longitude.toFixed(4)}
                        </div>
                      </div>
                    </motion.div>
                    {/* <Footer /> */}
                  </>
                )}

                {/* Conditions d'utilisation */}
                <div className="form-check mt-3 mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="termsCheck"
                    checked={acceptedTerms}
                    onChange={e => setAcceptedTerms(e.target.checked)}
                    required
                  />
                  <label className="form-check-label" htmlFor="termsCheck">
                    J'accepte les <Link to="/terms" target="_blank">conditions d'utilisation</Link> de LocalGN
                  </label>
                </div>

                {/* Bouton */}
                <motion.div
                  className="d-grid mt-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button type="submit" className="btn btn-primary btn-lg">
                    S'inscrire
                  </button>
                </motion.div>
              </form>

              <p className="text-center mt-3">
                Déjà inscrit ?{" "}
                <span
                  className="text-primary fw-bold"
                  role="button"
                  onClick={() => navigate("/login")}
                >
                  Connectez-vous
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
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

export default Register;
