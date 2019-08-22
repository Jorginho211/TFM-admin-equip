<template>
  <Content title="Usuarios">
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

    <v-data-table
      :headers="this.headers"
      :items="this.users"
      class="ma-5"
      :search="searchTable"
      items-per-page="8"
      :footer-props="{'items-per-page-options': [8]}"
    >
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
                    v-model="user.authentication.username"
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
                  v-model="user.authentication.password"
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
import { mapState, mapMutations } from "vuex";
import { HTTP, Unauthorized } from "../http-common.js";

export default {
  components: {
    Content,
    Modal
  },
  computed: {
    ...mapState(["users"])
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
        frequencySendData: 5,
        isAdmin: false,
        authentication: {
          username: "",
          password: ""
        }
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
      ]
    };
  },
  methods: {
    ...mapMutations(["removeUser", "addOrEditUser"]),
    async remove(user) {
      try {
        await HTTP.delete(`/api/v1/user/${user.id}`);
        this.removeUser(user.id);
      } catch (error) {
        if (Unauthorized(this.$router, error.response.status)) return;
      }
    },
    async edit(user) {
      try {
        let response = await HTTP.get(`/api/v1/user/${user.id}`);

        user = response.data;
        this.user.id = user.id;
        this.user.name = user.name;
        this.user.lastname = user.lastname;
        this.user.authentication = {
          username: user.authentication.username,
          password: ""
        };
        this.user.isAdmin = user.isAdmin;
        this.user.frequencySendData = user.frequencySendData;

        this.unit = Number.isInteger(this.user.frequencySendData / 60)
          ? "Minutos"
          : "Segundos";
        if (this.unit === "Minutos") {
          this.user.frequencySendData = this.user.frequencySendData / 60;
        }

        this.modalTitle = "Editar Usuario";
        this.modal = true;
      } catch (error) {
        if (Unauthorized(this.$router, error.response.status)) return;
      }
    },
    monitor(user) {
      this.$router.push({ name: "user", params: { id: user.id } });
    },
    add() {
      this.user.id = undefined;
      this.user.name = "";
      this.user.lastname = "";
      this.user.authentication = {
        username: "",
        password: ""
      };
      this.user.frequencySendData = 5;
      this.user.isAdmin = false;
      this.unit = "Minutos";

      this.modalTitle = "Engadir Usuario";
      this.modal = true;
    },
    async completeAdd() {
      if (!this.$refs.form.validate()) {
        return;
      }

      let frequencySendData =
        this.unit === "Minutos"
          ? this.user.frequencySendData * 60
          : this.user.frequencySendData;

      try {
        let response;
        if (Number.isInteger(this.user.id)) {
          this.user.authentication.password =
            this.user.authentication.password === ""
              ? undefined
              : this.user.authentication.password;
          response = await HTTP.put(`/api/v1/user/${this.user.id}`, {
            ...this.user,
            frequencySendData: frequencySendData
          });
        } else {
          response = await HTTP.post(`/api/v1/user/`, {
            ...this.user,
            frequencySendData: frequencySendData
          });
        }

        this.user.id = response.data.id;
        this.user.authentication = undefined;
        this.modal = false;
        this.user.frequencySendData = frequencySendData;
        this.addOrEditUser(this.user);
      } catch (error) {
        if (Unauthorized(error.response.status)) return;
        return;
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
