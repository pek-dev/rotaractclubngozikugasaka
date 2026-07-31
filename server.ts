import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "Rotaract Club Ngozi Kugasaka API", engine: "Node/Express + PHP MySQL Emulation" });
  });

  // --- IN-MEMORY BACKEND DATA STORE FOR PHP / MYSQL CRUD ---
  const dbStore = {
    events: [
      { id: "evt-1", title: "Assemblée Générale Annuelle", date: "2026-08-15", time: "14:00", location: "Hôtel Panorama, Ngozi", category: "Gouvernance", description: "Bilan des actions de l'année et élection du nouveau bureau du Rotaract Ngozi.", seats_available: 120 },
      { id: "evt-2", title: "Conférence Leadership & Jeunesse", date: "2026-08-22", time: "09:30", location: "Université de Ngozi, Grand Amphithéâtre", category: "Formation", description: "Atelier interactif sur la prise de parole, la gestion de projets et l'éthique.", seats_available: 250 },
      { id: "evt-3", title: "Gala de Charité & Soirée Rotaractienne", date: "2026-09-05", time: "18:00", location: "Salle Kugasaka Events, Ngozi", category: "Levée de fonds", description: "Grande soirée caritative au profit de l'Orphelinat Sainte-Marie de Ngozi.", seats_available: 80 }
    ],
    activities: [
      { id: "act-1", title: "Collecte Majeure de Sang", category: "Santé", date: "2026-03-15", location: "Centre de Santé de Ngozi", description: "Campagne annuelle de don de sang avec la Croix-Rouge du Burundi.", impact_metrics: "150+ poches collectées" },
      { id: "act-2", title: "Plantation de 500 Arbres", category: "Environnement", date: "2026-04-22", location: "Colline Kugasaka, Ngozi", description: "Opération de reboisement et lutte contre l'érosion des sols.", impact_metrics: "500 arbres plantés" },
      { id: "act-3", title: "Atelier Intensif en Leadership", category: "Formation", date: "2026-05-10", location: "Université de Ngozi", description: "Coaching pratique en éloquence et gouvernance locale.", impact_metrics: "60 jeunes formés" }
    ],
    news: [
      { id: "news-1", title: "Lancement de la Campagne Reboisement 2026 à Ngozi", date: "2026-07-20", author: "Comité Communication", category: "Environnement", summary: "Le Rotaract Ngozi s'engage à planter 1 000 arbres d'ici fin 2026." },
      { id: "news-2", title: "Remise officielle de kits scolaires aux enfants", date: "2026-07-12", author: "Secrétariat Général", category: "Éducation", summary: "85 orphelins ont reçu un sac à dos garni pour la rentrée." }
    ],
    members: [
      { id: "mem-1", name: "Niyonzima Alain", email: "alain.niyonzima@rotaractngozi.bi", role: "Président", phone: "+257 79 123 456", status: "Actif" },
      { id: "mem-2", name: "Irakoze Chantal", email: "chantal.irakoze@rotaractngozi.bi", role: "Secrétaire Générale", phone: "+257 71 987 654", status: "Actif" },
      { id: "mem-3", name: "Ndayishimiye Jean", email: "jean.ndayishimiye@rotaractngozi.bi", role: "Trésorier", phone: "+257 76 555 123", status: "Actif" }
    ],
    registrations: [
      { id: "reg-101", event_id: "evt-1", event_title: "Assemblée Générale Annuelle", name: "Mugisha Eric", email: "eric.mugisha@gmail.com", phone: "+257 79 001 002", registration_date: "2026-07-28 14:20:00", status: "Confirmé" }
    ],
    messages: [
      { id: "msg-1", name: "Gakiza Patrick", email: "patrick.gakiza@yahoo.fr", subject: "Partenariat Entreprise", message: "Bonjour, nous souhaitons parrainer votre prochain Gala de Charité.", message_date: "2026-07-29 11:05:00", is_read: false }
    ],
    subscribers: [
      { id: "sub-1", email: "contact@rotaractngozi.bi", subscribed_at: "2026-07-01 09:00:00", source: "Footer Site Web" },
      { id: "sub-2", email: "partenaire@ngozi-dev.org", subscribed_at: "2026-07-15 16:30:00", source: "Formulaire Newsletter" }
    ],
    user_themes: {} as Record<string, string>,
    audit_logs: [
      { id: 101, user_email: "president@rotaractngozi.bi", user_role: "president", action_type: "VALIDATION_CANDIDATURE", description: "Validation candidature Nkurunziza Jean-Paul", ip_address: "197.221.14.2", created_at: "2026-07-29 10:15:00" },
      { id: 102, user_email: "secretaire@rotaractngozi.bi", user_role: "secretaire", action_type: "PUBLICATION_PV", description: "Publication PV n°15 du Comité Exécutif", ip_address: "197.221.14.8", created_at: "2026-07-28 16:40:00" },
      { id: 103, user_email: "tresorier@rotaractngozi.bi", user_role: "tresorier", action_type: "COTISATION", description: "Encaissement cotisation Ndayishimiye Jean", ip_address: "197.221.14.12", created_at: "2026-07-27 11:20:00" }
    ]
  };

  // --- PHP ENDPOINTS COMPATIBILITY API ---

  // /api/get_events_calendar.php
  app.get(["/api/get_events_calendar.php", "/api/get_events_calendar"], (_req, res) => {
    res.json({
      status: "success",
      source: "PHP MySQL Backend API",
      total: dbStore.events.length,
      events: dbStore.events,
      sql_query: "SELECT * FROM events ORDER BY date ASC;"
    });
  });

  // /api/audit_log.php
  app.get(["/api/audit_log.php", "/api/audit_log"], (_req, res) => {
    res.json({
      status: "success",
      source: "PHP MySQL Backend API",
      logs: dbStore.audit_logs,
      sql_query: "SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 50;"
    });
  });

  app.post(["/api/audit_log.php", "/api/audit_log"], (req, res) => {
    const { user_email, user_role, action_type, description } = req.body || {};
    const newLog = {
      id: Date.now(),
      user_email: user_email || "system@rotaractngozi.bi",
      user_role: user_role || "admin",
      action_type: action_type || "SYSTEM_ACTION",
      description: description || "Action enregistrée via API PHP",
      ip_address: req.ip || "127.0.0.1",
      created_at: new Date().toISOString().slice(0, 19).replace("T", " ")
    };
    dbStore.audit_logs.unshift(newLog);
    res.json({
      status: "success",
      message: "Journal d'audit mis à jour dans la BDD MySQL",
      log: newLog,
      sql_executed: `INSERT INTO audit_logs (user_email, user_role, action_type, description) VALUES ('${newLog.user_email}', '${newLog.user_role}', '${newLog.action_type}', '${newLog.description}');`
    });
  });

  // /api/notifications.php
  app.get(["/api/notifications.php", "/api/notifications"], (_req, res) => {
    res.json({
      status: "success",
      notifications: dbStore.audit_logs.slice(0, 10),
      audit_logs: dbStore.audit_logs,
      sql_query: "SELECT * FROM notifications ORDER BY created_at DESC;"
    });
  });

  // /api/save_user_theme.php
  app.get(["/api/save_user_theme.php", "/api/save_user_theme"], (req, res) => {
    const email = String(req.query.email || "default");
    const theme = dbStore.user_themes[email] || "light";
    res.json({
      status: "success",
      email,
      theme_preference: theme,
      sql_query: `SELECT theme_preference FROM user_settings WHERE email='${email}';`
    });
  });

  app.post(["/api/save_user_theme.php", "/api/save_user_theme"], (req, res) => {
    const { email, mode } = req.body || {};
    if (email && mode) {
      dbStore.user_themes[email] = mode;
    }
    res.json({
      status: "success",
      message: "Préférence de thème enregistrée dans MySQL",
      email: email || "default",
      mode: mode || "light",
      sql_executed: `INSERT INTO user_settings (email, theme_preference) VALUES ('${email}', '${mode}') ON DUPLICATE KEY UPDATE theme_preference='${mode}';`
    });
  });

  // /api/auth_check.php
  app.get(["/api/auth_check.php", "/api/auth_check"], (req, res) => {
    const email = String(req.query.email || "guest@rotaractngozi.bi");
    const role = String(req.query.role || "visiteur");
    res.json({
      status: "success",
      authenticated: true,
      auth_config: { email, role, verified: true },
      sql_query: `SELECT id, email, role, status FROM users WHERE email='${email}';`
    });
  });

  // /api/subscribe_newsletter.php
  app.post(["/api/subscribe_newsletter.php", "/api/subscribe_newsletter"], (req, res) => {
    const { email, source } = req.body || {};
    if (!email) {
      res.status(400).json({ status: "error", error: "Email requis" });
      return;
    }
    const exists = dbStore.subscribers.some(s => s.email.toLowerCase() === String(email).toLowerCase());
    if (!exists) {
      const sub = {
        id: `sub-${Date.now()}`,
        email: String(email),
        subscribed_at: new Date().toISOString().slice(0, 19).replace("T", " "),
        source: source || "Site Web Rotaract"
      };
      dbStore.subscribers.unshift(sub);
    }
    res.json({
      status: "success",
      message: "Inscription newsletter enregistrée en BDD MySQL",
      email,
      sql_executed: `INSERT INTO newsletter_subscribers (email, source) VALUES ('${email}', '${source || 'Site Web'}');`
    });
  });

  // /api/send_email.php / send_contact
  app.post(["/api/send_email.php", "/api/send_email"], (req, res) => {
    const { name, email, subject, message } = req.body || {};
    const newMsg = {
      id: `msg-${Date.now()}`,
      name: name || "Anonyme",
      email: email || "inconnu@domain.com",
      subject: subject || "Message Contact Site",
      message: message || "",
      message_date: new Date().toISOString().slice(0, 19).replace("T", " "),
      is_read: false
    };
    dbStore.messages.unshift(newMsg);
    res.json({
      status: "success",
      message: "Message de contact enregistré en BDD MySQL",
      data: newMsg,
      sql_executed: `INSERT INTO contact_messages (name, email, subject, message) VALUES ('${newMsg.name}', '${newMsg.email}', '${newMsg.subject}', '${newMsg.message}');`
    });
  });

  // /api/register_event.php
  app.post(["/api/register_event.php", "/api/register_event"], (req, res) => {
    const { event_id, event_title, name, email, phone } = req.body || {};
    const newReg = {
      id: `reg-${Date.now()}`,
      event_id: event_id || "evt-1",
      event_title: event_title || "Événement Rotaract",
      name: name || "Inscrit",
      email: email || "user@domain.com",
      phone: phone || "+257 70 000 000",
      registration_date: new Date().toISOString().slice(0, 19).replace("T", " "),
      status: "Confirmé"
    };
    dbStore.registrations.unshift(newReg);
    res.json({
      status: "success",
      message: "Inscription à l'événement confirmée en BDD MySQL",
      registration: newReg,
      sql_executed: `INSERT INTO event_registrations (event_id, event_title, name, email, phone) VALUES ('${newReg.event_id}', '${newReg.event_title}', '${newReg.name}', '${newReg.email}', '${newReg.phone}');`
    });
  });

  // --- GENERIC RESTFUL PHP / MYSQL CRUD CONTROLLER ---
  // Tables allowed: events, activities, news, members, registrations, messages, subscribers, audit_logs
  const getTable = (tableName: string) => {
    const key = tableName.toLowerCase() as keyof typeof dbStore;
    if (dbStore[key] && Array.isArray(dbStore[key])) {
      return { key, list: dbStore[key] as any[] };
    }
    return null;
  };

  // GET /api/crud/:table -> Read All
  app.get("/api/crud/:table", (req, res) => {
    const tableInfo = getTable(req.params.table);
    if (!tableInfo) {
      res.status(404).json({ status: "error", error: `Table '${req.params.table}' non trouvée dans la base MySQL.` });
      return;
    }
    res.json({
      status: "success",
      table: tableInfo.key,
      count: tableInfo.list.length,
      data: tableInfo.list,
      sql_query: `SELECT * FROM \`${tableInfo.key}\` ORDER BY id DESC;`
    });
  });

  // GET /api/crud/:table/:id -> Read One
  app.get("/api/crud/:table/:id", (req, res) => {
    const tableInfo = getTable(req.params.table);
    if (!tableInfo) {
      res.status(404).json({ status: "error", error: `Table '${req.params.table}' non trouvée.` });
      return;
    }
    const item = tableInfo.list.find(i => String(i.id) === String(req.params.id));
    if (!item) {
      res.status(404).json({ status: "error", error: `Enregistrement ID '${req.params.id}' non trouvé.` });
      return;
    }
    res.json({
      status: "success",
      table: tableInfo.key,
      data: item,
      sql_query: `SELECT * FROM \`${tableInfo.key}\` WHERE id='${req.params.id}';`
    });
  });

  // POST /api/crud/:table -> Create (INSERT)
  app.post("/api/crud/:table", (req, res) => {
    const tableInfo = getTable(req.params.table);
    if (!tableInfo) {
      res.status(404).json({ status: "error", error: `Table '${req.params.table}' non trouvée.` });
      return;
    }
    const body = req.body || {};
    const newId = body.id || `${tableInfo.key.slice(0, 3)}-${Date.now()}`;
    const newItem = { id: newId, ...body, created_at: new Date().toISOString().slice(0, 19).replace("T", " ") };
    tableInfo.list.unshift(newItem);

    const keys = Object.keys(newItem).join(", ");
    const vals = Object.values(newItem).map(v => `'${String(v).replace(/'/g, "''")}'`).join(", ");

    res.status(201).json({
      status: "success",
      action: "CREATE",
      table: tableInfo.key,
      data: newItem,
      sql_executed: `INSERT INTO \`${tableInfo.key}\` (${keys}) VALUES (${vals});`
    });
  });

  // PUT /api/crud/:table/:id -> Update (UPDATE)
  app.put("/api/crud/:table/:id", (req, res) => {
    const tableInfo = getTable(req.params.table);
    if (!tableInfo) {
      res.status(404).json({ status: "error", error: `Table '${req.params.table}' non trouvée.` });
      return;
    }
    const index = tableInfo.list.findIndex(i => String(i.id) === String(req.params.id));
    if (index === -1) {
      res.status(404).json({ status: "error", error: `Enregistrement ID '${req.params.id}' non trouvé.` });
      return;
    }
    const updated = { ...tableInfo.list[index], ...req.body, updated_at: new Date().toISOString().slice(0, 19).replace("T", " ") };
    tableInfo.list[index] = updated;

    const setClauses = Object.entries(req.body || {}).map(([k, v]) => `\`${k}\`='${String(v).replace(/'/g, "''")}'`).join(", ");

    res.json({
      status: "success",
      action: "UPDATE",
      table: tableInfo.key,
      data: updated,
      sql_executed: `UPDATE \`${tableInfo.key}\` SET ${setClauses || "updated_at=NOW()"} WHERE id='${req.params.id}';`
    });
  });

  // DELETE /api/crud/:table/:id -> Delete (DELETE)
  app.delete("/api/crud/:table/:id", (req, res) => {
    const tableInfo = getTable(req.params.table);
    if (!tableInfo) {
      res.status(404).json({ status: "error", error: `Table '${req.params.table}' non trouvée.` });
      return;
    }
    const index = tableInfo.list.findIndex(i => String(i.id) === String(req.params.id));
    if (index === -1) {
      res.status(404).json({ status: "error", error: `Enregistrement ID '${req.params.id}' non trouvé.` });
      return;
    }
    const removed = tableInfo.list.splice(index, 1)[0];

    res.json({
      status: "success",
      action: "DELETE",
      table: tableInfo.key,
      deleted_id: req.params.id,
      deleted_data: removed,
      sql_executed: `DELETE FROM \`${tableInfo.key}\` WHERE id='${req.params.id}';`
    });
  });

  // AI Chat Route backed by Gemini API
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== "string") {
        res.status(400).json({ error: "Message valide requis" });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        // Fallback response if GEMINI_API_KEY is missing
        const fallbackAnswer = getRotaractFallbackAnswer(message);
        res.json({ reply: fallbackAnswer, mode: "fallback" });
        return;
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const systemInstruction = `Tu es l'assistant virtuel officiel et chaleureux du Rotaract Club Ngozi Kugasaka au Burundi (Afrique de l'Est).
Ton rôle est de répondre de manière amicale, informative, dynamique et concise aux questions des visiteurs, membres potentiels, partenaires et donateurs en français.

Informations clés sur le club :
- Nom : Rotaract Club Ngozi Kugasaka
- Devise / Slogan : "Jeunes engagés, Actions positives, Impact durable"
- Création : Fondé en 2018 sous le parrainage du Rotary Club de Ngozi et du Rotary International.
- Localisation : Ngozi, Burundi.
- Nombre de membres : Plus de 200 jeunes leaders actifs âgés de 18 à 30 ans.
- Piliers & Valeurs : Service humanitaire, Leadership, Amitié sincère, Développement durable.
- Domaines d'action majeurs :
  1. Santé (Collectes de sang avec la Croix-Rouge du Burundi, Caravanes médicales, Sensibilisation santé).
  2. Environnement (Reboisement, Plantation d'arbres, Journées de salubrité publique).
  3. Éducation & Jeunesse (Soutien aux orphelins, Dons de fournitures scolaires, Ateliers éducatifs).
  4. Leadership & Formation (Formations en prise de parole, gestion de projet, éthique).
- Événements à venir :
  - Assemblée Générale Annuelle (15 Août 2026 à Ngozi)
  - Conférence Leadership Jeunesse (22 Août 2026 à l'Université de Ngozi)
  - Gala de Charité (5 Septembre 2026 à l'Hôtel Panorama)
- Comment rejoindre : L'adhésion est ouverte aux jeunes de 18 à 30 ans via le formulaire de candidature sur la plateforme ou en participant à une réunion d'accueil.
- Contact : Email: contact@rotaractngozi.bi | Tél: +257 79 000 000 | Réseaux: Facebook, Instagram, LinkedIn, WhatsApp.

Sois courtois, encourageant et réponds clairement avec un ton professionnel mais enthousiaste ! N'hésite pas à utiliser des émojis pertinents.`;

      const contents = history && Array.isArray(history) && history.length > 0
        ? history.map((item: { role: string; text: string }) => ({
            role: item.role === "user" ? "user" : "model",
            parts: [{ text: item.text }],
          }))
        : [];

      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const reply = response.text || "Pardon, je n'ai pas pu générer une réponse fluide. Comment puis-je vous aider ?";
      res.json({ reply, mode: "gemini" });
    } catch (err: unknown) {
      console.error("Erreur Gemini Chat:", err);
      const fallback = getRotaractFallbackAnswer(req.body.message || "");
      res.json({ reply: fallback, mode: "fallback_error" });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

function getRotaractFallbackAnswer(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("rejoindre") || lower.includes("membre") || lower.includes("adhésion") || lower.includes("candidater")) {
    return "Pour rejoindre le Rotaract Club Ngozi Kugasaka, cliquez sur le bouton 'Devenir Membre' en haut du site pour remplir le formulaire de candidature. L'adhésion est ouverte à tous les jeunes motivés de 18 à 30 ans ! 🌟";
  }
  if (lower.includes("activité") || lower.includes("action") || lower.includes("projet") || lower.includes("que faites-vous")) {
    return "Nous organisons régulièrement des collectes de sang, des campagnes de reboisement (500+ arbres plantés), des dons de fournitures scolaires aux orphelins et des ateliers de leadership. Découvrez notre grille d'activités ci-dessous ! 🩸🌱📚";
  }
  if (lower.includes("événement") || lower.includes("gala") || lower.includes("conférence") || lower.includes("date")) {
    return "Nos prochains rendez-vous : L'Assemblée Générale le 15 Août, la Conférence Leadership Jeunesse le 22 Août à l'Université de Ngozi, et notre grand Gala de Charité le 5 Septembre. Vous pouvez vous inscrire directement via notre section Événements ! 🎟️";
  }
  if (lower.includes("partenaire") || lower.includes("don") || lower.includes("soutenir") || lower.includes("rotary")) {
    return "Nous collaborons étroitement avec le Rotary Club Ngozi, la Croix-Rouge, l'Université de Ngozi et nos partenaires locaux. Pour faire un don ou devenir partenaire, contactez-nous à contact@rotaractngozi.bi ! 🤝";
  }
  if (lower.includes("bonjour") || lower.includes("salut") || lower.includes("hello") || lower.includes("coucou")) {
    return "Bonjour et bienvenue ! 👋 Je suis l'assistant virtuel du Rotaract Club Ngozi Kugasaka. Comment puis-je vous aider aujourd'hui ?";
  }
  return "Merci pour votre message ! Le Rotaract Club Ngozi Kugasaka réunit plus de 200 jeunes engagés pour impacter positivement la communauté au Burundi. N'hésitez pas à nous laisser vos coordonnées via le formulaire de contact. 😊";
}

startServer();
