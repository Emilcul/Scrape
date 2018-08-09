const fs = require("fs");
const fetch = require("node-fetch");
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const request = require("request");

const connectionString = "mongodb://localhost:27017";

const restCollection = "Rests";
const proxyCollection = "ProxyList";


const promisifyRequest = () =>
  new Promise((resolve, reject) =>
    request(
      {
        method: "GET",
        uri:
          "http://list.didsoft.com/get?email=dashappsou@gmail.com&pass=n6pnmx&pid=httppremium&https=yes",
        gzip: true
      },
      (error, response, body) => {
        if (error) reject(error);
        try {
          resolve(body);
        } catch (err) {
          reject(err);
        }
      }
    )
  );

const addToCollection = (col) => async (arrToInsert) => {
    // const idsArray = arrToInsert.split(/\n/g).map(x => x.trim()).map(el => ({ rest: el, selected: false}));

  return new Promise((res, rej) => {
    MongoClient.connect(
      connectionString,
      async (err, client) => {
        const db = client.db("Proxy");
        const collection = db.collection(col);

        console.log("insertData",arrToInsert);
        const toInsert = arrToInsert? typeof arrToInsert === 'object'? arrToInsert : [arrToInsert] : false
        if(toInsert) {
            const insertData = await collection.insertMany(arrToInsert);
            console.log("INSERTED", insertData);
        }
        client.close();
        res();
      }
    );
  });
};

const getFromCollection = async (col) => {
  return new Promise((res, rej) => {
    MongoClient.connect(
      connectionString,
      async (err, client) => {
        const db = client.db("Proxy");

        const collection = db.collection(col);
        let availableProxy = await collection.findOne({ selected: false });
        if (!availableProxy && col === proxyCollection) {
         console.log("Update PROXY");
          await updateProxyDb();
          availableProxy = await collection.findOne({ selected: false });
        }
        await collection.updateOne(
          { _id: availableProxy._id },
          {
            $set: { selected: true }
          }
        );

        client.close();

        res(availableProxy);
      }
    );
  });
};

const readProxies = async str =>
  new Promise(async (res, rej) => {
    const result = await new Promise((res, rej) =>
      fs.readFile(str, "utf8", (err, data) => {
        if (err) rej(err);
        res(data);
      })
    );
    res(result);
  });

const mapProxy = str => {
  const countryFilter = str.split("\n")
//   .filter(string => /US|CA/.test(string));
  const result = countryFilter
    .map(string => string.replace(/[USCA#]/g, ""))
    .map(string => ({ proxy: string, selected: false }));
  return result;
};

const updateProxyDb = () =>
  promisifyRequest()
    .then(mapProxy)
    .then(addToCollection(proxyCollection));

// const makeALL = async src => {
//   const proxyList = await promisifyRequest(src).then(mapProxy);
//   const data = await addToCollection(proxyList);
//   console.log("dat", data);
// };

module.exports = {
    addToCollection,
  getFromCollection
};

// fs.readFile('all_fb_ids.txt','utf8', addToCollection("Rests"));

// makeALL('http://list.didsoft.com/get?email=dashappsou@gmail.com&pass=n6pnmx&pid=httppremium&https=yes');
