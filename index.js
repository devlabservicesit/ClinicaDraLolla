const express = require("express");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());

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

app.listen(8080, () => {
  console.log("Bot rodando na porta 8080");
});