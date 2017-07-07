// Shorthand for $( document ).ready()
$(function () {

    //--CONFIG----------------------------------------------------------------------------

    //page2
    var selectImgServiceUrl = "backend/btnPush.php";

    //page3
    var selectOptionServiceUrl = "backend/optionSelect.php";
    var loadOptionServiceUrl = "backend/getOptions.php";

    //max time to wait to get results (in milliseconds)
    serviceTimeout = 10000;

    //------------------------------------------------------------------------------------



    $(window).on('hashchange', function () {
        // On every hash change the render function is called with the new hash.
        // This is how the navigation of our app happens.
        render(decodeURI(window.location.hash));
    });


    var renderMainPage = function () {
        $('#link-page1').addClass('active');
        $('#page1').show();
    };

    var renderPage2 = function () {
        $('#link-page2').addClass('active');
        $('#page2').show();
    };

    var renderPage3 = function () {
        $('#link-page3').addClass('active');
        $('#page3').show();
        loadOptions('options-form-checkbox-area', "-1");
    };


    function render(url) {

        // Get the keyword from the url.
        var temp = url.split('/')[0];

        // console.log("url=" + url);
        // console.log("temp=" + temp);

        // Hide whatever page is currently shown.
        $('.page').hide();
        //#hide nav-bar selection
        $('#navigation > li').removeClass('active');

        var map = {

            // The Homepage.
            '': function () {
                renderMainPage();
            },

            // Single Products page.
            '#1': function () {
                renderMainPage();
            },

            '#2': function () {
                renderPage2();
            },

            '#3': function () {
                renderPage3();
            },

            // Page with filtered products
            '#filter': function () {

                // Grab the string after the '#filter/' keyword. Call the filtering function.
                url = url.split('#filter/')[1].trim();

                // Try and parse the filters object from the query string.
                try {
                    filters = JSON.parse(url);
                }
                // If it isn't a valid json, go back to homepage ( the rest of the code won't be executed ).
                catch (err) {
                    window.location.hash = '#';
                }

                renderFilterResults(filters, products);
            }

        };

        // Execute the needed function depending on the url keyword (stored in temp).
        if (map[temp]) {
            map[temp]();
        }
        // If the keyword isn't listed in the above - render the error page.
        else {
            console.log("page [" + temp + "] not found, using the default page");
            renderMainPage();
        }
    }

    function hideErrorDialog() {
        $('.error').hide();
    }


    function startWait(elemId) {
        console.log('startWait CALL');
        hideErrorDialog();
    }


    function stopWait(elemId) {
        console.log('stopWait CALL');
    }


    function processImgSuccess(data) {
        console.log('processSuccess CALL');
    }


    function processOptSuccess(data, OptionsAreaId, optionSelectedStr) {
        console.log('processOptSuccess CALL optionSelectedStr=' + optionSelectedStr);
        loadOptions(OptionsAreaId, optionSelectedStr);
    }

    function processLoadOptsToSuccess(data, textAreaId, OptionsAreaId, optionSelectedStr) {
        console.log('processLoadOptsToSuccess CALL, data=' + JSON.stringify(data));

        var s = '';
        for (var i = 0; i < data.options.length; i++) {
            s += '<div class="radio"><label><input type="radio" name="optradio" value="'
            + data.options[i].value + '" required>' + data.options[i].value + '</label></div>\n';
        }
        // console.log(s);

        $('#' + OptionsAreaId).html(s);
        $('#' + textAreaId).html(data.headertext);
    }

    function processFail(errorElemId, errorThrown) {
        console.log('processFail ERROR: ' + errorThrown);
        // console.log('type ERROR: ' + typeof errorThrown);
        if (!errorThrown) {
            errorThrown = 'An unknown error occured!';
        }
        $('#' + errorElemId).html(errorThrown).show();
    }


    function sendFromImgSelected(elemId) {
        return function () {
            buttonPressedStr = elemId.split('-')[1]; //number part in the name sel-x

            startWait(elemId);
            $.ajax({
                timeout: serviceTimeout, // a lot of time for the request to be successfully completed
                url: selectImgServiceUrl,
                contentType: "application/json",
                method: "POST",
                data: JSON.stringify({ "buttonPressed": buttonPressedStr })
            })
                .done(function (data) {
                    //var result = $(data).find('boolean').text();
                    processImgSuccess(data);
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    processFail('img-error', errorThrown);
                })
                .always(function (data) {
                    stopWait(elemId);
                });


        };
    }


    function sendFromOptionSelected(formId) {
        return function () {
            var optionSelectedStr = ($('input[name=optradio]:checked', ('#' + formId)).val());
            //console.log(optionSelectedStr);
            if (typeof optionSelectedStr === 'undefined') {
                processFail('options-form-error', "select at least one option");
                return false;
            }

            startWait(formId);
            $.ajax({
                timeout: serviceTimeout, // a lot of time for the request to be successfully completed
                url: selectOptionServiceUrl,
                contentType: "application/json",
                method: "POST",
                data: JSON.stringify({ "optionSelected": optionSelectedStr })
            })
                .done(function (data) {
                    //var result = $(data).find('boolean').text();
                    processOptSuccess(data, 'options-form-checkbox-area', optionSelectedStr);
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    processFail('options-form-error', errorThrown);
                })
                .always(function (data) {
                    stopWait(formId);
                });

            return false;
        };
    }


    function loadOptions(elemId, optionSelectedStr) {
            startWait(elemId);
            $.ajax({
                timeout: serviceTimeout, // a lot of time for the request to be successfully completed
                url: loadOptionServiceUrl,
                contentType: "application/json",
                method: "POST",
                data: JSON.stringify({ "optionSelected": optionSelectedStr })
            })
                .done(function (data) {
                    //var result = $(data).find('boolean').text();
                    processLoadOptsToSuccess(data, 'page3-text', 'options-form-checkbox-area', optionSelectedStr);
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    processFail('options-form-error', errorThrown);
                })
                .always(function (data) {
                    stopWait(elemId);
                });

            return false;







    }


    function init() {

        //page2 add if more is needed
        $('#sel-1').click(sendFromImgSelected('sel-1'));
        $('#sel-2').click(sendFromImgSelected('sel-2'));
        $('#sel-3').click(sendFromImgSelected('sel-3'));
        $('#sel-4').click(sendFromImgSelected('sel-4'));
        $('#sel-5').click(sendFromImgSelected('sel-5'));
        $('#sel-6').click(sendFromImgSelected('sel-6'));

        //page3
        $('#options-form-submit').click(sendFromOptionSelected('options-form'));

        var url = (window.location.href).split('/');
        //last url fragment
        render(url[url.length - 1]);
    }


    init();

});
