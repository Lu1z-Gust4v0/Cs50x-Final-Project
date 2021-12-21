// dark mode

const toggleTheme = document.querySelector(".dark-mode")
const body = document.querySelector("body")

const currentTheme = localStorage.getItem("theme")

if (currentTheme === "dark"){
  body.classList.toggle("dark")
  toggleTheme.classList.toggle("active")
}

toggleTheme.addEventListener("click", () => {
  toggleTheme.classList.toggle("active")
  body.classList.toggle("dark")

  let theme = "light"
  if (body.classList.contains("dark")) {
    theme = "dark"
  }
  localStorage.setItem("theme", theme)
})

// navbars

const page = document.querySelector("section")
let navbar
let toggle

if (page.id === "index-page") {
  navbar = document.querySelector(".index__nav-bar")
  toggle = document.querySelector(".index__toggle")
} else {
  navbar = document.querySelector(".nav-container")
  toggle = document.querySelector(".toggle")
}

if (toggle) {
  const navToggle = () => {
    toggle.classList.toggle("active")
    navbar.classList.toggle("active")
  }

  toggle.addEventListener("click", navToggle)

  page.addEventListener("click", (e) => {

    let closestNav = e.target.closest("nav")
    let closestToggle = e.target.closest("div.toggle")

    if(closestNav !== null || closestToggle !== null) return

    if (navbar.classList[1] === "active") {
      navToggle()
    }
  })
}

// forms

const patternFormInputs = document.querySelectorAll(".pattern-form-item input")

// add focus class when the input is focused

const addFocusClass = function () {
  let parent = this.parentNode
  parent.classList.add("focus")
}

// remove focus class when the user clicks outside

const removeFocusClass = function () {
  let parent = this.parentNode
  if (this.value == "") {
    parent.classList.remove("focus")
  }
}

patternFormInputs.forEach((input) => {
  input.addEventListener("focus", addFocusClass)
  input.addEventListener("blur", removeFocusClass)
})

// alert message 
const closeAlert = document.querySelector(".close-alert")

if (closeAlert) {
  closeAlert.addEventListener("click", () => {
    let parent = closeAlert.parentNode
    parent.style.display = "none";
  })
}