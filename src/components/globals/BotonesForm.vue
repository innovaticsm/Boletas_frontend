<template>
  <q-card-actions align="right">
    <q-btn
      label="Descartar"
      no-caps
      color="grey-1 text-black"
      :disabled="canceldisabled"
      icon-right="undo"
      style="width: 170px"
      @click="frmcancel()"
      class="q-mb-sm"
    />
    <q-btn
      v-if="lGrabarOtro"
      label="Grabar y continuar"
      no-caps
      color="teal"
      :disabled="canceldisabled"
      icon-right="check_circle_outline"
      style="width: 170px"
      @click="saveRecord(true)"
      class="q-mb-sm"
    />

    <q-btn
      label="Grabar y cerrar"
      no-caps
      color="primary"
      type="submit"
      :loading="frmLoading"
      icon-right="done"
      style="width: 170px"
      @click="saveRecord(false)"
      class="q-mb-sm"
    >
      <template v-slot:loading>
        <q-spinner-hourglass class="on-left" />Grabando...
      </template>
    </q-btn>

    <q-ajax-bar ref="backendBar" position="bottom" color="accent" size="5px" skip-hijack></q-ajax-bar>
  </q-card-actions>
</template>
<script>
import Helpers from "src/mixins/helpers";
export default {
  mixins: [Helpers],
  props: {
    canceldisabled: Boolean,
    lGrabarOtro: Boolean,
    frmLoading: Boolean,
    saveRecord: Function,
    _this: Object,
  },
  methods: {
    frmcancel() {
      this.cancel(this._this);
    }
  }
};
</script>
