<template>
  <div>
    <q-card flat bordered class="my-card bg-grey-1">
      <q-card-section class="bg-teal-7 text-white" style="padding: 4px;">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6">{{frmName}}</div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-tabs
          v-model="mytab"
          dense
          class="bg-blue-2 text-grey-9"
          active-color="black"
          indicator-color="primary"
          align="left"
          narrow-indicator
          no-caps
        >
          <q-tab
            v-for="mitab in mytabs"
            :key="'dyn-ftab-' + mitab.index"
            :label="mitab.name"
            :name="mitab.name"
            :disable="mitab.disabled"
          />
        </q-tabs>
        <q-btn
          v-show="btnIncluir"
          class="float-right"
          rounded
          dense
          icon="add"
          color="green-6"
          size="md"
          @click="frmincluir()"
          style="margin-top: -34px;"
        />
        <q-separator />

        <q-tab-panels v-model="mytab" animated transition-prev="jump-up" transition-next="jump-up">
          <q-tab-panel name="Listar">
           <formListar :visibleColumns=visibleColumns :data=data :columns=columns :fExport=frmExport :myApiModule=myApiModule 
            :fedit=editItem :_this=this />
          </q-tab-panel>
          <q-tab-panel name="Registro">
                <q-card color="#20A8D8">
                  <form @submit.prevent>
                    <q-card-section>
                      <div class="row q-mb-md justify-between">
                        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 q-mb-sm q-pr-xs">
                          <div class="row items-center">
                            <div class="col-12">
                              <q-select
                                v-model="form.TipoIdentificacion"
                                ref="compradorTipoIdentificacion"
                                :options="form.cmbTipoIdentificacion"
                                :rules="[(v)=> !!v || 'Por favor seleccione el tipo de documento' ]"
                                clearable
                                label="Tipo de Identificacion:"
                                transition-show="flip-up"
                                transition-hide="flip-down"
                                outlined
                                color="blue"
                                label-color="blue"
                                :loading="loading"
                                :hint="`${form.TipoIdentificacion ? '' : 'Por favor seleccione el tipo de documento'}`"
                                autofocus
                              />
                            </div>
                           
                          </div>
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 q-mb-sm q-pl-xs">
                          <q-input
                            v-model="form.Identificacion"
                            ref="compradorIdentificacion"
                            :rules="[() => !!form.Identificacion || 'La identificación es requerida',
                                        () => !!form.Identificacion && form.Identificacion.length > 4 || 'Deber ser mayor a 4 caracteres' ]"
                            lazy-rules
                            input-style="min-width: 200px"
                            outlined
                            class="col"
                            label="Identificación del comprador:"
                            placeholder="Ingresa la identificación del comprador"
                            maxlength="20"
                            counter
                            standout
                            required
                            autocomplete="off"
                          >
                            <template v-slot:append>
                              <q-icon
                                v-if="form.Identificacion"
                                @click="form.Identificacion=''"
                                name="close"
                                class="cursor-pointer"
                              />
                            </template>
                          </q-input>
                        </div>
                      </div>
                      <div class="row q-mb-md">
                        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 q-mb-sm q-pr-xs">
                          <q-input
                            v-model="form.Nombres"
                            ref="compradorNombres"
                            :rules="[() => !!form.Nombres || 'El nombre es requerido',
                                    () => !!form.Nombres && form.Nombres.length > 3 || 'Deber ser mayor a 3 caracteres' ]"
                            lazy-rules
                            outlined
                            class="col text-uppercase"
                            label="Nombre del comprador:"
                            placeholder="Ingresa los nombres del comprador"
                            maxlength="50"
                            counter
                            standout
                            required
                            autocomplete="off"
                          >
                            <template v-slot:append>
                              <q-icon
                                v-if="form.Nombres"
                                @click="form.Nombres=''"
                                name="close"
                                class="cursor-pointer"
                              />
                            </template>
                          </q-input>
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 q-mb-sm q-pl-xs">
                          <q-input
                            v-model="form.Apellidos"
                            ref="compradorApellidos"
                            :rules="[() => !!form.Apellidos || 'Apellidos es requerido',
                                    () => !!form.Apellidos && form.Nombres.length > 3 || 'Deber ser mayor a 3 caracteres' ]"
                            lazy-rules
                            outlined
                            class="col text-uppercase"
                            label="Apellidos del comprador:"
                            placeholder="Ingresa los apellidos del comprador"
                            maxlength="50"
                            counter
                            standout
                            required
                            autocomplete="off"
                          >
                            <template v-slot:append>
                              <q-icon
                                v-if="form.Apellidos"
                                @click="form.Apellidos=''"
                                name="close"
                                class="cursor-pointer"
                              />
                            </template>
                          </q-input>
                        </div>
                      </div>
                      <div class="row q-mb-md">
                        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 q-mb-sm q-pl-xs">
                            <q-input
                            v-model="form.Telefonos"
                            ref="compradorTelefonos"
                            :rules="[() => !!form.Telefonos || 'El teléfono es requerido',
                                    () => !!form.Telefonos && form.Telefonos.length > 5 || 'Deber ser mayor a 5 caracteres' ]"
                            lazy-rules
                            outlined
                            label="Teléfono:"
                            placeholder="Ingresa el número de teléfono del comprador"
                            maxlength="50"
                            counter
                            standout
                            required
                            autocomplete="off"
                          >
                            <template v-slot:append>
                              <q-icon
                                v-if="form.Telefonos"
                                @click="form.Telefonos=''"
                                name="close"
                                class="cursor-pointer"
                              />
                            </template>
                          </q-input>
                        </div>
                         <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 q-mb-sm q-pl-xs">
                            <q-input
                            v-model="form.Email"
                            ref="compradorEmail"
                            :rules="[ myRuleEmail ]"
                            lazy-rules
                            outlined
                            class="col"
                            label="Correo electrónico:"
                            placeholder="Ingresa el correo electrónico del comprador"
                            maxlength="100"
                            counter
                            standout
                            autocomplete="email"
                            type="email"
                          >
                            <template v-slot:append>
                              <q-icon
                                v-if="form.Email"
                                @click="form.Email=''"
                                name="close"
                                class="cursor-pointer"
                              />
                            </template>
                          </q-input>
                          </div>
                      </div>
                      <div class="row q-mb-md">
                        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 q-mb-sm q-pl-xs">
                            <q-select
                              v-model="form.Estado"
                              ref="compradorEstado"
                              :options="form.compradorcmbEstado"
                              :rules="[(v)=> !!v || 'Por favor seleccione el estado' ]"
                              clearable
                              label="Estado:"
                              transition-show="flip-up"
                              transition-hide="flip-down"
                              outlined
                              color="blue"
                              label-color="blue"
                              :loading="loading"
                            />     
                          </div>
                      </div>
                    </q-card-section>
                     <formBotones :canceldisabled=canceldisabled :frmLoading=frmLoading :lGrabarOtro=lGrabarOtro :saveRecord=saveRecord :_this=this />
                  </form>
                </q-card>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import Helpers from "src/mixins/helpers";
