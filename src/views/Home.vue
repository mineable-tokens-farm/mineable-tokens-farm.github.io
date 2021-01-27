<template>

<div>

   <div class="section bg-world px-0 lg:px-1">

     <div class=" ">
       <Navbar />
     </div>


   </div>

   <div class="section dark autospacing ">
     <div class="w-container pt-8">

        <ZapPanel />

        <div class="text-gray-100 p-8">
          Since 0xBTC is a pure PoW Mineable Token, providing liquidity to the 0xBTC-ETH trading liquidity pool has special attributes and benefits.  As miners mint new 0xBTC from the contract, it costs a small amount of ETH for gas.
          <br><br>
          Naturally, for the miners to continue mining, some will swap 0xBTC back to ETH using a Decentralized Exchange like Uniswap.  By providing liquidity for this pair on Uniswap, you are indirectly earning some of the 0xBTC that is being mined while also helping reduce price slippage for the miners and other traders.
          <br><br>
          Farm.mineabletokens is a dapp that makes it very simple to provide liquidity to the 0xBTC-ETH pair on Uniswap to earn interest by accepting those fees.

        </div>

     </div>
   </div>

   <div class="section ctas">
     <div class="autospacing w-container">
       <div class="w-row">

       </div>
       <div class="w-row">
         <div class="column w-col w-col-6  ">



            <h2 class="text-yellow-500"> 0xBTC-ETH Pair </h2>

            <a href="https://0xbtc.info/" target="_blank" class='text-gray-200'>
                 -> 0xBTC Mining Stats
                </a>
                <br>

           <a href="https://info.uniswap.org/pair/0xc12c4c3e0008b838f75189bfb39283467cf6e5b3" target="_blank" class='text-gray-200'>
                -> Uni Pool Statistics

               </a>



         </div>
         <div class="column-2 w-col w-col-6"><img src="@/assets/images/coins.svg" width="125" height="125" alt="">

         </div>
       </div>
     </div>
   </div>
   <div class="section dark autospacing  ">

   </div>

  <Footer/>

</div>
</template>


<script>
import Navbar from './components/Navbar.vue';
import ZapPanel from './components/ZapPanel.vue';
import Footer from './components/Footer.vue';

export default {
  name: 'Home',
  props: [],
  components: {Navbar,ZapPanel,Footer},
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>
