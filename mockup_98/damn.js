"use strict";
/*
    clock
*/
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
/*
    Windows-engine
*/
var windows = new Map();
var window_with_focus;
var main = document.querySelector("main");
var window_template = document.querySelector("#window_template").content;
var start_menu = document.querySelector("#menu_checkbox");
var taskbar = document.querySelector("#taskbar");


function add_window(id, title, htmlFragment) {
    start_menu.checked = false;
    if (windows.has(id)) {
        // exists!
        focus_window(id);
    } else {
        var new_window = window_template.cloneNode(true);
        new_window.querySelector("article").id = id;
        /* zIndex + 1 , htmlFragment is added later! */
        new_window.querySelector("article").style.zIndex = windows.size + 1;
        new_window.querySelector(".title").textContent = title;
        new_window.querySelector("section").appendChild(htmlFragment.cloneNode(true));
        new_window.querySelector(".close").onclick = function () { close_window(id) };
        new_window.querySelector("h2").onmousedown = function (e) {
            focus_window(id);
            isDown = true;
            var self_tmp = document.querySelector("#"+id);
            offset = [
                self_tmp.offsetLeft - e.clientX,
                self_tmp.offsetTop - e.clientY
            ];
        };
        windows.set(id, new_window);
        main.appendChild(new_window);
        window_with_focus = document.querySelector("#"+id);
        var taskbar_item = document.createElement('li');
        taskbar_item.id = "task_"+id;
        taskbar_item.textContent = title;
        taskbar_item.onclick = function () { focus_window(id); }
        taskbar.appendChild(taskbar_item);
        focus_window(id);
    }
}
function focus_window(id) {
    // rearrange windows / z-index
    console.log("focus to:", id);
    var window_to_focus = document.querySelector("#"+id);
    var focus_zIndex = parseInt(window_to_focus.style.zIndex);
    for (var id2 of windows.keys()) {
        if (id != id2) {
            console.log("checking:", id2);
            var tmp_window = document.querySelector("#"+id2);
            var tmp_zIndex = parseInt(tmp_window.style.zIndex);
            console.log("?? ", tmp_zIndex, ">=", focus_zIndex);
            if (tmp_zIndex >= focus_zIndex) {
                console.log("yes");
                var new_zIndex = tmp_zIndex - 1;
                console.log("new zIndex:", new_zIndex);
                tmp_window.style.zIndex = new_zIndex.toString();
                console.log(tmp_window);
            }
            var taskbar_item = document.querySelector("#task_"+id2);
            if (taskbar_item.classList.contains("focused")) {
                taskbar_item.classList.remove("focused");
            }
        }
    }
    window_to_focus.style.zIndex = windows.size;
    window_with_focus = window_to_focus;
    var taskbar_item = document.querySelector("#task_"+id);
    if (taskbar_item.classList.contains("focused")) {
    } else {
        taskbar_item.classList.add("focused");
    }
}
function close_window(id) {
    start_menu.checked = false;
    if (windows.has(id)) {
        var closed_window = document.querySelector("#"+id);
        var closed_zIndex = parseInt(closed_window.style.zIndex);
        main.removeChild(closed_window);
        windows.delete(id);
        var closed_task = document.querySelector("#task_"+id);
        taskbar.removeChild(closed_task);
    }
    for (var id2 of windows.keys()) {
        var tmp_window = document.querySelector("#"+id2);
        var tmp_zIndex = parseInt(tmp_window.style.zIndex);
        if (tmp_zIndex >= closed_zIndex) {
                tmp_window.style.zIndex = tmp_zIndex - 1;
        }
    }
}
/*
    windows
*/

var band_text = document.querySelector("#content_bandtext").content;
document.querySelector("#link_bandtext").onclick = function () {
    add_window("band_txt", "damniam.txt", band_text);
}

var band_picture = document.querySelector("#content_bandpicture").content;
document.querySelector("#link_bandpicture").onclick = function () {
    add_window("band_picture", "damiam.jpg", band_picture);
}

var test_win = document.querySelector("#content_test").content;
document.querySelector("#link_test").onclick = function () {
    add_window("test", "oi oi oi", test_win);
}
/*
    window movement
*/
var mousePosition;
var offset = [0,0];
var isDown = false;
/*
var test = document.getElementById('test');
test.addEventListener('mousedown', function(e) {
    isDown = true;
    offset = [
        test.offsetLeft - e.clientX,
        test.offsetTop - e.clientY
    ];
}, true);
*/
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
        window_with_focus.style.left = (mousePosition.x + offset[0]) + 'px';
        window_with_focus.style.top  = (mousePosition.y + offset[1]) + 'px';
    }
}, true);
