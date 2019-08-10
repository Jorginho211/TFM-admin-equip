<template>
  <v-container fluid fill-height pa-0>
    <v-layout column>
      <v-toolbar color="primary">
        <v-toolbar-title>
          <img style="width:42px;" :src="logo">
          <div class="title">Equip</div>
        </v-toolbar-title>
      </v-toolbar>

      <v-layout fill-height>
        <NavBar/>

        <v-flex>
          <router-view/>
        </v-flex>
      </v-layout>
    </v-layout>

    <portal-target name="modal"></portal-target>
  </v-container>
</template>

<script>
import NavBar from "../components/NavBar";
import { Unauthorized} from "../http-common";
import { mapActions } from "vuex";

export default {
  created() {
    let promises = [this.getUsers(), this.getEquipments(), this.getPlaces()];

    Promise.all(promises).catch(status => {
      if(Unauthorized(this.$router, status)) return;
    });
  },
  components: {
    NavBar
  },
  data() {
    return {
      logo: require('../assets/equip-logo-blue.png'),
    }
  },
  methods: {
    ...mapActions(["getUsers", "getEquipments", "getPlaces"])
  }
};
</script>

<style lang="scss" scoped>
@import "../plugins/_variables.scss";

.title {
  color: $accent;
  display: inline-block;
  margin-left: 10px;
  vertical-align: text-bottom;
}
</style>
