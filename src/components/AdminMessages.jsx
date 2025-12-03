import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Spinner, Alert } from "react-bootstrap";
import styles from "./AdminMessages.module.css";
// import { BsEnvelopeOpen, BsPersonCircle } from "react-icons/bs";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState("");
  const [search, setSearch] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetch("/api/messages-admin", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Erreur lors du chargement des messages.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="d-flex justify-content-center py-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  // Filtrage des messages par recherche
  const filteredMessages = messages.filter(
    m => m.subject?.toLowerCase().includes(search.toLowerCase()) ||
         m.message?.toLowerCase().includes(search.toLowerCase()) ||
         (m.userId?.nom || m.userEmail || "").toLowerCase().includes(search.toLowerCase())
  );
  const selectedMsg = filteredMessages.find(m => m._id === selectedId) || filteredMessages[0];

  return (
    <div className={styles["messenger-container"]}>
      {/* Sidebar */}
      <div className={styles["messenger-sidebar"]}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px 8px 24px'}}>
          <h3 style={{fontWeight:700,fontSize:24,margin:0}}>Messages</h3>
          <span style={{background:'#a78bfa',color:'#232323',borderRadius:'50%',width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:20}}>✎</span>
        </div>
        <div className={styles["messenger-search"]}>
          <input type="text" placeholder="Rechercher des messages" value={search} onChange={e=>setSearch(e.target.value)} className={styles["messenger-search-input"]} />
        </div>
        <div className={styles["messenger-list"]}>
          {filteredMessages.length === 0 ? (
            <div style={{color:'#bbb',textAlign:'center',marginTop:32}}>Aucun message trouvé.</div>
          ) : (
            filteredMessages.map(msg => (
              <div key={msg._id} className={
                styles["messenger-list-item"] + (selectedMsg?._id === msg._id ? ' ' + styles["selected"] : '')
              } onClick={()=>setSelectedId(msg._id)}>
                <div className={styles["messenger-avatar"]} style={{background:'#4f46e5'}}>
                  {msg.userId?.nom ? msg.userId.nom.split(' ').map(n=>n[0]).join('').toUpperCase() : (msg.userEmail ? msg.userEmail[0].toUpperCase() : 'U')}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:16}}>{msg.userId?.nom || msg.userEmail || "Prestataire inconnu"}</div>
                  <div style={{fontSize:15,opacity:0.8}}>{msg.subject || msg.message?.slice(0,32)}</div>
                </div>
                <div style={{fontSize:13,opacity:0.6}}>{new Date(msg.createdAt).toLocaleDateString()}</div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Main message view */}
      <div className={styles["messenger-main"]}>
        {selectedMsg ? (
          <>
            <div className={styles["messenger-header"]}>
              <div className={styles["messenger-avatar"]} style={{width:56,height:56,fontSize:24,background:'#4f46e5'}}>
                {selectedMsg.userId?.nom ? selectedMsg.userId.nom.split(' ').map(n=>n[0]).join('').toUpperCase() : (selectedMsg.userEmail ? selectedMsg.userEmail[0].toUpperCase() : 'U')}
              </div>
              <div className={styles["messenger-header-info"]}>
                <div style={{fontWeight:700,fontSize:20}}>{selectedMsg.userId?.nom || selectedMsg.userEmail || "Prestataire inconnu"}</div>
                <div style={{fontSize:15,opacity:0.8}}>{selectedMsg.userId?.email || selectedMsg.userEmail || ''}</div>
              </div>
              <div className={styles["messenger-header-actions"]}>
                <span style={{fontSize:22,opacity:0.7,cursor:'pointer'}}>📞</span>
                <span style={{fontSize:22,opacity:0.7,cursor:'pointer'}}>💬</span>
              </div>
            </div>
            <div className={styles["messenger-messages"]}>
              <div className={styles["messenger-message"]}>
                <span style={{fontWeight:600}}>{selectedMsg.userId?.nom || selectedMsg.userEmail || "Prestataire inconnu"}</span><br/>
                {selectedMsg.message}
              </div>
              {/* Si admin a répondu, afficher la réponse */}
              {selectedMsg.reply && (
                <div className={styles["messenger-message"] + ' ' + styles["admin"]}>
                  {selectedMsg.reply}
                </div>
              )}
            </div>
            {/* Formulaire de réponse */}
            <div className={styles["messenger-input"]}>
              <input
                type="text"
                placeholder="Saisir un message"
                value={replyText}
                onChange={e=>setReplyText(e.target.value)}
                className={styles["messenger-search-input"]}
              />
              <button
                onClick={async () => {
                  setReplyStatus("");
                  if (!replyText.trim()) return setReplyStatus("Le message ne peut pas être vide.");
                  try {
                    const res = await fetch("/api/messages-admin/reply", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                      },
                      body: JSON.stringify({ messageId: selectedMsg._id, adminId: user._id, reply: replyText })
                    });
                    const data = await res.json();
                    if (res.ok) {
                      setReplyStatus("Réponse envoyée !");
                      setReplyText("");
                      // Mettre à jour le message localement
                      setMessages(msgs => msgs.map(m => m._id === selectedMsg._id ? {...m, reply: replyText} : m));
                    } else {
                      setReplyStatus(data.msg || "Erreur lors de l'envoi.");
                    }
                  } catch (e) {
                    setReplyStatus("Erreur réseau.");
                  }
                }}
              >Envoyer</button>
            </div>
            {replyStatus && <div style={{color:'#a78bfa',marginBottom:8}}>{replyStatus}</div>}
          </>
        ) : (
          <div style={{color:'#bbb',textAlign:'center',marginTop:64}}>Sélectionnez un message pour afficher la conversation.</div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
