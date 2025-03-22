import React, { useState } from 'react';
import './style.scss';
import { SendTransactionRequest, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { toNano } from 'ton-core';

export function TxForm() {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const wallet = useTonWallet();
  const [tonConnectUi] = useTonConnectUI();

  const handleSendTransaction = async () => {
    if (!wallet?.account?.address || !recipientAddress || !amount) return;

    try {
      const transaction: SendTransactionRequest = {
        validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes from now
        messages: [
          {
            address: recipientAddress,
            amount: toNano(amount).toString(),
          }
        ]
      };

      await tonConnectUi.sendTransaction(transaction);
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  };

  return (
    <div className="send-tx-form">
      <h3>Send TON</h3>
      
      <div className="form-group">
        <label>Recipient Address:</label>
        <input
          type="text"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          placeholder="Enter recipient address"
        />
      </div>

      <div className="form-group">
        <label>Amount (TON):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          step="0.000000001"
          min="0"
        />
      </div>

      {wallet ? (
        <button onClick={handleSendTransaction}>
          Send TON
        </button>
      ) : (
        <button onClick={() => tonConnectUi.openModal()}>
          Connect wallet to send TON
        </button>
      )}
    </div>
  );
}

