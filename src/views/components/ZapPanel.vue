
<template>
    <div class="bg-gray-800 p-8">

      <div>
      <h3 class="text-lg font-bold inline text-white">Yield Farm: 0xBTC-ETH Pair </h3>

      <div v-if="connectedToWeb3() == false" @click="connectWeb3()" class="button pull-right bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">Connect to Web3</div>

      <div v-if="connectedToWeb3() "   class="truncate text-white pull-right" style="max-width:250px;  ">



        <Web3NetButton
           v-bind:providerNetworkID="providerNetworkID"
         />

        <span class="truncate" style="max-width:120px">
        <a   v-bind:href="getEtherscanBaseURL()+'/address/'+activeAccountAddress" class="text-green-500  "   target="_blank">  {{activeAccountAddress}} </a>
       </span>
       </div>


      </div>



      <div v-if="networkProviderIdError" class="p-8 bg-red-200">
        {{networkProviderIdError}}
      </div>





      <div v-if="connectedToWeb3() " >


          <div class="flex flex-row pt-8 text-white text-md"   >

            <div class="p-4  w-full text-center  ">
               ETH: {{  rawAmountToFormatted(currentBalances.eth, cryptoAssets.assets['ETH']['Decimals'])  }}
            </div>

            <div class="p-4  w-full text-center  ">
               Deposited (Est. ETH Value): {{  rawAmountToFormatted(currentBalances.eth, cryptoAssets.assets['ETH']['Decimals'])  }}
            </div>

          </div>


        <div  class="mb-12">

          <div class="p-6 bg-gray-800  text-white w-full text-sm flex ">

              <input  type="text" v-model="zapInETHAmount" class="shadow appearance-none border rounded py-2 px-3 text-gray-300 bg-gray-900 leading-tight focus:outline-none focus:shadow-outline inline-block mx-4" size="16"/>

              <button v-on:click="zapInEth()"   class="bg-gray-900 text-sm text-purple-500 hover:text-purple-400 py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full mt-2">
               Deposit ETH
              </button>

           </div>


           <div class="p-6 bg-gray-800  text-white w-full text-sm flex flex-col ">

               <div class="p-6 bg-gray-800  text-white w-full text-sm flex flex-row " v-if="!hasApprovalToZapOut()" >

                     <div class="">
                       <div> LP Tokens Approved: {{ zapOutLPTokensApproved  }}</div>
                     </div>

                     <button v-on:click="approveZapOutLPTokens()"   class="bg-gray-900 text-sm text-purple-500 hover:text-purple-400 py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full mt-2">
                      Approve LP Tokens To Withdraw
                     </button>


                </div>

               <button v-on:click="ZapOutToEth()"   class="bg-gray-900 text-sm text-gray-800 hover:text-red-700 py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full mt-2" :class="{'text-purple-500 hover:text-purple-400': hasApprovalToZapOut()  }">
                Withdraw All To ETH
               </button>


            </div>


        </div>

        <div class="m-4">
          <div v-if="txError">{{txError}}</div>

        </div>



      </div>



      <div v-if="connectedToWeb3() " >


          <div class="flex flex-row pt-8 text-white text-md"   >

            <div class="p-4  w-full text-center  ">
               0xBTC: {{ rawAmountToFormatted(currentBalances.zxbtc, cryptoAssets.assets['0xBTC']['Decimals'])    }}
            </div>

            <div class="p-4  w-full text-center  ">
               Deposited (Est. 0xBTC Value): {{  rawAmountToFormatted(currentBalances.eth, cryptoAssets.assets['ETH']['Decimals'])  }}
            </div>

          </div>


        <div  class="mb-12">

          <div class="p-6 bg-gray-800  text-white w-full text-sm flex flex-col">


            <div class="p-6 bg-gray-800  text-white w-full text-sm flex flex-row " v-if="!hasApprovalToZapInZXBTCTokens()">

                  <div class="">
                    <div> 0xBTC Approved: {{ zapInZXBTCApproved }}</div>
                  </div>

                  <button  v-on:click="approveZapInZXBTCTokens()"   class="bg-gray-900 text-sm text-purple-500 hover:text-purple-400 py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full mt-2">
                   Approve 0xBTC To Deposit
                  </button>


             </div>



            <div class="p-6 bg-gray-800  text-white w-full text-sm flex flex-row " >

              <input  type="text" v-model="zapInZXBTCAmount" class="shadow appearance-none border rounded py-2 px-3 text-gray-300 bg-gray-900 leading-tight focus:outline-none focus:shadow-outline inline-block mx-4" size="16"/>

              <button v-on:click="zapInToken"   class="bg-gray-900 text-sm text-gray-800  hover:text-red-700 py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full mt-2" :class="{'text-purple-500 hover:text-purple-400': hasApprovalToZapInZXBTCTokens()  }">
               Deposit 0xBTC
             </button>

           </div>



           </div>


           <div class="p-6 bg-gray-800  text-white w-full text-sm flex flex-col ">

             <div class="p-6 bg-gray-800  text-white w-full text-sm flex flex-row " v-if="!hasApprovalToZapOut()">

                   <div class="">
                     <div> LP Tokens Approved: {{ zapOutLPTokensApproved  }}</div>
                   </div>

                   <button  v-on:click="approveZapOutLPTokens()"   class="bg-gray-900 text-sm text-purple-500 hover:text-purple-400 py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full mt-2">
                    Approve LP Tokens To Withdraw
                   </button>


              </div>


               <button v-on:click="ZapOutToToken"     class="bg-gray-900 text-sm text-gray-800 hover:text-red-700 py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full mt-2" :class="{'text-purple-500 hover:text-purple-400': hasApprovalToZapOut()  }">
                Withdraw All To 0xBTC
               </button>


            </div>


        </div>

        <div class="m-4">
          <div v-if="txError">{{txError}}</div>

        </div>



      </div>








    </div>
