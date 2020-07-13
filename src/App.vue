<template>
  <v-app>
    <!-- Get rid of nav bar for the top of the page and introduce it for later on maybe?-->
    <v-app-bar app color="#252526" flat dense>
      <router-link to="/">Home</router-link>
      <v-spacer></v-spacer>
      <router-link to="/about">About</router-link>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
