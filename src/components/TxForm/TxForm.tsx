import React, { useCallback, useState, useEffect } from 'react';
import ReactJson, { InteractionProps } from 'react-json-view';
import './style.scss';
import { SendTransactionRequest, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { Address, toNano } from 'ton-core';
import { TonClient } from 'ton';
import { USDT_MASTER_ADDRESS, getJettonWalletAddress, createUSDTTransferTransaction } from '../../utils/usdt';

// In this example, we are using a predefined smart contract state initialization (`stateInit`)
// to interact with an "EchoContract". This contract is designed to send the value back to the sender,
// serving as a testing tool to prevent users from accidentally spending money.
const defaultTx: SendTransactionRequest = {
  // The transaction is valid for 10 minutes from now, in unix epoch seconds.
  validUntil: Math.floor(Date.now() / 1000) + 600,
  messages: [
    {
      address: '',
      amount: '0',
      payload: ''
    }
  ],
};

export function TxForm() {
  const [tx, setTx] = useState(defaultTx);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [jettonWalletAddress, setJettonWalletAddress] = useState<string>('');
  const wallet = useTonWallet();
  const [tonConnectUi] = useTonConnectUI();

  useEffect(() => {
    if (wallet?.account?.address) {
      const client = new TonClient({ endpoint: 'https://toncenter.com/api/v2/jsonRPC' });
      const ownerAddress = Address.parse(wallet.account.address);
      const masterAddress = Address.parse(USDT_MASTER_ADDRESS);
      
      getJettonWalletAddress(client, masterAddress, ownerAddress)
        .then(address => {
          setJettonWalletAddress(address.toString());
        })
        .catch(console.error);
    }
  }, [wallet?.account?.address]);

  const handleSendUSDT = async () => {
    if (!wallet?.account?.address || !recipientAddress || !amount) return;

    try {
      const toAddress = Address.parse(recipientAddress);
      const amountNano = toNano(amount);
      
      const transaction = createUSDTTransferTransaction(
        Address.parse(jettonWalletAddress),
        toAddress,
        amountNano
      );

      await tonConnectUi.sendTransaction(transaction);
    } catch (error) {
      console.error('Error sending USDT:', error);
    }
  };

  const onChange = useCallback((value: InteractionProps) => {
    setTx(value.updated_src as SendTransactionRequest)
  }, []);

  return (
    <div className="send-tx-form">
      <h3>Send USDT</h3>
      
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
        <label>Amount (USDT):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          step="0.000001"
        />
      </div>

      {wallet ? (
        <button onClick={handleSendUSDT}>
          Send USDT
        </button>
      ) : (
        <button onClick={() => tonConnectUi.openModal()}>
          Connect wallet to send USDT
        </button>
      )}
    </div>
  );
}

