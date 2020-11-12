<template>
  <div class="bgppal">
    <q-layout view="hHh lpr lFf">
      <q-header class="bg-indigo-1">
        <q-toolbar class="bg-blue-8 text-white">
          <q-btn
            flat
            dense
            round
            @click="leftDrawerOpen = !leftDrawerOpen"
            icon="menu"
            aria-label="Menu"
          />
          <q-toolbar-title class="gt-sm">&nbsp;Sistema informático de Boletas 1.0</q-toolbar-title>
          <q-space />
          <q-separator dark vertical inset />
          
        </q-toolbar>
      </q-header>

      <q-drawer v-model="leftDrawerOpen" bordered :breakpoint="767" content-class="bg-grey-2">
        <!-- show-if-above -->
          <q-tree
            :nodes="navItems"
            node-key="Id"
            label-key="label"
            :selected.sync="menuselected"
            @update:selected="runLand"
            no-nodes-label="No hay menú a visualizar"
          />
      </q-drawer>

     
     <q-page-container>
      <component v-bind:is="miContenido" />
    </q-page-container>

      <q-footer >
        <q-toolbar class="bg-blue-grey-10 text-white">
         
          <span class="text-bold text-h6">Walter Echavarría Pardo</span>
          <!-- <span class="text-grey-4 text-subtitle1">&nbsp;&nbsp;s.a.s.</span> -->
          <span class="gt-xs absolute-right q-pt-md text-grey-4 copyright">
            Derechos no reservados © 2020&nbsp;<q-spinner-hourglass v-show="lVisibleBusy" color="white" size="2em"/>
          </span>
           
        </q-toolbar>
      </q-footer>
    </q-layout>
  </div>
</template>

<script>
import { Loading } from "quasar";

export default {
  name: "myApp",
   components: {
    glbTerceros: () => import("src/pages/generales/glbTerceros"),
    glbEventos: () => import("src/pages/generales/glbEventos"),
    glbBoletas: () => import("src/pages/generales/glbBoletas"),
    
  },
  data() {
    return {
      leftDrawerOpen: false,
      menuselected: null,
      lVisibleBusy: false,
      miContenido: null,
    };
  },
  computed: {
    navItems() {
      return [
        {
          label: "Compradores",
          icon: "people_alt",
          link: "glbTerceros",
          Id: 0
        },
        {
          label: "Eventos",
          icon: "local_offer",
          link: "glbEventos",
          Id: 1
        },
        {
          label: "Boletas",
          icon: "local_activity",
          link: "glbBoletas",
          Id: 2
        }
      ];
    }
  },
  mounted() {
    this.$root.$on( "goHome", () => {
        location.reload();
      }
    )
    
    this.$root.$on( "HideMenu", () => {
        this.leftDrawerOpen = false;
      }
    );
    this.$root.$on( "AppBusy", (estate) => {
        this.lVisibleBusy = estate;
      }
    );
  },
  methods: {
    glbMakeTab(Id, Nombre, Url) {
      this.$root.$emit("InsertTab", Id, Nombre, Url);
    },
   
      runLand(option) {
      this.leftDrawerOpen=false;
      this.miContenido = this.navItems[option].link;
      this.menuselected=null;
    }

  }
  
};
</script>

<style >
.bgppal {
  background-color: #fafafa;
  /* background-image: linear-gradient(white,rgb(240, 250, 255),white); */
}

@media (max-width: 420px) {
  .topButtom {
    font-size: 10px !important;
  }
}
</style>
