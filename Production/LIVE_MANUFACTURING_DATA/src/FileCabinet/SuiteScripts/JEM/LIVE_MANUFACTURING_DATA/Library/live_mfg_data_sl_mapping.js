/**
 * @NApiVersion 2.1
 */
define([],
    
    () => {

        const SUITELET = {
            scriptid: 'customscript_live_mfg_data_land_page_sl',
            deploymentid: 'customdeploy_live_mfg_data_land_page_sl',
            form: {
                title: "Production Live Display Board",
                fields: {
                    TOTAL_ORDER: {
                        id: "custpage_total_active_orders",
                        type: "TEXT",
                        label: "Total Active Orders:",
                        isInLine: true,
                        hasdefault: true,
                    },
                    NEXT_SLIDE: {
                        id: "custpage_next_slide",
                        type: "TEXT",
                        label: "NEXT SLIDE:",
                        ishidden: true
                    },
                },
                buttons: {
                    SUBMIT: {
                        label: 'Refresh',
                    },
                },
                sublistfields: {
                    SALES_ORDER_NUMBER: {
                        id: "custpage_sales_order_number",
                        label: "Sales Order Number",
                        type: 'text',
                    },
                    CUSTOMER_NAME: {
                        id: "custpage_customer_name",
                        label: "Customer Name",
                        type: 'text',
                    },
                    DEPARTMENT_STAGE: {
                        id: "custpage_department_stage",
                        label: "Department Stage",
                        type: 'text',
                    },
                    ORDER_DATE: {
                        id: "custpage_order_date",
                        label: "Order Date",
                        type: "text",
                    },
                    EXPECTED_SHIP_DATE: {
                        id: "custpage_expected_ship_date",
                        label: "Expected Ship Date",
                        type: "text",
                    },
                    CURRENT_STAGE: {
                        ORDER_PROCESSING: {},
                        ENGINEERING: {
                            PRIMARY_ENGINEER: {
                                id: "custpage_primary_eng",
                                label: "Primary Engineer",
                                type: "text",
                            },
                            ENG_COMPLETION_DATE: {
                                id: "custpage_eng_completion",
                                label: "Eng Completion Date",
                                type: "text",
                            },
                            STATUS: {
                                id: "custpage_eng_status",
                                label: "Status",
                                type: "text",
                            },
                            PROGRAM: {
                                id: "custpage_program",
                                label: "Program?",
                                type: "text",
                            },
                            PROGRAM_STATUS: {
                                id: "custpage_program_status",
                                label: "Program Status",
                                type: "text",
                            },
                        },
                        PRODUCTION: {
                            PRIMARY_BUILDER: {
                                id: "custpage_primary_builder",
                                label: "Primary Builder",
                                type: "text",
                            },
                            BUILD_DATE_DONE: {
                                id: "custpage_dt_build_done",
                                label: "Date/Time Build to be Done",
                                type: "text",
                            },
                            STATUS: {
                                id: "custpage_production_status",
                                label: "Status",
                                type: "text",
                            },
                            PROGRESS: {
                                id: "custpage_progress",
                                label: "Progress",
                                type: "text",
                            },
                            ON_TIME: {
                                id: "custpage_on_time",
                                label: "On Time?",
                                type: "text",
                            },
                        },
                        COMPLETE: {},
                    },
                    LAST_UPDATE: {
                        id: "custpage_esc_last_modified_date",
                        label: "Last Update",
                        type: "text",
                    },
                },

                CS_PATH: '../CS/live_mfg_data_cs.js',
            },
        }

        const NOTIFICATION = {
            REQUIRED: {
                title: 'REQUIRED FIELDS MISSING',
                message: "Kindly ensure all mandatory fields are completed before proceeding with the preview."
            },
        }

        return { SUITELET, NOTIFICATION }

    });
