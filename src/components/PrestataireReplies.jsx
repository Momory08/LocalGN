import React, { useEffect, useState, useContext } from "react";
import { Card, ListGroup, Spinner, Alert, Badge } from "react-bootstrap";
import { UserContext } from "../contexts/UserContext";

const PrestataireReplies = () => {
  const { user } = useContext(UserContext);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?._id) return;
    fetch(`http://localhost:5000/api/messages-admin/replies/${user._id}`)
      .then(async res => {
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Erreur API: ${res.status} - ${errText}`);
        }
        return res.json();
      })
      .then(data => {
        setReplies(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur lors du chargement des réponses de l'admin.");
        setLoading(false);
        console.error('Erreur fetch replies:', err);
      });
  }, [user]);

  if (loading) return <div className="d-flex justify-content-center py-3"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Card className="mb-4 shadow border-0" style={{ borderRadius: 18 }}>
      <Card.Header className="bg-info text-white" style={{ borderRadius: '18px 18px 0 0' }}>
        Réponses de l'administrateur
        <Badge bg="light" text="dark" className="ms-2">{replies.length}</Badge>
      </Card.Header>
      <ListGroup variant="flush">
        {replies.length === 0 ? (
          <ListGroup.Item>Aucune réponse reçue.</ListGroup.Item>
        ) : (
          replies.map((rep) => (
            <ListGroup.Item key={rep._id}>
              <div className="fw-bold">{rep.reply}</div>
              <div className="text-muted" style={{ fontSize: 13 }}>
                {new Date(rep.createdAt).toLocaleString()}
              </div>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </Card>
  );
};

export default PrestataireReplies;
