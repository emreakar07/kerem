import { Address, beginCell, Cell, toNano } from 'ton-core';
import { TonClient } from 'ton';

// USDT Jetton Master Contract Address (Mainnet)
export const USDT_MASTER_ADDRESS = 'EQBynBO23ywHy_CgarY9NK9FTz0uDsG82PtcbSTQgGoXwiuA';

// Jetton Wallet ABI
const JETTON_WALLET_ABI = {
  transfer: (params: {
    toAddress: Address;
    amount: bigint;
    responseDestination?: Address;
    customPayload?: Cell;
    forwardTonAmount?: bigint;
    forwardPayload?: Cell;
  }) => {
    const msgBody = beginCell()
      .storeUint(0xf8a7ea5, 32)
      .storeUint(0, 64)
      .storeCoins(params.amount)
      .storeAddress(params.toAddress)
      .storeAddress(params.responseDestination || null)
      .storeMaybeRef(params.customPayload)
      .storeCoins(params.forwardTonAmount || 0)
      .storeMaybeRef(params.forwardPayload)
      .endCell();
    return msgBody;
  }
};

export async function getJettonWalletAddress(
  client: TonClient,
  masterAddress: Address,
  ownerAddress: Address
): Promise<Address> {
  const jettonWalletAddress = await client.runMethod(
    masterAddress,
    'get_wallet_address',
    [{ type: 'slice', cell: beginCell().storeAddress(ownerAddress).endCell() }]
  );
  return jettonWalletAddress.stack.readAddress();
}

export function createUSDTTransferPayload(
  toAddress: Address,
  amount: bigint,
  responseDestination?: Address,
  forwardTonAmount?: bigint,
  forwardPayload?: Cell
): Cell {
  return JETTON_WALLET_ABI.transfer({
    toAddress,
    amount,
    responseDestination,
    forwardTonAmount,
    forwardPayload
  });
}

export function createUSDTTransferTransaction(
  jettonWalletAddress: Address,
  toAddress: Address,
  amount: bigint,
  responseDestination?: Address,
  forwardTonAmount?: bigint,
  forwardPayload?: Cell
) {
  const payload = createUSDTTransferPayload(
    toAddress,
    amount,
    responseDestination,
    forwardTonAmount,
    forwardPayload
  );

  return {
    validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes
    messages: [
      {
        address: jettonWalletAddress.toString(),
        amount: toNano('0.05').toString(), // Gas fee
        payload: payload.toBoc().toString('base64')
      }
    ]
  };
} 