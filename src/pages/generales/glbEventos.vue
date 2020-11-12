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
                              <q-input
                                v-model="form.Codigo"
                                ref="eventoCodigo"
                                :rules="[() => !!form.Codigo || 'el Código es requerida',
                                            () => !!form.Codigo && form.Codigo.length > 3 || 'Deber ser mayor a 3 caracteres' ]"
                                lazy-rules
                                input-style="min-width: 200px"
                                outlined
                                class="col"
                                label="Código del evento:"
                                placeholder="Ingresa el código del evento"
                                maxlength="15"
                                counter
                                standout
                                required
                                autocomplete="off"
                              >
                                <template v-slot:append>
                                  <q-icon
                                    v-if="form.Codigo"
                                    @click="form.Codigo=''"
                                    name="close"
                                    class="cursor-pointer"
                                  />
                                </template>
                              </q-input>
                            </div>
                           
                          </div>
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 q-mb-sm q-pl-xs">
                          <q-input
                              v-model="form.FechaEvento"
                              ref="eventoFechaEvento"
                              lazy-rules
                              mask="date" 
                              placeholder="AAAA/MM/DD"
                              :rules="[ myRuleDate ]"
                              outlined
                              label="Fecha evento:"
                              maxlength="10"
                              counter
                              standout
                              required
                              autocomplete="off"
                            >
                              <template v-slot:append>
                                <q-icon name="event" class="cursor-pointer">
                                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                    <q-date v-model="form.FechaEvento" title="Fecha del evento" 
                                    :locale="myLocale"
                                    @input="() => $refs.qDateProxy.hide()" />
                                  </q-popup-proxy>
                                </q-icon>
                              </template>
                            </q-input>
                         
                        </div>
                      </div>
                      <div class="row q-mb-md">
                        <div class="col-12">
                           <q-input
                            v-model="form.Nombre"
                            ref="eventoNombre"
                            :rules="[() => !!form.Nombre || 'La identificación es requerida',
                                        () => !!form.Nombre && form.Nombre.length > 4 || 'Deber ser mayor a 4 caracteres' ]"
                            lazy-rules
                            input-style="min-width: 200px"
                            outlined
                            label="Nombre del evento:"
                            placeholder="Ingresa el nombre del evento"
                            maxlength="100"
                            counter
                            standout
                            required
                            autocomplete="off"
                          >
                            <template v-slot:append>
                              <q-icon
                                v-if="form.Nombre"
                                @click="form.Nombre=''"
                                name="close"
                                class="cursor-pointer"
                              />
                            </template>
                          </q-input>
                        </div>
                       
                      </div>
                      <div class="row q-mb-md q-gutter-x-xl">
                        <div class="col-xs-12 col-sm-5 col-md-5 col-lg-5 col-xl-5 q-mb-sm ">
                            <q-input
                            v-model="form.NombreZona1"
                            ref="eventoNombreZona1"
                            :rules="[() => !!form.NombreZona1 || 'El nombre es requerida',
                                        () => !!form.NombreZona1 && form.NombreZona1.length > 2 || 'Deber ser mayor a 2 caracteres' ]"
                            lazy-rules
                            input-style="min-width: 200px"
                            outlined
                            label="Nombre zona 1:"
                            placeholder="Ingresa el nombre de la zona"
                            maxlength="20"
                            counter
                            standout
                            required
                            autocomplete="off"
                          >
                            <template v-slot:append>
                              <q-icon
                                v-if="form.NombreZona1"
                                @click="form.NombreZona1=''"
                                name="close"
                                class="cursor-pointer"
                              />
                            </template>
                          </q-input>
                        </div>
                        <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 col-xl-3 q-mb-sm ">
                           <q-field
                                v-model="form.BoletasZona1"
                                ref="eventoBoletasZona1"
                                outlined
                                required
                                label="Boletas Zona:"
                              >
                                <template v-slot:control="{ id, value, emitValue }">
                                  <input :id="id" class="q-field__native text-right" :value="value" @change="e => emitValue(e.target.value)" v-money="quantityFormatForDirective" >
                                </template>
                                <template v-slot:append>
                                  <q-icon
                                    v-if="form.BoletasZona1"
                                    @click="form.BoletasZona1=0"
                                    name="close"
                                    class="cursor-pointer"
                                  />
                                </template>
                              </q-field>
                        </div>
                        <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 col-xl-3 q-mb-sm ">
                           <q-field
                                v-model="form.ValorZona1"
                                ref="eventoValorZona1"
                                outlined
                                required
                                prefix="$"
                                label="Precio:"
                              >
                                <template v-slot:control="{ id, value, emitValue }">
                                  <input :id="id" class="q-field__native text-right" :value="value" @change="e => emitValue(e.target.value)" v-money="moneyFormatForDirective" >
                                </template>
                                <template v-slot:append>
                                  <q-icon
                                    v-if="form.ValorZona1"
                                    @click="form.ValorZona1=0"
                                    name="close"
                                    class="cursor-pointer"
                                  />
                                </template>
                              </q-field>
                        </div>
                        
                      </div>
                      <div class="row q-mb-md q-gutter-x-xl">
                        <div class="col-xs-12 col-sm-5 col-md-5 col-lg-5 col-xl-5 q-mb-sm ">
                            <q-input
                            v-model="form.NombreZona2"
                            ref="eventoNombreZona2"
                            lazy-rules
                            input-style="min-width: 200px"
                            outlined
                            label="Nombre zona 2:"
                            placeholder="Ingresa el nombre de la zona"
                            maxlength="20"
                            counter
                            standout
                            autocomplete="off"
                          >
                            <template v-slot:append>
                              <q-icon
                                v-if="form.NombreZona2"
                                @click="form.NombreZona2=''"
                                name="close"
                                class="cursor-pointer"
                              />
                            </template>
                          </q-input>
                        </div>
                        <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 col-xl-3 q-mb-sm ">
                           <q-field
                                v-model="form.BoletasZona2"
                                ref="eventoBoletasZona2"
                                outlined
                                required
                                label="Boletas Zona:"
                              >
                                <template v-slot:control="{ id, value, emitValue }">
                                  <input :id="id" class="q-field__native text-right" :value="value" @change="e => emitValue(e.target.value)" v-money="quantityFormatForDirective" >
                                </template>
                                <template v-slot:append>
                                  <q-icon
                                    v-if="form.BoletasZona2"
                                    @click="form.BoletasZona2=0"
                                    name="close"
                                    class="cursor-pointer"
                                  />
                                </template>
                              </q-field>
                        </div>
                        <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 col-xl-3 q-mb-sm ">
                           <q-field
                                v-model="form.ValorZona2"
                                ref="eventoValorZona2"
                                outlined
                                required
                                prefix="$"
                                label="Precio:"
                              >
                                <template v-slot:control="{ id, value, emitValue }">
                                  <input :id="id" class="q-field__native text-right" :value="value" @change="e => emitValue(e.target.value)" v-money="moneyFormatForDirective" >
                                </template>
                                <template v-slot:append>
                                  <q-icon
                                    v-if="form.ValorZona2"
                                    @click="form.ValorZona2=0"
                                    name="close"
                                    class="cursor-pointer"
                                  />
                                </template>
                              </q-field>
                        </div>
                        
                      </div>
                      <div class="row q-mb-md q-gutter-x-xl">
                        <div class="col-xs-12 col-sm-5 col-md-5 col-lg-5 col-xl-5 q-mb-sm ">
                            <q-input
                            v-model="form.NombreZona3"
                            ref="eventoNombreZona3"
                            lazy-rules
                            input-style="min-width: 200px"
                            outlined
                            label="Nombre zona 3:"
                            placeholder="Ingresa el nombre de la zona"
                            maxlength="20"
                            counter
                            standout
                            autocomplete="off"
                          >
                            <template v-slot:append>
                              <q-icon
                                v-if="form.NombreZona3"
                                @click="form.NombreZona3=''"
                                name="close"
                                class="cursor-pointer"
                              />
                            </template>
                          </q-input>
                        </div>
                        <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 col-xl-3 q-mb-sm ">
                           <q-field
                                v-model="form.BoletasZona3"
                                ref="eventoBoletasZona3"
                                outlined
                                required
                                label="Boletas Zona:"
                              >
                                <template v-slot:control="{ id, value, emitValue }">
                                  <input :id="id" class="q-field__native text-right" :value="value" @change="e => emitValue(e.target.value)" v-money="quantityFormatForDirective" >
                                </template>
                                <template v-slot:append>
                                  <q-icon
                                    v-if="form.BoletasZona3"
                                    @click="form.BoletasZona3=0"
                                    name="close"
                                    class="cursor-pointer"
                                  />
                                </template>
                              </q-field>
                        </div>
                        <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 col-xl-3 q-mb-sm ">
                           <q-field
                                v-model="form.ValorZona3"
                                ref="eventoValorZona3"
                                outlined
                                required
                                prefix="$"
                                label="Precio:"
                              >
                                <template v-slot:control="{ id, value, emitValue }">
                                  <input :id="id" class="q-field__native text-right" :value="value" @change="e => emitValue(e.target.value)" v-money="moneyFormatForDirective" >
                                </template>
                                <template v-slot:append>
                                  <q-icon
                                    v-if="form.ValorZona3"
                                    @click="form.ValorZona3=0"
                                    name="close"
                                    class="cursor-pointer"
                                  />
                                </template>
                              </q-field>
                        </div>
                        
                      </div>
                      <div class="row q-mb-md q-gutter-x-xl">
                        <div class="col-xs-12 col-sm-5 col-md-5 col-lg-5 col-xl-5 q-mb-sm ">
                            <q-input
                            v-model="form.NombreZona4"
                            ref="eventoNombreZona4"
                            lazy-rules
                            input-style="min-width: 200px"
                            outlined
                            label="Nombre zona 4:"
                            placeholder="Ingresa el nombre de la zona"
                            maxlength="20"
                            counter
                            standout
                            autocomplete="off"
                          >
                            <template v-slot:append>
                              <q-icon
                                v-if="form.NombreZona4"
                                @click="form.NombreZona4=''"
                                name="close"
                                class="cursor-pointer"
                              />
                            </template>
                          </q-input>
                        </div>
                        <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 col-xl-3 q-mb-sm ">
                           <q-field
                                v-model="form.BoletasZona4"
                                ref="eventoBoletasZona4"
                                outlined
                                required
                                label="Boletas Zona:"
                              >
                                <template v-slot:control="{ id, value, emitValue }">
                                  <input :id="id" class="q-field__native text-right" :value="value" @change="e => emitValue(e.target.value)" v-money="quantityFormatForDirective" >
                                </template>
                                <template v-slot:append>
                                  <q-icon
                                    v-if="form.BoletasZona4"
                                    @click="form.BoletasZona4=0"
                                    name="close"
                                    class="cursor-pointer"
                                  />
                                </template>
                              </q-field>
                        </div>
                        <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 col-xl-3 q-mb-sm ">
                           <q-field
                                v-model="form.ValorZona4"
                                ref="eventoValorZona4"
                                outlined
                                required
                                prefix="$"
                                label="Precio:"
                              >
                                <template v-slot:control="{ id, value, emitValue }">
                                  <input :id="id" class="q-field__native text-right" :value="value" @change="e => emitValue(e.target.value)" v-money="moneyFormatForDirective" >
                                </template>
                                <template v-slot:append>
                                  <q-icon
                                    v-if="form.ValorZona4"
                                    @click="form.ValorZona4=0"
                                    name="close"
                                    class="cursor-pointer"
                                  />
                                </template>
                              </q-field>
                        </div>
                        
                      </div>
                      <div class="row q-mb-md">
                        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 q-mb-sm q-pl-xs">
                            <q-select
                              v-model="form.Estado"
                              ref="eventoEstado"
                              :options="form.eventocmbEstado"
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
import { date } from 'quasar'
import exportlib  from "src/mixins/Exports/jsonToExcel";
import formListar from "src/components/globals/ListarGrid.vue";
import formBotones from "src/components/globals/BotonesForm.vue";
export default {
  components: {
    formListar,
    formBotones
  },
  name: "glbEventos",
  mixins: [Helpers, exportlib],
  data() {
    return {
      myApiModule: "api/v1/events",
      frmName:"Eventos",
       myLocale: {
        /* starting with Sunday */
        days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
        daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
        months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
        monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
        firstDayOfWeek: 1
      },
      moneyFormatForDirective: {
        decimal: '.',
        thousands: ',',
        prefix: '',
        suffix: '',
        precision: 2,
        masked: false 
      },
      quantityFormatForDirective: {
        decimal: '.',
        thousands: ',',
        prefix: '',
        suffix: '',
        precision: 0,
        masked: false 
      },
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
        "Codigo",
        "Nombre",
        "FechaEvento",
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
          name: "Codigo",
          align: "left",
          label: "Codigo",
          field: "Codigo",
          sortable: true,
           filter: true,
          headerClasses:'myFilter'
        },
        {
          name: "Nombre",
          align: "left",
          label: "Nombre",
          field: "Nombre",
          sortable: true,
          filter: true,
          headerClasses:'myFilter'
        },
        {
          name: "FechaEvento",
          align: "left",
          label: "Fecha Evento",
          field: "FechaEvento",
          sortable: false,
        },
        {
          name: "BoletasZona1",
          align: "left",
          label: "BoletasZona1",
          field: "BoletasZona1",
          sortable: false,
          filter:false,
        },
        {
          name: "BoletasZona2",
          align: "left",
          label: "BoletasZona2",
          field: "BoletasZona2",
          sortable: false,
          filter:false,
        },
        {
          name: "BoletasZona3",
          align: "left",
          label: "BoletasZona3",
          field: "BoletasZona3",
          sortable: false,
          filter:false,
        },
        {
          name: "BoletasZona3",
          align: "left",
          label: "BoletasZona3",
          field: "BoletasZona3",
          sortable: false,
          filter:false,
        },
        {
          name: "BoletasZona4",
          align: "left",
          label: "BoletasZona4",
          field: "BoletasZona4",
          sortable: false,
          filter:false,
        },
        {
          name: "NombreZona1",
          align: "left",
          label: "NombreZona1",
          field: "NombreZona1",
          sortable: false,
          filter:false,
        },
        {
          name: "NombreZona2",
          align: "left",
          label: "NombreZona2",
          field: "NombreZona2",
          sortable: false,
          filter:false,
        },
        {
          name: "NombreZona3",
          align: "left",
          label: "NombreZona3",
          field: "NombreZona3",
          sortable: false,
          filter:false,
        },
        {
          name: "NombreZona4",
          align: "left",
          label: "NombreZona4",
          field: "NombreZona4",
          sortable: false,
          filter:false,
        },
        {
          name: "ValorZona1",
          align: "left",
          label: "ValorZona1",
          field: "ValorZona1",
          sortable: false,
          filter:false,
        },
        {
          name: "ValorZona2",
          align: "left",
          label: "ValorZona2",
          field: "ValorZona2",
          sortable: false,
          filter:false,
        },
        {
          name: "ValorZona3",
          align: "left",
          label: "ValorZona3",
          field: "ValorZona3",
          sortable: false,
          filter:false,
        },
        {
          name: "ValorZona4",
          align: "left",
          label: "ValorZona4",
          field: "ValorZona4",
          sortable: false,
          filter:false,
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
        Codigo: "",
        Nombre: "",
        FechaEvento: "",
        BoletasZona1: "0",
        BoletasZona2: "0",
        BoletasZona3: "0",
        BoletasZona4: "0",
        NombreZona1: "",
        NombreZona2: "",
        NombreZona3: "",
        NombreZona4: "",
        ValorZona1: "0",
        ValorZona2: "0",
        ValorZona3: "0",
        ValorZona4: "0",
        Estado: "",
        eventocmbEstado: ['Activo','Inactivo'],
        RecordId: 0
      },
      frmLoading: false,
      selected: [],
      forceLoadList: false,
    };
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
      this.form.Codigo = item.row.Codigo
      this.form.Nombre = item.row.Nombre
      this.form.FechaEvento = item.row.FechaEvento
      this.form.BoletasZona1 = item.row.BoletasZona1
      this.form.BoletasZona2 = item.row.BoletasZona2
      this.form.BoletasZona3 = item.row.BoletasZona3
      this.form.BoletasZona4 = item.row.BoletasZona4
      this.form.NombreZona1 = item.row.NombreZona1
      this.form.NombreZona2 = item.row.NombreZona2
      this.form.NombreZona3 = item.row.NombreZona3
      this.form.NombreZona4 = item.row.NombreZona4
      this.form.ValorZona1 = item.row.ValorZona1
      this.form.ValorZona2 = item.row.ValorZona2
      this.form.ValorZona3 = item.row.ValorZona3
      this.form.ValorZona4 = item.row.ValorZona4
      this.form.Estado = item.row.Estado
      setTimeout(() => {
        this.$refs.eventoNombre.focus();
      }, 100);
    },
    saveRecord(lPermanecer, lForge) {
      if (!lForge) {
        this.$refs.eventoCodigo.validate()
        this.$refs.eventoNombre.validate()
        this.$refs.eventoFechaEvento.validate()
        this.$refs.eventoNombreZona1.validate()
        this.$refs.eventoEstado.validate()

        if (this.$refs.eventoCodigo.hasError || this.$refs.eventoNombre.hasError 
          || this.$refs.eventoFechaEvento.hasError || this.$refs.eventoEstado.hasError 
          || this.$refs.eventoNombreZona1.hasError 
          || parseInt(this.form.BoletasZona1.replace(/,/g,''))==0  || parseInt(this.form.ValorZona1.replace(/,/g,''))==0 
          || (this.form.NombreZona2 !== ""  && (parseInt(this.form.BoletasZona2.replace(/,/g,''))==0  || parseInt(this.form.ValorZona2.replace(/,/g,''))==0)  )
          || (this.form.NombreZona3 !== ""  && (parseInt(this.form.BoletasZona3.replace(/,/g,''))==0  || parseInt(this.form.ValorZona3.replace(/,/g,''))==0)  )
          || (this.form.NombreZona4 !== ""  && (parseInt(this.form.BoletasZona4.replace(/,/g,''))==0  || parseInt(this.form.ValorZona4.replace(/,/g,''))==0)  )
        ){
          this.glbNoSave();
          return;
        }
      }
     
      // grabar
      let Parameters = {
        json: JSON.stringify({
          Codigo:this.form.Codigo,
          Nombre : this.form.Nombre,
          FechaEvento :date.formatDate(Date.parse(this.form.FechaEvento), 'YYYY-MM-DD'),
          NombreZona1 : this.form.NombreZona1,
          NombreZona2 : this.form.NombreZona2,
          NombreZona3 : this.form.NombreZona3,
          NombreZona4 : this.form.NombreZona4,
          BoletasZona1: parseInt(this.form.BoletasZona1.replace(/,/g,'')),
          BoletasZona2: ( this.form.NombreZona2=="" ? 0: parseInt(this.form.BoletasZona2.replace(/,/g,''))),
          BoletasZona3: ( this.form.NombreZona3=="" ? 0: parseInt(this.form.BoletasZona3.replace(/,/g,''))),
          BoletasZona4: ( this.form.NombreZona4=="" ? 0: parseInt(this.form.BoletasZona4.replace(/,/g,''))),
          ValorZona1: parseInt(this.form.ValorZona1.replace(/,/g,'')),
          ValorZona2: ( this.form.NombreZona2=="" ? 0: parseInt(this.form.ValorZona2.replace(/,/g,''))),
          ValorZona3: ( this.form.NombreZona3=="" ? 0: parseInt(this.form.ValorZona3.replace(/,/g,''))),
          ValorZona4: ( this.form.NombreZona4=="" ? 0: parseInt(this.form.ValorZona4.replace(/,/g,''))),
          Estado : this.form.Estado
          
        })
      };

      this.glbSaveRecord1(Parameters, this, lPermanecer);
    },
    deleteItemJson(item) {
      let Json = {
        json: JSON.stringify({
          nombres: item.row.Nombre,
          fecha: item.row.FechaEvento,
        })
      };
      return Json;
    },
    resetFields() {
      this.form.RecordId =0;
      this.form.Codigo= ""
      this.form.Nombre = ""
      this.form.BoletasZona1 = "0"
      this.form.BoletasZona2 = "0"
      this.form.BoletasZona3 = "0"
      this.form.BoletasZona4 = "0"
      this.form.NombreZona1 = ""
      this.form.NombreZona2 = ""
      this.form.NombreZona3 = ""
      this.form.NombreZona4 = ""
      this.form.ValorZona1 = "0"
      this.form.ValorZona2 = "0"
      this.form.ValorZona3 = "0"
      this.form.ValorZona4 = "0"
      this.form.Estado = ""
      this.form.RecordId = 0;
      this.$refs.eventoNombre.resetValidation();
      try {
        this.$refs.eventoCodigo.focus();
      } catch (error) {}
    },
     myRuleDate(value) {
      let d = new Date(value);
      return checkRule((d.getTime() === d.getTime() ),'Fecha errada')
    },
    frmExport(exportTo){
      let aFields ={ 
        "Código": "Codigo",
        "Nombres del evento" : "Nombre",
        "Fecha del evento" : "FechaEvento",
        "Estado": "Estado"}
      let aTitulos= ['Listado de eventos','']
      let sFileName = "DatosEventos."
      sFileName += exportTo
      this.ExportGenerate(sFileName, this.exportTo, aFields, this.data,aTitulos)
      this.exportar=false
    },
  }
};
</script>
