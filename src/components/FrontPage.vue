<template>
  <!-- https://github.com/matteobruni/tsparticles -->
  <!-- Could try limegreen for the particle/line colour? 00FF00-->
  <div>
    <div class="background">
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
    </div>
    <div class="name-block">
      <div class="title-text">
        <h1>Ashraf Ali</h1>
        <p>Computer Science student</p>
      </div>
    </div>
  </div>
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
.name-block {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80%;
  margin: 0 auto;
  z-index: 400;
  position: absolute;
}
h1 {
  font-size: 2.3rem;
  padding: 2px 10px;
  text-align: center;
  text-transform: uppercase;
  border: 2px solid;
  color: #ffffff;
}
p {
  font-size: 1.5rem;
  text-align: center;
  margin: 5px auto;
  color: #ffffff;
}
.title-text {
  width: 250px;
}
</style>
