<template>
  <Content title="Areas">
    <v-layout justify-end mt-5 mr-10>
      <v-flex xs12 sm6 md4>
        <v-text-field
          v-model="searchTable"
          append-icon="search"
          label="Busca"
          single-line
          hide-details
          solo
        ></v-text-field>
      </v-flex>
    </v-layout>

    <v-data-table :headers="this.headers" :items="this.places" class="ma-5" :search="searchTable" items-per-page="8"
      :footer-props="{'items-per-page-options': [8]}">
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
                        v-model="blueprintFile"
                        accept="image/*"
                        :rules="[v => v.size > 0 || '']"
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
                        :item-value="item => item"
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
                        :item-value="item => item"
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
import { HTTP, Unauthorized } from "../http-common";
import { dataURLtoFile, fileToDataURL} from "../utils"
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    Content,
    Modal
  },
  computed: {
    ...mapState(['users', 'places', 'equipments'])
  },
  data() {
    return {
      searchTable: "",
      modal: false,
      modalTitle: "",
      step: 1,
      validForm: true,
      blueprintFile: undefined,

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
    };
  },
  methods: {
    ...mapMutations(['addOrEditPlace', 'removePlace']),
    add() {
      this.modalTitle = "Engadir Area";
      this.place.id = undefined;
      this.place.name = "";
      this.place.major = 1;
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
    async next() {
      if (this.step < 2) {
        if(!this.$refs.form.validate()){
          return;
        }
        
        this.step++;
        return;
      }

      let body = {
        name: this.place.name,
        major: this.place.major,
        minor: this.place.minor,
        blueprint: this.place.blueprint
      }

      try {
        let response;
        if(this.place.id !== undefined){
          response = await HTTP.put(`/api/v1/place/${this.place.id}`, body);
        }
        else {
          response = await HTTP.post(`/api/v1/place/`, body);
        }

        this.place.id = response.data.id;

        let asociateEquipmentsRequest = HTTP.post(`/api/v1/place/${this.place.id}/equipments`, this.place.equipments.map(e => e.id));
        let asociateUsersRequest = HTTP.post(`/api/v1/place/${this.place.id}/users`, this.place.users.map(u => u.id));
        response = await asociateEquipmentsRequest;
        response = await asociateUsersRequest;
      }
      catch(error){
        if(Unauthorized(this.$router, error.response.status)) return;
      }

      this.place.equipments = undefined;
      this.place.users = undefined;
      this.place.blueprint = undefined;
      this.modal = false;
      this.addOrEditPlace(this.place);
    },
    blueprintSelected(file) {
      fileToDataURL(file).then((dataURL) => this.place.blueprint = dataURL);
    },
    async edit(place) {
      this.placeIdentifiers = [...Array(65536).keys()];
      for (let p of this.places) {
        if(place === p){
          console.log(p.minor);
          continue;
        }

        let index = -1;
        if ((index = this.placeIdentifiers.indexOf(p.minor)) > -1) {
          this.placeIdentifiers.splice(index, 1);
        }
      }
      this.placeIdentifiers.splice(0, 1);

      try {
        let placeRequest = HTTP.get(`/api/v1/place/${place.id}`);
        let asociateEquipmentsRequest = HTTP.get(`/api/v1/place/${place.id}/equipments`);
        let asociateUsersRequest = HTTP.get(`/api/v1/place/${place.id}/users`);

        let response = await placeRequest;
        this.place = response.data;
        this.blueprintFile = dataURLtoFile(this.place.blueprint, 'blueprint');
        response = await asociateEquipmentsRequest;
        this.place.equipments = response.data;
        response = await asociateUsersRequest;
        this.place.users = response.data;
      }
      catch(error) {
        if(Unauthorized(this.$router, error.response.status)) return;
      }      

      this.step = 1;
      this.modalTitle = "Editar area";
      this.modal = true;
    },
    async remove(place) {
      try {
        await HTTP.delete(`/api/v1/place/${place.id}`);
        this.removePlace(place.id);
      } catch (error) {
        if(Unauthorized(this.$router, error.response.status)) return;
      }
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