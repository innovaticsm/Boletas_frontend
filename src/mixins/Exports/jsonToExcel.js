import { download } from "src/mixins/Exports/download";

export default {
    methods: {
        /** 
         * Exportar Datos Json a Excel o CSV
         * @author José Espinoza https://github.com/jecovier/vue-json-excel
         * @param {string} sFileName Nombre del archivo a exportar
         * @param {String} sFormato formato del archivo a exportar  [html,xls,csv]
         * @param {object} oFields objeto de campos a exportar
         * @param {Array} aDataJson Datos en formato json 
         * @param {Array} aTitles objeto de titulos de columnas de los campos a exportar
         * @param {Strint} sSheet  Nombre de la hoja (en excel)
         * @param {function} fFecth Función para llenar la data (opcional)
         * @param {function} fbeforeGenerate Funcion a ejecutar antes de generar la exportación
         * @param {function} fbeforeFinish Funcion a ejecutar al terminar de generar la exportación
         */
        async ExportGenerate(sFileName, sFormato, oFields, aDataJson, aTitles, sSheet, fFecth, fbeforeGenerate, fbeforeFinish) {
            this.$root.$emit("AppBusy", true);
            if (fbeforeGenerate !== undefined && typeof fbeforeGenerate === 'function') {
                await fbeforeGenerate();
            }
            let data = aDataJson;
            if (fFecth !== undefined && typeof fFecth === 'function' || !data)
                data = await fFecth();
            if (!data || !data.length) {
                return;
            }
            if (sFileName === undefined || sFileName == "") {
                sFilename = "FileExported.xls"
            }
            if (sSheet === undefined || sSheet == "") {
                sSheet = "Sheet1"
            }
            if (aTitles === undefined || aTitles == "") {
                aTitles = oFields;
            }
            if (sFormato === undefined || sFormato == "") {
                sFormato = "xls"
            }
            let json = this.getProcessedJson(data, oFields);
            if (sFormato == "json")
                json = JSON.stringify(data, null, 2)
            switch (sFormato) {
                case "html":
                    return this.export(
                        this.jsonToXLS(json, sSheet, aTitles),
                        sFileName.replace(".xls", ".html"),
                        "text/html",
                        fbeforeFinish
                    );
                    break
                case "csv":
                    return this.export(
                        this.jsonToCSV(json),
                        sFileName.replace(".xls", ".csv"),
                        "application/csv",
                        fbeforeFinish
                    );
                    break
                case "json":
                    return this.export(
                        json,
                        sFileName.replace(".xls", ".json"),
                        "application/csv",
                        fbeforeFinish
                    );
                    break
                case "xls":
                    return this.export(
                        this.jsonToXLS(json, sSheet, aTitles),
                        sFileName,
                        "application/vnd.ms-excel",
                        fbeforeFinish
                    );
                    break
            }

        },
        /*
		Use downloadjs to generate the download link
		*/
        export: async function(data, sFileName, mime, fbeforeFinish) {
            let blob = this.base64ToBlob(data, mime);
            if (fbeforeFinish !== undefined && typeof fbeforeFinish === 'function')
                await fbeforeFinish();
            download.downloader(blob, sFileName, mime);
            this.$root.$emit("AppBusy", false);
        },
        /*
		jsonToXLS
		---------------
		Transform json data into an xml document with MS Excel format, sadly
		it shows a prompt when it opens, that is a default behavior for
		Microsoft office and cannot be avoided. It's recommended to use CSV format instead.
		*/
        jsonToXLS(data, sSheet, aTitles) {
            let xlsTemp =
                '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta name=ProgId content=Excel.Sheet> <meta name=Generator content="Microsoft Excel 11"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><style>br {mso-data-placement: same-cell;}</style></head><body><table>${table}</table></body></html>';
            let xlsData = "<thead>";
            const colspan = Object.keys(data[0]).length;
            let _self = this;
            //Header
            if (aTitles != null) {
                xlsData += this.parseExtraData(
                    aTitles,
                    '<tr><th colspan="' + colspan + '">${data}</th></tr>'
                );
            }
            //Fields
            xlsData += "<tr>";
            for (let key in data[0]) {
                xlsData += "<th>" + key + "</th>";
            }
            xlsData += "</tr>";
            xlsData += "</thead>";
            //Data
            xlsData += "<tbody>";
            data.map(function(item, index) {
                xlsData += "<tr>";
                for (let key in item) {
                    xlsData += "<td>" + _self.valueReformattedForMultilines(item[key]) + "</td>";
                }
                xlsData += "</tr>";
            });
            xlsData += "</tbody>";
            return xlsTemp.replace("${table}", xlsData).replace("${worksheet}", sSheet);
        },
        /*
		jsonToCSV
		---------------
		Transform json data into an CSV file.
		*/
        jsonToCSV(data) {
            var csvData = [];

            //Fields
            for (let key in data[0]) {
                csvData.push(key);
                csvData.push(",");
            }
            csvData.pop();
            csvData.push("\r\n");
            //Data
            data.map(function(item) {
                for (let key in item) {
                    let toCSV = ""
                    if (isNaN(item[key])) {
                        let d = new Date(item[key]);
                        if (d == "Invalid Date")
                            toCSV = '\"' + item[key] + '\"';
                        else
                            toCSV = item[key]
                    } else {
                        toCSV = item[key]
                    }
                    csvData.push(toCSV);
                    csvData.push(",");
                }
                csvData.pop();
                csvData.push("\r\n");
            });
            return csvData.join("");
        },
        /*
		getProcessedJson
		---------------
		Get only the data to export, if no fields are set return all the data
		*/
        getProcessedJson(data, header) {
            let keys = this.getKeys(data, header);
            let newData = [];
            let _self = this;
            data.map(function(item, index) {
                let newItem = {};
                for (let label in keys) {
                    let property = keys[label];
                    newItem[label] = _self.getValue(property, item);
                }
                newData.push(newItem);
            });
            return newData;
        },
        getKeys(data, header) {
            if (header) {
                return header;
            }
            let keys = {};
            for (let key in data[0]) {
                keys[key] = key;
            }
            return keys;
        },
        /*
		parseExtraData
		---------------
		Parse title and footer attribute to the csv format
		*/
        parseExtraData(extraData, format) {
            let parseData = "";
            if (Array.isArray(extraData)) {
                for (var i = 0; i < extraData.length; i++) {
                    parseData += format.replace("${data}", extraData[i]);
                }
            } else {
                parseData += format.replace("${data}", extraData);
            }
            return parseData;
        },
        getValue(key, item) {
            const field = typeof key !== "object" ? key : key.field;
            let indexes = typeof field !== "string" ? [] : field.split(".");
            let value = this.defaultValue;

            if (!field)
                value = item;
            else if (indexes.length > 1)
                value = this.getValueFromNestedItem(item, indexes);
            else
                value = this.parseValue(item[field]);

            if (key.hasOwnProperty('callback'))
                value = this.getValueFromCallback(value, key.callback);

            if (value === undefined) value = ""
            return value;
        },
        /*
        convert values with newline \n characters into <br/>
        */
        valueReformattedForMultilines(value) {
            if (typeof(value) == "string") return (value.replace(/\n/ig, "<br/>"));
            else return (value);
        },
        getValueFromNestedItem(item, indexes) {
            let nestedItem = item;
            for (let index of indexes) {
                if (nestedItem)
                    nestedItem = nestedItem[index];
            }
            return this.parseValue(nestedItem);
        },
        getValueFromCallback(item, callback) {
            if (typeof callback !== "function")
                return this.defaultValue
            const value = callback(item);
            return this.parseValue(value);
        },
        parseValue(value) {
            return value || value === 0 || typeof value === 'boolean' ?
                value :
                this.defaultValue;
        },
        base64ToBlob(data, mime) {
            let base64 = window.btoa(window.unescape(encodeURIComponent(data)));
            let bstr = atob(base64);
            let n = bstr.length;
            let u8arr = new Uint8ClampedArray(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        }
    } // end methods
};