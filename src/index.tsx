import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/store";
import './css/style.css';
import { WebAppProvider } from "@vkruglikov/react-telegram-web-app";
import { NextUIProvider } from "@nextui-org/react";
import './i18n';
import ErrorBoundary from "./components/ErrorBoundary";
import './touch';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { OkxWalletProvider } from "./utils/OkxWalletProvider";
import { MetaMaskUIProvider } from "@metamask/sdk-react-ui"
// import { Web3ModalProvider } from "./utils/Web3ModalProvider";

// @ts-ignore
const tg = window['Telegram'].WebApp;

if (tg && // @ts-ignore
    tg.setHeaderColor) {
    // @ts-ignore
    tg.setHeaderColor('#08121D');
    // @ts-ignore
    tg.setBackgroundColor('#08121D');
    // @ts-ignore
    tg.enableClosingConfirmation();
    // // @ts-ignore
    // tg.requestFullscreen();
    // // @ts-ignore
    // tg.addToHomeScreen();
    // @ts-ignore
    tg.ready();
    // @ts-ignore
    tg.expand();
}

// Enable Eruda if the env variable is provided
if (process.env.REACT_APP_ENABLE_ERUDA_CONSOLE === 'true') {
    // Dynamically import Eruda
    import('eruda').then(eruda => {
        // Initialize Eruda
        eruda.default.init();
    });
}


// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <WebAppProvider options={{ smoothButtonsTransition: false }}>
            <NextUIProvider>
                <TonConnectUIProvider manifestUrl={`${process.env.REACT_APP_URL}/tonconnect-manifest.json`}>
                    <OkxWalletProvider>
                        {/* <Web3ModalProvider> */}
                        <main className="dark text-foreground">
                            <ErrorBoundary>
                                <App />
                            </ErrorBoundary>
                        </main>

                        {/* </Web3ModalProvider> */}
                    </OkxWalletProvider>
                </TonConnectUIProvider>
            </NextUIProvider>
        </WebAppProvider>
    </Provider>
);