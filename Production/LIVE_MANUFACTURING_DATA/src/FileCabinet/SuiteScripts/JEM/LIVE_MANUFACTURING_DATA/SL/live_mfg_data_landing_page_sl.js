/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/file', 'N/record', 'N/search', "../Library/live_mfg_data_sl_module.js", "../Library/live_mfg_data_sl_mapping.js", "N/redirect"],
    /**
 * @param{file} file
 * @param{record} record
 * @param{search} search
 */
    (file, record, search, module, mapping, redirect) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const CONTEXT_METHOD = {
            GET: "GET",
            POST: "POST"
        };

        const onRequest = (scriptContext) => {
            var objForm = ""
            try {
                if (scriptContext.request.method == CONTEXT_METHOD.POST) {
                    let scriptObj = scriptContext.request.parameters;
                    // log.debug('POST onRequest scriptObj', scriptObj);
                    let strCurrentStage = scriptContext.request.parameters['custpage_next_slide'];
                    if (strCurrentStage) {
                        let objPostParam = {
                            custpage_current_slide: strCurrentStage,
                        }
                        redirect.toSuitelet({
                            scriptId: mapping.SUITELET.scriptid,
                            deploymentId: mapping.SUITELET.deploymentid,
                            parameters: {
                                data: JSON.stringify(objPostParam)
                            }
                        });
                    }
                } else {
                    let strCurrentStage = null
                    let scriptObj = scriptContext.request.parameters;
                    let strPostParam = scriptObj.data
                    log.debug('GET onRequest strPostParam', strPostParam);

                    if(strPostParam){
                        objPostParam = JSON.parse(strPostParam);

                        let objCurrentData = objPostParam.custpage_current_slide

                        strCurrentStage = objCurrentData

                    } else {
                        strCurrentStage = 'ORDER PROCESSING'
                    }

                    objForm = module.FORM.buildForm({ // searchItems
                        title: mapping.SUITELET.form.title,
                        currentStage: strCurrentStage 
                    });
                        
                    scriptContext.response.writePage(objForm);
                }
                
            } catch (err) {
                log.error('ERROR ONREQUEST:', err)
            }
        }

        return {onRequest}

    });
