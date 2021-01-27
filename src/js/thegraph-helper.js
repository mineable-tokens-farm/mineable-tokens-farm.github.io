
const Axios = require('axios');


export default class TheGraphHelper {


    static async queryGraphData( ){

      let baseurl = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2"

      let querystring = "{uniswapFactories(first:5){id pairCount totalVolumeUSD} tokens(first:5){id symbol name}"

      return new Promise(   (resolve, reject) => {

        Axios({
            method: 'post',
           
             url: baseurl,
            data: querystring
          }).then((res) => {
                console.log(`Status: ${res.status}`);
                console.log('Body: ', res.data);
                resolve(res)
            }).catch((err) => {
                console.error(err);
                reject(err)
            });

      });


    }


}
