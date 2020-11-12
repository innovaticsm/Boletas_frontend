import { myServices } from "src/services/myServices"
import { Loading } from "quasar"

export default {
    created: function() {},
    methods: {
        getDataFromApi(props, _this) {
            _this.loading = true
            this.$root.$emit("AppBusy", true)
            return new Promise((resolve, reject) => {
                const { page, rowsPerPage, sortBy, descending } = props.pagination
                const filter = props.filter

                let Parameters = {
                    sortBy: sortBy,
                    descending: descending,
                    page: page,
                    rowsPage: rowsPerPage,
                    filter: filter,
                    columns: _this.columns
                }
                myServices.Listar(_this.myApiModule, Parameters)
                    .then(request => {
                        _this.pagination.rowsNumber = request.data.data.Total
                        _this.pagination.page = props.pagination.page
                        _this.pagination.rowsPerPage = props.pagination.rowsPerPage
                        _this.pagination.sortBy = props.pagination.sortBy
                        _this.pagination.descending = props.pagination.descending
                        let returnedData = request.data.data.records
                        _this.data.splice(0, _this.data.length, ...returnedData)
                    })
                    .catch(request => {

                        this.$q.notify({
                            message: "No se obtuvo información, Error en la consulta de la BD o fallo la conexión de internet",
                            // caption: _this.$store.get("Usuario").nombre,
                            color: "red",
                            position: "bottom-right",
                            icon: "error",
                            textColor: "white",
                            html: true,
                            timeout: 4000
                        })
                    })
                    .finally(() => {
                        _this.loading = false
                        Loading.hide()
                        this.$root.$emit("AppBusy", false)
                    })
            })
        },
        cancel(_this) {
            _this.resetFields()
            _this.mytabs[0].disabled = false
            _this.mytabs[1].disabled = true
            _this.mytab = "Listar"
            _this.btnIncluir = true
            this.$q.notify({
                message: "La acción de: " +
                    _this.accionincluir.toLowerCase() +
                    ", ha sido cancelada por el usuario",
                // caption: _this.$store.get("Usuario").nombre,
                color: "orange-10",
                position: "bottom-right",
                icon: "info",
                textColor: "white",
                html: true,
                timeout: 3000
            })
            if (_this.forceLoadList) {
                _this.forceLoadList = false
                this.getDataFromApi({
                    pagination: _this.pagination,
                    filter: _this.filter
                }, _this)
            }
        },
        incluir(_this) {
            _this.mytabs[0].disabled = true
            _this.mytabs[1].disabled = false
            _this.canceldisabled = false
            _this.cansavedisabled = true
            _this.mytab = "Registro"
            _this.accionincluir = "Crear registro"
            _this.lGrabarOtro = true
            _this.form.RecordId = 0
            _this.datarecording = false
            _this.btnIncluir = false
        },
        LoadCombox(_this, itemcombo) {
            let params = {
                json: JSON.stringify({
                    combos: itemcombo
                })
            }
            this.$root.$emit("AppBusy", true)
            myServices.GetPutData(_this.myApiModule + "/getCombox", params)
                .then(request => {
                    _this.lCombosLoad = true
                    _this.LoadComboxFrm(request, itemcombo)
                })
                .catch(error => {
                    this.$q.notify({
                        message: "No se obtuvo información de las Listas (combos)",
                        // caption: _this.$store.get("Usuario").nombre,
                        color: "red",
                        position: "bottom-right",
                        icon: "error",
                        textColor: "white",
                        html: true,
                        timeout: 4000
                    })
                }).finally(() => {
                    Loading.hide()
                    _this.loading = false
                    this.$root.$emit("AppBusy", false)
                })

        },
        glbEditItem(_this) {
            _this.lGrabarOtro = false
            _this.accionincluir = "Editar registro"
            _this.mytabs[0].disabled = true
            _this.mytabs[1].disabled = false
            _this.mytab = "Registro"
            _this.canceldisabled = false
            _this.cansavedisabled = false
            _this.btnIncluir = false
        },
        glbNoSave() {
            this.$q.notify({
                message: "Por favor complete los datos",
                // caption: this.$store.get("Usuario").nombre,
                color: "orange-10",
                position: "bottom-right",
                icon: "error",
                textColor: "white",
                html: true,
                timeout: 3000
            })
        },
        RetrieveRecord(_this) {
            this.$root.$emit("AppBusy", true)
            myServices.LeerRegistro(_this.myApiModule, _this.form.RecordId)
                .then(request => _this.editFillField(request.data.data.record))
                .catch(error => this.RetrieveRecordFail())
                .finally(() => {
                    _this.loading = false
                    Loading.hide()
                    this.$root.$emit("AppBusy", false)
                })
        },
        RetrieveRecordFail() {
            this.$q.notify({
                message: "No se recuperó el registro",
                // caption: this.$store.get("Usuario").nombre,
                color: "negative",
                position: "bottom-right",
                icon: "warning",
                textColor: "white",
                html: true,
                timeout: 4000
            })
        },
        glbSaveRecord1(Parameters, _this, lPermanecer) {
            _this.datarecording = true
            _this.cansavedisabled = true
            _this.canceldisabled = true
            _this.lPermanecer = lPermanecer
            this.$root.$emit("AppBusy", true)

            if (_this.form.RecordId == 0) {
                myServices.Guardar(_this.myApiModule, Parameters)
                    .then(response => this.saveOk1(response, _this))
                    .catch(error => this.saveFail1(error, _this))
                    .finally(() => {
                        _this.loading = false
                        Loading.hide()
                        this.$root.$emit("AppBusy", false)
                    })
            } else {
                myServices.Actualizar(_this.myApiModule, Parameters, _this.form.RecordId)
                    .then(response => this.saveOk1(response, _this))
                    .catch(error => this.saveFail1(error, _this))
                    .finally(() => {
                        _this.loading = false
                        Loading.hide()
                        this.$root.$emit("AppBusy", false)
                    })
            }
        },
        saveOk1(response, _this) {
            try {
                _this.resetFields()
            } catch {}
            this.$q.notify({
                message: "Datos grabados satisfactoriamente",
                // caption: this.$store.get("Usuario").nombre,
                color: "orange-10",
                position: "bottom-right",
                icon: "info",
                textColor: "white",
                html: true,
                timeout: 3000
            })

            if (!_this.lPermanecer) {
                setTimeout(() => {
                    _this.mytabs[0].disabled = false
                    _this.mytabs[1].disabled = true
                    _this.mytab = "Listar"
                    _this.datarecording = false
                    _this.btnIncluir = true
                    this.$root.$emit("ComboNeedUpdate", _this.$options.name)

                }, 100)
            } else {
                setTimeout(() => {
                    _this.datarecording = false
                    _this.canceldisabled = false
                    _this.forceLoadList = true
                }, 100)
            }
        },
        saveFail1(error, _this) {

            let sMensaje = ''
            if (error.response.data.errors) {
                let lsEr = error.response.data.errors
                let Oer = Object.keys(lsEr)
                let aMes = []
                Oer.map(key => {
                    aMes.push(lsEr[key][0])
                })
                sMensaje = aMes.join('<br>') + '<br><br>'
            }

            this.$q.notify({
                message: "Hubo un error para grabar datos<br><br>" + sMensaje,
                // caption: this.$store.get("Usuario").nombre,
                color: "red",
                position: "bottom-right",
                icon: "error",
                textColor: "white",
                html: true,
                timeout: 3000
            })
        },

        deleteItemCheck(item, _this) {
            const dialog = this.$q.dialog({
                    title: "Alerta<em>!</em>",
                    message: "No podrás recuperar este registro" +
                        "<br><br>¿ Desea borrar el registro ?",
                    html: true,
                    ok: {
                        color: "negative",
                        label: "Borrar"
                    },
                    cancel: {
                        color: "grey-1 text-black",
                        label: "Cancelar"
                    },
                    persistent: false
                })
                .onOk(() => {
                    this.deleteItem(item, _this)
                })
                .onCancel(() => {})
                .onDismiss(() => {
                    clearTimeout(timer)
                })
            const timer = setTimeout(() => {
                dialog.hide()
            }, 20000)
        },
        deleteItem(item, _this) {
            _this.loading = true
            this.$root.$emit("AppBusy", true)
            if (_this.form.RecordId == 0) {
                myServices.Borrar(_this.myApiModule, _this.deleteItemJson(item), item.row.Id)
                    .then(request => this.deleteOk(request, _this, false))
                    .catch(error => this.deleteFail(error, _this, false))
                    .finally(() => {
                        _this.loading = false
                        Loading.hide()
                        this.$root.$emit("AppBusy", false)
                    })
            }
        },
        deleteOk(response, _this, lBloque) {
            this.getDataFromApi({
                pagination: _this.pagination,
                filter: "" //_this.filter
            }, _this)
            if (lBloque) {
                _this.selected = []
            }
            this.$q.notify({
                message: "Registro(s) eliminado(s) satisfactoriamente",
                // caption: this.$store.get("Usuario").nombre,
                color: "positive",
                position: "bottom-right",
                icon: "info",
                textColor: "white",
                html: true,
                timeout: 5000
            })
            this.$root.$emit("ComboNeedUpdate", _this.$options.name)

        },
        deleteFail(error, _this, lBloque) {
            if (lBloque) {
                _this.multiDelete = true
            }
            this.$q.notify({
                message: "No se eliminó registro alguno",
                // caption: this.$store.get("Usuario").nombre,
                color: "negative",
                position: "bottom-right",
                icon: "warning",
                textColor: "white",
                html: true,
                timeout: 4000
            })
        },

    },
}