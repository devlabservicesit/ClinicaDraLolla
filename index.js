const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys')
const qrcode = require('qrcode-terminal')

async function startBot() {

    const { state, saveCreds } = await useMultiFileAuthState('session')

    const sock = makeWASocket({
        auth: state
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', (update) => {

        const { connection, lastDisconnect, qr } = update

        if(qr){
            console.log("Escaneie o QR Code:")
            qrcode.generate(qr, { small: true })
        }

        if(connection === "close"){

            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut

            console.log("Conexão fechada. Reconectando...", shouldReconnect)

            if(shouldReconnect){
                startBot()
            }

        } else if(connection === "open"){
            console.log("✅ Bot conectado ao WhatsApp")
        }

    })

    sock.ev.on('messages.upsert', async ({ messages }) => {

        const msg = messages[0]

        if(!msg.message) return

        const texto = msg.message.conversation || ""

        if(texto.toLowerCase() === "oi"){

            await sock.sendMessage(msg.key.remoteJid, {
                text: "Olá 👋 Eu sou seu BOT-ZAP!"
            })

        }

    })

}

startBot()