const ProxyChain = require("proxy-chain");

const kek = proxy => {
  const proxyServer = new ProxyChain.Server({
    port: 8000,
    verbose: false,
    prepareRequestFunction: ({ request }) => {
      let upstreamProxyUrl = proxy;
      return { upstreamProxyUrl };
    }
  });

  proxyServer.listen(() => {
    console.log(`Router Proxy server is listening on port ${8000}`);
  });

  proxyServer.close(true, () => {
    console.log("Proxy server was closed.");
  });

  return proxyServer;
};

function Proxy() {
  this.proxyServer = null;
  this._proxyList = [];
  this._i = 0;

  this.init = function(proxyList) {
    this._proxyList = proxyList;
    this._i = 0;
  };

  this.create = function() {
    this.proxyServer = new ProxyChain.Server({
      port: 8000,
      verbose: false,
      prepareRequestFunction: ({ request }) => ({
        upstreamProxyUrl: this._proxyList[this._i]
      })
    });
    this._i++;
    return this;
  };
  this.start = async function() {
    if (!this.proxyServer) this.create();

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
    await this.stop();
    await this.create();
    await this.start();
  };
}

module.exports = Proxy;
