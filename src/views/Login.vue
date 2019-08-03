<template>
  <v-container fluid fill-height align-center class="bg_container">
    <v-card width="500" height="300" class="mx-auto pa-5">
      <v-layout column>
        <v-flex>
          <v-text-field v-model="username" label="Usuario" placeholder="pepe.perez" outlined></v-text-field>
        </v-flex>

        <v-flex>
          <v-text-field
            v-model="password"
            label="Contrasinal"
            placeholder="Contrasinal"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'visibility' : 'visibility_off'"
            outlined
            @click:append="showPassword = !showPassword"
          ></v-text-field>
        </v-flex>

        <v-flex>
          <v-btn color="primary" @click="test()">Entrar</v-btn>
        </v-flex>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      showPassword: false
    };
  },
  methods: {
    test() {
      this.$router.push("/");
    }
  }
};
</script>

<style lang="scss" scoped>
  @import '../plugins/_variables.scss';

  .bg_container {
    background: $primary;
  }
</style>


