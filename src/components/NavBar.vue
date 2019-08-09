<template>
  <v-navigation-drawer expand-on-hover left permanent elevation="24">
    <v-list dense nav class="pa-0">
      <v-divider></v-divider>

      <v-list-item link :to="{name: 'users'}" active-class="item item--active" class="pa-2 ma-0">
        <v-list-item-icon>
          <v-icon class="icon">accessibility</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="item__text">Usuarios</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item link :to="{name: 'equipments'}" active-class="item item--active" class="pa-2 ma-0">
        <v-list-item-icon>
          <v-icon class="icon">headset</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="item__text">Equipamentos</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item  link :to="{name: 'places'}" active-class="item item--active" class="pa-2 ma-0">
        <v-list-item-icon>
          <v-icon class="icon">place</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="item__text">Areas</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item @click="logout()" active-class="item item--active" class="pa-2 ma-0"> 
        <v-list-item-icon>
          <v-icon class="icon">exit_to_app</v-icon>
        </v-list-item-icon>
        

        <v-list-item-content>
          <v-list-item-title class="item__text">Sair</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$router.replace({name: 'login'});
    }
  }  
}
</script>

<style lang="scss" scoped>
  @import '../plugins/_variables.scss';  

  .item__text {
    color: $black;
  }

  .item {
    &--active {
      background-color: $secondary;
    }
  }

  .icon {
    color: $black!important;
  }

  .item.item--active .icon {
    color: $white!important;
  }

  .item.item--active .item__text {
    color: $white;
  }
</style>

