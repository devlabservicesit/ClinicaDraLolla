const express = require("express");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ==========================
// CAPTURA DE LEADS DO SITE
// ==========================
const DATA_DIR = path.join(__dirname, "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");
const AGENDAMENTOS_FILE = path.join(DATA_DIR, "agendamentos.json");
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

function ensureDataFile(filePath) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]", "utf8");
}

function readJsonArray(filePath) {
  ensureDataFile(filePath);
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    console.error(`Erro lendo ${filePath}:`, error);
    return [];
  }
}

function saveRecord(filePath, data, req) {
  const records = readJsonArray(filePath);
  const record = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    page: data.page || req.get("referer") || "Não informado",
    source: data.source || "site",
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Não informado",
    userAgent: req.get("user-agent") || "Não informado",
    ...data,
  };

  records.unshift(record);
  fs.writeFileSync(filePath, JSON.stringify(records, null, 2), "utf8");
  return record;
}

function isValidEmail(value = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

function onlyDigits(value = "") {
  return String(value).replace(/\D/g, "");
}

app.post("/api/leads", (req, res) => {
  const contact = String(req.body.contact || "").trim();
  const phoneDigits = onlyDigits(contact);

  if (!contact) {
    return res.status(400).json({ ok: false, message: "Informe e-mail ou WhatsApp." });
  }

  if (!isValidEmail(contact) && phoneDigits.length < 10) {
    return res.status(400).json({ ok: false, message: "Informe um e-mail válido ou WhatsApp com DDD." });
  }

  const record = saveRecord(LEADS_FILE, {
    contact,
    contactType: isValidEmail(contact) ? "email" : "whatsapp",
  }, req);

  res.status(201).json({ ok: true, message: "Lead salvo com sucesso.", id: record.id });
});

app.post("/api/agendamentos", (req, res) => {
  const { nome, telefone, email, servico, data, horario, mensagem, page, source } = req.body;

  if (!nome || !telefone || !email || !servico) {
    return res.status(400).json({ ok: false, message: "Preencha nome, telefone, e-mail e serviço." });
  }

  if (onlyDigits(telefone).length < 10) {
    return res.status(400).json({ ok: false, message: "Informe telefone/WhatsApp com DDD." });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, message: "Informe um e-mail válido." });
  }

  const record = saveRecord(AGENDAMENTOS_FILE, {
    nome,
    telefone,
    email,
    servico,
    data: data || "A combinar",
    horario: horario || "A combinar",
    mensagem: mensagem || "Sem mensagem adicional",
    page,
    source: source || "formulario_agendamento",
  }, req);

  res.status(201).json({ ok: true, message: "Agendamento salvo com sucesso.", id: record.id });
});

app.get("/api/admin/leads", (req, res) => {
  if (!ADMIN_TOKEN) {
    return res.status(403).json({
      ok: false,
      message: "Configure a variável ADMIN_TOKEN na Railway para liberar o painel de leads.",
    });
  }

  if (req.query.token !== ADMIN_TOKEN) {
    return res.status(401).json({ ok: false, message: "Token inválido." });
  }

  res.json({
    ok: true,
    leads: readJsonArray(LEADS_FILE),
    agendamentos: readJsonArray(AGENDAMENTOS_FILE),
  });
});

// Configura o servidor para entregar os arquivos da pasta 'front' (HTML, CSS, Imagens)
app.use(express.static(path.join(__dirname, "front")));
// Fallback: Tenta encontrar 'assets' na raiz do projeto caso não esteja dentro de 'front'
app.use("/assets", express.static(path.join(__dirname, "assets")));

const TOKEN = process.env.TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post("/webhook", async (req, res) => {
  try {
    const message =
      req.body.entry[0].changes[0].value.messages?.[0];

    if (message) {
      const from = message.from;
      const text = message.text?.body?.toLowerCase();

      let reply = "";

      if (text === "oi" || text === "menu") {
        reply =
          "👋 Bem-vindo à clínica!\n\n1️⃣ Agendar avaliação\n2️⃣ Procedimentos\n3️⃣ Localização";
      }

      else if (text === "1") {
        reply =
          "📅 Para agendar avaliação informe:\nNome + melhor dia.";
      }

      else if (text === "2") {
        reply =
          "💉 Procedimentos disponíveis:\n• Botox\n• Preenchimento\n• Lipo de papada";
      }

      else if (text === "3") {
        reply =
          "📍 Estamos localizados em Recife.\nhttps://maps.google.com";
      }

      else {
        reply = "Digite *menu* para ver as opções.";
      }

      await axios.post(
        `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          text: { body: reply },
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
    }

    res.sendStatus(200);
  } catch (error) {
    console.log(error.response?.data || error);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Bot rodando na porta ${PORT}`);
});