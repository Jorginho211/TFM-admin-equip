<template>
  <Content title="Usuarios">
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

    <v-data-table :headers="this.headers" :items="this.users" class="ma-5" :search="searchTable">
      <template v-slot:item.isAdmin="{ item }">
        <v-icon v-if="item.isAdmin" color="success">check_circle</v-icon>
        <v-icon v-else color="error">cancel</v-icon>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon color="black" @click="remove(item)" class="mr-5">delete</v-icon>
        <v-icon color="black" @click="edit(item)" class="mr-5">edit</v-icon>
        <v-icon color="black" @click="monitor(item)">person_pin_circle</v-icon>
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
                    v-model="user.name"
                    label="Nome"
                    solo
                    hide-details
                    :rules="[v => !!v || '']"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row mb-4>
                <v-flex>
                  <v-text-field
                    v-model="user.lastname"
                    label="Apelidos"
                    solo
                    hide-details
                    :rules="[v => !!v || '']"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row mb-4>
                <v-flex>
                  <v-text-field
                    v-model="user.username"
                    label="Nome de usuario"
                    solo
                    hide-details
                    :rules="[v => !!v || '', v => v.indexOf(' ') === -1 || '']"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row mb-4>
                <v-text-field
                  v-model="user.password"
                  label="Contrasinal"
                  :type="showPassword ? 'text' : 'password'"
                  :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                  solo
                  hide-details
                  @click:append="showPassword = !showPassword"
                ></v-text-field>
              </v-layout>
              <v-layout row mb-4>
                <v-flex xs7>
                  <v-text-field
                    v-model="user.frequencySendData"
                    label="Frecuencia adquisición datos (Numero)"
                    solo
                    hide-details
                    :rules="[v => !!v || 'dato incorrecto', v => Number.isInteger(Number(v)) || '' ]"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs4 offset-xs1>
                  <v-select
                    v-model="unit"
                    :items="['Minutos', 'Segundos']"
                    label="Unidad"
                    hide-details
                    solo
                  ></v-select>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-checkbox
                  v-model="user.isAdmin"
                  hide-details
                  color="primary"
                  label="Usuario administrador"
                ></v-checkbox>
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
      modal: false,
      showPassword: false,
      modalTitle: "",
      searchTable: "",
      validForm: true,
      unit: "Minutos",
      user: {
        name: "",
        lastname: "",
        username: "",
        password: "",
        frequencySendData: 5,
        isAdmin: false
      },

      headers: [
        {
          text: "Nome",
          align: "start",
          value: "name"
        },
        { text: "Apelidos", value: "lastname" },
        { text: "Administrador", value: "isAdmin", align: "center" },
        { text: "Accións", value: "action", sortable: false, align: "end" }
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
      ]
    };
  },
  methods: {
    remove(user) {
      console.log(user);
    },
    edit(user) {
      this.user.id = user.id;
      this.user.name = user.name;
      this.user.lastname = user.lastname;
      this.user.username = user.authentication.username;
      this.user.password = "";
      this.user.frequencySendData = user.frequencySendData/60;

      if(this.user.frequencySendData <= 0 || !Number.isInteger(this.user.frequencySendData)){
        this.unit = "Segundos";
        this.user.frequencySendData = user.frequencySendData;
      }

      this.user.isAdmin = user.isAdmin;
      this.modalTitle = "Editar Usuario";
      this.modal = true;
    },
    monitor(user) {
      this.$router.push({ name: "user", params: { id: user.id } });
    },
    add() {
      this.user.name = "";
      this.user.lastname = "";
      this.user.username = "";
      this.user.password = "";
      this.user.frequencySendData = 5;
      this.user.isAdmin = false;
      this.unit = "Minutos";

      this.modalTitle = "Engadir Usuario";
      this.modal = true;
    },
    completeAdd() {
      if (this.$refs.form.validate()) {
        this.modal = false;
      }

      this.user.frequencySendData = this.unit === "Minutes" ? this.frequencySendData * 60 : this.frequencySendData;
    }
  }
};
</script>

<style lang="scss" scoped>
.v-btn.v-btn--fab.floating_button {
  bottom: 20px;
}
</style>
