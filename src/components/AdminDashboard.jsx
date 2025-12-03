
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { Container, Button, Spinner, Alert, Badge, Card, Row, Col, Image } from "react-bootstrap";
import AdminMessages from "./AdminMessages";
import { BsPersonCircle, BsEnvelope, BsBoxArrowRight, BsBarChartFill, BsCheckCircleFill, BsClockHistory } from "react-icons/bs";

// Fonction utilitaire pour afficher le statut d'abonnement d'un prestataire
function getSubscriptionStatus(prestataire) {
  if (prestataire.isSubscribed && prestataire.subscriptionStart && prestataire.subscriptionEnd) {
    return {
      status: "active",
      start: new Date(prestataire.subscriptionStart).toLocaleDateString(),
      end: new Date(prestataire.subscriptionEnd).toLocaleDateString(),
    };
  }
  const dateStr = prestataire.dateInscription || prestataire.createdAt;
  if (!dateStr) return { status: "expired" };
  const created = new Date(dateStr);
  const now = new Date();
  const diffMs = now - created;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const endTrial = new Date(created);
  endTrial.setDate(created.getDate() + 31);
  if (diffDays < 31) {
    return {
      status: "trial",
      daysLeft: 31 - diffDays,
      endDate: endTrial.toLocaleDateString(),
    };
  }
  return { status: "expired", endDate: endTrial.toLocaleDateString() };
}

const AdminDashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const [prestataires, setPrestataires] = useState([]);
  const [searchNom, setSearchNom] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  // Extraire toutes les catégories uniques des prestataires pour le filtre
  const categories = Array.from(new Set(prestataires.map(p => p.category).filter(Boolean)));
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (user && user.role === "admin") {
      fetch("/api/auth/all-prestataires", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json().then(data => ({ status: res.status, data })))
        .then(({ status, data }) => {
          if (status === 200 && Array.isArray(data)) {
            setPrestataires(data);
            setFetchError("");
          } else {
            setPrestataires([]);
            setFetchError(data.msg || "Erreur lors du chargement des prestataires.");
          }
          setLoading(false);
        })
        .catch(() => {
          setPrestataires([]);
          setFetchError("Erreur réseau ou serveur.");
          setLoading(false);
        });
    }
  }, [user]);

  const handleValidate = async (id) => {
    setMessage("");
    try {
      const res = await fetch(`/api/auth/validate/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (res.ok) {
        setPrestataires((prev) => prev.map((p) => (p._id === id ? { ...p, isValidated: true } : p)));
        setMessage("✅ Prestataire validé !");
      } else {
        setMessage(`❌ Erreur : ${data.msg || "Erreur lors de la validation"}`);
      }
    } catch (e) {
      setMessage(`❌ Erreur réseau lors de la validation : ${e.message}`);
    }
  };

  const handleDelete = async (id) => {
    setMessage("");
    if (!window.confirm("Voulez-vous vraiment supprimer ce prestataire ?")) return;
    try {
      const res = await fetch(`/api/auth/delete-prestataire/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (res.ok) {
        setPrestataires((prev) => prev.filter((p) => p._id !== id));
        setMessage("✅ Prestataire supprimé !");
      } else {
        setMessage(data.msg || "Erreur lors de la suppression");
      }
    } catch {
      setMessage("Erreur réseau lors de la suppression");
    }
  };

  const navigate = useNavigate();
  if (!user || user.role !== "admin") {
    return <Alert variant="danger" className="mt-5 text-center">Accès réservé à l'administrateur.<br/>Rôle actuel : <b>{user ? user.role : "aucun"}</b></Alert>;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  // Gestion réelle de l'abonnement
  const handleSubscription = async (id, activate) => {
    setMessage("");
    try {
      const res = await fetch(`/api/auth/subscription/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ isSubscribed: activate, durationDays: 31 }),
      });
      const data = await res.json();
      if (res.ok) {
        setPrestataires((prev) => prev.map((p) => (p._id === id ? data.user : p)));
        setMessage(data.msg || (activate ? "Abonnement activé" : "Abonnement désactivé"));
      } else {
        setMessage(data.msg || "Erreur lors de la gestion de l'abonnement");
      }
    } catch {
      setMessage("Erreur réseau lors de la gestion de l'abonnement");
    }
  };


  return (

    <Container fluid className="py-4 px-2 px-md-5" style={{ background: 'linear-gradient(120deg, #f8fafc 60%, #e0e7ff 100%)', minHeight: '100vh' }}>
      {/* Header moderne avec statistiques */}
      <Card className="shadow-lg border-0 mb-4" style={{ borderRadius: 22, background: 'linear-gradient(90deg, #2563eb 0%, #0ea5e9 100%)', color: '#fff' }}>
        <Card.Body className="d-flex flex-column flex-md-row align-items-center justify-content-between p-4">
          <div className="d-flex align-items-center gap-3">
            <Image src={user.photo ? (user.photo.startsWith("http") ? user.photo : `http://localhost:5000${user.photo}`) : "/admin.jpeg"} alt="Profil" roundedCircle style={{ width: 80, height: 80, objectFit: "cover", border: "3px solid #fff", boxShadow: "0 2px 12px #2563eb22" }} />
            <div>
              <h3 className="fw-bold mb-1" style={{ letterSpacing: 1 }}> {user.nom || user.email}</h3>
              <div className="mb-1"><Badge bg="light" text="dark" className="me-2"><BsPersonCircle style={{marginBottom:2}}/> {user.role}</Badge></div>
              <div style={{ fontSize: 15, opacity: 0.95 }}><BsEnvelope style={{marginBottom:2}}/> {user.email}</div>
              {/* Statistiques prestataires déplacées ici */}
              <div className="d-flex gap-3 mt-3">
                <Card className="text-center border-0 shadow-sm" style={{ borderRadius: 18, minWidth: 120 }}>
                  <Card.Body>
                    <div style={{ fontSize: 24, color: '#2563eb', fontWeight: 700 }}><BsBarChartFill style={{marginBottom:4, marginRight:6}}/>{prestataires.length}</div>
                    <div style={{ fontSize: 14 }}>Total</div>
                  </Card.Body>
                </Card>
                <Card className="text-center border-0 shadow-sm" style={{ borderRadius: 18, minWidth: 120 }}>
                  <Card.Body>
                    <div style={{ fontSize: 24, color: '#22c55e', fontWeight: 700 }}><BsCheckCircleFill style={{marginBottom:4, marginRight:6}}/>{prestataires.filter(p => p.isValidated).length}</div>
                    <div style={{ fontSize: 14 }}>Validés</div>
                  </Card.Body>
                </Card>
                <Card className="text-center border-0 shadow-sm" style={{ borderRadius: 18, minWidth: 120 }}>
                  <Card.Body>
                    <div style={{ fontSize: 24, color: '#fbbf24', fontWeight: 700 }}><BsClockHistory style={{marginBottom:4, marginRight:6}}/>{prestataires.filter(p => !p.isValidated).length}</div>
                    <div style={{ fontSize: 14 }}>En attente</div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
            <Button variant="outline-light" className="fw-bold" style={{ fontSize: 18, borderRadius: 18, padding: '10px 24px' }} onClick={handleLogout} title="Déconnexion">
              <BsBoxArrowRight style={{marginBottom:3, marginRight:6}}/> Déconnexion
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Section messagerie prestataires améliorée */}
      <div className="mb-4" style={{animation: 'fadeInUp 0.7s', marginTop: 16}}>
        <AdminMessages />
      </div>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {message && <Alert variant={message.startsWith("✅") ? "success" : "danger"}>{message}</Alert>}
      {fetchError && <Alert variant="danger" className="mb-3">{fetchError}</Alert>}

      {/* Barre de recherche et filtre métier */}
      <div className="d-flex flex-column flex-md-row align-items-md-end gap-3 mb-4" style={{maxWidth:600}}>
        <div className="flex-fill">
          <label htmlFor="search-nom" className="form-label fw-bold">Rechercher par nom</label>
          <input
            id="search-nom"
            type="text"
            className="form-control"
            placeholder="Nom du prestataire..."
            value={searchNom}
            onChange={e => setSearchNom(e.target.value)}
            style={{borderRadius:14, fontSize:16}}
          />
        </div>
        <div style={{minWidth:200}}>
          <label htmlFor="filter-category" className="form-label fw-bold">Filtrer par métier</label>
          <select
            id="filter-category"
            className="form-select"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            style={{borderRadius:14, fontSize:16}}
          >
            <option value="">Tous les métiers</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: 200 }}>
          <Spinner animation="border" />
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {prestataires
            .filter(p =>
              (!searchNom || (p.nom && p.nom.toLowerCase().includes(searchNom.toLowerCase()))) &&
              (!filterCategory || p.category === filterCategory)
            )
            .map((p) => (
            <Col key={p._id}>
              <Card className="h-100 border-0 glass-card" style={{ borderRadius: 24, background: 'rgba(255,255,255,0.7)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)', backdropFilter: 'blur(8px)', transition: 'box-shadow 0.2s', position: 'relative', overflow: 'hidden' }}>
                <Card.Body className="d-flex flex-column align-items-center justify-content-between p-4">
                  <div className="mb-3 w-100 text-center">
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#f8fafc 60%,#ffe0e0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', border: '4px solid #0ea5e9', boxShadow: '0 2px 12px #2563eb22', overflow: 'hidden' }}>
                      <img src={p.photo ? (p.photo.startsWith('http') ? p.photo : `http://localhost:5000${p.photo}`) : '/logo192.png'} alt={p.nom} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: '50%' }} />
                    </div>
                    <div className="fw-bold" style={{ fontSize: 22, color: '#0ea5e9', letterSpacing: 1 }}>{p.nom}</div>
                    <div className="text-muted" style={{ fontSize: 15 }}>{p.email}</div>
                  </div>
                  <div className="mb-2 w-100 text-center">
                    <Badge bg="info" text="dark" style={{ fontSize: 15, marginRight: 8, borderRadius: 12 }}>{p.category || 'Non renseigné'}</Badge>
                    {p.isValidated ? (
                      <Badge bg="success" style={{ fontSize: 15, borderRadius: 12 }}>Validé</Badge>
                    ) : (
                      <Badge bg="warning" text="dark" style={{ fontSize: 15, borderRadius: 12 }}>En attente</Badge>
                    )}
                  </div>
                  {/* Statut d'abonnement */}
                  <div className="mb-2 w-100 text-center">
                    {(() => {
                      const sub = getSubscriptionStatus(p);
                      if (sub.status === "active") {
                        return (
                          <span className="badge bg-success d-flex align-items-center gap-2" style={{fontSize: 15, padding: '10px 16px', borderRadius: 14, boxShadow:'0 2px 8px #22c55e33'}}>
                            <span style={{fontSize: 20}}>✅</span>
                            <span>Abonnement actif</span>
                          </span>
                        );
                      } else if (sub.status === "trial") {
                        return (
                          <span className="badge bg-info text-dark d-flex align-items-center gap-2" style={{fontSize: 15, padding: '10px 16px', borderRadius: 14, boxShadow:'0 2px 8px #0ea5e933'}}>
                            <span style={{fontSize: 20}}>⏳</span>
                            <span>
                              Essai gratuit&nbsp;: <b>{sub.daysLeft}j restants</b><br/>
                              <span style={{fontSize: 13}}>Jusqu'au <b style={{color:'#ff9800'}}>{sub.endDate}</b></span>
                            </span>
                          </span>
                        );
                      } else {
                        return (
                          <span className="badge bg-danger d-flex align-items-center gap-2" style={{fontSize: 15, padding: '10px 16px', borderRadius: 14, boxShadow:'0 2px 8px #ef444433'}}>
                            <span style={{fontSize: 20}}>🔒</span>
                            <span>
                              Abonnement requis<br/>
                              <span style={{fontSize: 13}}>Essai terminé le <b style={{color:'#ff9800'}}>{sub.endDate}</b></span>
                            </span>
                          </span>
                        );
                      }
                    })()}
                  </div>
                  {/* Gestion réelle de l'abonnement */}
                  <div className="d-flex flex-column align-items-center gap-2 mb-2 w-100">
                    {(() => {
                      const sub = getSubscriptionStatus(p);
                      if (sub.status === "active") {
                        return <>
                          <span className="badge bg-success d-flex align-items-center gap-2" style={{fontSize: 15, padding: '10px 16px', borderRadius: 14, boxShadow:'0 2px 8px #22c55e33'}}>
                            <span style={{fontSize: 20}}>✅</span>
                            <span>Abonnement actif<br/><span style={{fontSize:13}}>Du <b>{sub.start}</b> au <b>{sub.end}</b></span></span>
                          </span>
                          <Button variant="outline-danger" size="sm" style={{borderRadius:14, fontWeight:'bold', minWidth:120}} onClick={() => handleSubscription(p._id, false)}>
                            Désactiver l'abonnement
                          </Button>
                        </>;
                      } else {
                        return <Button variant="primary" size="sm" style={{borderRadius:14, fontWeight:'bold', minWidth:120}} onClick={() => handleSubscription(p._id, true)}>
                          Activer l'abonnement
                        </Button>;
                      }
                    })()}
                  </div>

                  {/* Historique d'abonnement */}
                  {Array.isArray(p.subscriptionHistory) && p.subscriptionHistory.length > 0 && (
                    <div className="w-100 mt-3">
                      <div className="fw-bold mb-1" style={{fontSize:16, color:'#0ea5e9'}}>Historique d'abonnement</div>
                      <div style={{maxHeight:120, overflowY:'auto', borderRadius:12, boxShadow:'0 2px 8px #2563eb22', background:'#f8fafc'}}>
                        <table className="table table-sm table-bordered mb-0" style={{fontSize:14}}>
                          <thead className="table-light">
                            <tr>
                              <th>Date</th>
                              <th>Action</th>
                              <th>Admin</th>
                              <th>Période</th>
                            </tr>
                          </thead>
                          <tbody>
                            {p.subscriptionHistory.slice().reverse().map((h, i) => (
                              <tr key={i}>
                                <td>{h.date ? new Date(h.date).toLocaleDateString() : ''}</td>
                                <td>{h.action === 'activated' ? 'Activation' : 'Désactivation'}</td>
                                <td>{h.admin ? h.admin : '-'}</td>
                                <td>{h.start && h.end ? `${new Date(h.start).toLocaleDateString()} au ${new Date(h.end).toLocaleDateString()}` : '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  <div className="d-flex gap-2 justify-content-center mt-3 w-100">
                    {!p.isValidated && (
                      <Button variant="success" size="sm" style={{borderRadius:14, fontWeight:'bold', minWidth:120}} onClick={() => handleValidate(p._id)}>
                        Valider
                      </Button>
                    )}
                    <Button variant="danger" size="sm" style={{borderRadius:14, fontWeight:'bold', minWidth:120}} onClick={() => handleDelete(p._id)}>
                      Supprimer
                    </Button>
                  </div>
                </Card.Body>
                {/* Effet glassmorphism décoratif */}
                <div style={{position:'absolute',top:-40,right:-40,width:120,height:120,background:'rgba(14,165,233,0.15)',borderRadius:'50%',filter:'blur(8px)'}}></div>
                <div style={{position:'absolute',bottom:-30,left:-30,width:80,height:80,background:'rgba(255,152,0,0.12)',borderRadius:'50%',filter:'blur(6px)'}}></div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default AdminDashboard;
