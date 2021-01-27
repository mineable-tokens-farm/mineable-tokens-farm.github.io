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
          aaaa


     </div>
   </div>

   <div class="section ctas">
     <div class="autospacing w-container">
       <div class="w-row">

       </div>
       <div class="w-row">
         <div class="column w-col w-col-6  ">

            <h2 class="text-yellow-500"> 0xBTC-ETH Pool </h2>
           <a href="https://info.uniswap.org/pair/0xc12c4c3e0008b838f75189bfb39283467cf6e5b3" target="_blank" class='text-gray-200'>
                View Uni Pool Statistics

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
