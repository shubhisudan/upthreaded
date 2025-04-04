let slides = document.querySelectorAll(".slides");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");
let i = 0;
slides[0].classList.add("active");

function activeSlide(n) {
  for (let slide of slides) slide.classList.remove("active");
  slides[n].classList.add("active");
}

next.addEventListener("click", function () {
  if (i == slides.length - 1) {
    i = 0;
    activeSlide(i);
  } else {
    i++;
    activeSlide(i);
  }
});

prev.addEventListener("click", function () {
  if (i == 0) {
    i = slides.length - 1;
    activeSlide(i);
  } else {
    i--;
    activeSlide(i);
  }
});

let menuToggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
menuToggle.onclick = function () {
  menuToggle.classList.toggle("active");
  navigation.classList.toggle("active");
};