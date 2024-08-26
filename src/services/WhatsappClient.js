const { Client, LocalAuth } = require("whatsapp-web.js");
const axios = require("axios");
const qrcode = require("qrcode"); // Import the qrcode package

const clients = {};

async function startClient(id) {
  return new Promise((resolve, reject) => {
    clients[id] = new Client({
      authStrategy: new LocalAuth({ clientId: id }),
    });

    clients[id].initialize().catch((err) => reject(err));

    clients[id].on("qr", async (qr) => {
      console.log("QR received");

      try {
        // Generate Base64 QR code string
        const base64Qr = await qrcode.toDataURL(qr);
        resolve({ qr: base64Qr });
      } catch (error) {
        reject(error);
      }
    });

    clients[id].on("ready", () => {
      console.log("Client is ready!");
      resolve({ qr: null });
    });
    
    clients[id].on("message_create", async (msg) => {
      try {
        const contact = await msg.getContact();
        const yourNumber = contact.id._serialized;
        const userId = id;

        if (msg.from === yourNumber && msg.to === yourNumber) {
          const { body } = msg;

          let apiEndpoint;
          if (body.startsWith('/link')) {
            apiEndpoint = 'http://localhost:3000/api/whatsapp-message/links';
          } else if (body.startsWith('/task')) {
            apiEndpoint = 'http://localhost:3000/api/whatsapp-message/tasks';
          }

          if (apiEndpoint) {
            const messageDetails = {
              from: msg.from,
              to: msg.to,
              body: msg.body,
              isGroupMsg: msg.isGroupMsg,
              type: msg.type,
              userId: userId
            };

            console.log("Message received:", messageDetails);
            await axios.post(apiEndpoint, messageDetails);
          } else {
            console.log("Message does not match any command prefix.");
          }
        }
      } catch (error) {
        console.log("Error processing message create:", error);
      }
    });
  });
}

module.exports = { startClient };
