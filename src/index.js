const express = require("express")
const messageRouter = require('./routers/messageRouter')
const whatsappclient = require('./services/WhatsappClient')

// whatsappclient.initialize()

const app = express()
app.use(express.json())
app.use(messageRouter)

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server is ready in on port ${PORT}`))