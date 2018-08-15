const ProxyChain = require("proxy-chain");

const getProxy = require('./putProxyintoBase.js');

// const getResult = async () => {
//   const proxies = await getProxy.getProxyFromCollection();
//   console.log(result);
//   return result;
// }

// console.log(getResult())

const restCollection = "Rests";
const proxyCollection = "ProxyList";

function Proxy() {
  this.proxyServer = null;

  this.init = function(proxyList) {
    this._proxyList = proxyList;
    this._i = 0;
  };

  this.create = async function() {
    const proxy = await getProxy.getProxyFromCollection();

    console.log("CURRENt PROXY", proxy);
    this.proxyServer = new ProxyChain.Server({
      port: 8000,
      verbose: false,
      prepareRequestFunction: ({ request }) => ({
        upstreamProxyUrl: `http://${proxy.proxy}`
      })
    });
    return this;
  };


  this.start = async function() {
    if (!this.proxyServer) {
      await this.create();
    }
    return new Promise((res, rej) =>
      this.proxyServer.listen(() => {
        console.log(`Router Proxy server is listening on port ${8000}`);
        res(true);
      })
    );
  };

  this.stop = async function() {
    if (this.proxyServer) {
      const isClose = await new Promise((res, rej) =>
        this.proxyServer.close(true, () => {
          console.log("Proxy server was closed.");
          res(true);
        })
      );
      if (isClose) {
        this.proxyServer = null;
      }
    }
  };

  this.changeProxy = async function() {
    // await getProxy.makeProxyCrashed(proxyCollection);

    console.log("PROXY HAS CHANGED")
    await this.stop();
    await this.start();
  };
}

// const proxy = new Proxy();
// proxy.create();
module.exports = Proxy;
