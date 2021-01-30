<template>
  <div class="inline-block button   bg-gray-900 hover:bg-gray-700     py-0 px-1 rounded cursor-pointer text-xs relative pl-6">
    <div class="text-green-500 text-xs inline mining-animation absolute " style="left:4px; text-shadow: 0px 0px 1px #eeddaa; ">  ⛏️  </div> Yield Farming
  </div>
</template>


<script>

export default {
  name: 'YieldFarmingLabel',
  props: ["providerNetworkID"],
  components: {},
  data() {
    return {
      showResponsiveMenu: false
    }
  },
  methods: {

    getNetworkName(){
      if(this.providerNetworkID == 1){
        return 'Mainnet'
      }
      if(this.providerNetworkID == 42){
        return 'Kovan'
      }
      return 'InvalidNetwork'
    }

  }
}
</script>
