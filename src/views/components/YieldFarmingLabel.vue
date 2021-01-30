<template>
  <div>
  <div class="inline-block button   bg-gray-900 hover:bg-gray-700     py-0 px-1 rounded cursor-pointer text-xs relative pl-6" v-if="active">

   <div >   <div class="text-green-500 text-xs inline mining-animation absolute " style="left:4px; text-shadow: 0px 0px 1px #eeddaa; " >  ⛏️  </div> Yield Farming </div>


  </div>

  <div class="inline-block button   bg-gray-900 hover:bg-gray-700     py-0 px-1 rounded cursor-pointer text-xs relative "  v-if="!active">

   <div >    Not Yield Farming </div>

  </div>
  </div>
</template>


<script>

export default {
  name: 'YieldFarmingLabel',
  props: ["active"],
  components: {},
  data() {
    return {

    }
  },
  methods: {



  }
}
</script>
