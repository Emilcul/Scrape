const fs = require("fs");
const fetch = require("node-fetch");
const MongoClient = require("mongodb").MongoClient;
const request = require("request");
const R  = require('ramda');
 
 
 
 
const restCollection = "Rests";
const proxyCollection = "ProxyList";
 
 
// const promisifyRequest = () =>
//     new Promise((resolve, reject) =>
//         request(
//             {
//                 method: "GET",
//                 uri:
//                     "http://list.didsoft.com/get?email=dashappsou@gmail.com&pass=n6pnmx&pid=httppremium&https=yes",
//                 gzip: true
//             },
//             (error, response, body) => {
//                 if (error) reject(error);
//                 try {
//                     resolve(body);
//                 } catch (err) {
//                     reject(err);
//                 }
//             }
//         )
//     );
 
// const addToCollection = (col) => async (arrToInsert) => {
 
//     //  const idsArray = arrToInsert.split(/\n/g).map(x => x.trim()).map(el => ({ rest: el, selected: false, fetchChances: 0}));
 
//     return new Promise((res, rej) => {
//         MongoClient.connect(
//             connectionString,
//             async (err, client) => {
//                 const db = client.db("Proxy");
//                 const collection = db.collection(col);
//                 console.log('collection', col);
 
//                 if (col == 'Rests') {
//                     console.log('availableRest and UPDATE');
//                     let availableRest = arrToInsert[0];
 
 
 
//                     const objToUpdate = await collection.findOne({ _id: availableRest._id });
//                     console.log("O`bj TRUEEE", objToUpdate)
 
//                     console.log('fetchChances', objToUpdate.fetchChances);
 
//                     await collection.updateOne(
//                         { rest: objToUpdate.rest },
//                         {
//                             $set: { selected: false, fetchChances: objToUpdate.fetchChances + 1 }
//                         }
//                     );
 
//                     const objUpdated = await collection.findOne({ _id: availableRest._id });
//                     console.log("OBJ FALSEEEE", objUpdated);
 
//                 } else if (col == 'Errors') {
 
//                     let availableRest = arrToInsert[0];
 
//                     const objToUpdate = await collection.findOne({ _id: availableRest._id });
 
 
 
 
//                     await db.collection('Rests').updateOne(
//                         { rest: objToUpdate.rest },
//                         {
//                             $set: { selected: true }
//                         }
//                     );
 
//                     const insertData = await collection.insertMany([{ rest: availableRest.rest }]);
 
//                     const objUpdated = await collection.findOne({ _id: availableRest._id });
//                     console.log("OBJ FALSEEEE", objUpdated);
 
//                 } else {
//                     const toInsert = arrToInsert ? typeof arrToInsert === 'object' ? arrToInsert : [arrToInsert] : false
//                     if (toInsert) {
//                         const insertData = await collection.insertMany(arrToInsert);
//                         // console.log("INSERTED", insertData);
//                     }
//                 }
 
//                 // console.log("insertData",arrToInsert);
 
//                 client.close();
//                 res();
//             }
//         );
//     });
// };
 
 
// const getRestFromCollection = async () => {
//     return new Promise((res, rej) => {
//         MongoClient.connect(
//             connectionString,
//             async (err, client) => {
//                 const db = client.db("Proxy");
 
//                 const collection = db.collection('Rests');
//                 let availableRest = await collection.findOne({ selected: false });
//                 await collection.updateOne(
//                     { _id: availableRest._id },
//                     {
//                         $set: { selected: true }
//                     }
//                 );
 
//                 client.close();
 
//                 res(availableRest);
//             }
//         );
//     });
// };
 
// const getProxyFromCollection = async () => {
//     return new Promise((res, rej) => {
//         MongoClient.connect(
//             connectionString,
//             async (err, client) => {
//                 const db = client.db("Proxy");
 
//                 const collection = db.collection('ProxyList');
 
//                 let availableProxy = await collection.findOne({ crashed: false });
 
//                 if (!availableProxy) {
//                     console.log("Update PROXY");
 
//                     await updateProxyDb();
//                     availableProxy = await collection.findOne({ crashed: false });
//                 }
//                 await collection.updateOne(
//                     { _id: availableProxy._id },
//                     {
//                         $set: { crashed: true }
//                     }
//                 );
 
//                 client.close();
 
//                 res(availableProxy);
//             }
//         );
//     });
// };
 
 
 
 
// const readProxies = async str =>
//     new Promise(async (res, rej) => {
//         const result = await new Promise((res, rej) =>
//             fs.readFile(str, "utf8", (err, data) => {
//                 if (err) rej(err);
//                 res(data);
//             })
//         );
//         res(result);
//     });
 
// const mapProxy = str => {
//     const countryFilter = str.split("\n")
//         .filter(string => /US|CA/.test(string));
//     const result = countryFilter
//         .map(string => string.replace(/[USCA#]/g, ""))
//         .map(string => ({ proxy: string, crashed: false }));
//     return result;
// };
 
// const updateProxyDb = () =>
//     promisifyRequest()
//         .then(mapProxy)
//         .then(addToCollection(proxyCollection));
 
// // const makeALL = async () => {
// //   const proxyList = await promisifyRequest().then(mapProxy);
// //   const data = await addToCollection(proxyList);
// //   console.log("dat", data);
// // };
 
// const localStr =  'mongodb://localhost:27017';
// const localDB  = 'scrapeLocal';
// const writeIntoLocalMongo = async (data) => new Promise((res, rej) =>
//     MongoClient.connect(
//         localStr,
//         async (err, client) => {
//             const db = client.db(localDB);
//             const resultsCollection = db.collection('Results');
//             const rest = db.collection('Rests')
 
           
//             await rest.insertMany(data);
//             console.log("DONE");
//             res();
 
//         }
//     ));
 

 
const connectionString = "mongodb://localhost:27017";

 
MongoClient.connect(
    connectionString,
        async (err, client) => {
        const db = client.db('Proxy');
        const resultCollection = db.collection('Results');
        const restCollection = db.collection('Rests');
 
        const rest = await restCollection.find({}).toArray();
        const results = await resultCollection.find({}).toArray().then(y => y.map(x => x.id));
 
        const unresolvedIDS = rest.filter(x => !results.includes(x.rest)).map(x => ({...x, selected: false}));
 
        await restCollection.drop();
 
        await restCollection.insertMany(unresolvedIDS);
        console.log("NEW RESTS", unresolvedIDS.length)
 
       
        client.close();
 
    }
);