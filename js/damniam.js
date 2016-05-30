
function fillTable(data) {
    var template = $('#tabletemplate').html();
    Mustache.parse(template);   // optional, speeds up future uses
    document.getElementById('termine').innerHTML = null; 
    for (i in data) {
        var datum = new Date(Date.parse(data[i].datetime));
            var rendered = Mustache.render(template, {
                                            city: data[i].venue.city,
                                            venuename: data[i].venue.name,
                                            latitude: data[i].venue.latitude,
                                            longitude: data[i].venue.longitude,
                                            datum: datum.toLocaleDateString()
                                            }
                                        );
            // document.getElementById('termine').innerHTML += rendered;
            $('#termine').append(rendered);
     }
}

function fillGrid(data) {
    var template = $('#feedtemplate').html();
    Mustache.parse(template);   // optional, speeds up future uses
    //console.log(data);
    for (i in data.data) {
        var datum = new Date(Date.parse(data.data[i].created_time));

        var m = datum.getMonth();
        var d = datum.getDate();
        var month_names = new Array ( );
        month_names[month_names.length] = "Januar";
        month_names[month_names.length] = "Februar";
        month_names[month_names.length] = "März";
        month_names[month_names.length] = "April";
        month_names[month_names.length] = "Mai";
        month_names[month_names.length] = "Juni";
        month_names[month_names.length] = "Juli";
        month_names[month_names.length] = "August";
        month_names[month_names.length] = "September";
        month_names[month_names.length] = "Oktober";
        month_names[month_names.length] = "November";
        month_names[month_names.length] = "Dezember";
        var datum = d + '. ' + month_names[m] ;

            if( ("message" in data.data[i]) ) {
                var rendered = Mustache.render(template, {
                                                image: data.data[i].full_picture,
                                                link: data.data[i].link,
                                                message: data.data[i].message,
                                                datum: datum
                                                }
                                            );
                $('#grid').append(rendered);
            };
     }
}


function fillGallery(data) {
    var template = $('#gallerytemplate').html();
    Mustache.parse(template);   // optional, speeds up future uses
    for (i in data) {
        var datum = new Date(parseInt(data.data[0].created_time) * 1000);
            var rendered = Mustache.render(template, {
                                            image: data.data[i].images.low_resolution.url,
                                            datum: datum.toLocaleDateString()
                                            }
                                        );
            // document.getElementById('termine').innerHTML += rendered;
            $('#gallery').append(rendered);
     }
}

$( document ).ready(function() {
    // console.log( "ready!" );

    $.getJSON( 'http://api.bandsintown.com/artists/damniam/events.json?api_version=2.0&app_id=damniam_website&callback=?', fillTable );
    $.getJSON( 'https://graph.facebook.com/v2.6/35075947587/posts?fields=full_picture,message,link,created_time&limit=10&access_token=1280679008628028|iSLmie0AppAKj2yWz3zx2TN8C4Q', fillGrid);
    // $.getJSON( 'https://graph.facebook.com/v2.6/35075947587/posts?fields=full_picture,message,link,created_time&limit=10&access_token=EAACEdEose0cBAI5zCanZB0VXacZASI4JHCgxd2s2YcyVEPyOtPPgxoCKd10TymNXVfFswBDtV3jQp3JSJLEBuZBkugIuAvfzxarovACSPdSbH8uyrjhl4FjZAZAzHeRo6ppP2ZBZCfWh4a5CfKrhPiZAPkT9EV8H5OJ4v7R7dyJykgZDZD', fillGrid);
    $.getJSON( 'https://api.instagram.com/v1/users/self/media/recent/?access_token=328950673.467ede5.f0004ab84606494dbde9242463601438&count=16', fillGallery );

});
