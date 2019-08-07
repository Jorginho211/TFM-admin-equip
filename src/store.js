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
    }
  },
  actions: {
    getUsers(context){
      console.log("qqqq")
      return new Promise((resolve, reject) => {
        console.log(HTTP.headers);
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
