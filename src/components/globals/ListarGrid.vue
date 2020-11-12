<template>
  <q-table
    title
    no-data-label="Sin datos para visualizar"
    table-class="text-black bg-white"
    table-header-class="bg-blue-3 text-black"
    virtual-scroll
    :visible-columns="visibleColumns"
    :selection="multiDelete ? 'multiple':'none'"
    :selected.sync="selected"
    :selected-rows-label="frmgetSelectedString"
    :hide-selected-banner=false
    :rows-per-page-options="[10, 20,50, 100, 'Todos']"
    :data="data"
    :columns="columns"
    :pagination.sync="pagination"
    :loading="loading"
    :filter="filter"
    :pagination-label="frmgetPageLabel"
    rows-per-page-label="Registros por página"
    row-key="Id"
    @request="frmgetDataFromApi"
    @row-dblclick="frmDobleCkick"
    binary-state-sort
    class="tableToFormater"
  >
    <template v-slot:top-left>
      <q-input v-show="canFilter"
        borderless
        outlined
        dense
        debounce="300"
        v-model="filter"
        placeholder="Filtrar"
        style="width: 300px"
        class="float-left"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-toggle v-show="canExport" v-model="exportar" label="Exportar datos a:" color="blue" class="float-left q-mr-lg" keep-color icon="filter_none" size="lg" />
      <q-option-group
        v-show="exportar"
        v-model="exportTo"
        :options="Exportoptions"
        color="positive"
        inline
        class="float-left"
      />
        <q-btn
        v-show="exportar"
        color="indigo-10"
        no-caps
        round
        icon="save_alt"
        size="sm"
        @click="fExport(exportTo)"
        class="q-ml-xl"
      />
    </template>
    
    <template v-slot:body-cell-Acciones="props">
      <q-td :props="props">
        <div>
          <q-btn v-show="canEdit"
            color="green-8"
            outline
            round
            icon="edit"
            size="sm"
            @click="fedit( props)"
          >
          <q-tooltip content-class="bg-dark">Editar el registro</q-tooltip>
          </q-btn>
          <q-btn v-show="canDelete"
            color="negative"
            outline
            round
            icon="delete"
            size="sm"
            @click="frmdeleteItemCheck( props)"
          >
          <q-tooltip content-class="bg-dark">Borrar el registro</q-tooltip>
          </q-btn>
        </div>
      </q-td>
    </template>
   
  </q-table>
</template>
<script>
import Helpers from "src/mixins/helpers";
export default {
  mixins: [Helpers],
  props: {
    fExport: Function,
    fedit: Function,
    visibleColumns: Array,
    data: Array,
    columns: Array,
    myApiModule: String,
    dataFromServer: { 
      type: Boolean,
      default: true
    },
    canEdit: {
      type: Boolean,
      default: true
    },
    canDelete: {
      type: Boolean,
      default: true
    },
    canMultiDelete: {
      type: Boolean,
      default: true
    },
    canFilter: {
      type:Boolean,
      default: true
    },
    canExport: {
      type:Boolean,
      default: true
    },
    _this: Object,
  },
  data(){
    return {
      selected: [],
      multiDelete: false,
      loading: false,
      filter: "",
       pagination: {
        sortBy: "",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      exportar: false,
      exportTo: 'xls',
      Exportoptions: [
        {
          label: 'Excel',
          value: 'xls'
        },
        {
          label: '.CSV',
          value: 'csv'
        },
        {
          label: '.json',
          value: 'json'
        },
      ],
    }
  },
  created() {
    if( this.dataFromServer) {
      this.getDataFromApi({ pagination: this.pagination, filter: "" },this)
    }
  },
  methods: {
    frmgetSelectedString() {
      return this.selected.length === 0 ?
        "" :
        `${this.selected.length} Registro${
          this.selected.length > 1 ? "s" : ""
        } seleccionado${this.selected.length > 1 ? "s" : ""} de ${
          this.data.length
        }`;
    },
    frmgetDataFromApi(requestProp) {
      if( this.dataFromServer) {
        this.getDataFromApi( requestProp,this);
      }
    },
    frmgetPageLabel(firstRowIndex, endRowIndex, totalRowsNumber) {
      // return  this.getPageLabel(firstRowIndex, endRowIndex, totalRowsNumber) ;
      let inicia = Number.isNaN(firstRowIndex) ? "" : firstRowIndex;
      let final = Number.isNaN(endRowIndex) ? "" : endRowIndex;
      let Paginas =
          inicia == "" && final == "" ?
          "Visualizando los " + totalRowsNumber + " registros" :
          "" + inicia + " - " + final + " de " + totalRowsNumber;

      return Paginas;
    },
    frmbloqDeleteCheck() {
      this._this.selected= this.selected
      this._this.pagination=this.pagination
      this.bloqDeleteCheck(this._this);
    },
    frmdeleteItemCheck(props) {
      this._this.selected= this.selected
      this._this.pagination=this.pagination
      this.deleteItemCheck(props, this._this);
    },
    frmDobleCkick(evt, row){
      let nPos=this.myApiModule.lastIndexOf('/')
      row.emitModule=  this.myApiModule.substring(nPos+1)
      this.$root.$emit("ItemSelected", row);
    },
  }
 };
</script>
