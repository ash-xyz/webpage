<template>
  <!-- https://github.com/matteobruni/tsparticles -->
  <!-- Could try limegreen for the particle/line colour? 00FF00-->
  <Particles
    id="tsparticles"
    color="#dedede"
    :particleOpacity="0.7"
    :particlesNumber="80"
    shapeType="circle"
    :particleSize="6"
    linesColor="#dedede"
    :linesWidth="2.5"
    :lineLinked="true"
    :linesOpacity="0.4"
    :linesDistance="150"
    :moveSpeed="3"
    :hoverEffect="true"
    hoverMode="grab"
    :clickEffect="false"
    class="change"
  ></Particles>
</template>

<script>
// @ is an alias to /src
import Particles from "particles.vue";
export default {
  name: "particles",
  components: { Particles }
};
</script>
<style>
.change {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #1e1e1e;
}
</style>
