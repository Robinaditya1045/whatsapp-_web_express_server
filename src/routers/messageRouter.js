const express = require("express");
const router = new express.Router();
const { startClient } = require("../services/WhatsappClient");

router.get("/", (req, res) => {
  res.send("Hello World!");
});

// router.post("/message", upload.single("file"), (req, res) => {
//   const file = req.file
//   const clientId = req.body.clientId;
//   sendMessage(req.body.phoneNumber, req.body.message, clientId, file);
//   res.send();
// })

router.post("/start", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).send("Client ID is required.");
  }

  try {
    const { qr } = await startClient(id);
    console.log("QR Code sent to client:", qr); // Log the QR code being sent
    if (qr) {
      res.status(200).json({ message: "QR code generated.", qr });
    } else {
      res.status(200).json({ message: "Client is ready!" });
    }
  } catch (error) {
    console.log("Error starting client:", error);
    res.status(500).send("Failed to start WhatsApp client.");
  }
});



module.exports = router;
