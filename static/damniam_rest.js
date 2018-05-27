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




function fill_feed(data) {
    var template = '<div class="card feed">'
                   +'   <h4>{{datum}}</h4> '
                   +'     <hr>'
                   +'     <img src="{{image}}">'
                   +'    <p>{{message}}</p>'
                   +'     <a class="button" rel="noopener" target="_blank"  href="{{link}}">READ MORE</a>'
                   +' </div>';
    for (let d of data) {
        var rendered = template
                            .replace('{{image}}',d.full_picture)
                            .replace('{{link}}',d.link)
                            .replace('{{datum}}',d.created_time)
                            .replace('{{message}}', d.message);
        document.getElementById('news').innerHTML += rendered;
     }
}

function fill_gallery(data) {
    var template = ' <a href="{{link}}" rel="noopener" target="_blank" style="text-decoration: none;">'
                  +'      <div class="card pic"'
                  +'              style="background:url(\'{{image}}\') center center; background-size: inherit;">'
                  +'          <p>'
                  +'              {{datum}}'
                  +'          </p>'
                  +'      </div>'
                  +'  </a>';
    for (let img of data) {
        var rendered = template
                            .replace('{{image}}',img.images.low_resolution.url)
                            .replace('{{link}}',img.link)
                            .replace('{{datum}}',img.created_time);
        document.getElementById('pics').innerHTML += rendered;
     }
}




fetch('/rest/feed')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        fill_feed(data);
    });

fetch('/rest/gallery')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        fill_gallery(data);
    });
