import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Client } from 'xmtpjs';
import './App.css';

function App() {
  const [message, setMessage] = useState("");
  const [address, setAddress] = useState("");
  const [xmtpClient, setXmtpClient] = useState(null);

  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const xmtp = await Client.create(signer);
    setXmtpClient(xmtp);
  };

  const sendMessage = async () => {
    if (xmtpClient) {
      const conversation = await xmtpClient.conversations.newConversation(address);
      await conversation.send(message);
      alert("Message sent!");
    }
  };

  return (
    <div className="App">
      <button onClick={connectWallet}>Connect Wallet</button>
      <input
        type="text"
        placeholder="Receiver Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
}

export default App;
