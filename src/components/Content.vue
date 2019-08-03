<template>
  <v-layout fill-height>
    <v-flex justify-center ma-10>
      <v-card class="card">
        <v-card-title v-if="!this.titleDisabled" class="title pa-0">
          <v-container fluid>
            <v-layout>
              <v-icon v-if="this.goBackEnabled" @click="goBack()" class="arrow" size="32">arrow_back</v-icon>
              <v-flex class="title__text">{{this.title}}</v-flex>
            </v-layout>
          </v-container>
        </v-card-title>

        <slot></slot>

      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
    props:{
      title: String,
      goBackEnabled: Boolean,
      titleDisabled: Boolean
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../plugins/_variables.scss';

.card {
    height: 100%;
}

.title {
    height: 5rem;
    background-color: $secondary;
    color: $accent;
    justify-content: center;
}

.title__text {
    margin-right: 32px;
    text-align: center;
}

.arrow {
    color: $accent;
}
</style>

