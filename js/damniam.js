"use strict";


var menu_visible = false;

function toggle_menu() {
   var menu = document.getElementById("menu") 
    if (menu_visible) {
        menu_visible = false;
        // menu.style.display = "none";
        menu.style.maxHeight = "0";
    } else{
        menu_visible = true;
        // menu.style.display = "block";
        menu.style.maxHeight = "calc(100vh - 3rem)";
    }
    // alert(menu_visible);
}
document.getElementById("menu_button").addEventListener("click", toggle_menu);
document.getElementById("menu").addEventListener("mousedown", toggle_menu);

function date_to_string(datum) {
        var datum_string = '';
        var now = new Date();
        var diff = now.valueOf() - datum.valueOf();
        if (Math.floor(diff/(1000*60)) == 0) {
            datum_string = 'vor ' + Math.floor(diff/(1000)).toString() + 's';
        } else if (Math.floor(diff/(1000*60*60)) == 0) {
            datum_string = 'vor ' + Math.floor(diff/(1000*60)).toString() + 'min';
        } else if (Math.floor(diff/(1000*60*60* 24)) == 0) {
            datum_string =  'vor ' + Math.floor(diff/(1000*60*60)).toString() + 'h';
        } else if ( Math.floor(diff/(1000*60*60* 24)) == 1 ) {
            datum_string = 'gestern';
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
            datum_string = d.toString() + '. ' + month_names[m] ;
        }
        return datum_string;
}

function fill_list(data) {
    var template =   '<li>'
                    +'    <h5>{{city}}</h5>'
                    +'    <span>'
                    +'        <a href=\'{{url}}\' rel=\'noopener\' target=\'_blank\'>'
                    +'            {{datum}} @ {{venuename}}'
                    +'        </a>'
                    +'    </span>'
                    +'    <a href=\'http://maps.google.com/?q={{latitude}},{{longitude}}\' rel=\'noopener\' target=\'_blank\'>'
                    +'        <div class="location"></div>'
                    +'    </a>'
                    +'</li>';
    document.getElementById('termine').innerHTML = null; 
    var jsonLdDate = new Array();
    for (var i =0 ;i < data.length; i++) {
        jsonLdDate[i] = {};
        jsonLdDate[i]['@context'] = 'http://schema.org';
        jsonLdDate[i]['@type'] = 'MusicEvent';
        jsonLdDate[i]['name'] = 'DAMNIAM';
        jsonLdDate[i]['url'] = data[i].url; // will be .url in api v3 -> https://rest.bandsintown.com
        jsonLdDate[i]['startDate'] = data[i].datetime;
        jsonLdDate[i]['location'] = {};
        jsonLdDate[i]['location']['@type'] = 'Place';
        jsonLdDate[i]['location']['name'] = data[i].venue.name;
        jsonLdDate[i]['location']['address'] = data[i].venue.city;
        jsonLdDate[i]['performer'] = 'DAMNIAM';
        var datum = date_to_string(new Date(Date.parse(data[i].datetime)));
        var rendered = template
                            .replace('{{city}}', data[i].venue.city)
                            .replace('{{url}}', data[i].url)
                            .replace('{{venuename}}',data[i].venue.name)
                            .replace('{{latitude}}',data[i].venue.latitude)
                            .replace('{{longitude}}',data[i].venue.longitude)
                            .replace('{{datum}}', datum);
        document.getElementById('termine').innerHTML += rendered;
     }
    if (data.length == 0) {
        document.getElementById('termine').innerHTML = '<li class="mdl-list__item"><span class="mdl-list__item-primary-content">coming up soon</span></li>';
    }
    var scriptJsonLd = document.createElement('script');
    scriptJsonLd.type = "application/ld+json";
    scriptJsonLd.innerHTML = JSON.stringify(jsonLdDate);
    document.getElementsByTagName('head')[0].appendChild(scriptJsonLd);
}

function fill_feed(data) {
    var template = '<div class="card feed">'
                   +'   <h4>{{datum}}</h4> '
                   +'     <hr>'
                   +'     <img src="{{image}}">'
                   +'    <p>{{message}}</p>'
                   +'     <a class="button" target="_blank"  href="{{link}}">READ MORE</a>'
                   +' </div>';
    var MAX_ENTRIES = 10;
    var k = 0;
    for (var i = 0; ( i < data.data.length ) && ( k < MAX_ENTRIES ); i++) {
        var datum = date_to_string(
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
            document.getElementById('news').innerHTML += rendered;
            k++;
        };
     }
}

function fill_gallery(data) {
    var template = ' <a href="{{link}}" target="_blank" style="text-decoration: none;">'
                  +'      <div class="card pic"'
                  +'              style="background:url(\'{{image}}\') center center; background-size: inherit;">'
                  +'          <p>'
                  +'              {{datum}}'
                  +'          </p>'
                  +'      </div>'
                  +'  </a>';
    for (var i = 0; i < data.data.length; i++) {
        var datum = date_to_string(new Date(parseInt(data.data[i].created_time) * 1000));
        var rendered = template
                            .replace('{{image}}',data.data[i].images.low_resolution.url)
                            .replace('{{link}}',data.data[i].link)
                            .replace('{{datum}}',datum);
        document.getElementById('pics').innerHTML += rendered;
     }
}


var bands_in_town = document.createElement('script');
bands_in_town.setAttribute('async', '');
bands_in_town.setAttribute('defer', '');
bands_in_town.setAttribute('type', 'text/javascript');
bands_in_town.src = 'https://rest.bandsintown.com/artists/damniam/events?app_id=damniam_website&callback=fill_list';

var facebook_feed = document.createElement('script');
facebook_feed.setAttribute('async', '');
facebook_feed.setAttribute('defer', '');
facebook_feed.setAttribute('type', 'text/javascript');
facebook_feed.src = 'https://graph.facebook.com/v2.10/35075947587/posts?fields=full_picture,message,link,created_time&limit=20&access_token=1280679008628028|iSLmie0AppAKj2yWz3zx2TN8C4Q&date_format=U&callback=fill_feed';

var instagram_gallery = document.createElement('script');
instagram_gallery.setAttribute('async', '');
instagram_gallery.setAttribute('defer', '');
instagram_gallery.setAttribute('type', 'text/javascript');
instagram_gallery.src = 'https://api.instagram.com/v1/users/self/media/recent/?access_token=328950673.93e3299.50f6a823351144fa89ff552524d343c6&count=16&callback=fill_gallery';


document.getElementsByTagName('head')[0].appendChild(bands_in_town);
document.getElementsByTagName('head')[0].appendChild(facebook_feed);
document.getElementsByTagName('head')[0].appendChild(instagram_gallery);