import {checkemail, checkRule} from "src/mixins/validators";
import { myServices } from "src/services/myServices";
import { Loading } from "quasar";
import exportlib  from "src/mixins/Exports/jsonToExcel";
import formListar from "src/components/globals/ListarGrid.vue";
import formBotones from "src/components/globals/BotonesForm.vue";
export default {
  components: {
    formListar,
    formBotones
  },
  name: "glbTerceros",
  mixins: [Helpers, exportlib],
  data() {
    return {
      myApiModule: "api/v1/persons",
      frmName:"Compradores",
      btnIncluir:  true,
      mytab: "Listar",
      mytabs: [
        { index: 1, name: "Listar", disabled: false },
        { index: 2, name: "Registro", disabled: true }
      ],
      filtermodules: "",
      loading: false,
      pagination: {},
      visibleColumns: [
        "TipoIdentificacion",
        "Identificacion",
        "Nombres",
        "Apellidos",
        "Telefonos",
        "Acciones"
      ],
      columns: [
        {
          name: "Id",
          align: "left",
          label: "Id",
          field: "Id"
        },
        {
          name: "idIdentificacion",
          align: "left",
          label: "idIdentificacion",
          field: "idIdentificacion",
          sortable: true,
        },
        {
          name: "TipoIdentificacion",
          align: "left",
          label: "Tipo Identificación",
          field: row => row.tipo_identificacion.Codigo,
          sortable: false,
          fromdual: true,
        },
        {
          name: "Identificacion",
          align: "left",
          label: "Identificación",
          field: "Identificacion",
          sortable: true,
          filter: true,
          headerClasses:'myFilter'
        },
        {
          name: "Apellidos",
          align: "left",
          label: "Apellidos",
          field: "Apellidos",
          sortable: false,
          filter:true,
          headerClasses:'myFilter'
        },
        {
          name: "Nombres",
          align: "left",
          label: "Nombres",
          field: "Nombres",
          sortable: false,
          filter:true,
          headerClasses:'myFilter'
        },
        {
          name: "Telefonos",
          align: "left",
          label: "Teléfonos",
          field: "Telefonos",
          sortable: true,
          filter:true,
          headerClasses:'myFilter'
        },
        {
          name: "Email",
          align: "left",
          label: "Email",
          field: "Email",
          sortable: true,
          filter:true,
          headerClasses:'myFilter'
        },
        {
          name: "Estado",
          align: "left",
          label: "Estado",
          field: "Estado",
          sortable: true
        },
        {
          name: "Acciones",
          align: "right",
          label: "Acciones",
          field: "acciones",
          sortable: false,
          fromdual: true
        }
      ],
      data: [],
      lPermanecer: false,
      datarecording: false,
      lGrabarOtro: false,
      canceldisabled: true,
      cansavedisabled: true,
      accionincluir: "",
      form: {
        TipoIdentificacion: null,
        cmbTipoIdentificacion: [],
        Identificacion: "",
        Nombres: "",
        Apellidos: "",
        Telefonos: "",
        Email: "",
        Estado: "",
        compradorcmbEstado: ['Activo','Inactivo'],
        RecordId: 0
      },
      frmLoading: false,
      selected: [],
      forceLoadList: false,
    };
  },
  created() {
    this.LoadCombox(this, "all");
    this.$root.$on("ComboNeedUpdate", (combo) => {
      let aCombos=['auxIdentificacion']
      if( aCombos.includes( combo) ) {
        setTimeout(() => {
          this.LoadCombox(this, combo); 
        }, 100);
      }
    });
   
  },
  methods: {
     frmcancel() {
      this.cancel(this);
    },
    frmincluir() {
      this.incluir(this);
    },
    editItem(item) {
      this.glbEditItem(this);
      this.form.RecordId = item.row.Id;
      this.form.TipoIdentificacion = this.form.cmbTipoIdentificacion.filter( opt => opt.value == item.row.idIdentificacion)[0]
      this.form.Identificacion = item.row.Identificacion
      this.form.Nombres = item.row.Nombres
      this.form.Apellidos = item.row.Apellidos
      this.form.Estado = item.row.Estado
      this.form.Telefonos = item.row.Telefonos
      this.form.Email = item.row.Email

      setTimeout(() => {
        this.$refs.compradorNombres.focus();
      }, 100);
    },
    saveRecord(lPermanecer, lForge) {
      if (!lForge) {
        this.$refs.compradorTipoIdentificacion.validate();
        this.$refs.compradorIdentificacion.validate();
        this.$refs.compradorNombres.validate();
        this.$refs.compradorApellidos.validate();
        this.$refs.compradorTelefonos.validate();
        this.$refs.compradorEstado.validate();

        if (this.$refs.compradorTipoIdentificacion.hasError || this.$refs.compradorIdentificacion.hasError 
          || this.$refs.compradorNombres.hasError || this.$refs.compradorApellidos.hasError 
          || this.$refs.compradorTelefonos.hasError  || this.$refs.compradorEstado.hasError ) {
          this.glbNoSave();
          return;
        }
      }
     
      // grabar
      let Parameters = {
        json: JSON.stringify({
          idIdentificacion:this.form.TipoIdentificacion.value,
          Identificacion : this.form.Identificacion,
          Nombres :this.form.Nombres,
          Apellidos :this.form.Apellidos,
          Telefonos : this.form.Telefonos,
          Email: this.form.Email,
          Estado : this.form.Estado
          
        })
      };

      this.glbSaveRecord1(Parameters, this, lPermanecer);
    },
    deleteItemJson(item) {
      let Json = {
        json: JSON.stringify({
          identificacion: item.row.Identificacion,
          nombres: item.row.Nombres,
        })
      };
      return Json;
    },
    resetFields() {
      this.form.RecordId =0;
      this.form.TipoIdentificacion= null
      this.form.Identificacion = ""
      this.form.Nombres = ""
      this.form.Apellidos = ""
      this.form.Telefonos = ""
      this.form.Email = ""
      this.form.Estado = ""
      this.form.RecordId = 0;
      this.$refs.compradorNombres.resetValidation();
      try {
        this.$refs.compradorTipoIdentificacion.focus();
      } catch (error) {}
    },
    toLoadCombox(combo) {
      this.LoadCombox(this,combo)
    },
    LoadComboxFrm(request, combos) {
      if (combos == "all" || combos == "auxIdentificacion") {
        this.form.cmbTipoIdentificacion = request.data.data.tiposIdentificacion;
      }
      
    },
     myRuleEmail(value) {
       return checkemail(this.form.Email)
    },
    frmExport(exportTo){
      let aFields ={ 
        "Identificacion": "Identificacion",
        "Nombres del comprador" : "Nombres",
        "Apellidos del comprador" : "Apellidos",
        "Telefonos" : "Telefonos",
        "Email": "Email",
        "Estado": "Estado"}
      let aTitulos= ['Listado de Compradores','']
      let sFileName = "DatosCompradores."
      sFileName += exportTo
      this.ExportGenerate(sFileName, this.exportTo, aFields, this.data,aTitulos)
      this.exportar=false
    },
  }
};
</script>
