import '../img/icon-128.png'
import '../img/icon-34.png'

import WalletConnect from '@walletconnect/browser';
import { setupMessageListener } from "chrome-extension-message-wrapper";

const bridge = "https://bridge.walletconnect.org";

const walletConnector = new WalletConnect({ bridge });

const checkConnection = () => {
    return walletConnector.connected;
}

const generateUri = async () => {
    await walletConnector.createSession();
    const uri = walletConnector.uri;
    return uri;
}

const loadDapplet = async (dappletId, metaTx) => {
    try {
        const result = await walletConnector.loadDapplet(dappletId, metaTx);
        return result;
    } catch {
        return null;
    }
};

const waitPairing = () => {
    var promise = new Promise(function (resolve, reject) {
        walletConnector.on("connect", (error, payload) => {
            if (error) {
                reject(error);
            }

            resolve(true);
        });
    });

    return promise;
}

chrome.runtime.onMessage.addListener(
    setupMessageListener({
        loadDapplet,
        generateUri,
        checkConnection,
        waitPairing
    })
);
