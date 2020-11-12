import { apiServices } from 'src/services/apiservices'
import { Loading } from 'quasar'

export const myServices = {
    Listar,
    Borrar,
    Guardar,
    Actualizar,
    BorrarBloque,
    LeerRegistro,
    GetPutData,
    GetFree,
    GetHeader,
    Procesar,
};

function Listar(sApi, params) {
    Loading.show()
    return apiServices.POST(sApi + "/List", params)
}

function Guardar(sApi, params) {
    Loading.show()
    return apiServices.POST(sApi, params)
}

function Actualizar(sApi, params, id) {
    Loading.show()
    return apiServices.PUT(sApi, params, id)
}

function Borrar(sApi, params, id) {
    Loading.show()
    return apiServices.DELETE(sApi, params, id)
}

function BorrarBloque(sApi, params) {
    Loading.show()
    return apiServices.POST(sApi + "/massdestroy", params)
}

function LeerRegistro(sApi, id) {
    Loading.show()
    return apiServices.GETR(sApi, id)
}

function GetPutData(sApi, params, lLoading) {
    if (typeof lLoading !== "undefined" && lLoading !== null && lLoading !== "" && lLoading == true) {
        Loading.show()
    }
    return apiServices.POST(sApi, params)
}

function GetFree(sApi, lLoading, lBase) {
    if (typeof lLoading !== "undefined" && lLoading !== null && lLoading !== "" && lLoading == true) {
        Loading.show()
    }
    let lAddBase = true
    if (typeof lBase !== "undefined" && lBase !== null && lBase !== "") {
        lAddBase = lBase
    }

    return apiServices.GETF(sApi, lAddBase)
}

function GetHeader(sApi, lLoading) {
    if (typeof lLoading !== "undefined" && lLoading !== null && lLoading !== "" && lLoading == true) {
        Loading.show()
    }
    return apiServices.GETH(sApi);
}


function Procesar(sApi, params, formdata = false) {
    Loading.show()
    return apiServices.POST(sApi, params, formdata)
}