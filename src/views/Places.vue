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

    <v-btn absolute fab bottom right color="primary" class="floating_button" @click="add()">
      <v-icon>add</v-icon>
    </v-btn>

    <portal to="modal" v-if="this.modal">
      <Modal :title="this.modalTitle">
        <template v-slot:content>
          <v-stepper class="stepper" v-model="step">
            <v-stepper-header>
              <v-stepper-step :complete="step > 1" step="1">Datos da Area</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="step > 2" step="2">Usuarios e Equipamentos</v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content class="stepper_content" step="1">
                <v-form ref="form" v-model="validForm" lazy-validation>
                <v-container class="stepper_container">
                  <v-layout row mb-4>
                    <v-flex xs12>
                      <v-text-field
                        v-model="place.name"
                        label="Nome"
                        solo
                        hide-details
                        :rules="[v => !!v || '']"
                        required
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row mb-2>
                    <v-flex xs4>
                      <v-select
                        v-model="place.minor"
                        :items="placeIdentifiers"
                        label="Identificador único de area"
                        hide-details
                        solo
                        :rules="[v => !!v || '']"
                        required
                      ></v-select>
                    </v-flex>
                    <v-flex offset-xs1 xs7>
                      <v-file-input
                        label="Plano da area"
                        filled
                        solo
                        hide-details
                        @change="blueprintSelected"
                        accept="image/*"
                        :rules="[v => !vv || '']"
                        required
                      ></v-file-input>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex offset-xs5 xs7 class="blueprint">
                      <img v-if="place.blueprint !== ''" :src="place.blueprint">
                    </v-flex>
                  </v-layout>
                </v-container>
                </v-form>
              </v-stepper-content>

              <v-stepper-content class="stepper_content" step="2" pt-5>
                <v-container class="stepper_container">
                  <v-layout row>
                    <v-flex xs12>
                      <v-autocomplete
                        v-model="place.users"
                        :items="users"
                        item-value="id"
                        :item-text="item => item.name + ' ' + item.lastname"
                        cache-items
                        hide-no-data
                        hide-details
                        label="Usuarios"
                        multiple
                        solo
                      >
                        <template v-slot:selection="data">
                          <v-chip
                            v-bind="data.attrs"
                            :input-value="data.selected"
                            close
                            @click:close="() => place.users.splice(place.users.indexOf(data.item.id), 1)"
                          >
                            <v-avatar left>
                              <v-icon>accessibility</v-icon>
                            </v-avatar>
                            {{ data.item.name + " " + data.item.lastname}}
                          </v-chip>
                        </template>
                      </v-autocomplete>
                    </v-flex>
                  </v-layout>
                  <v-layout row mt-5>
                    <v-flex xs12>
                      <v-autocomplete
                        v-model="place.equipments"
                        :items="equipments"
                        item-value="id"
                        :item-text="item => item.name"
                        cache-items
                        hide-no-data
                        hide-details
                        label="Equipamentos"
                        multiple
                        solo
                      >
                        <template v-slot:selection="data">
                          <v-chip
                            v-bind="data.attrs"
                            :input-value="data.selected"
                            close
                            @click:close="() => place.equipments.splice(place.equipments.indexOf(data.item.id), 1)"
                          >
                            <v-avatar left>
                              <v-icon>headset</v-icon>
                            </v-avatar>
                            {{ data.item.name }}
                          </v-chip>
                        </template>
                      </v-autocomplete>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </template>

        <template v-slot:actions>
          <v-btn text color="error" @click="modal = false">Cancelar</v-btn>
          <v-btn text color="primary" @click="next()">
            <span v-if="step < 2">Seguinte</span>
            <span v-else>Completar</span>
          </v-btn>
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
      step: 1,

      placeIdentifiers: [],
      place: {
        name: "",
        major: 1,
        minor: 0,
        blueprint: "",
        equipments: [],
        users: []
      },

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
          major: 1,
          minor: 1,
          name: "Sala de montaxe"
        },
        {
          id: 9,
          major: 1,
          minor: 2,
          name: "Sala de maquinas"
        }
      ],
      users: [
        {
          id: 6,
          name: "admin",
          lastname: "admin",
          isAdmin: true,
          uuid: "cde77ff0-ad5f-11e9-b1de-4102069e53c0",
          frequencySendData: 5,
          authentication: {
            username: "jorge.lopez"
          }
        },
        {
          id: 20,
          name: "Jorge",
          lastname: "Lopez",
          isAdmin: true,
          uuid: "03f77f70-ad63-11e9-be91-21a8f11653b7",
          frequencySendData: 5,
          authentication: {
            username: "jorge.lopez"
          }
        },
        {
          id: 24,
          name: "test",
          lastname: "test",
          isAdmin: false,
          uuid: "b2a4e7b0-ad63-11e9-be01-217812bf7e51",
          frequencySendData: 20,
          authentication: {
            username: "jorge.lopez"
          }
        },
        {
          id: 32,
          name: "Jorge",
          lastname: "Lopez",
          isAdmin: true,
          uuid: "e35e0b80-afba-11e9-b3fd-09eedf8b53b3",
          frequencySendData: 5,
          authentication: {
            username: "jorge.lopez"
          }
        }
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
      this.modalTitle = "Engadir Area";
      this.place.name = "";
      this.place.minor = 0;
      this.place.blueprint = "";
      this.place.equipments = [];
      this.place.users = [];

      this.placeIdentifiers = [...Array(65536).keys()];
      for (let place of this.places) {
        let index = -1;
        if ((index = this.placeIdentifiers.indexOf(place.minor)) > -1) {
          console.log(index);
          this.placeIdentifiers.splice(index, 1);
        }
      }
      this.placeIdentifiers.splice(0, 1);

      this.step = 1;
      this.modal = true;
    },
    next() {
      if (this.step <= 2) {
        if(!this.$refs.form.validate() || this.place.blueprint === ""){
          return;
        }
        
        this.step++;
        return;
      }

      this.places.push({ ...this.place });
      this.modal = false;
    },
    blueprintSelected(file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function() {
        this.place.blueprint = reader.result;
      }.bind(this);
    },
    edit(place) {
      
      this.placeIdentifiers = [...Array(65536).keys()];
      for (let p of this.places) {
        if(place === p){
          continue;
        }

        let index = -1;
        if ((index = this.placeIdentifiers.indexOf(p.minor)) > -1) {
          this.placeIdentifiers.splice(index, 1);
        }
      }
      this.placeIdentifiers.splice(0, 1);

      this.place = place;
      this.step = 1;
      this.modalTitle = "Editar area";
      this.modal = true;
    },
    remove(item) {

    }
  }
};
</script>

<style lang="scss" scoped>
.v-btn.v-btn--fab.floating_button {
  bottom: 20px;
}

.stepper {
  box-shadow: none !important;
}

.blueprint {
  height: 200px;
  text-align: center;
}
.blueprint img {
  height: 100%;
}
.stepper_container {
  padding: 15px 15px;
}

.stepper_content {
  padding-top: 5px;
}
</style>