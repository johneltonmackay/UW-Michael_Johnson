/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */
define(['N/currentRecord'], (currentRecord) => {

    // Function to initialize the page
    const pageInit = (scriptContext) => {
        try {
            console.log('Page Fully Loaded!');
            // var submitButton = document.getElementById('submitter');
            // var submit2ndButton = document.getElementById('secondarysubmitter');
            
            // submitButton.style.display = 'none';
            // submit2ndButton.style.display = 'none';
            refreshPage();
        } catch (error) {
            console.log('Error in pageInit:', error.message);
        }
    };

    const refreshPage = () => {
        const fieldValues = ['ENGINEERING', 'PRODUCTION', 'COMPLETE', 'ORDER PROCESSING'];
        
        let currentIndex = parseInt(localStorage.getItem('currentIndex'), 10) || 0;
        
        const rec = currentRecord.get();
        
        rec.setValue({
            fieldId: 'custpage_next_slide',
            value: fieldValues[currentIndex]
        });
        
        console.log('Updated field value to:', fieldValues[currentIndex]);
        
        currentIndex = (currentIndex + 1) % fieldValues.length;
        localStorage.setItem('currentIndex', currentIndex);
        
        setTimeout(() => {
            submitPage();
        }, 3000);
    };

    const submitPage = () =>{
        const submitButton = document.querySelector('input[type="submit"]');
        if (submitButton) {
            submitButton.click();
            console.log('Submit button clicked.');
        } else {
            console.log('Submit button not found.');
        }
    }
    return {
        pageInit
    };

});



