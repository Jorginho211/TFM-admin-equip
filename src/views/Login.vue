<template>
  <v-container fluid fill-height align-center class="bg_container">
    <v-card width="500" class="mx-auto pa-5">
      <v-layout column>
        <v-alert v-if="loginError" dense outlined type="error">Usuario ou contrasinal incorrectos</v-alert>
        <v-form ref="form" @keyup.native.enter="login()">
          <v-flex mb-5>
            <v-text-field
              v-model="username"
              label="Usuario"
              placeholder="pepe.perez"
              :rules="[v => !!v || '']"
              outlined
              hide-details
            ></v-text-field>
          </v-flex>

          <v-flex mb-5>
            <v-text-field
              v-model="password"
              label="Contrasinal"
              placeholder="Contrasinal"
              :type="showPassword ? 'text' : 'password'"
              :append-icon="showPassword ? 'visibility' : 'visibility_off'"
              outlined
              :rules="[v => !!v || '']"
              @click:append="showPassword = !showPassword"
              hide-details
            ></v-text-field>
          </v-flex>

          <v-flex>
            <v-btn color="primary" @click="login()">Entrar</v-btn>
          </v-flex>
        </v-form>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
import { HTTP, Unauthorized } from "../http-common.js";

export default {
  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
      loginError: false
    };
  },
  created() {
    let token = localStorage.getItem("token");
    if (token !== null) {
      this.$router.replace({ name: "home" });
    }
  },
  methods: {
    login() {
      if (!this.$refs.form.validate()) {
        return;
      }

      HTTP.get("api/v1/user/login", {
        headers: {
          username: this.username,
          password: this.password
        }
      })
        .then(response => {
          if (Unauthorized(this.$router, response.status)) return;

          localStorage.setItem("token", response.data.token);
          HTTP.defaults.headers["Authorization"] =
            "Bearer " + localStorage.getItem("token");
          this.$router.replace({ name: "main" });
        })
        .catch(error => {
          if (Unauthorized(this.$router, error.response.status)){
            this.loginError = true;
            return;
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../plugins/_variables.scss";

.bg_container {
  background: $primary;
}
</style>


