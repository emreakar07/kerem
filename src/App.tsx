import './App.scss'
import {THEME, TonConnectUIProvider} from "@tonconnect/ui-react";
import {TxForm} from "./components/TxForm/TxForm";

function App() {
  return (
      <TonConnectUIProvider
          manifestUrl="https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json"
          uiPreferences={{ theme: THEME.DARK }}
          walletsListConfiguration={{
            includeWallets: [
              {
                appName: "telegram-wallet",
                name: "Wallet",
                imageUrl: "https://wallet.tg/images/logo-288.png",
                aboutUrl: "https://wallet.tg/",
                universalLink: "https://t.me/wallet?attach=wallet",
                bridgeUrl: "https://bridge.ton.space/bridge",
                platforms: ["ios", "android", "macos", "windows", "linux"]
              }
            ]
          }}
      >
        <div className="app-container">
          <TxForm />
        </div>
      </TonConnectUIProvider>
  );
}

export default App
