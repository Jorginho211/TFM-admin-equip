<template>
  <div class="modal_container">
      <v-card class="card">
        <v-card-title class="title">
          {{this.title}}
        </v-card-title>

        <div class="ml-5 mr-5">
          <slot name="content"></slot>
        </div>

        <v-card-actions class="modal_actions mb-5 mr-5">
          <slot name="actions"></slot>
        </v-card-actions>
      </v-card>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>


<style lang="scss" scoped>
  @import '../plugins/_variables.scss';

  .modal_container {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.75);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .modal_actions {
    position: absolute;
    right: 0;
    bottom: 0;
  }

  .card {
    position: relative;
    width: 800px;
    height: 550px;
    left: calc(50% - 400px);
    top: calc(50% - 30%);
  }

  .title {
    color: $primary;
    font-weight: normal;
  }


</style>
