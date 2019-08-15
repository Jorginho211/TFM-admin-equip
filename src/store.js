import Vue from 'vue'
import Vuex from 'vuex'
import {HTTP, HTTP_CODES} from './http-common.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    users: [],
    equipments: [],
    places: []
  },
  mutations: {
    setUsers(state, users) {
      state.users = users;
    },
    setEquipments(state, equipments) {
      state.equipments = equipments;
    },
    setPlaces(state, places) {
      state.places = places;
    },
    removeUser(state, idUser) {
      state.users = state.users.filter((user) => user.id !== idUser);
    },
    addOrEditUser(state, user) {
      let userAux = state.users.find((u) => u.id === user.id);
      if(userAux !== undefined){
        userAux.name = user.name;
        userAux.lastname = user.lastname;
        userAux.isAdmin = user.isAdmin;
        userAux.frequencySendData = user.frequencySendData;
      }
      else {
        state.users.push(user);
      }

      state.users = state.users.slice();
    },
    removeEquipment(state, idEquipment) {
      state.equipments = state.equipments.filter((eq) => eq.id !== idEquipment);
    },
    addOrEditEquipment(state, equipment){
      let eqAux = state.equipments.find((eq) => eq.id === equipment.id);
      if(eqAux !== undefined){
        eqAux.name = equipment.name;
        eqAux.major = equipment.major;
        eqAux.minor = equipment.minor;
      }
      else {
        state.equipments.push(equipment);
      }

      state.equipments = state.equipments.slice();
    },
    addOrEditPlace(state, place){
      let placeAux = state.places.find((p) => p.id === place.id);
      if(placeAux !== undefined){
        placeAux.name = place.name;
        placeAux.major = place.major;
        placeAux.minor = place.minor;
      }
      else {
        state.places.push(place);
      }

      state.places = state.places.slice();
    },
    removePlace(state, idPlace){
      state.places = state.places.filter((p) => p.id !== idPlace);
    }
  },
  actions: {
    getUsers(context){
      return new Promise((resolve, reject) => {
        HTTP.get('/api/v1/user/')
          .then((response) => {
            if(response.status === HTTP_CODES.Ok){
              context.commit('setUsers', response.data);
              resolve(response.status);
              return;
            }
            reject(response.status); 
            return;   
          })
        .catch((error) => {
          reject(error.response.status);
        });
      });
    },
    getEquipments(context){
      return new Promise((resolve, reject) => {
        HTTP.get('/api/v1/equipment')
          .then((response) => {
            if(response.status === HTTP_CODES.Ok){
              context.commit('setEquipments', response.data);
              resolve(response.status);
              return;
            }
            reject(response.status); 
            return;   
          })
        .catch((error) => {
          reject(error.response.status);
        });
      });
    },
    getPlaces(context){
      return new Promise((resolve, reject) => {
        HTTP.get('/api/v1/place')
          .then((response) => {
            if(response.status === HTTP_CODES.Ok){
              context.commit('setPlaces', response.data);
              resolve(response.status);
              return;
            }
            reject(response.status); 
            return;   
          })
        .catch((error) => {
          reject(error.response.status);
        });
      });
    }
  }
})
