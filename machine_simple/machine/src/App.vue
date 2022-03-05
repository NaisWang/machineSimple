<template>
  <div>
    <Main></Main>
  </div>
</template>

<script>
import Main from "./views/Main.vue";

export default {
  components: {Main},
  data() {
    return {
      msg: 'OK'
    }
  }
}
</script>

<style lang="css" scoped>
h1 {
  color: red;
}
</style>
