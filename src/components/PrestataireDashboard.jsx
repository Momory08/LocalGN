
import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Container, Card, Button, Row, Col, Table, Alert, Badge, Image, Modal, Form, Spinner } from "react-bootstrap";
import PrestataireReplies from "./PrestataireReplies";
import { UserContext } from "../contexts/UserContext";
import { BsPersonCircle, BsEnvelope, BsTelephone, BsBoxArrowRight, BsBarChartFill, BsCheckCircleFill, BsClockHistory, BsStarFill } from "react-icons/bs";

// Fonction utilitaire pour afficher le statut d'abonnement avec icône, couleur, date de fin d'essai
function getSubscriptionStatus(user) {
  const dateStr = user.dateInscription || user.createdAt;
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


const PrestataireDashboard = () => {
  // Modal Orange Money
  const [showOrangeMoney, setShowOrangeMoney] = useState(false);
  const [orangePhone, setOrangePhone] = useState("");
  const [orangeLoading, setOrangeLoading] = useState(false);
  const [orangeSuccess, setOrangeSuccess] = useState("");
  const [orangeError, setOrangeError] = useState("");
  const location = useLocation();
  const { user, setUser } = useContext(UserContext);
  const onLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };
  const [prestations, setPrestations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ total: 0, enCours: 0, terminees: 0 });
  const [evaluations, setEvaluations] = useState([]);
  const [reply, setReply] = useState({});
  const [replyLoading, setReplyLoading] = useState({});
  const [replyMessage, setReplyMessage] = useState({});
  // Modal contact admin
  const [showContact, setShowContact] = useState(false);
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState("");
  const [contactError, setContactError] = useState("");

  // Modal abonnement
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState("");
  const [subscribeError, setSubscribeError] = useState("");

  // Gérer la réponse à un avis
  const handleReplyChange = (id, value) => {
    setReply((prev) => ({ ...prev, [id]: value }));
  };

  const handleReplySubmit = async (id) => {
    setReplyLoading((prev) => ({ ...prev, [id]: true }));
    setReplyMessage((prev) => ({ ...prev, [id]: "" }));
    try {
      const res = await fetch(`http://localhost:5000/api/evaluations/${id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ reply: reply[id] }),
      });
      const data = await res.json();
      if (res.ok) {
        setReplyMessage((prev) => ({ ...prev, [id]: "Réponse envoyée !" }));
        // Rafraîchir les évaluations
        fetch(`http://localhost:5000/api/prestataire/${user._id}/evaluations`)
          .then(res => res.json())
          .then(data => setEvaluations(data));
        setReply((prev) => ({ ...prev, [id]: "" }));
      } else {
        setReplyMessage((prev) => ({ ...prev, [id]: data.msg || "Erreur lors de l'envoi." }));
      }
    } catch {
      setReplyMessage((prev) => ({ ...prev, [id]: "Erreur serveur" }));
    }
    setReplyLoading((prev) => ({ ...prev, [id]: false }));
  };

  // Contact admin
  const handleContactAdmin = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactSuccess("");
    setContactError("");
    try {
      const res = await fetch("http://localhost:5000/api/contact-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          subject: contactSubject,
          message: contactMessage,
          userId: user._id,
          userEmail: user.email,
        }),
      });
      if (res.ok) {
        setContactSuccess("Message envoyé à l'administrateur !");
        setContactSubject("");
        setContactMessage("");
      } else {
        setContactError("Erreur lors de l'envoi du message.");
      }
    } catch {
      setContactError("Erreur serveur.");
    }
    setContactLoading(false);
  };

  useEffect(() => {
    if (!user || !user._id) return;
    fetch(`http://localhost:5000/api/prestataire/${user._id}/prestations`)
      .then(res => res.json())
      .then(data => {
        setPrestations(data);
        setLoading(false);
        setStats({
          total: data.length,
          enCours: data.filter(p => p.statut === "En cours").length,
          terminees: data.filter(p => p.statut === "Terminée").length
        });
      })
      .catch(() => {
        setError("Erreur lors du chargement des prestations.");
        setLoading(false);
      });
    fetch(`http://localhost:5000/api/prestataire/${user._id}/evaluations`)
      .then(res => res.json())
      .then(data => setEvaluations(data))
      .catch(() => setEvaluations([]));
  }, [user]);

  // Confirmation Stripe
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("payment") === "success") {
      // Rafraîchir le profil prestataire
      fetch(`http://localhost:5000/api/auth/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data._id) setUser(data);
        });
    }
  }, [location.search, setUser]);

  if (!user) {
    return <Container className="mt-5"><h2>Veuillez vous connecter.</h2></Container>;
  }

  return (
  <>
      {new URLSearchParams(location.search).get("payment") === "success" && (
        <Alert variant="success" className="mb-3">Votre paiement Stripe a été validé, votre abonnement est activé !</Alert>
      )}
      {/* Alerte date de fin d’abonnement */}
      {user.subscriptionActive && user.subscriptionEnd && (
        <Alert variant="warning" className="mb-3" style={{fontWeight:'bold', fontSize:16}}>
          Votre abonnement est actif jusqu’au <span style={{color:'#ff9800'}}>{new Date(user.subscriptionEnd).toLocaleDateString()}</span>
        </Alert>
      )}
      <Container fluid className="py-4 px-2 px-md-5" style={{ background: 'linear-gradient(120deg, #f8fafc 60%, #e0e7ff 100%)', minHeight: '100vh' }}>
      {/* Header moderne */}
      <Card className="shadow-lg border-0 mb-4" style={{ borderRadius: 22, background: 'linear-gradient(90deg, #2563eb 0%, #0ea5e9 100%)', color: '#fff' }}>
        <Card.Body className="d-flex flex-column flex-md-row align-items-center justify-content-between p-4">
          <div className="d-flex align-items-center gap-3">
            <Image src={user.photo ? (user.photo.startsWith("http") ? user.photo : `http://localhost:5000${user.photo}`) : "/logo192.png"} alt="Profil" roundedCircle style={{ width: 80, height: 80, objectFit: "cover", border: "3px solid #fff", boxShadow: "0 2px 12px #2563eb22" }} />
            <div>
              <h3 className="fw-bold mb-1" style={{ letterSpacing: 1 }}>{user.nom || user.email}</h3>
              <div className="mb-1"><Badge bg="light" text="dark" className="me-2"><BsPersonCircle style={{marginBottom:2}}/> {user.role}</Badge> <Badge bg="info">{user.category || "Métier"}</Badge></div>
              <div style={{ fontSize: 15, opacity: 0.95 }}><BsEnvelope style={{marginBottom:2}}/> {user.email}</div>
              <div style={{ fontSize: 15, opacity: 0.95 }}><BsTelephone style={{marginBottom:2}}/> {user.telephone || <span className="text-muted">Non renseigné</span>}</div>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
            <Button variant="outline-light" className="fw-bold" style={{ fontSize: 18, borderRadius: 18, padding: '10px 24px' }} onClick={onLogout} title="Déconnexion">
              <BsBoxArrowRight style={{marginBottom:3, marginRight:6}}/> Déconnexion
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Statistiques visuelles */}
      <Row className="mb-4 g-3">
        <Col md={4}><Card className="text-center border-0 shadow-sm" style={{ borderRadius: 18 }}><Card.Body><div style={{ fontSize: 36, color: '#2563eb', fontWeight: 700 }}><BsBarChartFill style={{marginBottom:4, marginRight:6}}/>{stats.total}</div><div style={{ fontSize: 16 }}>Total prestations</div></Card.Body></Card></Col>
        <Col md={4}><Card className="text-center border-0 shadow-sm" style={{ borderRadius: 18 }}><Card.Body><div style={{ fontSize: 36, color: '#fbbf24', fontWeight: 700 }}><BsClockHistory style={{marginBottom:4, marginRight:6}}/>{stats.enCours}</div><div style={{ fontSize: 16 }}>En cours</div></Card.Body></Card></Col>
        <Col md={4}><Card className="text-center border-0 shadow-sm" style={{ borderRadius: 18 }}><Card.Body><div style={{ fontSize: 36, color: '#22c55e', fontWeight: 700 }}><BsCheckCircleFill style={{marginBottom:4, marginRight:6}}/>{stats.terminees}</div><div style={{ fontSize: 16 }}>Terminées</div></Card.Body></Card></Col>
      </Row>

      {/* Statut d'abonnement et historique */}
      <Row className="mb-4">
        <Col md={12}>
          <PrestataireReplies />
        </Col>
      </Row>
      <Row className="mb-4 g-3">
        <Col md={6}>
          <Card className="border-0 shadow-sm" style={{ borderRadius: 18 }}>
            <Card.Body>
              <div className="fw-bold mb-2" style={{fontSize:18}}>Statut d'abonnement</div>
              {(() => {
                const sub = getSubscriptionStatus(user);
                if (sub.status === "trial") {
                  return (
                    <span className="badge bg-info text-dark d-flex align-items-center gap-2" style={{fontSize: 16, padding: '12px 18px'}}>
                      <span style={{fontSize: 22}}>⏳</span>
                      <span>
                        Essai gratuit&nbsp;: <b>{sub.daysLeft}j restants</b><br/>
                        <span style={{fontSize: 14}}>Jusqu'au <b>{sub.endDate}</b></span><br/>
                        <Button size="sm" variant="outline-primary" className="mt-2" onClick={() => setShowContact(true)}>
                          Contacter l'administrateur
                        </Button>
                      </span>
                    </span>
                  );
                } else {
                  return (
                    <span className="badge bg-primary d-flex flex-column align-items-start gap-2" style={{fontSize: 16, padding: '12px 18px'}}>
                      <div className="d-flex align-items-center gap-2">
                        <span style={{fontSize: 22}}>🔒</span>
                        <span>
                          Abonnement requis<br/>
                          {/* <span style={{fontSize: 14}}>Essai terminé le <b style={{color:'#ff9800'}}>{sub.endDate}</b></span> */}
                          {user.dateInscription || user.createdAt ? (
                            <span style={{fontSize: 13, color: '#ff9800', marginLeft: 4, fontWeight:'bold'}}>
                              (Date de fin d’essai calculée : {new Date(new Date(user.dateInscription || user.createdAt).getTime() + 31*24*60*60*1000).toLocaleDateString()})
                            </span>
                          ) : null}
                        </span>
                      </div>
                      <div className="d-flex gap-2 mt-2">
                        <Button size="sm" variant="success" onClick={async () => {
                          setShowSubscribe(true);
                        }}>S’abonner par carte</Button>
                        <Button size="sm" variant="warning" onClick={() => setShowOrangeMoney(true)}>S’abonner Orange Money</Button>
                      </div>
                      {/* Modal Stripe */}
                      <Modal show={showSubscribe} onHide={() => setShowSubscribe(false)} centered>
                        <Modal.Header closeButton>
                          <Modal.Title>S’abonner</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="mb-3">
                            <b>Choisissez votre formule :</b><br/>
                            <div className="mt-2 mb-2">
                              <span className="badge bg-success me-2" style={{fontSize:15}}>Mensuel : 20 000 GNF / mois</span>
                              <span className="badge bg-primary" style={{fontSize:15}}>Annuel : 204 000 GNF / an <span style={{color:'#22c55e', fontWeight:'bold'}}>(-15%)</span></span>
                            </div>
                            <span className="text-muted" style={{fontSize:13}}>Paiement par carte bancaire (simulation).</span>
                          </div>
                          {subscribeSuccess ? (
                            <Alert variant="success" style={{background:'#e0ffe0', color:'#22c55e', fontWeight:'bold', fontSize:16, border:'2px solid #22c55e'}}>
                              <span style={{fontSize:22}}>🎉</span> {subscribeSuccess}
                            </Alert>
                          ) : (
                            <Form onSubmit={async e => {
                              e.preventDefault();
                              setSubscribeLoading(true);
                              setSubscribeError("");
                              setTimeout(async () => {
                                try {
                                  const plan = e.target.plan.value;
                                  const months = plan === "annual" ? 12 : 1;
                                  const price = plan === "annual" ? 204000 : 20000;
                                  const res = await fetch(`http://localhost:5000/api/prestataire/${user._id}/subscribe`, {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                                    },
                                    body: JSON.stringify({ months, annual: plan === "annual", price })
                                  });
                                  const data = await res.json();
                                  if (res.ok) {
                                    setSubscribeSuccess(plan === "annual" ? "Abonnement annuel activé avec réduction !" : "Abonnement mensuel activé ! Merci pour votre paiement.");
                                    setSubscribeSuccess(plan === "annual"
                                      ? "Votre abonnement annuel est activé avec une réduction de 15% ! 🎉 Profitez de tous les avantages Annuaire GN pendant 12 mois."
                                      : "Votre abonnement mensuel est activé ! 🎉 Merci pour votre confiance, profitez de tous les services Annuaire GN.");
                                    setUser(data.user);
                                  } else {
                                    setSubscribeError(data.msg || "Une erreur est survenue lors de l’activation de votre abonnement. Veuillez réessayer ou contacter l’administrateur.");
                                  }
                                } catch {
                                  setSubscribeError("Erreur serveur.");
                                }
                                setSubscribeLoading(false);
                              }, 1800);
                            }}>
                              <Form.Group className="mb-3">
                                <Form.Label>Formule</Form.Label>
                                <div className="d-flex gap-3">
                                  <Form.Check type="radio" label="Mensuel (10 000 GNF)" name="plan" value="monthly" defaultChecked required />
                                  <Form.Check type="radio" label="Annuel (102 000 GNF, -15%)" name="plan" value="annual" required />
                                </div>
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>Numéro de carte</Form.Label>
                                <Form.Control type="text" placeholder="4242 4242 4242 4242" required maxLength={19} />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>Date d’expiration</Form.Label>
                                <Form.Control type="text" placeholder="MM/AA" required maxLength={5} />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>Cryptogramme</Form.Label>
                                <Form.Control type="text" placeholder="123" required maxLength={3} />
                              </Form.Group>
                              {subscribeError && <Alert variant="danger">{subscribeError}</Alert>}
                              {subscribeError && <Alert variant="danger" style={{background:'#ffe0e0', color:'#ef4444', fontWeight:'bold', fontSize:15, border:'2px solid #ef4444'}}>
                                <span style={{fontSize:20}}>❌</span> {subscribeError}
                              </Alert>}
                              <Button type="submit" variant="success" disabled={subscribeLoading} className="w-100">
                                {subscribeLoading ? "Paiement en cours..." : "Payer et s’abonner"}
                              </Button>
                            </Form>
                          )}
                        </Modal.Body>
                      </Modal>
                      {/* Modal Orange Money */}
                      <Modal show={showOrangeMoney} onHide={() => { setShowOrangeMoney(false); setOrangeSuccess(""); setOrangeError(""); }} centered>
                        <Modal.Header closeButton>
                          <Modal.Title>Paiement Orange Money</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="mb-3">
                            <b>Choisissez votre formule :</b><br/>
                            <div className="mt-2 mb-2">
                              <span className="badge bg-warning me-2" style={{fontSize:15}}>Mensuel : 20 000 GNF / mois</span>
                              <span className="badge bg-primary" style={{fontSize:15}}>Annuel : 204 000 GNF / an <span style={{color:'#22c55e', fontWeight:'bold'}}>(-15%)</span></span>
                            </div>
                            <span className="text-muted" style={{fontSize:13}}>Paiement Orange Money (simulation).</span>
                          </div>
                          {orangeSuccess ? (
                            <Alert variant="success" style={{background:'#fffbe0', color:'#fbbf24', fontWeight:'bold', fontSize:16, border:'2px solid #fbbf24'}}>
                              <span style={{fontSize:22}}>📱</span> {orangeSuccess}
                            </Alert>
                          ) : (
                            <Form onSubmit={async e => {
                              e.preventDefault();
                              setOrangeLoading(true);
                              setOrangeError("");
                              setTimeout(async () => {
                                try {
                                  const plan = e.target.planom.value;
                                  const months = plan === "annual" ? 12 : 1;
                                  const price = plan === "annual" ? 204000 : 20000;
                                  const res = await fetch(`http://localhost:5000/api/orange-money/${user._id}/pay-orange-money`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ phone: orangePhone, months, annual: plan === "annual", price })
                                  });
                                  const data = await res.json();
                                  if (res.ok) {
                                    setOrangeSuccess(plan === "annual" ? "Abonnement annuel activé via Orange Money avec réduction !" : "Abonnement mensuel activé via Orange Money !");
                                    setOrangeSuccess(plan === "annual"
                                      ? "Votre abonnement annuel Orange Money est activé avec une réduction de 15% ! 📱 Profitez de tous les avantages Annuaire GN pendant 12 mois."
                                      : "Votre abonnement mensuel Orange Money est activé ! 📱 Merci pour votre confiance, profitez de tous les services Annuaire GN.");
                                    setUser(u => ({ ...u, subscriptionActive: true, subscriptionMethod: 'orange_money' }));
                                  } else {
                                    setOrangeError(data.msg || "Une erreur est survenue lors du paiement Orange Money. Veuillez réessayer ou contacter l’administrateur.");
                                  }
                                } catch {
                                  setOrangeError("Erreur serveur.");
                                }
                                setOrangeLoading(false);
                              }, 1800);
                            }}>
                              <Form.Group className="mb-3">
                                <Form.Label>Formule</Form.Label>
                                <div className="d-flex gap-3">
                                  <Form.Check type="radio" label="Mensuel (20 000 GNF)" name="planom" value="monthly" defaultChecked required />
                                  <Form.Check type="radio" label="Annuel (204 000 GNF, -15%)" name="planom" value="annual" required />
                                </div>
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>Numéro Orange Money</Form.Label>
                                <Form.Control type="text" placeholder="ex: 620 00 00 00" value={orangePhone} onChange={e => setOrangePhone(e.target.value)} required maxLength={15} />
                              </Form.Group>
                              {orangeError && <Alert variant="danger">{orangeError}</Alert>}
                              {orangeError && <Alert variant="danger" style={{background:'#fff0e0', color:'#f97316', fontWeight:'bold', fontSize:15, border:'2px solid #f97316'}}>
                                <span style={{fontSize:20}}>❌</span> {orangeError}
                              </Alert>}
                              <Button type="submit" variant="warning" disabled={orangeLoading} className="w-100">
                                {orangeLoading ? "Paiement en cours..." : "Payer et s’abonner"}
                              </Button>
                            </Form>
                          )}
                        </Modal.Body>
                      </Modal>
                      <Button size="sm" variant="outline-light" className="mt-2" onClick={() => setShowContact(true)}>
                        Contacter l'administrateur
                      </Button>
                    </span>
                  );
                }
              })()}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="border-0 shadow-sm" style={{ borderRadius: 18 }}>
            <Card.Body>
              <div className="fw-bold mb-2" style={{fontSize:18}}>Historique d'abonnement</div>
              {Array.isArray(user.subscriptionHistory) && user.subscriptionHistory.length > 0 ? (
                <div style={{maxHeight:120, overflowY:'auto'}}>
                  <table className="table table-sm table-bordered mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Date</th>
                        <th>Action</th>
                        <th>Période</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.subscriptionHistory.slice().reverse().map((h, i) => (
                        <tr key={i}>
                          <td>{h.date ? new Date(h.date).toLocaleDateString() : ''}</td>
                          <td>{h.action === 'activated' ? 'Activation' : 'Désactivation'}</td>
                          <td>{h.start && h.end ? `${new Date(h.start).toLocaleDateString()} au ${new Date(h.end).toLocaleDateString()}` : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <span className="text-muted">Aucun historique</span>}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal Contact Admin */}
      <Modal show={showContact} onHide={() => { setShowContact(false); setContactSuccess(""); setContactError(""); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Contacter l'administrateur</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleContactAdmin}>
          <Modal.Body>
            {contactSuccess && <Alert variant="success">{contactSuccess}</Alert>}
            {contactError && <Alert variant="danger">{contactError}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Sujet</Form.Label>
              <Form.Control
                type="text"
                value={contactSubject}
                onChange={e => setContactSubject(e.target.value)}
                required
                placeholder="Sujet du message"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={contactMessage}
                onChange={e => setContactMessage(e.target.value)}
                required
                placeholder="Votre message à l'administrateur"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowContact(false)}>
              Fermer
            </Button>
            <Button type="submit" variant="primary" disabled={contactLoading}>
              {contactLoading ? <Spinner size="sm" animation="border" /> : "Envoyer"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>


    {/* Prestations */}
  <h4 className="fw-bold mt-4">Mes prestations</h4>
      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : prestations.length === 0 ? (
        <p>Aucune prestation enregistrée.</p>
      ) : (
        <div className="table-responsive">
          <Table bordered hover className="align-middle shadow-sm" style={{ borderRadius: 16, overflow: 'hidden', background: '#fff' }}>
            <thead className="table-primary">
              <tr style={{fontSize:16}}>
                <th>Service</th>
                <th>Date</th>
                <th>Client</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {prestations.map((p) => (
                <tr key={p._id} style={{fontSize:15}}>
                  <td>{p.service}</td>
                  <td>{new Date(p.date).toLocaleDateString()}</td>
                  <td><Badge bg="light" text="dark">{p.clientNom}</Badge></td>
                  <td>
                    <Badge bg={p.statut === "Terminée" ? "success" : p.statut === "En cours" ? "warning" : "secondary"} style={{fontSize:15}}>
                      {p.statut}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Evaluations */}
      <h4 className="mt-4 fw-bold">Évaluations reçues</h4>
      {evaluations.length === 0 ? (
        <p className="text-muted">Aucune évaluation pour l'instant.</p>
      ) : (
        <div className="table-responsive">
          <Table bordered hover className="align-middle shadow-sm" style={{ borderRadius: 16, overflow: 'hidden', background: '#fff' }}>
            <thead className="table-info">
              <tr style={{fontSize:16}}>
                <th>Client</th>
                <th>Note</th>
                <th>Commentaire</th>
                <th>Date</th>
                <th>Réponse</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map((e) => (
                <tr key={e._id} style={{fontSize:15}}>
                  <td><Badge bg="light" text="dark">{e.clientNom}</Badge></td>
                  <td><span style={{color:'#fbbf24', fontSize:18}}><BsStarFill style={{marginBottom:3, marginRight:2}}/>{e.note}</span></td>
                  <td>{e.commentaire || <span className="text-muted">Aucun commentaire</span>}</td>
                  <td>{e.date ? new Date(e.date).toLocaleDateString() : ""}</td>
                  <td style={{ minWidth: 180 }}>
                    {e.reply ? (
                      <div className="text-success">{e.reply}</div>
                    ) : (
                      <div>
                        <textarea
                          className="form-control mb-1"
                          rows={2}
                          placeholder="Répondre à cet avis..."
                          value={reply[e._id] || ""}
                          onChange={ev => handleReplyChange(e._id, ev.target.value)}
                          disabled={replyLoading[e._id]}
                        />
                        <Button
                          size="sm"
                          variant="primary"
                          disabled={replyLoading[e._id] || !(reply[e._id] && reply[e._id].trim())}
                          onClick={() => handleReplySubmit(e._id)}
                        >
                          Envoyer
                        </Button>
                        {replyMessage[e._id] && <div className="mt-1 small text-info">{replyMessage[e._id]}</div>}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
  </Container>
  </>
  );
};

export default PrestataireDashboard;
