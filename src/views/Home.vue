<template>
  <div class="home">
    <!-- https://github.com/matteobruni/tsparticles -->
    <!-- Could try limegreen for the particle/line colour? 00FF00-->
    <Particles
      id="tsparticles"
      color="#dedede"
      :particleOpacity="0.7"
      :particlesNumber="80"
      shapeType="circle"
      :particleSize="4"
      linesColor="#dedede"
      :linesWidth="1"
      :lineLinked="true"
      :linesOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="false"
      clickMode="push"
    ></Particles>
  </div>
</template>

<script>
// @ is an alias to /src
import Particles from "particles.vue";
export default {
  name: "Home",
  components: {
    //HelloWorld,
    Particles
  }
};
</script>
<style>
.home {
  background-color: #1e1e1e;
}
</style>
