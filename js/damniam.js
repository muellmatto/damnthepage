function closeMenu() {
    var layout = document.querySelector('.mdl-layout');
    layout.MaterialLayout.toggleDrawer();
    return true;
}

function datumString(datum) {
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

        return d.toString() + '. ' + month_names[m] ;
}


function fillList(data) {
    var template = document.getElementById('listtemplate').innerHTML;
    document.getElementById('termine').innerHTML = null; 
    for (i in data) {
        var datum = datumString(new Date(Date.parse(data[i].datetime)));
            var rendered = template.replace('{{city}}', data[i].venue.city).replace('{{venuename}}',data[i].venue.name).replace('{{latitude}}',data[i].venue.latitude).replace('{{longitude}}',data[i].venue.longitude).replace('{{datum}}', datum);
            document.getElementById('termine').innerHTML += rendered;
     }
}

function fillGrid(data) {
    var template = document.getElementById('feedtemplate').innerHTML;
    var k = 0;
    for (i in data.data) {
        console.log(data.data[i].created_time);
        var datum = datumString(new Date(Date.parse(data.data[i].created_time)));
        console.log(datum);
            if( ("message" in data.data[i]) && ( k < 10) ) {
                var rendered = template.replace('{{image}}',data.data[i].full_picture).replace('{{link}}',data.data[i].link).replace('{{datum}}',datum).replace('{{message}}', data.data[i].message);
                document.getElementById('grid').innerHTML += rendered;
                k++;
            };
     }
}



function fillGallery(data) {
        var template = document.getElementById('gallerytemplate').innerHTML;
    for (i in data.data) {
        var datum = datumString(new Date(parseInt(data.data[i].created_time) * 1000));
        var rendered = template.replace('{{image}}',data.data[i].images.low_resolution.url).replace('{{link}}',data.data[i].link).replace('{{datum}}',datum);
        document.getElementById('media').innerHTML += rendered;
     }
}


var bandsInTown = document.createElement('script');
bandsInTown.src = 'http://api.bandsintown.com/artists/damniam/events.json?api_version=2.0&app_id=damniam_website&callback=fillList';

var facebookFeed = document.createElement('script');
facebookFeed.src = 'https://graph.facebook.com/v2.6/35075947587/posts?fields=full_picture,message,link,created_time&limit=16&access_token=1280679008628028|iSLmie0AppAKj2yWz3zx2TN8C4Q&callback=fillGrid';

var instagramGallery = document.createElement('script');
instagramGallery.src = 'https://api.instagram.com/v1/users/self/media/recent/?access_token=328950673.93e3299.50f6a823351144fa89ff552524d343c6&count=24&callback=fillGallery';

document.getElementsByTagName('head')[0].appendChild(bandsInTown);
document.getElementsByTagName('head')[0].appendChild(facebookFeed);
document.getElementsByTagName('head')[0].appendChild(instagramGallery);

