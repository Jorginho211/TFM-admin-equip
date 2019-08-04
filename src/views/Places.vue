<template>
  <Content title="Areas">
    <v-layout justify-end mt-5 mr-10>
      <v-flex xs12 sm6 md4>
        <v-text-field
          v-model="searchTable"
          append-icon="search"
          label="Search"
          single-line
          hide-details
          solo
        ></v-text-field>
      </v-flex>
    </v-layout>

    <v-data-table :headers="this.headers" :items="this.places" class="ma-5" :search="searchTable">
      <template v-slot:item.isAdmin="{ item }">
        <v-icon v-if="item.isAdmin" color="success">check_circle</v-icon>
        <v-icon v-else color="error">cancel</v-icon>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon color="black" @click="remove(item)" class="mr-5">delete</v-icon>
        <v-icon color="black" @click="edit(item)" class="mr-5">edit</v-icon>
      </template>
    </v-data-table>

    <v-btn absolute fab bottom right color="primary" class="floating_button">
      <v-icon>add</v-icon>
    </v-btn>
  </Content>
</template>

<script>
import Content from "../components/Content.vue";

export default {
  components: {
    Content
  },
  data() {
    return {
      searchTable: "",

      headers: [
        {
          text: "Nome",
          align: "left",
          value: "name"
        },
        { text: "Accións", value: "action", sortable: false, align: "end" }
      ],
      places: [
        {
          id: 8,
          major: 2,
          minor: 1,
          name: "Sala de montaxe"
        },
        {
          id: 9,
          major: 1,
          minor: 1,
          name: "Sala de maquinas"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.v-btn.v-btn--fab.floating_button {
  bottom: 20px;
}
</style>