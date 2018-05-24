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
