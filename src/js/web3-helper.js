/* eslint-disable */

//https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider
const tokenContractABI = require('../contracts/ERC20ABI.json')
const uniswapRouterContractABI = require('../contracts/UniswapV2Router.json')
const uniswapPairContractABI = require('../contracts/UniPairABI.json')
const uniswapv2addabi = require('../contracts/uniswapv2add.json')
const uniswapv2removeabi = require('../contracts/uniswapv2remove.json')

const contractData = require('../config/contractdata.json')

const BigNumber = require('bignumber.js');

const axios = require('axios')

const Web3 = require('web3');
const web3utils = Web3.utils;
//var max_target = web3utils.toBN( 2 ).pow( web3utils.toBN( 234 ) ) ;


var helper = {

  init(){
    console.log('init web3 helper')

    /**********************************************************/
    /* Handle chain (network) and chainChanged (per EIP-1193) */
    /**********************************************************/

    // Normally, we would recommend the 'eth_chainId' RPC method, but it currently
    // returns incorrectly formatted chain ID values.
    let currentChainId = window.ethereum.chainId;

    window.ethereum.on('chainChanged', handleChainChanged);

    function handleChainChanged(_chainId) {
      // We recommend reloading the page, unless you must do otherwise
      window.location.reload();
    }


    window.ethereum.on('accountsChanged', handleAccountsChanged);

      // For now, 'eth_accounts' will continue to always return an array
      function handleAccountsChanged(accounts) {
        window.location.reload();
      }

  },

  mainnetChainID()
  {
    return 1
  },
  kovanChainID()
  {
    return 42
  },

  getWeb3NetworkName(networkId){

    if(networkId == this.mainnetChainID()){
      return 'mainnet'
    }

    if(networkId == this.kovanChainID()){
      return 'kovan'
    }

        console.error('Invalid network Id!')
    return null
  },


  getContractDataForNetworkID(networkId){
    let netName = this.getWeb3NetworkName(networkId)

    if(netName){
        return contractData[netName].contracts
    }


    return undefined

  },


  async getConnectedAccounts()
  {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts;
  },

  async getProviderNetworkID()
  {
    var net_id = await  window.ethereum.chainId;
    console.log('net id is', net_id)
    return net_id;
  },
  async getTokenContract(web3, contractAddress)
  {

    var tokenContract = new web3.eth.Contract(tokenContractABI,contractAddress)

    return tokenContract;
  },
  async getZapInContractAddress(web3NetworkName)
  {

    var contractAddress = contractData[web3NetworkName].contracts.uniswapv2add.address;


    return contractAddress;
  },
  async getZapInContract(web3, web3NetworkName)
  {

    var contractAddress = await this.getZapInContractAddress(web3NetworkName)

    var contract =  new web3.eth.Contract(uniswapv2addabi,contractAddress)

    return contract;
  },
  async getZapOutContractAddress(web3NetworkName)
  {

    var contractAddress = contractData[web3NetworkName].contracts.uniswapv2remove.address;


    return contractAddress;
  },
  async getZapOutContract(web3, web3NetworkName)
  {

    var contractAddress = await this.getZapOutContractAddress(web3NetworkName)

    var contract = new web3.eth.Contract(uniswapv2removeabi,contractAddress)

    return contract;
  },

    async getUniswapRouterContract(web3, contractAddress)
    {

      var pairContract = new web3.eth.Contract(uniswapRouterContractABI,contractAddress)

      return pairContract;
    },

  async getUniswapPairContract(web3, contractAddress)
  {

    var pairContract = new web3.eth.Contract(uniswapPairContractABI,contractAddress)

    return pairContract;
  },

  async get0xSwapQuote(  buyToken , sellToken , sellAmount, networkId) {
    try {
      const TIMEOUT = 30000;
      const HEADERS = {
        "Content-Type": "application/json;charset=utf-8",
        Accept: "*/*",
      };
      var HOST = "https://api.0x.org";

      if(networkId == 42){
        HOST = "https://kovan.api.0x.org";
      }

      const instance = axios.create({
        baseURL: HOST,
        timeout: TIMEOUT,
        headers: HEADERS,
      });

      const response = await instance.get(
        HOST +
          "/swap/v1/quote?buyToken=" +
          buyToken +
          "&sellToken=" +
          sellToken +
          "&sellAmount=" +
          sellAmount
      );

      const quote = response.data;
      console.log(
        `zapper.get0xSwapQuote(): Retrieved swap 0x quote for buyToken ${buyToken}, sellToken ${sellToken}, amount ${sellAmount}, quote ${JSON.stringify(quote)}`
      );

      return quote;
    } catch (err) {
      console.log(JSON.stringify(err));
      throw err;
    }
  },


  async getMarketPairPriceEstimate(pairContract){

    let priceEstimates = []

       await new Promise((resolve, reject) => {
        pairContract.methods.price0CumulativeLast( ).call( {}  )
         .then(function(result){
           priceEstimates[0] = result
           resolve(result);
         })
         .catch(function(err){
           console.error(err)
           reject(err)
         })
       });

       await new Promise((resolve, reject) => {
        pairContract.methods.price1CumulativeLast( ).call( {}  )
         .then(function(result){
           priceEstimates[1] = result
           resolve(result);
         })
         .catch(function(err){
           console.error(err)
           reject(err)
         })
       });

       return priceEstimates

  },

  async getMarketPairReserves(pairContract){

    let reserves = null

       await new Promise((resolve, reject) => {
        pairContract.methods.getReserves( ).call( {}  )
         .then(function(result){
           reserves = result
           resolve(result);
         })
         .catch(function(err){
           console.error(err)
           reject(err)
         })
       });


       return reserves

  },



    async getUniSwapEstimate(uniRouterContract, amountIn, reserveIn, reserveOut){

      let amountOut = 0

         await new Promise((resolve, reject) => {
          uniRouterContract.methods.getAmountOut(amountIn, reserveIn, reserveOut).call( {}  )
           .then(function(result){
             amountOut = result
             resolve(result);
           })
           .catch(function(err){
             console.error(err)
             reject(err)
           })
         });


         return amountOut

    },



  async getTotalLPTokenSupply(pairContract){

    let reserves = null

       await new Promise((resolve, reject) => {
        pairContract.methods.totalSupply( ).call( {}  )
         .then(function(result){
           reserves = result
           resolve(result);
         })
         .catch(function(err){
           console.error(err)
           reject(err)
         })
       });


       return reserves

  },


  async getTokensAllowance(tokenAddress, ownerAddress, spender )
  {

    var web3 = new Web3(Web3.givenProvider);


    console.log('get token allowance', tokenAddress)
  //    var tokenContract = await this.getTokenContract(web3, tokenAddress);
    var tokenContract = new web3.eth.Contract(tokenContractABI,tokenAddress)



    console.log('meep',tokenContract,spender,ownerAddress)

    var allowance =0

     await new Promise((resolve, reject) => {

     tokenContract.methods.allowance( ownerAddress, spender).call( {}  )
      .then(function(result){
        console.log('we got ', result)
        allowance = result;
        resolve(result);
      })
      .catch(function(err){
        console.error(err)
        reject(err)
      })
    });


  //  console.log('get allowance .. promise',tokenAddress,spender,ownerAddress)
  //  var allowance = new Promise tokenContract.methods.allowance(spender,ownerAddress).call();
    console.log('allowance!!! ',allowance)
    return allowance;
  },


  async hasEnoughAllowance(acctAddress,spenderAddress,assetName,requestedDepositAmountFormatted)
  {
    console.log('hasEnoughAllowance',acctAddress,spenderAddress,assetName,requestedDepositAmountFormatted)

        var numApproved = await this.getTokensAllowance(CryptoAssets.assets[assetName]['MaticContract'], acctAddress ,spenderAddress)

        var numApprovedFormatted = this.rawAmountToFormatted(numApproved,CryptoAssets.assets[assetName]['Decimals'])

          console.log('num Approved ',assetName, numApproved)
          console.log('num Approved f ', numApprovedFormatted)

      return  ( parseFloat(numApprovedFormatted) >= parseFloat(requestedDepositAmountFormatted) )


  },


  async getETHBalance(ownerAddress)
  {
    var web3 = new Web3(Web3.givenProvider);

    return web3.eth.getBalance(ownerAddress);
  },

  async getTokenBalance(contractAddress, ownerAddress)
  {
    var web3 = new Web3(Web3.givenProvider);

    var tokenContract = new web3.eth.Contract(tokenContractABI, contractAddress, {});


    var balance = await tokenContract.methods.balanceOf(ownerAddress).call();

    return balance;
  },


 /*

  async getMaticTokensBalance(contractAddress, ownerAddress)
  {

    var web3 = new Web3(Web3.givenProvider);


    var tokenContract = new web3.eth.Contract(tokenContractABI, contractAddress, {});


    var balance = await tokenContract.methods.balanceOf(ownerAddress).call();

    return balance;
  },
  async getStakedInvaderBalance( ownerAddress)
  {

    var web3 = new Web3(Web3.givenProvider);

    var contractAddress = await this.getAlienContractAddress();

    var alienContract = new web3.eth.Contract(alienContractABI, contractAddress, {});


    var balance = await alienContract.methods.getStakedTokenBalance(ownerAddress).call();

    return balance;
  },
  async getYieldAvailable( ownerAddress)
  {

    var web3 = new Web3(Web3.givenProvider);

    var contractAddress = await this.getAlienContractAddress();

    var alienContract = new web3.eth.Contract(alienContractABI, contractAddress, {});


    var balance = await alienContract.methods.getYieldAvailable(ownerAddress).call();

    return balance;
  },*/

  rawAmountToFormatted(amount,decimals)
  {
    console.log('formatting',amount,decimals)
    return (amount * Math.pow(10,-1 * decimals)).toFixed(decimals);
  },

  formattedAmountToRaw(amountFormatted,decimals)
  {

    var multiplier = new BigNumber( 10 ).exponentiatedBy( decimals ) ;


    return multiplier.multipliedBy(amountFormatted).toFixed() ;
  },

  async connect()
  {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts
  },

  async disconnect()
  {
    console.log('disconnecting')
    const accounts = await window.ethereum.request({
     method: "eth_requestAccounts",
     params: [
       {
         eth_accounts: {}
       }
     ]
   });
   window.location.reload();
  }
}

export default helper