</template>

<script>

const Web3 = require('web3')

const CryptoAssets = require('../../config/cryptoassets.json')

import Web3NetButton from './Web3NetButton.vue'

import Web3Helper from '../../js/web3-helper.js'

export default {
  name: 'ZapPanel',
  props: [ ],
  components:{Web3NetButton},
  data() {
    return {
      activeAccountAddress: null,
      providerNetworkID: null,

      cryptoAssets: CryptoAssets,

      currentBalances: {eth:0, zxbtc:0, lptoken:0 },


      zapInETHAmount: 0,
      zapInZXBTCAmount: 0,

      zapOutLPTokensApproved: 0,
      zapInZXBTCApproved: 0,

      txError: null,

      networkProviderIdError: null
    }
  },
 async  mounted()
  {


 /*
    setTimeout(this.updateBalance, 2000);

    setInterval(this.updateBalance, 10000);

    setInterval(this.updateFormMode, 6000);

    setInterval(this.updateEstimatedEarnings, 100);*/
  },
  updated()
  {

    //this.updateAll();
  },
  methods: {


   async refreshBalances(){

      let contractData = Web3Helper.getContractDataForNetworkID(this.providerNetworkID)

      let zcbtcTokenAddress = contractData["0xbitcoin"].address
      let lpTokenAddress = contractData["0xbitcoinmarketpair"].address

      let zapInContractAddress = contractData["uniswapv2add"].address
      let zapOutContractAddress = contractData["uniswapv2remove"].address

       this.currentBalances.eth = await Web3Helper.getETHBalance(this.activeAccountAddress)
       this.currentBalances.zxbtc = await Web3Helper.getTokenBalance(zcbtcTokenAddress, this.activeAccountAddress)

       this.currentBalances.lpToken = await Web3Helper.getTokenBalance(lpTokenAddress, this.activeAccountAddress)

       this.zapOutLPTokensApproved= await Web3Helper.getTokensAllowance(lpTokenAddress,  this.activeAccountAddress, zapOutContractAddress)
       this.zapInZXBTCApproved=  await Web3Helper.getTokensAllowance(zcbtcTokenAddress,  this.activeAccountAddress, zapInContractAddress)


    },


  async recalculateDepositedEthFromLPTokens(){
      // this.currentBalances.lpToken
  },

  async recalculateDepositedZXBTCFromLPTokens(){

  },


  rawAmountToFormatted(amount,decimals){

    return Web3Helper.rawAmountToFormatted(amount, decimals)
  },



  /*  updateAll()
    {
        console.log('form updated')
      // this.updateFormMode();
      // this.updateBalance();
    },
    currentDomainName(){
      if(this.activeWalletDomain == "matic"){ return "Matic Network" }else{ return "Tip Jar" }
    },
    otherDomainName(){
      if(this.activeWalletDomain == "matic"){ return "Tip Jar" }else{ return "Matic Network" }
    },
    getAssetNickname(){
       return CryptoAssets.assets[this.assetName]['Nickname'];
    },*/

    async connectWeb3(){
      console.log('connect')
      if (window.ethereum) {
           window.web3 = new Web3(window.ethereum);
           window.ethereum.enable();

           window.ethereum.on('accountsChanged', (accounts) => {
                  this.refreshWeb3Accounts()
            });

          ethereum.on('chainChanged', (chainId) => {
                  this.refreshWeb3Accounts()
             });


          this.refreshWeb3Accounts()


         }
    },

  async  refreshWeb3Accounts(){
      if ( window.ethereum.selectedAddress) {
        this.providerNetworkID = await Web3Helper.getProviderNetworkID();
        this.activeAccountAddress = window.ethereum.selectedAddress

          console.log('this.activeAccountAddress ',this.activeAccountAddress )

          this.refreshBalances()
      }

    },

    connectedToWeb3(){

      return  this.activeAccountAddress != null
    },


    checkNetworkProviderIdValid(){

        if(this.providerNetworkID !=  1 )
        {
          this.networkProviderIdError = "Please switch your Web3 Provider to Ethereum Mainnet to call these methods."
          return false
        }


      //this.networkProviderIdError = null;
      return true;
    },

    getEtherscanBaseURL(){
        if(this.providerNetworkID == 42){
          return  'https://kovan.etherscan.io'
        }

        return 'https://etherscan.io'
    },



    hasApprovalToZapOut(){

      return this.zapOutLPTokensApproved > 0
    },

    hasApprovalToZapInZXBTCTokens(){
        return this.zapInZXBTCApproved > 0
    },


       async approveZapInZXBTCTokens(){

         let networkId = this.providerNetworkID

         var userAddress = this.activeAccountAddress;

         const UnlimitedAmount = 100000000
         var amtRaw  = Web3Helper.formattedAmountToRaw(UnlimitedAmount, CryptoAssets.assets['0xBTC']['Decimals']);

         let contractData =  Web3Helper.getContractDataForNetworkID(networkId)

         let tokenAddress = contractData["0xbitcoin"].address

         var tokenContract = await Web3Helper.getTokenContract(web3,tokenAddress)

         var zapInContractAddress = contractData["uniswapv2add"].address

         tokenContract.methods.approve(zapInContractAddress,amtRaw).send({from: userAddress })
         .then(function(receipt){
           console.log(receipt)

           this.refreshWeb3Accounts()
             // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
         }.bind(this));




       },


   async approveZapOutLPTokens(){

     let networkId = this.providerNetworkID

     var userAddress = this.activeAccountAddress;

     const UnlimitedAmount = 100000000000000
     var amtRaw  = Web3Helper.formattedAmountToRaw(UnlimitedAmount, CryptoAssets.assets['LPToken']['Decimals']);

     let contractData =  Web3Helper.getContractDataForNetworkID(networkId)

     let tokenAddress = contractData["0xbitcoinmarketpair"].address

     var tokenContract = await Web3Helper.getTokenContract(web3,tokenAddress)

     var zapOutContractAddress = contractData["uniswapv2remove"].address

     tokenContract.methods.approve(zapOutContractAddress,amtRaw).send({from: userAddress })
     .then(function(receipt){
       console.log(receipt)

       this.refreshWeb3Accounts()
         // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
     }.bind(this));




   },

    async zapInEth()
    {
      let networkId = this.providerNetworkID

      let assetName = 'ETH'

      var userAddress = this.activeAccountAddress;
      var amtRaw  = Web3Helper.formattedAmountToRaw(this.zapInETHAmount, CryptoAssets.assets[assetName]['Decimals']);

      console.log('zap in eth!', userAddress, amtRaw)

      var zapInContract = await Web3Helper.getZapInContract( window.web3, Web3Helper.getWeb3NetworkName( networkId ) );

       const wethContractAddress = Web3Helper.getContractDataForNetworkID(networkId)["weth"].address
      const zxbtcContractAddress = Web3Helper.getContractDataForNetworkID(networkId)["0xbitcoin"].address// "0xb6ed7644c69416d67b522e20bc294a9a9b405b31"

      var tokenAddress =  "0x0000000000000000000000000000000000000000"
      var marketPairAddress = Web3Helper.getContractDataForNetworkID(networkId)["0xbitcoinmarketpair"].address



      //should this be 0.45 multiplier ??
      var swapQuote = await Web3Helper.get0xSwapQuote(zxbtcContractAddress, 'ETH',  amtRaw , this.providerNetworkID);
      var swapData = swapQuote.data

      var allowanceTarget = swapQuote.to
      var swapTarget = swapQuote.to

      var minPoolTokens = Math.floor(swapQuote.buyAmount*0.05) //for now -- helps against front running
      let tokensAmount = 0//swapQuote.buyAmount

      zapInContract.methods.ZapIn(tokenAddress,marketPairAddress, tokensAmount, minPoolTokens, allowanceTarget, swapTarget, swapData )
      .send({from: userAddress, value: amtRaw })
      .then(function(receipt){
        console.log(receipt)
          // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
      });




    },



      ///Need approval?
        async zapInToken()
        {
          let networkId = this.providerNetworkID


          var userAddress = this.activeAccountAddress;
          var amtRaw  = Web3Helper.formattedAmountToRaw(this.zapInZXBTCAmount, CryptoAssets.assets['0xBTC']['Decimals']);

          console.log('zap in 0xBTC!', userAddress, amtRaw)

          var zapInContract = await Web3Helper.getZapInContract( window.web3, Web3Helper.getWeb3NetworkName( networkId ) );

           const wethContractAddress = Web3Helper.getContractDataForNetworkID(networkId)["weth"].address
          const zxbtcContractAddress = Web3Helper.getContractDataForNetworkID(networkId)["0xbitcoin"].address// "0xb6ed7644c69416d67b522e20bc294a9a9b405b31"

          var tokenAddress =  zxbtcContractAddress
          var marketPairAddress = Web3Helper.getContractDataForNetworkID(networkId)["0xbitcoinmarketpair"].address



          //should this be 0.45 multiplier ??
          var swapQuote = await Web3Helper.get0xSwapQuote('ETH', zxbtcContractAddress,  amtRaw , this.providerNetworkID);
          var swapData = swapQuote.data

          var allowanceTarget = swapQuote.to
          var swapTarget = swapQuote.to

          var minPoolTokens = 0 // for now -- helps against front running
          let tokensAmount =  swapQuote.sellAmount

          zapInContract.methods.ZapIn(tokenAddress,marketPairAddress, tokensAmount, minPoolTokens, allowanceTarget, swapTarget, swapData )
          .send({from: userAddress })
          .then(function(receipt){
            console.log(receipt)
            this.refreshWeb3Accounts()
              // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
          }.bind(this));




        },



   ///Need approval?
    async ZapOutToEth( ){

      let networkId = this.providerNetworkID
      var userAddress = this.activeAccountAddress;

      var zapOutContract = await Web3Helper.getZapOutContract( window.web3, Web3Helper.getWeb3NetworkName( networkId ) );


        console.log('zapout' )

      var tokenAddress =  "0x0000000000000000000000000000000000000000" //to receive ETh
      var marketPairAddress = Web3Helper.getContractDataForNetworkID(networkId)["0xbitcoinmarketpair"].address

      var incomingLP = this.currentBalances.lpToken //all of them

      var minTokensRecieved = 0 //for now ...

      console.log('zapout',tokenAddress,marketPairAddress, incomingLP, minTokensRecieved)

      zapOutContract.methods.ZapOut(tokenAddress,marketPairAddress, incomingLP, minTokensRecieved  )
      .send({from: userAddress })
      .then(function(receipt){
        console.log(receipt)
        this.refreshWeb3Accounts()
          // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
      }.bind(this));


    },

      ///Need approval?
    async ZapOutToToken( ){

      let networkId = this.providerNetworkID
      var userAddress = this.activeAccountAddress;

      var zapOutContract = await Web3Helper.getZapOutContract( window.web3, Web3Helper.getWeb3NetworkName( networkId ) );


        console.log('zapout' )

      var tokenAddress =  Web3Helper.getContractDataForNetworkID(networkId)["0xbitcoin"].address
      var marketPairAddress = Web3Helper.getContractDataForNetworkID(networkId)["0xbitcoinmarketpair"].address

      var incomingLP =  this.currentBalances.lpToken //all of them

      var minTokensRecieved = 0 //for now ...

      console.log('zapout',tokenAddress,marketPairAddress, incomingLP, minTokensRecieved)

      zapOutContract.methods.ZapOut(tokenAddress,marketPairAddress, incomingLP, minTokensRecieved  )
      .send({from: userAddress })
      .then(function(receipt){
        console.log(receipt)

        this.refreshWeb3Accounts()
          // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
      }.bind(this));


    },



  }
}

</script>
