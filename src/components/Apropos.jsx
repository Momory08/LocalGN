import Footer from "./Footer";
import React from "react";
import Header from "./Header";
import { motion } from "framer-motion";
import { Users, MapPin, Star, HeartHandshake } from "lucide-react";

const Apropos = () => {
  return (
    <>
      <Header />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(120deg, #e0e7ff 0%, #f1f5f9 60%, #fff 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "32px 8px 64px 8px",
          position: "relative",
          overflow: "hidden",
          // marginTop: ,
        }}
      >
        {/* Décor rond en fond */}
        <motion.div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, #2563eb22 60%, transparent 100%)",
            zIndex: 0,
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
        />

        {/* Titre principal + image en deux colonnes */}

        {/* Titre principal + image en deux colonnes (texte à gauche, image à droite) */}
        <motion.div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 48,
            width: "100%",
            maxWidth: 1200,
            margin: "0 auto 32px auto",
            zIndex: 1,
            flexWrap: "wrap",
            background: "linear-gradient(90deg, #f1f5f9 60%, #e0e7ff 100%)",
            borderRadius: 24,
            boxShadow: "0 4px 32px #2563eb11",
            padding: "32px 18px",
          }}
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Colonne texte à gauche */}
          <div
            style={{
              flex: "1 1 340px",
              minWidth: 260,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              paddingLeft: 12,
            }}
          >
            <h1
              style={{
                fontSize: "2.7rem",
                fontWeight: "bold",
                color: "#2563eb",
                marginBottom: 12,
                textAlign: "left",
                letterSpacing: 1,
                lineHeight: 1.1,
                textShadow: "0 2px 8px #2563eb22",
              }}
            >
              À propos de <span >LocalGN</span>
            </h1>
            <div
              style={{
                fontSize: 15,
                color: "#374151",
                fontWeight: 600,
                marginBottom: 10,
                textAlign: "left",
                letterSpacing: 0.5,
              }}
            >
              La plateforme qui connecte la Guinée aux meilleurs talents locaux <br />
               <span style={{}}>C'est</span>{" "}
          est une plateforme{" "}
          <span style={{ fontWeight: "bold" }}>
            moderne, inclusive et gratuite
          </span>{" "}
          qui connecte les habitants de Guinée Conakry avec les{" "}
          <span style={{ }}>
            meilleurs professionnels de proximité
          </span>
            </div>

          </div>
          {/* Colonne image/logo à droite */}
          <div
            style={{
              flex: "0 0 260px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 200,
            }}
          >
            <img
              src="/logo3.png"
              alt="Logo LocalGN"
              style={{
                width: 250,
                height: 250,
                borderRadius: "50%",
                marginBottom: 22,
                boxShadow: "0 4px 32px #2563eb44",
                border: "6px solid #fff",
                background:
                  "linear-gradient(135deg, #2563eb 60%, )",
                objectFit: "cover",
                transition: "transform 0.2s",
              }}
            />

          </div>
        </motion.div>


        {/* Section Vidéo Présentation */}
        <motion.div
          style={{
            margin: "30px auto 30px auto",
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 4px 24px #2563eb22",
            padding: "10px 10px",
            maxWidth: 720,
            width: "100%",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: 18,
              color: "#2563eb",
              textAlign: "center",
              letterSpacing: 1,
            }}
          >
            Découvrez LocalGN en vidéo
          </h2>
          <div
            style={{
              width: "100%",
              maxWidth: 560,
              aspectRatio: "16/9",
              background: "#e0e7ff",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 2px 12px #2563eb22",
              margin: "0 auto",
            }}
          >
            {/* video de presentation LocalGN */}
            <iframe
              width="100%"
              height="100%"
              src="presentation.mp4"
              title="Présentation LocalGN"
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ display: "block", width: "100%", height: "100%" }}
            ></iframe>
          </div>
        </motion.div>
    

        {/* Sections en cartes */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 32,
            maxWidth: 1100,
            width: "100%",
            zIndex: 1,
          }}
        >
          {/* Carte 1 */}
          <motion.div
            style={{
              background: "#fff",
              boxShadow: "0 4px 24px #0001",
              borderRadius: 16,
              padding: 24,
              transition: "box-shadow 0.2s",
              textAlign: "center",
            }}
            whileHover={{ scale: 1.05 }}
          >
            <Users
              style={{
                width: 48,
                height: 48,
                color: "#2563eb",
                marginBottom: 16,
              }}
            />
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginBottom: 8,
              }}
            >
              Communauté
            </h3>
            <p style={{ color: "#4b5563" }}>
              Des milliers d’artisans, prestataires et habitants réunis autour
              d’une même plateforme.
            </p>
          </motion.div>

          {/* Carte 2 */}
          <motion.div
            style={{
              background: "#fff",
              boxShadow: "0 4px 24px #0001",
              borderRadius: 16,
              padding: 24,
              transition: "box-shadow 0.2s",
              textAlign: "center",
            }}
            whileHover={{ scale: 1.05 }}
          >
            <MapPin
              style={{
                width: 48,
                height: 48,
                color: "#22c55e",
                marginBottom: 16,
              }}
            />
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginBottom: 8,
              }}
            >
              Localisation
            </h3>
            <p style={{ color: "#4b5563" }}>
              Trouvez un professionnel près de chez vous grâce à la carte
              interactive et aux filtres par quartier.
            </p>
          </motion.div>

          {/* Carte 3 */}
          <motion.div
            style={{
              background: "#fff",
              boxShadow: "0 4px 24px #0001",
              borderRadius: 16,
              padding: 24,
              transition: "box-shadow 0.2s",
              textAlign: "center",
            }}
            whileHover={{ scale: 1.05 }}
          >
            <Star
              style={{
                width: 48,
                height: 48,
                color: "#eab308",
                marginBottom: 16,
              }}
            />
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginBottom: 8,
              }}
            >
              Confiance
            </h3>
            <p style={{ color: "#4b5563" }}>
              Consultez les avis et notes laissés par d’autres clients pour
              choisir en toute sérénité.
            </p>
          </motion.div>

          {/* Carte 4 */}
          <motion.div
            style={{
              background: "#fff",
              boxShadow: "0 4px 24px #0001",
              borderRadius: 16,
              padding: 24,
              transition: "box-shadow 0.2s",
              textAlign: "center",
            }}
            whileHover={{ scale: 1.05 }}
          >
            <HeartHandshake
              style={{
                width: 48,
                height: 48,
                color: "#ec4899",
                marginBottom: 16,
              }}
            />
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginBottom: 8,
              }}
            >
              Impact local
            </h3>
            <p style={{ color: "#4b5563" }}>
              LocalGN valorise les métiers locaux et crée des opportunités
              économiques pour les artisans guinéens.
            </p>
          </motion.div>
        </div>

        {/* Section Mission en blocs */}
        <div
          style={{
            marginTop: 64,
            marginBottom: 32,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <h2
            style={{
              fontSize: "2.1rem",
              fontWeight: "bold",
              marginBottom: 32,
              textAlign: "center",
              letterSpacing: 1,
              color: "#2563eb",
            }}
          >
            Notre Mission
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 28,
              maxWidth: 1100,
              width: "100%",
            }}
          >
            {/* Bloc 1 : Accès & Proximité */}
            <motion.div
              style={{
                position: "relative",
                backgroundImage: 'url("/Fond1.jpeg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#fff",
                borderRadius: 16,
                boxShadow: "0 4px 24px #2563eb33",
                padding: 28,
                minHeight: 180,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                overflow: "hidden",
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.45)",
                zIndex: 1,
              }} />
              <div style={{ position: "relative", zIndex: 2 }}>
                <span style={{ fontSize: 32, marginBottom: 10 }}>🌍</span>
                <div className="fw-bold mb-2" style={{ fontSize: 18 }}>
                  Accès pour tous
                </div>
                <div style={{ fontSize: 15 }}>
                  Offrir à chaque citoyen de Guinée un accès simple, rapide et
                  gratuit aux services essentiels de proximité.
                </div>
              </div>
            </motion.div>
            {/* Bloc 2 : Connexion & Communauté */}
            <motion.div
              style={{
                position: "relative",
                backgroundImage: 'url("/Fond10.jpeg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#fff",
                borderRadius: 16,
                boxShadow: "0 4px 24px #2563eb22",
                padding: 28,
                minHeight: 180,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                border: "1.5px solid #2563eb22",
                overflow: "hidden",
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.45)",
                zIndex: 1,
              }} />
              <div style={{ position: "relative", zIndex: 2 }}>
                <span style={{ fontSize: 32, marginBottom: 10 }}>🤝</span>
                <div className="fw-bold mb-2" style={{ fontSize: 18 }}>
                  Créer du lien
                </div>
                <div style={{ fontSize: 15 }}>
                  Connecter habitants et professionnels pour construire une
                  économie locale plus forte et inclusive.
                </div>
              </div>
            </motion.div>
            {/* Bloc 3 : Innovation */}
            <motion.div
              style={{
                position: "relative",
                backgroundImage: 'url("/Fond3.jpeg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#fff",
                borderRadius: 16,
                boxShadow: "0 4px 24px #fbbf2422",
                padding: 28,
                minHeight: 180,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                overflow: "hidden",
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.45)",
                zIndex: 1,
              }} />
              <div style={{ position: "relative", zIndex: 2 }}>
                <span style={{ fontSize: 32, marginBottom: 10 }}>💡</span>
                <div className="fw-bold mb-2" style={{ fontSize: 18 }}>
                  Innover pour la Guinée
                </div>
                <div style={{ fontSize: 15 }}>
                  Proposer des solutions digitales modernes pour valoriser les
                  métiers locaux et simplifier la vie quotidienne.
                </div>
              </div>
            </motion.div>
            {/* Bloc 4 : Confiance */}
            <motion.div
              style={{
                position: "relative",
                backgroundImage: 'url("/ResponsablePartenariats.jpeg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#fff",
                borderRadius: 16,
                boxShadow: "0 4px 24px #2563eb22",
                padding: 28,
                minHeight: 180,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                border: "1.5px solid #2563eb22",
                overflow: "hidden",
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.45)",
                zIndex: 1,
              }} />
              <div style={{ position: "relative", zIndex: 2 }}>
                <span style={{ fontSize: 32, marginBottom: 10 }}>⭐</span>
                <div className="fw-bold mb-2" style={{ fontSize: 18 }}>
                  Confiance & Qualité
                </div>
                <div style={{ fontSize: 15 }}>
                  Garantir la transparence, la sécurité et la qualité grâce aux
                  avis et à la sélection des prestataires.
                </div>
              </div>
            </motion.div>
            {/* Bloc 5 : Accessibilité */}
            <motion.div
              style={{
                position: "relative",
                backgroundImage: 'url("/Fond5.jpeg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#fff",
                borderRadius: 16,
                boxShadow: "0 4px 24px #22c55e22",
                padding: 28,
                minHeight: 180,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                overflow: "hidden",
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.45)",
                zIndex: 1,
              }} />
              <div style={{ position: "relative", zIndex: 2 }}>
                <span style={{ fontSize: 32, marginBottom: 10 }}>📱</span>
                <div className="fw-bold mb-2" style={{ fontSize: 18 }}>
                  Accessibilité
                </div>
                <div style={{ fontSize: 15 }}>
                  Rendre les services accessibles partout, sur mobile comme sur
                  ordinateur, pour tous les publics.
                </div>
              </div>
            </motion.div>

            {/* Bloc 6 : Impact local */}
            <motion.div
              style={{
                position: "relative",
                backgroundImage: 'url("/Fond5.jpeg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#fff",
                borderRadius: 16,
                boxShadow: "0 4px 24px #22c55e22",
                padding: 28,
                minHeight: 180,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                overflow: "hidden",
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.45)",
                zIndex: 1,
              }} />
              <div style={{ position: "relative", zIndex: 2 }}>
                <span style={{ fontSize: 32, marginBottom: 10 }}>📱</span>
                <div className="fw-bold mb-2" style={{ fontSize: 18 }}>
                  Accessibilité
                </div>
                <div style={{ fontSize: 15 }}>
                  Rendre les services accessibles partout, sur mobile comme sur
                  ordinateur, pour tous les publics.
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      <Footer />
    </>
  );
};

export default Apropos;
