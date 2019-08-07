<template>
  <v-container fluid fill-height align-center class="bg_container">
    <v-card width="500" height="300" class="mx-auto pa-5">
      <v-layout column>
        <v-form ref="form">
        <v-flex>
          <v-text-field
            v-model="username"
            label="Usuario"
            placeholder="pepe.perez"
            :rules="[v => !!v || '']"
            outlined
          ></v-text-field>
        </v-flex>

        <v-flex>
          <v-text-field
            v-model="password"
            label="Contrasinal"
            placeholder="Contrasinal"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'visibility' : 'visibility_off'"
            outlined
            :rules="[v => !!v || '']"
            @click:append="showPassword = !showPassword"
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
      showPassword: false
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
      if(!this.$refs.form.validate()){
        return;
      }

      HTTP.get("api/v1/user/login", {
        headers: {
          username: this.username,
          password: this.password
        }
      })
        .then(response => {
          if(Unauthorized(this.$router, response.status)) return;

          localStorage.setItem("token", response.data.token);
          HTTP.defaults.headers['Authorization'] = 'Bearer ' + localStorage.getItem("token");
          this.$router.replace({ name: "main" });
        })
        .catch(error => {
          console.log(error);
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


