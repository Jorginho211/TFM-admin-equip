<template>
  <Content title="Equipamentos">
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

    <v-data-table
      :headers="this.headers"
      :items="this.equipments"
      class="ma-5"
      :search="searchTable"
    >
      <template v-slot:item.isAdmin="{ item }">
        <v-icon v-if="item.isAdmin" color="success">check_circle</v-icon>
        <v-icon v-else color="error">cancel</v-icon>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon color="black" @click="remove(item)" class="mr-5">delete</v-icon>
        <v-icon color="black" @click="edit(item)" class="mr-5">edit</v-icon>
      </template>
    </v-data-table>

    <v-btn absolute fab bottom right color="primary" class="floating_button" @click="add()">
      <v-icon>add</v-icon>
    </v-btn>

    <portal to="modal" v-if="this.modal">
      <Modal :title="this.modalTitle">
        <template v-slot:content>
          <v-form ref="form" v-model="validForm" lazy-validation>
            <v-container>
              <v-layout row mb-4>
                <v-flex>
                  <v-text-field
                    v-model="equipment.name"
                    label="Nome"
                    solo
                    hide-details
                    :rules="[v => !!v || '']"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row mb-4>
                <v-flex xs12>
                  <v-select
                    v-model="equipment.minor"
                    :items="equipIdentifiers"
                    label="Identificador único de equipamento"
                    hide-details
                    solo
                    :rules="[v => !!v || '']"
                    required
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </template>

        <template v-slot:actions>
          <v-btn text color="error" @click="modal = false">Cancelar</v-btn>
          <v-btn text color="primary" @click="completeAdd()">Aceptar</v-btn>
        </template>
      </Modal>
    </portal>
  </Content>
</template>

<script>
import Content from "../components/Content.vue";
import Modal from "../components/Modal.vue";

export default {
  components: {
    Content,
    Modal
  },
  data() {
    return {
      searchTable: "",
      modal: false,
      modalTitle: "",
      validForm: true,
      equipment: {
        name: "",
        minor: 0
      },
      equipIdentifiers: [],

      headers: [
        {
          text: "Nome",
          align: "left",
          value: "name"
        },
        { text: "Accións", value: "action", sortable: false, align: "end" }
      ],
      equipments: [
        {
          id: 2,
          major: 1,
          minor: 1,
          name: "Chaleco"
        },
        {
          id: 3,
          major: 1,
          minor: 2,
          name: "Casco"
        }
      ]
    };
  },
  methods: {
    add() {
      this.equipment.name = "";
      this.equipment.major = 1;
      this.equipment.minor = 0;
      this.equipIdentifiers = [];

      for (let i = 0; i < 16; i++) {
        let id = Math.pow(2, i);
        if (this.equipments.find(eq => eq.minor === id) === undefined) {
          this.equipIdentifiers.push(id);
        }
      }

      this.modalTitle = "Engadir Equipamento";
      this.modal = true;
    },
    edit(equipment) {
      this.equipment.id = equipment.id;
      this.equipment.name = equipment.name;
      this.equipment.major = equipment.major;
      this.equipment.minor = equipment.minor;

      this.equipIdentifiers = [];
      for (let i = 0; i < 16; i++) {
        let id = Math.pow(2, i);
        if ((this.equipments.find(eq => eq.minor === id) === undefined) || id === this.equipment.minor) {
          this.equipIdentifiers.push(id);
        }
      }

      this.modalTitle = "Editar Equipamento";
      this.modal = true;
    },
    completeAdd() {
      if (this.$refs.form.validate()) {
        this.modal = false;
      }

      let equipment = this.equipments.find(eq => eq.id === this.equipment.id);
      if(equipment !== undefined){
        equipment.name = this.equipment.name;
        equipment.minor = this.equipment.minor;
      }
      else {
        this.equipment.id = 10;
        this.equipments.push({...this.equipment});
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.v-btn.v-btn--fab.floating_button {
  bottom: 20px;
}
</style>