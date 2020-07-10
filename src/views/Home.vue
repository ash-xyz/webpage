<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <!--<HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <!-- https://github.com/matteobruni/tsparticles -->
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
      :clickEffect="true"
      clickMode="push"
    ></Particles>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from "@/components/HelloWorld.vue";
import Particles from "particles.vue";
export default {
  name: "Home",
  components: {
    //HelloWorld,
    Particles
  }
};
</script>
