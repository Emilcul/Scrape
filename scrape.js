const puppeteer = require("puppeteer");
const fs = require("fs");
const proxy = require("./proxyServer.js");
// const addToCollection = require('./mongoConnection.js');
const collectionServ = require("./putProxyintoBase.js");

// const fetchProxy = require('fakeFetch.js');

const ROUTER_PROXY = "http://127.0.0.1:8000";

const uas = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
];

let scrape = async (id, i) => {
  console.log("CURRENT EL ", id);

  const browser = await puppeteer.launch({
    args: [`--proxy-server=${ROUTER_PROXY}`],
    headless: false
  });

  const page = await browser.newPage();
  page.setUserAgent(uas[0]);
  const link = "https://www.facebook.com/" + id;

  await page.goto(link);
  await page.setViewport({ width: 1000, height: 1000 });

  const mainPage = await page.evaluate(() => {
    if (document.querySelector("._4-u3._5dwa._5dwb._g3i")) {
      const getLocation = () => {
        if (document.querySelector("._4-u2._u9q._3xaf._4-u8")) {
          const arr = document
            .querySelector("._4-u2._u9q._3xaf._4-u8")
            .querySelectorAll("._4bl9");

          const filteredArr = [].filter.call(arr, node => {
            if (node.querySelector("._2wzd")) return true;
            else false;
          });

          if (filteredArr[0]) {
            const locationWithPostal = filteredArr[0].querySelector("._2wzd")
              .innerHTML;
            const arr = locationWithPostal.split("<br>");
            const streetAdr = arr[0].trim();
            const postal = arr[1].replace(/\D/g, "").trim();
            const cityAndState = arr[1].replace(/\d/g, "");
            const addressLocality = cityAndState.split(",")[0].trim();
            const addressRegion = cityAndState.split(",")[1].trim();

            const single_line_address =
              streetAdr +
              ", " +
              addressLocality +
              ", " +
              addressRegion +
              " " +
              postal;

            return [
              single_line_address,
              { streetAdr, postal, addressLocality, addressRegion }
            ];
          } else return "not signed";
        } else return "not signed";
      };

      const getWebsite = () => {
        if (
          document
            .querySelector("._4-u2._u9q._3xaf._4-u8")
            .querySelector("#u_0_q")
        ) {
          if (
            document
              .querySelector("._4-u2._u9q._3xaf._4-u8")
              .querySelector("#u_0_q")
              .getElementsByTagName("a")[1]
          ) {
            return document
              .querySelector("._4-u2._u9q._3xaf._4-u8")
              .querySelector("#u_0_q")
              .getElementsByTagName("a")[1].innerText;
          } else if (document.querySelector("._4bl9._v0m")) {
            if (
              document.querySelector("._4bl9._v0m").getElementsByTagName("a")[1]
            ) {
              return document
                .querySelector("._4bl9._v0m")
                .getElementsByTagName("a")[1].innerText;
            } else if (
              document
                .querySelectorAll("._4bl9._v0m")[1]
                .getElementsByTagName("a")[1]
            ) {
              return document
                .querySelectorAll("._4bl9._v0m")[1]
                .getElementsByTagName("a")[1].innerText;
            }
          } else return "not signed";
        } else if (document.querySelector("._4bl9._v0m")) {
          if (
            document.querySelector("._4bl9._v0m").getElementsByTagName("a")[1]
          ) {
            return document
              .querySelector("._4bl9._v0m")
              .getElementsByTagName("a")[1].innerText;
          } else if (
            document
              .querySelectorAll("._4bl9._v0m")[1]
              .getElementsByTagName("a")[1]
          ) {
            return document
              .querySelectorAll("._4bl9._v0m")[1]
              .getElementsByTagName("a")[1].innerText;
          }
        } else return "not signed";
      };

      const getEngagement = () => {
        if (document.querySelector("._4-u2._6590._3xaf._4-u8")) {
          const engagement = document
            .querySelector("._4-u2._6590._3xaf._4-u8")
            .querySelector("._4bl9")
            .innerText.replace(/,/, "")
            .replace(/people like this/, "");

          return parseInt(engagement.replace(/\n/, ""));
        } else return "not signed";
      };

      const getRatingCount = () => {
        if (
          document
            .querySelector("._4-u2._5tsm._4-u8")
            .firstChild.getElementsByTagName("meta")[1]
        ) {
          const rating_count = +document
            .querySelector("._4-u2._5tsm._4-u8")
            .firstChild.getElementsByTagName("meta")[1].content;
          return rating_count;
        } else return;
      };

      const getNameAndStarRating = () => {
        if (document.querySelector("._4-u2._1c02._3-96._4-u8")) {
          const selector = document.querySelector("._4-u2._1c02._3-96._4-u8");
          const arrOfNodes = selector.childNodes;

          const name = selector.querySelector("#seo_h1_tag > span").innerText;
          const description = selector.querySelector("#seo_h1_tag > div")
            .innerText;

          const overall_star_rating = [].map.call(arrOfNodes, node => {
            if (node.querySelector(".accessible_elem"))
              return node.querySelector(".accessible_elem").innerText;
            else return;
          })[1];
          return { name, description, overall_star_rating };
        } else if (document.querySelector("._4-u2._1c02._3-96._4-u8") == null) {
          const description = document
            .querySelector("._4-u2._3-96._4-u8")
            .querySelector("._1c03").innerText;

          const getOverall_star_rating = () => {
            if (document.querySelector("._4-u2._3-96._4-u8")) {
              return +document
                .querySelector("._4-u2._3-96._4-u8")
                .querySelector("._8jy").firstChild.innerText;
            }
          };

          const getName = () => {
            if (
              document.querySelector("._1qkq._1qks").querySelector("#u_0_e")
            ) {
              return document
                .querySelector("._1qkq._1qks")
                .querySelector("#u_0_e")
                .querySelector("#seo_h1_tag").firstChild.innerText;
            } else if (document.querySelector("#seo_h1_tag > a > span")) {
              return document.querySelector("#seo_h1_tag > a > span").innerText;
            } else return "not signed";
          };

          return { name: getName(), description, overall_star_rating };
        }
      };

      const result = Object.assign(getNameAndStarRating(), {
        engagement: getEngagement(),
        rating_count: getRatingCount(),
        website: getWebsite(),
        location: getLocation()[1],
        single_line_address: getLocation()[0]
      });
      return result;
    } else {
      return null;
    }
  });

  if (!!mainPage) {
    const seeAllInf = await page.evaluate(() => {
      return document.querySelector("._5u7u").href;
    });

    await page.goto(seeAllInf);

    const getPhotosUrl = await page.evaluate(() => {
      if (document.querySelectorAll("._2yav")) {
        const arr = document.querySelectorAll("._2yav");
        const result = [].filter.call(
          arr,
          node => node.innerText == "Photos"
        )[0];
        if (result) {
          return result.parentNode.href;
        }
      }

      return null;
    });

    const moreInf = await page.evaluate(x => {
      const getWebsite = () => {};

      const getHours = () => {
        if (document.querySelectorAll("._4-u2._3xaf._3-95._4-u8")[1]) {
          if (
            document
              .querySelectorAll("._4-u2._3xaf._3-95._4-u8")[1]
              .querySelector("._50f7").innerText == "HOURS"
          ) {
            if (
              document
                .querySelectorAll("._4-u2._3xaf._3-95._4-u8")[1]
                .querySelector(".clearfix._ikh._5jau._p")
            ) {
              return document
                .querySelectorAll("._4-u2._3xaf._3-95._4-u8")[1]
                .querySelector(".clearfix._ikh._5jau._p").firstChild.innerText;
            }
          }
        } else {
          return "not signed";
        }
      };

      const getBusinnesInf = () => {
        const businessInfo = document.querySelector("._2piu._4wye.lfloat._ohe");

        const businessArr = businessInfo.querySelectorAll(
          ".clearfix._ikh._3-95"
        );

        const price_range = [].map
          .call(businessArr, elem => {
            if (
              elem.children[0].innerText == "Price Range" ||
              elem.children[0].innerText == "Price range"
            )
              return elem.children[1].innerText;
          })
          .filter(el => el != null)
          .join(", ");

        const restaurant_services = [].map
          .call(businessArr, elem => {
            if (elem.children[0].innerText == "Services")
              return elem.children[1].innerText;
          })
          .filter(el => el != null)
          .join(", ");

        const restaurant_specialties = [].map
          .call(businessArr, elem => {
            if (elem.children[0].innerText == "Specialties")
              return elem.children[1].innerText;
          })
          .filter(el => el != null)
          .join(", ");

        return { restaurant_services, restaurant_specialties, price_range };
      };

      const about = () => {
        if (document.querySelector("._3-8w") != null) {
          return document.querySelector("._3-8w").innerText;
        } else return "not signed";
      };

      const getLatLong = () => {
        if (document.querySelector("._3n4n")) {
          const srcOfCoord = document
            .querySelector("._3n4n")
            .querySelector("._4j7v").firstChild.src;

          let index = srcOfCoord.search(/markers=/);

          let result = srcOfCoord.substring(index);
          let arr = result.split(/%2C/);

          let LatAndLong = arr.map(x => x.replace(/[^-0-9\.]/gim, ""));
          let lat = LatAndLong[0];
          let long = LatAndLong[1];
          return { lat, long };
        } else return "not signed";
      };

      const phone = () => {
        if (document.querySelector("._50f4")) {
          return document.querySelector("._50f4").innerText.replace(/Call/, "");
        } else return "not signed";
      };

      const category_list = () => {
        if (
          document.querySelector(
            "#PagesProfileAboutInfoPagelet_" +
              x +
              " > div.clearfix > div._2piu._4wye.lfloat._ohe > div > div.clearfix._ikh._3-8j > div._4bl9._5m_o"
          )
        ) {
          const colletionOfservices = document.querySelector(
            "#PagesProfileAboutInfoPagelet_" +
              x +
              " > div.clearfix > div._2piu._4wye.lfloat._ohe > div > div.clearfix._ikh._3-8j > div._4bl9._5m_o"
          );

          if (colletionOfservices != null) {
            return colletionOfservices.innerText;
          }
        } else return "not signed";
      };

      let result = Object.assign(getBusinnesInf(), {
        about: about(),
        phone: phone(),
        category_list: category_list(),
        hours: getHours(),
        latandLong: getLatLong(),
        id: x
      });

      return result;
    }, id);

    if (getPhotosUrl) {
      await page.goto(getPhotosUrl);
    }

    try {
      await page.waitForSelector("._2eea", { timeout: 10000 });
    } catch (e) {
      console.log(e);
    }

    const getPhotos = await page.evaluate(() => {
      if (document.querySelectorAll("._2eea")) {
        const photos = document.querySelectorAll("._2eea");
        const result = [];

        for (let i = 0; i < photos.length; i++) {
          result.push(photos[i].getElementsByTagName("img")[0].src);
        }
        return result;
      } else return "no photos";
    });

    const data = Object.assign(moreInf, mainPage, { link, photos: getPhotos });

    const ordered = {};
    Object.keys(data)
      .sort()
      .forEach(function(key) {
        ordered[key] = data[key];
      });

    browser.close();

    return ordered;
  } else {
    const getAnotherTypeOfPage = await page.evaluate(z => {
      if (document.querySelector("#vertex-info-item-address")) {
        const address = () => {
          if (document.querySelector("#vertex-info-item-address")) {
            if (
              document
                .querySelector("#vertex-info-item-address")
                .querySelector(".uiList._4kg")
            ) {
              if (
                !document
                  .querySelector("#vertex-info-item-address")
                  .querySelector(".uiList._4kg").firstChild.href
              ) {
                const address = document
                  .querySelector("#vertex-info-item-address")
                  .querySelector(".uiList._4kg").children;

                const streetAdr = address[0].innerText;
                const addressLocality = address[1].innerText.split(",")[0];
                const stateCityPostal = address[1].innerText.split(" ");
                const postal = stateCityPostal[stateCityPostal.length - 1];
                const addressRegion =
                  stateCityPostal[stateCityPostal.length - 2];
                const single_line_address =
                  streetAdr + ", " + address[1].innerText;

                const result = [
                  single_line_address,
                  { addressLocality, addressRegion, streetAdr, postal }
                ];
                return result;
              }
            }
          } else return "not signed";
        };

        const website = () => {
          if (
            document
              .querySelector("#vertex-info-item-website")
              .querySelector("._480u")
          ) {
            if (
              document
                .querySelector("#vertex-info-item-website")
                .querySelector("._480u").firstChild
            ) {
              return document
                .querySelector("#vertex-info-item-website")
                .querySelector("._480u").firstChild.href;
            }
          } else {
            return "not signed";
          }
        };

        const prise_range = () => {
          if (document.querySelector("#vertex-info-item-price")) {
            return document
              .querySelector("#vertex-info-item-price")
              .querySelector("._480u").innerText;
          } else {
            return "not signed";
          }
        };

        const getLoc = () => {
          const locationUrl = document
            .querySelector("._5wsb._f8x")
            .querySelector("._4j7v").firstChild.src;

          let index = locationUrl.search(/markers=/);

          let result = locationUrl.substring(index);
          let arr = result.split(/%2C/);

          let LatAndLong = arr.map(x => x.replace(/[^-0-9\.]/gim, ""));
          let lat = LatAndLong[0];
          let long = LatAndLong[1];

          return { lat, long };
        };

        const getNameAndDescription = () => {
          const name = document.querySelector("._2i5e").firstChild.innerText;
          const description = document
            .querySelector("._2i5e")
            .querySelector(".fsm.fwn.fcg").innerText;

          return { name, description };
        };

        const overall_star_rating = () => {
          if (document.querySelector("._2pt2")) {
            if (
              document.querySelector("._2pt2").getElementsByTagName("meta")[0]
            ) {
              const star_rating = document
                .querySelector("._2pt2")
                .getElementsByTagName("meta")[0].content;
              return star_rating;
            }
          } else return "not signed";
        };

        const phone = () => {
          if (document.querySelector("#vertex-info-item-phone")) {
            if (
              !document
                .querySelector("#vertex-info-item-phone")
                .querySelector("._480u").firstChild.href
            )
              return document
                .querySelector("#vertex-info-item-phone")
                .querySelector("._480u").innerText;
          } else {
            return "not signed";
          }
        };

        const hours = () => {
          if (document.querySelector("#vertex-info-item-hours")) {
            return document
              .querySelector("#vertex-info-item-hours")
              .querySelector("._480u").innerText;
          } else {
            return "not signed";
          }
        };

        const engagement = +document
          .querySelector("._51m-.vTop._1zus._51mw")
          .innerText.replace(/\D/gim, "")
          .trim();

        const rating_count = () => {
          if (document.querySelector("._jl_").querySelector("._2pt2")) {
            if (
              document
                .querySelector("._jl_")
                .querySelector("._2pt2")
                .getElementsByTagName("meta")[1]
            ) {
              const rating = +document
                .querySelector("._jl_")
                .querySelector("._2pt2")
                .getElementsByTagName("meta")[1].content;
              return rating;
            }
          } else return "not signed";
        };

        const checkins = +document
          .querySelectorAll("._51m-.vTop._1zus._51mw")[1]
          .innerText.replace(/\D/gim, "")
          .trim();

        const result = Object.assign(getNameAndDescription(), {
          hours: hours(),
          latAndLong: getLoc(),
          prise_range: prise_range(),
          location: address()[1],
          single_line_address: address()[0],
          phone: phone(),
          engagement,
          checkins,
          rating_count: rating_count(),
          overall_star_rating: overall_star_rating(),
          website: website(),
          id: z
        });

        return result;
      } else if (
        document
          .querySelector("#globalContainer")
          .querySelector(".captcha_interstitial")
      ) {
        return { error: "security Check", id: z };
      } else if (
        document.querySelector("._4-u5._30ny").querySelector("._585n._3-8n")
      ) {
        return { error: "this is not a restaurant", id: z };
      } else return { error: "else problem", id: z };
    }, id);

    const dataOfAnotherPage = Object.assign({ link }, getAnotherTypeOfPage);

    const ordered = {};

    Object.keys(dataOfAnotherPage)
      .sort()
      .forEach(function(key) {
        ordered[key] = dataOfAnotherPage[key];
      });

    browser.close();

    return ordered;
  }
};

const restCollection = "Rests";
const proxyCollection = "ProxyList";

const calculateResult = async () => {
  const proxyServer = new proxy();
  await proxyServer.create();
  await proxyServer.start();

  let currentRest = await collectionServ.getFromCollection(restCollection);
  console.log("CURRENT REST", currentRest);
  while (currentRest) {
    const scrapeResult = await scrape(currentRest.rest).catch(async () => {
      console.log("INVALID REST");
      await collectionServ.addToCollection("Errors")([
        { rest: currentRest.rest }
      ]);
      await proxyServer.changeProxy();
    });

    await new Promise((res, rej) => {
      setTimeout(res, 1000);
    });

    if (!scrapeResult) {
      console.log("SCRAPE RES is", scrapeResult);
      await collectionServ.addToCollection("Errors")([
        { rest: currentRest.rest }
      ]);
      await proxyServer.changeProxy();
    } else {
      await collectionServ.addToCollection("Results")([scrapeResult]);
    }
    currentRest = null;
    currentRest = await collectionServ.getFromCollection(restCollection);
    console.log("CURRENT REST", currentRest);
    // promisifyWrite(scrapeResult, "resultWithProxy.txt");
  }
};

calculateResult();

// fs.readFile('all_fb_ids.txt','utf8', );
