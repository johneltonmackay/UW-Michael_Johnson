/**
 * @NAPIVersion 2.1
 */
define(["N/ui/serverWidget", "N/search", "N/task", "N/file", "N/record", "../Library/live_mfg_data_sl_mapping.js", 'N/runtime', 'N/url', 'N/ui/message', 'N/format', 'N/currentRecord'],

    (serverWidget, search, task, file, record, slMapping, runtime, url, message, format, currentRecord) => {

        //#constants
        const FORM = {};
        const ACTIONS = {};

        //#global functions
        FORM.buildForm = (options) => {
            try {
                // log.debug('buildForm options', options)
                let strCurrentStage = options.currentStage ? options.currentStage : 'ORDER_PROCESSING'
                let sublistParam = {
                    currentStage: strCurrentStage,
                }

                let arrSearchResults = runSearch()

                if(arrSearchResults.length > 0){
                    sublistParam.searchResults = arrSearchResults
                } else {
                    sublistParam.searchResults = []
                }

                var objForm = serverWidget.createForm({
                    title: options.title,
                    hideNavBar: true
                });
                
                addButtons({
                    form: objForm,
                });

                addFields({
                    form: objForm,
                    data: arrSearchResults.length
                });

                addSublistFields({
                    form: objForm,  
                    data: sublistParam
                });

                objForm.clientScriptModulePath = slMapping.SUITELET.form.CS_PATH;

                return objForm;
            } catch (err) {
                log.error('ERROR_BUILD_FORM:', err.message)
            }
        }

        const addButtons = (options) => {
            try {
                const submitButton = options.form.addSubmitButton({
                    label: slMapping.SUITELET.form.buttons.SUBMIT.label,
                });
                submitButton.isHidden = true;

            } catch (err) {
                log.error("BUILD_FORM_ADD_BUTTONS_ERROR", err.message);
            }
        };

        const addFields = (options) => {
            try {
                let intTotalOrders = options.data;
                for (var strKey in slMapping.SUITELET.form.fields) {
                    options.form.addField(slMapping.SUITELET.form.fields[strKey]);
                    var objField = options.form.getField({
                        id: slMapping.SUITELET.form.fields[strKey].id,
                        container: 'custpage_fieldgroup'
                    });

                    if (slMapping.SUITELET.form.fields[strKey].hasdefault) {
                        objField.defaultValue = `<span style="color: red;">${intTotalOrders}</span>`
                    }

                    if (slMapping.SUITELET.form.fields[strKey].isInLine) {
                        objField.updateDisplayType({
                            displayType: serverWidget.FieldDisplayType.INLINE
                        });
                    }

                    if (slMapping.SUITELET.form.fields[strKey].ishidden) {
                        objField.updateDisplayType({
                            displayType: serverWidget.FieldDisplayType.HIDDEN
                        });
                    }
                }
            } catch (err) {
                log.error("BUILD_FORM_ADD_BODY_FILTERS_ERROR", err.message);
            }
        };

        const addSublistFields = (options) => {
            try {
                let arrFilteredItems = []
                let arrAddedFieldId = []
                let objSublistParam = options.data;

                let strCurrentStage = objSublistParam.currentStage
                let arrSearchResults = objSublistParam.searchResults

                let sublist = options.form.addSublist({
                    id: 'custpage_sublist',
                    type: serverWidget.SublistType.LIST,
                    label: strCurrentStage,
                    tab: 'custpage_tabid'
                });
        
                for (var strKey in slMapping.SUITELET.form.sublistfields) {
                    if (strKey == 'CURRENT_STAGE') {
                        const currentStage = slMapping.SUITELET.form.sublistfields.CURRENT_STAGE;
                        for (let stage in currentStage) {
                            if (stage == strCurrentStage) {
                                const currentObjStage = currentStage[stage];
                                for (let objKeyStage in currentObjStage) {
                                    sublist.addField(currentObjStage[objKeyStage]);
                                    arrAddedFieldId.push(currentObjStage[objKeyStage].id)
                                }
                            }
                        }
                    } else {
                        sublist.addField(slMapping.SUITELET.form.sublistfields[strKey]);
                        arrAddedFieldId.push(slMapping.SUITELET.form.sublistfields[strKey].id)
                    }
                }

                if(arrSearchResults.length > 0){
                    arrFilteredItems = arrSearchResults.filter(item => {
                        const stage = item.custpage_department_stage;
                        return stage && stage.toUpperCase() === strCurrentStage;
                    });
                }

                let objLog = {
                    currentStage: strCurrentStage,
                    arrFilteredItems: arrFilteredItems
                }

                log.debug('objLog', objLog)


                arrFilteredItems.forEach((data, index) => {
                    let objCurrDepStage = data.custpage_department_stage;

                    strFormattedDeptStage = objCurrDepStage.toUpperCase();

                    if (strCurrentStage == strFormattedDeptStage) {
                        for (const key in data) {
                            let value = data[key];
                            if (value !== undefined && value !== null && value !== "") {
                            try {
                                if (arrAddedFieldId.includes(key)) {
                                    sublist.setSublistValue({
                                        id: key,
                                        line: index,
                                        value: value
                                    });
                                }
                            } catch (error) {
                                log.error("setSublistValue error", error.message);
                            }

                            }
                        }
                    }
                });
        
            } catch (err) {
                log.error("BUILD_FORM_ADD_SUBLIST_ERROR", err.message);
            }
        };
        

        const runSearch = () => {
 
            try {
                let arrSearchResults = []
                let objSavedSearch = search.create({
                    type: 'salesorder',
                    filters: [
                        ['type', 'anyof', 'SalesOrd'],
                        'AND',
                        ['mainline', 'is', 'T'],
                        'AND',
                        ['custbody_department_stage', 'noneof', '@NONE@'],
                    ],
                    columns: [
                        search.createColumn({ name: 'tranid', label: 'custpage_sales_order_number' }),
                        search.createColumn({ name: 'altname', join: 'customermain', label: 'custpage_customer_name' }),
                        search.createColumn({ name: 'custbody_department_stage', label: 'custpage_department_stage' }),
                        search.createColumn({ name: 'trandate', label: 'custpage_order_date' }),
                        search.createColumn({ name: 'shipdate', label: 'custpage_expected_ship_date' }),

                        search.createColumn({ name: 'custbody_primary_eng', label: 'custpage_primary_eng' }),
                        search.createColumn({ name: 'custbody_eng_completion', label: 'custpage_eng_completion' }),
                        search.createColumn({ name: 'custbody_eng_status', label: 'custpage_eng_status' }),
                        search.createColumn({ name: 'custbody_program', label: 'custpage_program' }),
                        search.createColumn({ name: 'custbody_program_status', label: 'custpage_program_status' }),

                        search.createColumn({ name: 'custbody_primary_builder', label: 'custpage_primary_builder' }),
                        search.createColumn({ name: 'custbody_dt_build_done', label: 'custpage_dt_build_done' }),
                        search.createColumn({ name: 'custbody_production_status', label: 'custpage_production_status' }),
                        search.createColumn({ name: 'custbody_progress', label: 'custpage_progress' }),
                        search.createColumn({ name: 'custbody_on_time', label: 'custpage_on_time' }),

                        // search.createColumn({ name: 'custbody_esc_last_modified_date', label: 'custpage_esc_last_modified_date' }),
                    ],

                });

                let searchResultCount = objSavedSearch.runPaged().count;
            
                if (searchResultCount !== 0) {
                    let pagedData = objSavedSearch.runPaged({ pageSize: 1000 });
            
                    for (let i = 0; i < pagedData.pageRanges.length; i++) {
                        let currentPage = pagedData.fetch(i);
                        let pageData = currentPage.data;
                        var pageColumns = currentPage.data[0].columns;
                        if (pageData.length > 0) {
                            for (let pageResultIndex = 0; pageResultIndex < pageData.length; pageResultIndex++) {
                                let objData = {};
                                pageColumns.forEach(function (result) {
                                    let resultLabel = result.label;
                                    if (resultLabel === 'custpage_program') {
                                        objData[resultLabel] = pageData[pageResultIndex].getValue(result) ? 'Yes' : 'No';
                                    } else if (resultLabel === 'custpage_department_stage') {
                                        objData[resultLabel] = pageData[pageResultIndex].getText(result);
                                    } else {
                                        objData[resultLabel] = pageData[pageResultIndex].getValue(result);
                                    }                                    
                                })
                                arrSearchResults.push(objData);
                            }
                        }   
                    }
                }
            // log.debug(`runSearch arrSearchResults ${Object.keys(arrSearchResults).length}`, arrSearchResults);

            return arrSearchResults;

            } catch (err) {
                log.error('Error: runSearch', err.message);
            }
        }

        return { FORM, ACTIONS }
    });
