import { AUTH_CONFIG } from '../config/config';
import axios from "axios"

export const apiServices = {
    GETF,
    GETR,
    GETH,
    getPaginate,
    POST,
    PUT,
    DELETE,
    headers
};

const apiUrlBase = AUTH_CONFIG.API_URL_BASE;

async function GETF(url, lBase) {
    const requestOptions = {
        method: 'get'
    };
    let apiGet = apiUrlBase
    if (!lBase) {
        apiGet = ''
    }
    return await axios(apiGet + url, requestOptions);
}
async function GETH(url) {
    const requestOptions = {
        method: 'get',
        headers: headers()
    };
    return await axios(apiUrlBase + url, requestOptions);
}
async function GETR(url, id) {
    let api_id = url;
    if (id)
        api_id = url + `/${id}`;
    const requestOptions = {
        method: 'get',
        headers: headers()
    };
    return await axios(apiUrlBase + api_id, requestOptions);
}

async function getPaginate({ api, busqueda, page }) {
    return await this.GET(api + `?busqueda=${busqueda}&page=${page}`);
}

async function POST(url, paradata, formdata) {
    if (formdata) {
        let Token = getToken()
        return await axios(apiUrlBase + url, {
            method: 'POST',
            data: paradata,
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + Token,
                'Content-Type': 'multipart/form-data',
            }
        })
    } else {
        const requestOptions = {
            method: 'POST',
            headers: headers(),
            data: paradata ? JSON.stringify(paradata) : {}
        };

        return await axios(apiUrlBase + url, requestOptions);
    }
}

async function PUT(url, data, id) {

    let api_id = url;
    if (typeof id !== "undefined" && id !== null && id !== "") {
        // if (id !== 'undefined') {
        api_id = url + `/${id}`;
    }
    const requestOptions = {
        method: 'PUT',
        headers: headers(),
        data: JSON.stringify(data)
    };

    return await axios(apiUrlBase + api_id, requestOptions).then(handleResponse);
}

async function DELETE(url, data, id) {
    let api_id = url;
    if (typeof id !== "undefined" && id !== null && id !== "") {
        // if (id !== 'undefined') {
        api_id = url + `/${id}`;
    }
    const requestOptions = {
        method: 'DELETE',
        headers: headers(),
        data: JSON.stringify(data)
    };

    return await axios(apiUrlBase + api_id, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    if (!response.status == 200) {
        return Promise.reject(response.data);
    }
    return Promise.resolve(response.data)
}

function headers() {
    let Token = getToken()
    return {
        Accept: 'application/json',
        Authorization: 'Bearer ' + Token,
        'Content-Type': 'application/json',
    }
}

function getToken() {
    return ""
}