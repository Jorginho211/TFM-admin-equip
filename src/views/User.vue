<template>
  <Content goBackEnabled :title="title">
    <v-data-table
      :headers="this.headers"
      :items="this.userMonitorDatas"
      class="ma-5"
      :search="searchTable"
    >
      <template v-slot:item.date="{ item }">{{getDateFromUnixTimestamp(item.date)}}</template>
      <template v-slot:item.time="{ item }">{{getTimeFromUnixTimestamp(item.date)}}</template>
      <template v-slot:item.place="{ item }">{{getPlaceNameById(item.place)}}</template>
      <template v-slot:item.action="{ item }">
        <v-icon color="black" @click="info(item)">info</v-icon>
      </template>
    </v-data-table>

    <portal to="modal" v-if="this.modal">
      <Modal :title="this.modalTitle">
        <template v-slot:content>
          <v-container>
            <v-layout row>
              <v-flex xs12 sm6>
                <h2 class="title">Area:</h2>
                <h2
                  class="place__name"
                  v-if="userMonitorData.place !== undefined"
                >{{userMonitorData.place.name}}</h2>
                <h2 v-else class="place__name place__name--no-area">Non hai datos da area</h2>
                <figure class="blueprint">
                  <img
                    v-if="userMonitorData.place !== undefined"
                    :src="userMonitorData.place.blueprint"
                  >
                </figure>
              </v-flex>
              <v-flex xs12 md6>
                <h2 class="title">Equipamentos:</h2>
                <h2
                  class="no_equipments"
                  v-if="userMonitorData.equipments.length === 0"
                >Non hai datos de equipamento</h2>
                <ul class="equipments__list" v-if="userMonitorData.equipments.length > 0">
                  <li
                    class="equipments__item"
                    :key="index"
                    v-for="(eq, index) in userMonitorData.equipments"
                  >{{eq}}</li>
                </ul>
              </v-flex>
            </v-layout>
          </v-container>
        </template>
        <template v-slot:actions>
          <v-btn text color="primary" @click="modal=false">Cerrar</v-btn>
        </template>
      </Modal>
    </portal>
  </Content>
</template>

<script>
import Content from "../components/Content.vue";
import { mapState } from "vuex";
import Modal from "../components/Modal.vue";
import { HTTP, Unauthorized } from "../http-common";

export default {
  components: {
    Content,
    Modal
  },
  async created() {
    let idUser = Number(this.$route.params.id);
    
    try {
      let monitorDataRequest = HTTP.get(`/api/v1/user/${idUser}/monitorData`);
      let user = this.users.find(u => u.id === idUser);
      this.title = `Historial Usuario: ${user.name} ${user.lastname}`;

      let response = await monitorDataRequest;
      this.userMonitorDatas = response.data;
    }
    catch(error){
      if(Unauthorized(this.$router, error.response.status)) return;
    } 
  },
  computed: {
    ...mapState(["users", "places", "equipments"])
  },
  data() {
    return {
      title: "",
      modalTitle: "",
      searchTable: "",
      modal: false,
      userMonitorData: {},
      userMonitorDatas: [],

      headers: [
        {
          text: "Data",
          align: "start",
          value: "date"
        },
        { text: "Hora", value: "time", align: "center" },
        { text: "Sala", value: "place", align: "center" },
        { text: "Accións", value: "action", sortable: false, align: "end" }
      ]
    };
  },
  methods: {
    getDateFromUnixTimestamp(unixTimestamp) {
      let date = new Date(unixTimestamp * 1000);

      let yyyy = date.getFullYear();
      let dd = date.getDate();
      let mm = date.getMonth() + 1;

      dd = dd < 10 ? "0" + dd : dd;
      mm = mm < 10 ? "0" + mm : mm;

      return `${dd}/${mm}/${yyyy}`;
    },
    getTimeFromUnixTimestamp(unixTimestamp) {
      let date = new Date(unixTimestamp * 1000);
      let hh = date.getHours();
      let mm = date.getMinutes();
      let ss = date.getSeconds();

      hh = hh < 10 ? "0" + hh : hh;
      mm = mm < 10 ? "0" + mm : mm;
      ss = ss < 10 ? "0" + ss : ss;

      return hh + ":" + mm + ":" + ss;
    },
    getPlaceNameById(idPlace) {
      if (idPlace !== -1) {
        let place = this.places.find(p => p.id === idPlace);
        return place.name;
      }
      return "";
    },
    async info(monitorData) {
      this.modalTitle =
        "Historial - " +
        this.getDateFromUnixTimestamp(monitorData.date) +
        " " +
        this.getTimeFromUnixTimestamp(monitorData.date);

      this.userMonitorData = {
        equipments: []
      };

      try {
        let placeRequest;
        if (monitorData.place !== -1) {
          placeRequest = HTTP.get(`/api/v1/place/${monitorData.place}`);
        }

        for (let idEq of monitorData.equipments) {
          let equipment = this.equipments.find(eq => eq.id === idEq);
          if (equipment === undefined) {
            continue;
          }

          this.userMonitorData.equipments.push(equipment.name);
        }

        if (placeRequest !== undefined) {
          let response = await placeRequest;
          this.userMonitorData.place = response.data;
        }

        this.modal = true;
      } catch (error) {
        if (Unauthorized(this.$router, error.response.status)) return;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../plugins/_variables.scss";

.title {
  color: $black;
  font-size: 1.25rem;
}
.place__name {
  color: $black;
  font-size: 1.25rem;
  font-weight: normal;

  &--no-area {
    color: $error;
  }
}
.no_equipments {
  color: $error;
  font-size: 1.25rem;
  font-weight: normal;
}
.equipments__list {
  margin-top: 10px;
}
.equipments__item {
  line-height: 1.75rem;
  color: $black;
}
.blueprint, .blueprint > img {
  max-width: 100%;
  max-height: 350px;
  text-align: center;
}
</style>
