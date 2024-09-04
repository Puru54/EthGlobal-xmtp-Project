// server/index.js
require('dotenv').config();
const express = require('express');
const XMTP = require('@xmtp/xmtp-js');
const ethers = require('ethers');

const app = express();
app.use(express.json());

// Initialize XMTP Client
async function initXMTP() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  const xmtp = await XMTP.Client.create(wallet);
  return xmtp;
}

// Messaging Route
app.post('/send-message', async (req, res) => {
  const { toAddress, message } = req.body;
  const xmtp = await initXMTP();
  
  const conversation = await xmtp.conversations.newConversation(toAddress);
  await conversation.send(message);

  res.json({ success: true, message: "Message sent" });
});

// Subscribe for messages
app.post('/subscribe', async (req, res) => {
  const { address } = req.body;
  const xmtp = await initXMTP();

  const conversations = await xmtp.conversations.list();

  conversations.forEach(async (conversation) => {
    if (conversation.peerAddress === address) {
      for await (const message of await conversation.streamMessages()) {
        console.log(message.content);
      }
    }
  });

  res.json({ success: true, message: "Subscribed" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
