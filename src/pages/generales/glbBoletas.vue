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
        <div class="row q-mb-md justify-between">
            <div class="col-12">
              <div class="row items-center">
                <div class="col-12">
                  <q-select
                    v-model="form.boletaEvento"
                    ref="boletaEvento"
                    :options="form.boletacmbEventos"
                    :rules="[(v)=> !!v || 'Por favor seleccione un evento' ]"
                    clearable
                    label="Eventos disponibles:"
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    outlined
                    color="blue"
                    label-color="blue"
                    :loading="loading"
                    :hint="`${form.boletaEvento ? '' : 'Por favor seleccione el evento'}`"
                    autofocus
                    @input="buscarZonas"
                  />
                </div>
                
              </div>
            </div>
        </div>
        <div class="row q-mb-md justify-between">
            <div class="col-12">
              <div class="row items-center">
                <div class="col-12">
                  <q-select
                    v-model="form.boletaZona"
                    :options="form.boletacmbZonas"
                    :rules="[(v)=> !!v || 'Por favor seleccione una zona' ]"
                    clearable
                    label="Zonas disponibles:"
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    outlined
                    color="blue"
                    label-color="blue"
                    :loading="loading"
                    :hint="`${form.boletaZona ? '' : 'Por favor seleccione una zona'}`"
                    :disabled="form.enabledZona"
                    @input="buscarBoletas"
                  />
                </div>
                
              </div>
            </div>
        </div>
        <div class="row q-mb-md justify-between">
            <div class="col-12">
              <div class="row items-center">
                <div class="col-12">
                  <q-select
                    v-model="form.boletaTikects"
                    :options="form.boletacmbTikects"
                    :rules="[(v)=> !!v || 'Por favor seleccione una boleta' ]"
                    clearable
                    label="Boletas disponibles:"
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    outlined
                    color="blue"
                    label-color="blue"
                    :loading="loading"
                    :hint="`${form.boletaTikects ? '' : 'Por favor seleccione una boleta'}`"
                    :disabled="form.enabledTikects"
                    @input="canSave"
                  />
                </div>
                
              </div>
            </div>
        </div>
        <div class="row q-mb-md justify-between">
            <div class="col-12">
              <div class="row items-center">
                <div class="col-12">
                  <q-select
                    v-model="form.boletaComprador"
                    :options="form.boletacmbCompradores"
                    :rules="[(v)=> !!v || 'Por favor seleccione un comprador' ]"
                    clearable
                    label="Compradores:"
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    outlined
                    color="blue"
                    label-color="blue"
                    :loading="loading"
                    :hint="`${form.boletaComprador ? '' : 'Por favor seleccione un comprador'}`"
                    :disabled="form.enabledComprador"
                    @filter="filterCompradores"
                    use-input
                    hide-selected
                    fill-input
                    input-debounce="0"
                    @input="canSave"
                  />
                </div>
                
              </div>
            </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="Descartar"
          no-caps
          color="grey-1 text-black"
          icon-right="undo"
          style="width: 170px"
          @click="frmcancel()"
          class="q-mb-sm"
        />
        <q-btn
          label="Grabar"
          no-caps
          color="teal"
          :disabled="form.bntComprar"
          icon-right="check_circle_outline"
          style="width: 170px"
          @click="saveRecord()"
          class="q-mb-sm"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>
<script>
import Helpers from "src/mixins/helpers";
import { myServices } from "src/services/myServices";
import { Loading } from "quasar";
export default {
 
  name: "glbBoletas",
  mixins: [Helpers],
  data() {
    return {
      myApiModule: "api/v1/tickets",
      frmName:"Boletas",
      btnIncluir:  true,
      loading: false,
      form: {
        boletaEvento: null,
        boletacmbEventos: [],
        boletaZonas: '',
        boletacmbZonas:[],
        enabledZona: true,
        boletaTikects: null,
        boletacmbTikects:[],
        enabledTikects: true,
        boletaComprador: null,
        boletacmbCompradores:[],
        boletacmbCompradoresDB:[],
        enabledComprador: true,
        bntComprar: true,
      }
    };
  },
  created() {
    this.LoadCombox(this, "all");
  },
  
  methods: {
    frmcancel() {
      this.clearData(true, true, true)
      this.$refs.boletaEvento.focus()
    },
    frmincluir() {
      this.incluir(this);
    },
    canSave() {
      if( this.form.boletaEvento !== null && this.form.boletaZona!==null 
          && this.form.boletaTikects!==null && this.form.boletaComprador!==null
        ) {
          this.form.bntComprar=false
        }
    },
    saveRecord() {
      // grabar
      let Parameters = {
        json: JSON.stringify({
          idcomprador:this.form.boletaComprador.value,
          idboleta : this.form.boletaTikects.value
        })
      };

      this.glbSaveRecord1(Parameters, this, false);
    },
   
    resetFields() {
     this.frmcancel()
    },
    
    LoadComboxFrm(request, combos) {
      if (combos == "all" || combos == "eventos") {
        this.form.boletacmbEventos = request.data.data.events;
      }
      if (combos == "all" || combos == "compradores") {
        this.form.boletacmbCompradores = request.data.data.compradores;
        this.form.boletacmbCompradoresDB = request.data.data.compradores;
      }
    },
    clearData(lClearEvent, lClearZone, lClearTicket) {
      if( lClearZone) {
        this.form.enabledZona=true
        this.form.boletaZona=null
        this.form.boletacmbZonas=[]
      }
      if( lClearTicket) {
        this.form.boletaTikects=null
        this.form.boletacmbTikects=[]
        this.form.enabledTikects=true
      }
      this.form.boletaComprador=null
      this.form.bntComprar=true
      if( lClearEvent) {
        this.form.boletaEvento=null
      }
    },
    buscarZonas(val) {
      // buscar zonas
      this.clearData(false, true, true)
    
      if( val.NombreZona1 !== "") {
        this.form.boletacmbZonas.push({value:1, label: val.NombreZona1})
      }
      if( val.NombreZona2 !== "") {
        this.form.boletacmbZonas.push({value:2, label: val.NombreZona2})
      }
      if( val.NombreZona3 !== "") {
        this.form.boletacmbZonas.push({value:3, label: val.NombreZona3})
      }
      if( val.NombreZona4 !== "") {
        this.form.boletacmbZonas.push({value:1, label: val.NombreZona4})
      }
      this.form.enabledZona=false;
    },
    buscarBoletas(val) {
      this.clearData(false,false,true)
      let param= { json: JSON.stringify({ event:  this.form.boletaEvento.value, zone: val.value })};
      myServices.GetPutData(this.myApiModule + "/getTickets",  param)
      .then(request => {
          this.form.boletacmbTikects=request.data.data.records
          this.form.enabledZona=false
      })
      .catch(error => {
          this.$q.notify({
              message: "No se obtuvo información de boletas disponibles ",
              color: "red",
              position: "bottom-right",
              icon: "error",
              textColor: "white",
              html: true,
              timeout: 4000
          });
      }).finally(()=>{
        Loading.hide();
        this.loading = false;
      });
    },
    filterCompradores (val, update, abort) {
      if( val.length>2) {
      update(() => {
        let needle = val.toLowerCase()
        this.form.boletacmbCompradores = this.form.boletacmbCompradoresDB.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
      }
    },
    
  },
  
};
</script>
