// Initial scroll so we dont break the speech text stuff at the bottom
window.scrollTo(0, 0);

// Custom defines

Array.prototype.random = function () {
  return this[this.length * Math.random() | 0];
}

// Random title splash text
let splashes = [
  "i make cool things for fun :D",
  "download geyserextras!!!",
  "download client side sounds for 1.8.9!",
  "play blue house bundle!!!",
  "welcome!",
  "im pretty cool i think",
  "this title is not inspired by minecraft at all!",
  "click to change splash!",
  "GE v2.0.0 coming soon!",
  "site written with html/css/javascript!",
  "site hosted by github pages!",
  "new rec room video coming 2096!",
  //"did you know that this text is so long that it gets cut off?\nbut its ok, because you can scroll\nscroll\nscroll\nscroll\nscroll\nscroll\nscroll\nscroll\nscroll\nscroll\nscroll\nscroll\nscroll\nscroll\nscroll\nscroll\nscroll\nscroll\nscroll\nscroll\nscroll\nscroll\nscroll\nscroll\nscroll\nscroll\nscroll\nscroll\nscroll",
  "not optimized for mobile!",
  "null",
  "Task #999 for GeyserExtras generated an exception",
  "it is currently %time% for me!",
  "right click me to spin once and then never again!"
];

function changeSplash() {
  let splash = splashes.random();
  if (splash.includes("%time%")) {
    let time = new Date(new Date().getTime() + 8 * 3600 * 1000).toUTCString().replace(/ GMT$/, "")
    splash = splash.replace("%time%", time)
  }
  document.getElementById("splash").innerText = splash;
}
changeSplash();


function spinSplash(ev) {
  ev.preventDefault();
  document.getElementById("splash").classList.add("spin");
  return false;
}


// lga speech
const callback = function (entries) {
  entries.forEach(entry => {
    entry.target.classList.toggle("is-visible");
  });
};

const observer = new IntersectionObserver(callback);

const targets = document.querySelectorAll(".show-on-scroll");
targets.forEach(function (target) {
  observer.observe(target);
});

// Frame stuff

document.getElementById("fullscreen").addEventListener("click", (ev) => {
  document.getElementById("frame").requestFullscreen();
})

function openFrameGUI(url) {
  document.body.style.overflow = "hidden";
  let frame = document.createElement("iframe");
  frame.id = "frame";
  frame.src = url;
  let container = document.getElementById("frame-container");
  container.style.display = "block";
  container.appendChild(frame);
}

function deleteFrameGUI() {
  document.body.style.overflow = "auto";
  document.getElementById("frame").remove();
  document.getElementById("frame-container").style.display = "none";
}

function openInNewTabGUI() {
  window.open(document.getElementById("frame").src, "_blank")
}

function frameReload() {
  document.getElementById("frame").src += "";
}