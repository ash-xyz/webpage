<template>
  <div class="home">
    <FrontPage></FrontPage>
  </div>
</template>

<script>
// @ is an alias to /src
import FrontPage from "@/components/FrontPage.vue";
export default {
  name: "Home",
  components: {
    FrontPage
  }
};
</script>
<style>
.home {
  background-color: #1e1e1e;
}
</style>
