
<template>
    <div class="">
      <h3 class="text-lg font-bold">Wallet Balance ({{currentDomainName()}})</h3>

      <div class="p-12 text-xl w-full text-center  text-glow text-green-500">
        {{currentBalance}} {{getAssetNickname()}}
      </div>

      <div>

        <div v-if="networkProviderIdError" class="p-8 bg-red-200">
          {{networkProviderIdError}}
        </div>


        <div v-if="assetName=='AlienToken'">


          <div class=" p-6 bg-green-500 w-full text-sm relative">

            <div class="p-4 text-md text-white w-full text-center">

              <div> Estimated Alien Earnings: {{ estimatedYield  }}</div>

            </div>

            <div class="absolute inset-x-2 top-2 " style="top:2em;right:2em;" v-if="stakedInvader > 0">

              <img src="@/assets/images/logo.png" alt="Invader" class="shake h-5 w-5">


            </div>



          <br>

          <button @click="mintAliens" class="bg-gray-900 text-glow text-sm text-green-500 hover:text-purple-400 py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full mt-2">
            Mint Aliens from Staked Invader
          </button>



          </div>

          <div class="p-6 my-2 bg-gray-800  text-white w-full text-sm">

            <div class="p-4 text-md text-white w-full text-center">
              <div> Staked Invader Balance: {{ stakedInvader  }}</div>

            </div>

            <input type="text" v-model="unstakeAmount" class="shadow appearance-none border rounded py-2 px-3 text-gray-300 bg-gray-900 leading-tight focus:outline-none focus:shadow-outline inline-block mr-4" size="8"/>


          <button @click="unstakeInvaderFromAlien" class="bg-gray-900 text-sm text-green-500 hover:text-purple-400 py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full mt-2">
            Unstake Invader
          </button>

          </div>
        </div>

        <div v-if="assetName=='InvaderToken'">


          <div class="my-6 p-6 bg-green-500 w-full text-sm">


          <div class="p-4 text-md text-white w-full text-center">
            <div> Staked Invader Balance: {{ stakedInvader  }}</div>

          </div>

          <input type="text" v-model="stakeAmount" v-on:keyup="updateFormMode" class="shadow appearance-none border rounded py-2 px-3 text-gray-300 bg-gray-900 leading-tight focus:outline-none focus:shadow-outline inline-block mr-4" size="8"/>

          <button @click="approveInvaderToAlien" v-if="!approvedEnoughToDeposit" class="bg-gray-900 text-sm text-purple-500 hover:text-purple-400 py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full mt-2">
            Approve Invader To Stake
          </button>

          <button @click="stakeInvaderToAlien" v-if="approvedEnoughToDeposit" class="bg-gray-900 text-glow text-sm text-green-500 hover:text-purple-400 py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full mt-2">
            Stake Invader to Farm Aliens
          </button>



          </div>

          <div class="p-6 bg-gray-800  text-white w-full text-sm">

          <input type="text" v-model="withdrawAmount" class="shadow appearance-none border rounded py-2 px-3 text-gray-300 bg-gray-900 leading-tight focus:outline-none focus:shadow-outline inline-block mr-4" size="8"/>


          <button @click="withdrawFromInvader" class="bg-gray-900 text-sm text-purple-500 hover:text-purple-400 py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full mt-2">
            Withdraw Invader to LP Token
          </button>

          </div>
        </div>

        <div v-if="assetName=='0xBTC_LP_Token'" class="mb-48">

          <div class="p-6 bg-gray-800  text-white w-full text-sm">

          <input v-on:keyup="updateFormMode" type="text" v-model="depositAmount" class="shadow appearance-none border rounded py-2 px-3 text-gray-300 bg-gray-900 leading-tight focus:outline-none focus:shadow-outline inline-block mr-4" size="8"/>

          <button @click="approveToInvader" v-if="!approvedEnoughToDeposit" class="bg-gray-900 text-sm text-purple-500 hover:text-purple-400 py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full mt-2">
            Approve LP Token To Invader
          </button>

          <button @click="depositToInvader" v-if="approvedEnoughToDeposit" class="bg-gray-900 text-sm text-purple-500 hover:text-purple-400 py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full mt-2">
            Deposit LP Token To Invader
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

import Web3Helper from '../../js/web3-helper.js'

