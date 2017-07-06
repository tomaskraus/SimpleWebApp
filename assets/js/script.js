// Shorthand for $( document ).ready()
$(function () {


    $(window).on('hashchange', function () {
        // On every hash change the render function is called with the new hash.
        // This is how the navigation of our app happens.
        render(decodeURI(window.location.hash));
    });


    var renderMainPage = function () {
        $('#link-page1').addClass('active');
        $('#page1').show();
    };

    var renderPage2 = function() {
        $('#link-page2').addClass('active');
        $('#page2').show();
    };

    var renderPage3 = function() {
        $('#link-page3').addClass('active');
        $('#page3').show();
    };


    function render(url) {

        // Get the keyword from the url.
        var temp = url.split('/')[0];

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


    function init() {
        $('#link-page1').onclick = function () { render('page1'); };
        $('#link-page2').onclick = function () { render('page2'); };
        // $('#link-page3').onclick = renderErrorPage;

        render(window.location.href);
    }


    init();

});
