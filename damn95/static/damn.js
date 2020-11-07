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
        new_window.querySelector("article").style.top = Math.floor(Math.random()*12).toString() + '%';
        new_window.querySelector("article").style.left = Math.floor(Math.random()*12).toString() + '%';
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
        new_window.querySelector("h2").ontouchstart = function (e) {
            var self_tmp = document.querySelector("#"+id).getElementsByTagName('h2')[0];
            var touch = e.touches[0];
            var mouseEvent = new MouseEvent("mousedown", {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            self_tmp.dispatchEvent(mouseEvent);
        }
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
    // console.log("focus to:", id);
    var window_to_focus = document.querySelector("#"+id);
    var focus_zIndex = parseInt(window_to_focus.style.zIndex);
    for (var id2 of windows.keys()) {
        if (id != id2) {
            // console.log("checking:", id2);
            var tmp_window = document.querySelector("#"+id2);
            var tmp_zIndex = parseInt(tmp_window.style.zIndex);
            // console.log("?? ", tmp_zIndex, ">=", focus_zIndex);
            if (tmp_zIndex >= focus_zIndex) {
                // console.log("yes");
                var new_zIndex = tmp_zIndex - 1;
                // console.log("new zIndex:", new_zIndex);
                tmp_window.style.zIndex = new_zIndex.toString();
                // console.log(tmp_window);
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
    windows and function calls
*/
var band_text = document.querySelector("#content_bandtext").content;
document.querySelector("#link_bandtext1").onclick = function () {
    add_window("band_txt", "damniam.txt", band_text);
}
document.querySelector("#link_bandtext2").onclick = document.querySelector("#link_bandtext1").onclick;
document.querySelector("#link_bandtext3").onclick = document.querySelector("#link_bandtext1").onclick;

var computer_template = document.querySelector("#computer_template").content;
document.querySelector("#link_computer").onclick = function () {
    add_window("computer_files", "computer", computer_template);
    document.querySelector("#link_bandtext4").onclick = document.querySelector("#link_bandtext1").onclick;

    var band_picture = document.querySelector("#content_bandpicture").content;
    document.querySelector("#link_bandpicture").onclick = function () {
        add_window("band_picture", "damiam.bmp", band_picture);
    }
    document.querySelector("#link_bandtourdates").onclick = document.querySelector("#clock").onclick;
}
document.querySelector("#link_computer2").onclick = document.querySelector("#link_computer").onclick;


var band_tourdates = document.querySelector("#content_tourdates").content;
document.querySelector("#clock").onclick = function () {
    add_window("tourdates", "tourdates", band_tourdates);
}

var band_contact = document.querySelector("#content_contact").content;
document.querySelector("#link_bandcontact").onclick = function () {
    add_window("contact", "contact", band_contact);
}

// music
var band_music_planetpiss = document.querySelector("#content_music_planetpiss").content;
document.querySelector("#link_music_planetpiss2").onclick = function () {
    add_window("music_planetpiss", "winamp - PLANET PISS", band_music_planetpiss);
}

var download_folder = document.querySelector("#download_folder_template").content;
document.querySelector("#link_download_folder").onclick = function () {
    add_window("download_folder", "downloads", download_folder);
    document.querySelector("#link_music_planetpiss1").onclick = document.querySelector("#link_music_planetpiss2").onclick;

    var band_music_damage = document.querySelector("#content_music_damage").content;
    document.querySelector("#link_music_damage").onclick = function () {
        add_window("music_damage", "winamp - DAMAGE", band_music_damage);
    }

    var band_music_madamin = document.querySelector("#content_music_madamin").content;
    document.querySelector("#link_music_madamin").onclick = function () {
        add_window("music_madamin", "winamp - MADAMIN", band_music_madamin);
    }

    document.querySelector("#link_download_zip").onclick = function () {
        start_virus();
    }
}
// shit
var ms_paint_exe = document.querySelector("#jspaint_template").content;
document.querySelector("#link_paint").onclick = function () {
    add_window("paint", "paint.exe", ms_paint_exe);
}

var diablo_exe = document.querySelector("#diablo_template").content;
document.querySelector("#link_diablo").onclick = function () {
    add_window("diablo_exe", "diablo.exe", diablo_exe);
}
var minesweeper_exe = document.querySelector("#minesweeper_template").content;
document.querySelector("#link_minesweeper").onclick = function () {
    add_window("minesweeper", "minesweeper.exe", minesweeper_exe);
}
var game2048 = document.querySelector("#game2048_template").content;
document.querySelector("#link_game2048").onclick = function () {
    add_window("game2048", "2048.exe", game2048);
}

document.querySelector("#link_herunterfahren").onclick = function () {
    raise_blue_screen();
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
/* touchscreens */
document.addEventListener("touchend", function (e) {
    var mouseEvent = new MouseEvent("mouseup", {});
    document.dispatchEvent(mouseEvent);
}, false);
document.addEventListener("touchmove", function (e) {
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    document.dispatchEvent(mouseEvent);
}, false);
/* blue screen */
    function raise_blue_screen() {
    var blue_screen = document.querySelector("#blue_screen_template").content;
    main.innerHTML = ''
    main.appendChild(blue_screen);
}
function start_virus () {
    function add_colored_box () {
        var colored_box = document.createElement('div');
        colored_box.style.cssText = "position: fixed; width: 0.5rem; height: 0.5rem; border-radius: 100%; z-index:1000";
        var pos_top = Math.floor(Math.random()*100).toString() + "%";
        var pos_left = Math.floor(Math.random()*100).toString() + "%";
        colored_box.style.background = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)
        colored_box.style.top = pos_top;
        colored_box.style.left = pos_left;
        main.appendChild(colored_box);
    }
    // main.style.transition = "transform 10s ease-in";
    // main.style.transform = "rotate(360deg)";
    main.style.animation = "shake 0.5s";
    main.style.animationIterationCount = "8";
    var virus = setInterval(add_colored_box, 10);
    setTimeout(function () {
        clearInterval(virus);
        raise_blue_screen();
    }, 4000)
}
var blue_screen_time = Math.floor(Math.random() * 120) * 1000 + 30000;
// console.log(blue_screen_time);
// setTimeout(function() { raise_blue_screen(); }, blue_screen_time);
