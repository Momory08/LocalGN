import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import ProvidersMap from "../components/ProvidersMap";

const Results = () => {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    commune: "",
    email: "",
    minLat: "",
    maxLat: "",
    minLng: "",
    maxLng: ""
  });

  // Charger les prestataires depuis le backend
  useEffect(() => {
    fetch("/api/auth/all")
      .then((res) => res.json())
      .then((data) => {
        setProviders(data);
        setFilteredProviders(data);
      });
  }, []);

  // Mettre à jour les filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // Appliquer les filtres
  const applyFilters = () => {
    let results = providers;

    if (filters.keyword.trim()) {
      results = results.filter((p) =>
        (p.nom && p.nom.toLowerCase().includes(filters.keyword.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(filters.keyword.toLowerCase()))
      );
    }
    if (filters.email.trim()) {
      results = results.filter((p) =>
        p.email && p.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }
    if (filters.category) {
      results = results.filter((p) => p.category === filters.category);
    }
    if (filters.commune) {
      results = results.filter((p) => p.commune === filters.commune);
    }
    if (filters.minLat) {
      results = results.filter((p) => p.latitude >= parseFloat(filters.minLat));
    }
    if (filters.maxLat) {
      results = results.filter((p) => p.latitude <= parseFloat(filters.maxLat));
    }
    if (filters.minLng) {
      results = results.filter((p) => p.longitude >= parseFloat(filters.minLng));
    }
    if (filters.maxLng) {
      results = results.filter((p) => p.longitude <= parseFloat(filters.maxLng));
    }
    setFilteredProviders(results);
  };

  const location = useLocation();

  // Extraire query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialFilters = {
      keyword: params.get("keyword") || "",
      category: params.get("category") || "",
      commune: params.get("commune") || "",
    };
    setFilters(initialFilters);

    // Appliquer les filtres automatiquement
    let results = providers;

    if (initialFilters.keyword.trim()) {
      results = results.filter((p) =>
        p.name.toLowerCase().includes(initialFilters.keyword.toLowerCase())
      );
    }
    if (initialFilters.category) {
      results = results.filter((p) => p.category === initialFilters.category);
    }
    if (initialFilters.commune) {
      results = results.filter((p) => p.commune === initialFilters.commune);
    }
    setFilteredProviders(results);
  }, [location.search, providers]);

  return (
    <>
      <header className="bg-primary text-white py-3">
        <Container>
          <h1 className="h4">Résultats des professionnels</h1>
        </Container>
      </header>

      <Container className="my-4">
        <Row className="g-2">
          <Col md={3}>
            <Form.Control
              name="keyword"
              placeholder="Recherche par nom ou métier..."
              value={filters.keyword}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={2}>
            <Form.Control
              name="email"
              placeholder="Recherche par email..."
              value={filters.email}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={2}>
            <Form.Select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">Toutes les catégories</option>
              <option>Plombier</option>
              <option>Taxi</option>
              <option>Couturier</option>
              <option>Electricien</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select
              name="commune"
              value={filters.commune}
              onChange={handleFilterChange}
            >
              <option value="">Toutes les communes</option>
              <option>Dixinn</option>
              <option>Kaloum</option>
              <option>Ratoma</option>
              <option>Matoto</option>
            </Form.Select>
          </Col>
          <Col md={1}>
            <Form.Control
              name="minLat"
              type="number"
              step="0.0001"
              placeholder="Min lat"
              value={filters.minLat}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={1}>
            <Form.Control
              name="maxLat"
              type="number"
              step="0.0001"
              placeholder="Max lat"
              value={filters.maxLat}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={1}>
            <Form.Control
              name="minLng"
              type="number"
              step="0.0001"
              placeholder="Min lng"
              value={filters.minLng}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={1}>
            <Form.Control
              name="maxLng"
              type="number"
              step="0.0001"
              placeholder="Max lng"
              value={filters.maxLng}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md="auto">
            <Button variant="success" onClick={applyFilters}>
              Filtrer
            </Button>
          </Col>
        </Row>
      </Container>
      

      <Container className="mb-5">
        {filteredProviders.length > 0 ? (
          <Row className="g-3">
            {filteredProviders.map((p) => (
              <Col md={4} key={p._id}>
                <Card className="shadow-sm">
                  {p.photo && (
                    <Card.Img variant="top" src={p.photo.startsWith('http') ? p.photo : `http://localhost:5000${p.photo}`} style={{ height: 180, objectFit: "cover" }} />
                  )}
                  <Card.Body>
                    <Card.Title
                      style={{ cursor: "pointer", color: "#0d6efd" }}
                    >
                      {p.nom}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {p.category} {p.commune ? `- ${p.commune}` : ""}
                    </Card.Subtitle>
                    <Card.Text>
                      <strong>Email :</strong> {p.email}<br />
                      <strong>Latitude :</strong> {p.latitude}<br />
                      <strong>Longitude :</strong> {p.longitude}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p>Aucun prestataire trouvé.</p>
        )}
        

<h4 className="mt-4">Carte des prestataires</h4>
<ProvidersMap providers={filteredProviders} />

      </Container>

      <footer className="bg-dark text-white text-center py-3">
        ©2025 Annuaire Local Guinée – Tous droits réservés
      </footer>
    </>
  );
};

export default Results;
