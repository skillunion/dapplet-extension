import '../img/icon-128.png'
import '../img/icon-34.png'

import WalletConnect from '@walletconnect/browser';

async function init() {
    const bridge = "https://bridge.walletconnect.org";

    // create new walletConnector
    const walletConnector = new WalletConnect({ bridge });

    chrome.extension.onConnect.addListener(function (port) {
        console.log("Connected .....");

        var connectWalletAsync = function (uri) {
            var promise = new Promise(function (resolve, reject) {
                port.postMessage({ type: 'bg_inpage_openModal', uri: uri });

                walletConnector.on("connect", (error, payload) => {
                    console.log('walletConnector.on("connect")'); // tslint:disable-line

                    if (error) {
                        reject(error);
                    }

                    port.postMessage({ type: 'bg_inpage_closeModal' });

                    resolve();
                });
            });

            return promise;
        }

        port.onMessage.addListener(async function (msg) {
            console.log("message recieved" + msg);

            if (msg.type === 'inpage_bg_loadDapplet') {
                if (!walletConnector.connected) {
                    await walletConnector.createSession();
                    const uri = walletConnector.uri;
                    console.log(uri);
                    await connectWalletAsync(uri);
                }

                walletConnector.loadDapplet(msg.dappletId, msg.metadata);
            }
        });

        walletConnector.on("disconnect", (error, payload) => {
            console.log('walletConnector.on("disconnect")'); // tslint:disable-line

            if (error) {
                throw error;
            }

            localStorage.clear(); // TODO: May be use native clear methods of walletConnector, if they exist
        });
    })
}

init();