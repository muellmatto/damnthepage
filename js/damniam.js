"use strict";

function closeMenu() {
    var layout = document.querySelector('.mdl-layout');
    layout.MaterialLayout.toggleDrawer();
    return true;
}

function datumString(datum) {
        var datumString = '';
        var now = new Date();
        var diff = now.valueOf() - datum.valueOf();
        if (Math.floor(diff/(1000*60)) == 0) {
            datumString = 'vor ' + Math.floor(diff/(1000)).toString() + 's';
        } else if (Math.floor(diff/(1000*60*60)) == 0) {
            datumString = 'vor ' + Math.floor(diff/(1000*60)).toString() + 'min';
        } else if (Math.floor(diff/(1000*60*60* 24)) == 0) {
            datumString =  'vor ' + Math.floor(diff/(1000*60*60)).toString() + 'h';
        } else if ( Math.floor(diff/(1000*60*60* 24)) == 1 ) {
            datumString = 'gestern';
        } else {
            var m = datum.getMonth();
            var d = datum.getDate();
            var month_names = [
                                "Januar",
                                "Februar",
                                "März",
                                "April",
                                "Mai",
                                "Juni",
                                "Juli",
                                "August",
                                "September",
                                "Oktober",
                                "November",
                                "Dezember",
                                ];
            datumString = d.toString() + '. ' + month_names[m] ;
        }
        return datumString;
}


function fillList(data) {
    var template = document.getElementById('listtemplate').innerHTML;
    document.getElementById('termine').innerHTML = null; 
    var jsonLdDate = new Array();
    for (var i =0 ;i < data.length; i++) {
        jsonLdDate[i] = {};
        jsonLdDate[i]['@context'] = 'http://schema.org';
        jsonLdDate[i]['@type'] = 'MusicEvent';
        jsonLdDate[i]['name'] = 'DAMNIAM';
        jsonLdDate[i]['startDate'] = data[i].datetime;
        jsonLdDate[i]['location'] = {};
        jsonLdDate[i]['location']['@type'] = 'Place';
        jsonLdDate[i]['location']['name'] = data[i].venue.name;
        jsonLdDate[i]['location']['address'] = data[i].venue.city;
        var datum = datumString(new Date(Date.parse(data[i].datetime)));
        var rendered = template
                            .replace('{{city}}', data[i].venue.city)
                            .replace('{{venuename}}',data[i].venue.name)
                            .replace('{{latitude}}',data[i].venue.latitude)
                            .replace('{{longitude}}',data[i].venue.longitude)
                            .replace('{{datum}}', datum);
        document.getElementById('termine').innerHTML += rendered;
     }
    var scriptJsonLd = document.createElement('script');
    scriptJsonLd.type = "application/ld+json";
    scriptJsonLd.innerHTML = JSON.stringify(jsonLdDate);
    document.getElementsByTagName('head')[0].appendChild(scriptJsonLd);
}

function fillGrid(data) {
    var template = document.getElementById('feedtemplate').innerHTML;
    var MAX_ENTRIES = 10;
    var k = 0;
    for (var i = 0; ( i < data.data.length ) && ( k < MAX_ENTRIES ); i++) {
        var datum = datumString(
                        new Date(
                                    parseInt(data.data[i].created_time) * 1000
                            )
                    );
        if( "message" in data.data[i] ) {
            var rendered = template
                                .replace('{{image}}',data.data[i].full_picture)
                                .replace('{{link}}',data.data[i].link)
                                .replace('{{datum}}',datum)
                                .replace('{{message}}', data.data[i].message);
            document.getElementById('grid').innerHTML += rendered;
            k++;
        };
     }
}



function fillGallery(data) {
    var template = document.getElementById('gallerytemplate').innerHTML;
    for (var i = 0; i < data.data.length; i++) {
        var datum = datumString(new Date(parseInt(data.data[i].created_time) * 1000));
        var rendered = template
                            .replace('{{image}}',data.data[i].images.low_resolution.url)
                            .replace('{{link}}',data.data[i].link)
                            .replace('{{datum}}',datum);
        document.getElementById('media').innerHTML += rendered;
     }
}


var bandsInTown = document.createElement('script');
bandsInTown.src = 'http://api.bandsintown.com/artists/damniam/events.json?api_version=2.0&app_id=damniam_website&callback=fillList';

var facebookFeed = document.createElement('script');
facebookFeed.src = 'https://graph.facebook.com/v2.6/35075947587/posts?fields=full_picture,message,link,created_time&limit=16&access_token=1280679008628028|iSLmie0AppAKj2yWz3zx2TN8C4Q&date_format=U&callback=fillGrid';

var instagramGallery = document.createElement('script');
instagramGallery.src = 'https://api.instagram.com/v1/users/self/media/recent/?access_token=328950673.93e3299.50f6a823351144fa89ff552524d343c6&count=18&callback=fillGallery';


document.getElementsByTagName('head')[0].appendChild(bandsInTown);
document.getElementsByTagName('head')[0].appendChild(facebookFeed);
document.getElementsByTagName('head')[0].appendChild(instagramGallery);

