<template>
  <v-container fluid fill-height pa-0>
    <v-layout column>
      <v-toolbar color="primary">
        <v-toolbar-title>
          <div class="title">
            Equip
          </div> 
        </v-toolbar-title>
      </v-toolbar>

      <v-layout fill-height>
        <NavBar />

        <v-flex>
            <router-view />
        </v-flex>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
import NavBar from "../components/NavBar"

export default {
  components: {
    NavBar
  }
};
</script>

<style lang="scss" scoped>
  @import '../plugins/_variables.scss';

  .title {
    color: $accent;
  }
</style>
