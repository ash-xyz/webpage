<template>
  <div class="home">
    <Particles></Particles>
  </div>
</template>

<script>
// @ is an alias to /src
import Particles from "@/components/Particles.vue";
export default {
  name: "Home",
  components: {
    Particles
  }
};
</script>
<style>
.home {
  background-color: #1e1e1e;
}
</style>
