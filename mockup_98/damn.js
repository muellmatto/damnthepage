"use strict";
function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('clock').innerHTML =
  h + ":" + m + ":" + s;
  var t = setTimeout(startTime, 500);
}
function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}
startTime();


var windows = new Map();
var main = document.querySelector("main");
var window_template = document.querySelector("#window_template").content;
var start_menu = document.querySelector("#menu_checkbox");

var band_text = document.querySelector("#content_bandtext").content;
var band_picture = document.querySelector("#content_bandpicture").content;

function add_window(id, title, htmlFragment) {
    start_menu.checked = false;
    if (windows.has(id)) {
        // exists!
        // TODO: raise z-index
    } else {
        var new_window = window_template.cloneNode(true);
        new_window.querySelector("article").id = id;
        new_window.querySelector("article").style.zIndex = windows.size;
        new_window.querySelector(".title").textContent = title;
        new_window.querySelector("section").appendChild(htmlFragment.cloneNode(true));
        new_window.querySelector(".close").onclick = function () { close_window(id) };
        windows.set(id, new_window);
        main.appendChild(new_window);
    }
}

function close_window(id) {
    start_menu.checked = false;
    if (windows.has(id)) {
        main.removeChild(document.querySelector("#"+id));
        windows.delete(id);
        // TODO: resort z-index
    }
}

document.querySelector("#link_bandtext").onclick = function () {
    add_window("band_txt", "damniam.txt", band_text);
}
document.querySelector("#link_bandpicture").onclick = function () {
    add_window("band_picture", "damiam.jpg", band_picture);
}

var mousePosition;
var offset = [0,0];
var isDown = false;

var test = document.getElementById('test');
test.addEventListener('mousedown', function(e) {
    isDown = true;
    offset = [
        test.offsetLeft - e.clientX,
        test.offsetTop - e.clientY
    ];
}, true);

document.addEventListener('mouseup', function() {
    isDown = false;
}, true);

document.addEventListener('mousemove', function(event) {
    event.preventDefault();
    if (isDown) {
        mousePosition = {

            x : event.clientX,
            y : event.clientY

        };
        test.style.left = (mousePosition.x + offset[0]) + 'px';
        test.style.top  = (mousePosition.y + offset[1]) + 'px';
    }
}, true);