export default {
  name: 'ZapPanel',
  props: [ ],
  data() {
    return {


      txError: null,

      networkProviderIdError: null
    }
  },
  mounted()
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
    updateAll()
    {
        console.log('form updated')
      // this.updateFormMode();
      // this.updateBalance();
    },
  /*  currentDomainName(){
      if(this.activeWalletDomain == "matic"){ return "Matic Network" }else{ return "Tip Jar" }
    },
    otherDomainName(){
      if(this.activeWalletDomain == "matic"){ return "Tip Jar" }else{ return "Matic Network" }
    },
    getAssetNickname(){
       return CryptoAssets.assets[this.assetName]['Nickname'];
    },*/


    checkNetworkProviderIdValid(){


        if(this.providerNetworkID !=  1 )
        {
          this.networkProviderIdError = "Please switch your Web3 Provider to Ethereum Mainnet to call these methods."
          return false
        }


      //this.networkProviderIdError = null;
      return true;
    },
    updateEstimatedEarnings()
    {

      var stakedInvader = this.stakedInvader;
      var blockTime = 2000; //ms
      var tickTime = 100;  //ms

      var tokensEarnedPerBlock = stakedInvader / 1000000.0;

      var tokensEarnedPerTick = (tokensEarnedPerBlock * (tickTime/blockTime))

      console.log('meep1', tokensEarnedPerTick, this.estimatedYield)

      this.estimatedYield = (parseFloat(parseFloat(this.estimatedYield) + parseFloat(tokensEarnedPerTick))).toFixed(8);

      console.log('meep2', tokensEarnedPerTick, this.estimatedYield )



    },
    async updateBalance()
    {



      if(this.activeWalletDomain == "matic"){
        var web3provider = new Web3(Web3.givenProvider || 'ws://localhost:8546');
        var userAddress = this.acctAddress;

         var balanceRaw = await Web3Helper.getMaticTokensBalance(
          CryptoAssets.assets[this.assetName]['MaticContract'],
          userAddress
        )
        this.currentBalance =  Web3Helper.rawAmountToFormatted(balanceRaw, CryptoAssets.assets[this.assetName]['Decimals']);



          var stakedInvaderRaw =  await Web3Helper.getStakedInvaderBalance(userAddress)
          console.log('staked invader raw',stakedInvaderRaw)
          this.stakedInvader =  Web3Helper.rawAmountToFormatted(stakedInvaderRaw, CryptoAssets.assets['InvaderToken']['Decimals']);

          var yieldAvailableRaw =  await Web3Helper.getYieldAvailable(userAddress)
          this.yieldAvailable =  Web3Helper.rawAmountToFormatted(yieldAvailableRaw, CryptoAssets.assets['AlienToken']['Decimals']);
          this.estimatedYield = parseFloat(this.yieldAvailable).toFixed(8);


      }

    },
    async updateFormMode()
    {
      console.log('updateFormMode');




        if(this.assetName == "0xBTC_LP_Token"){
          //check to see how many are approved to invader
          console.log('has enough allowance?', this.acctAddress,this.assetName,this.depositAmount)

          var spenderAddress = await Web3Helper.getInvaderContractAddress();

          var amt = this.depositAmount;

          var hasAllowance = await Web3Helper.hasEnoughAllowance(this.acctAddress,spenderAddress,this.assetName,amt)

          this.approvedEnoughToDeposit = hasAllowance;
        }



        if(this.assetName == "InvaderToken"){
          //check to see how many are approved to alien
          console.log('has enough allowance?', this.acctAddress,this.assetName,this.stakeAmount)

          var spenderAddress = await Web3Helper.getAlienContractAddress();

          var amt = this.stakeAmount;

          var hasAllowance = await Web3Helper.hasEnoughAllowance(this.acctAddress,spenderAddress,this.assetName,amt)

          this.approvedEnoughToDeposit = hasAllowance;
        }




      //  this.checkNetworkProviderIdValid()


    },

    async approveToInvader()
    {
      console.log('approve to invader')
      this.networkProviderIdError=null;


      var web3 = window.web3
      var userAddress = this.acctAddress;
      var amt  = Web3Helper.formattedAmountToRaw(this.depositAmount, CryptoAssets.assets[this.assetName]['Decimals']);

      var tokenAddress = CryptoAssets.assets[this.assetName]['MaticContract']

      if(this.providerNetworkID != 0x89){
        this.networkProviderIdError = "Please switch your Web3 Provider to Matic Mainnet to call this method."

        return;

      }

      var invaderContractAddress = await Web3Helper.getInvaderContractAddress();

      var tokenContract = await Web3Helper.getTokenContract(web3,tokenAddress,userAddress)

      console.log(invaderContractAddress,amt)

      tokenContract.methods.approve(invaderContractAddress,amt).send({from: userAddress })
      .then(function(receipt){
        console.log(receipt)
          // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
      });


    },


    async depositToInvader()
    {
      console.log('deposit to invader')
      this.networkProviderIdError=null;


      var web3 = window.web3
      var userAddress = this.acctAddress;
      var amt  = Web3Helper.formattedAmountToRaw(this.depositAmount, CryptoAssets.assets[this.assetName]['Decimals']);

      //var tokenAddress = CryptoAssets.assets[this.assetName]['MaticContract']

      if(this.providerNetworkID != 0x89){
        this.networkProviderIdError = "Please switch your Web3 Provider to Matic Mainnet to call this method."

        return;

      }

      var contractAddress = CryptoAssets.assets[this.assetName]['MaticContract'];


      var invaderContract = await Web3Helper.getInvaderContract(web3);

      console.log(amt)

      invaderContract.methods.depositTokens(amt).send({from: userAddress })
      .then(function(receipt){
        console.log(receipt)
          // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
      });


    },
    async withdrawFromInvader()
    {

      this.networkProviderIdError=null;

      var web3 = window.web3
      var userAddress = this.acctAddress;
      var amt  = Web3Helper.formattedAmountToRaw(this.withdrawAmount, CryptoAssets.assets[this.assetName]['Decimals']);

      var tokenAddress = CryptoAssets.assets[this.assetName]['MaticContract']

      if(this.providerNetworkID != 0x89){
        this.networkProviderIdError = "Please switch your Web3 Provider to Matic Mainnet to call this method."

        return;

      }

      var contractAddress = CryptoAssets.assets[this.assetName]['MaticContract'];


      var invaderContract = await Web3Helper.getInvaderContract(web3);

      invaderContract.methods.withdrawTokens(amt).send({from: userAddress})
      .then(function(receipt){
          // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
      });


    },
    async approveInvaderToAlien()
    {

      this.networkProviderIdError=null;

      var web3 = window.web3
      var userAddress = this.acctAddress;
      var amt  = Web3Helper.formattedAmountToRaw(this.stakeAmount, CryptoAssets.assets[this.assetName]['Decimals']);

      var tokenAddress = CryptoAssets.assets[this.assetName]['MaticContract']

      if(this.providerNetworkID != 0x89){
        this.networkProviderIdError = "Please switch your Web3 Provider to Matic Mainnet to call this method."

        return;

      }

      var invaderContract = await Web3Helper.getInvaderContract(web3);

      var alienContractAddress = await Web3Helper.getAlienContractAddress()


      invaderContract.methods.approve(alienContractAddress,amt).send({from: userAddress })
      .then(function(receipt){
        console.log(receipt)
          // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
      });



    },
    async stakeInvaderToAlien()
    {

      this.networkProviderIdError=null;

      var web3 = window.web3
      var userAddress = this.acctAddress;
      var amt  = Web3Helper.formattedAmountToRaw(this.stakeAmount, CryptoAssets.assets[this.assetName]['Decimals']);


      if(this.providerNetworkID != 0x89){
        this.networkProviderIdError = "Please switch your Web3 Provider to Matic Mainnet to call this method."

        return;

      }

      console.log('stake invader to alien ')


      var alienContract = await Web3Helper.getAlienContract(web3)


      alienContract.methods.stakeTokens(amt).send({from: userAddress })
      .then(function(receipt){
        console.log(receipt)
          // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
      });




    },
    async unstakeInvaderFromAlien()
    {


      this.networkProviderIdError=null;

      var web3 = window.web3
      var userAddress = this.acctAddress;
      var amt  = Web3Helper.formattedAmountToRaw(this.unstakeAmount, CryptoAssets.assets[this.assetName]['Decimals']);


      if(this.providerNetworkID != 0x89){
        this.networkProviderIdError = "Please switch your Web3 Provider to Matic Mainnet to call this method."

        return;

      }


      var alienContract = await Web3Helper.getAlienContract(web3)


      alienContract.methods.unstakeTokens(amt).send({from: userAddress })
      .then(function(receipt){
        console.log(receipt)
          // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
      });



    },
    async mintAliens()
    {


      this.networkProviderIdError=null;

      var web3 = window.web3
      var userAddress = this.acctAddress;

       if(this.providerNetworkID != 0x89){
        this.networkProviderIdError = "Please switch your Web3 Provider to Matic Mainnet to call this method."

        return;

      }


      var alienContract = await Web3Helper.getAlienContract(web3)


      alienContract.methods.claimYields( ).send({from: userAddress })
      .then(function(receipt){
        console.log(receipt)
          // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
      });



    }
  }
}

</script>
