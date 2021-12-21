const editIcons = document.querySelectorAll("#change-info-btn")
const editImgBtn = document.querySelector("#edit-pic-btn")
const editCard = document.querySelector(".edit-card")
const closeBtn = editCard.querySelector(".cancel")
const imgContainer = editCard.querySelector(".img-container")
const colorContainer = editCard.querySelector(".color-container")
const colorBtns = Array.from(colorContainer.children)
const svgImgs = editCard.querySelectorAll("svg")
const confirmBtn = editCard.querySelector(".confirm")

// Post the change to the database

const postChange = async (elementClass, newContent) => {

  let data = {
    "username": null,
    "email": null,
    "description": null,
    "picture": null
  }

  switch (elementClass) {
    case "user-name":
      data.username = newContent
      break

    case "user-email":
      data.email = newContent
      break

    case "user-description":
      data.description = newContent
      break

    case "edit-card":
      data.picture = newContent
      break

    default:
      console.log("Invalid Class")
  }

  let response = await fetch("/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

const setButtons = (changeProfile, oldContent, grandparentClass) => {
  let buttons = Array.from(changeProfile.children)

  // cancel button
  buttons[0].addEventListener("click", (e) => {
    let grandparent = e.target.parentNode.parentNode
    let pencil = grandparent.querySelector(".pencil")
    let paragraph = grandparent.querySelector("p")

    cancelChange(pencil, paragraph, changeProfile, oldContent)
  })

  // confirm button
  buttons[1].addEventListener("click", (e) => {
    let grandparent = e.target.parentNode.parentNode
    let pencil = grandparent.querySelector(".pencil")
    let paragraph = grandparent.querySelector("p")

    confirmChange(pencil, paragraph, changeProfile, oldContent, grandparentClass)
  })
}

// it confirms the action

const confirmChange = (pencil, paragraph, changeProfile, oldContent, grandparentClass) => {
  let buttons = Array.from(changeProfile.children)
  let newContent = paragraph.textContent

  // prevent users from providing empty strings
  let isSafe = true

  if (newContent === "") {
    paragraph.textContent = oldContent
    window.alert("[Error] invalid input")
    isSafe = false
  }

  buttons.forEach(button => {
    button.removeEventListener
  })

  paragraph.contentEditable = "false"
  changeProfile.classList.remove("active")
  pencil.style.display = "inline-block"

  if (!isSafe) return

  postChange(grandparentClass, newContent.trim())
}

// it cancels the action and returns the paragraph's text to the previous one

const cancelChange = (pencil, paragraph, changeProfile, oldContent) => {
  let buttons = Array.from(changeProfile.children)

  buttons.forEach(button => {
    button.removeEventListener
  })

  paragraph.textContent = oldContent
  paragraph.contentEditable = "false"
  changeProfile.classList.remove("active")
  pencil.style.display = "inline-block"
}

editIcons.forEach(icon => {
  icon.addEventListener("click", (e) => {
    let grandparent = e.target.parentNode.parentNode
    let grandparentClass = grandparent.classList[0] // reference to the grandparent class
    let paragraph = grandparent.querySelector("p")
    let oldContent = paragraph.textContent
    let changeProfile = grandparent.querySelector(".change-profile")

    e.target.style.display = "none";
    paragraph.contentEditable = "true"
    changeProfile.classList.add("active")

    setButtons(changeProfile, oldContent, grandparentClass)
  })
})

// change user picture

const changeUserPicture = (imageSrc, newColor, parentClass) => {
  const currentImg = document.querySelector(".user-picture img")
  const url  = `/static/avatars/${imageSrc}-${newColor}.svg`

  currentImg.src = url
  postChange(parentClass, url)
}

editImgBtn.addEventListener("click", () => {
  editCard.classList.add("active")
})

closeBtn.addEventListener("click", () => {
  editCard.classList.remove("active")
})

imgContainer.addEventListener("click", (e) => {
  let closestImg = e.target.closest("svg")

  if(!closestImg) return

  svgImgs.forEach(svgImg => {
    svgImg.classList.remove("selected")
  })

  closestImg.classList.add("selected")
})

colorContainer.addEventListener("click", (e) => {
  let closestBtn = e.target.closest("button")

  if(!closestBtn) return

  let selectedColor = closestBtn.classList[1]
  let imgColor = svgImgs[0].classList[0]

  if(imgColor === "selected") {
    imgColor = svgImgs[0].classList[1]
  }

  colorBtns.forEach(btn => {
    btn.classList.remove("selected")
  })

  closestBtn.classList.add("selected")

  svgImgs.forEach(svgImg => {
    svgImg.classList.remove(imgColor)
    svgImg.classList.add(selectedColor)
  })
})

confirmBtn.addEventListener("click", (e) => {
  let selectedbtn = editCard.querySelector("button.selected")

  if(!selectedbtn) {
    window.alert("Please, select an option.")
    return
  }

  let selectedSvg = editCard.querySelector("svg.selected")
  let selectedColor = selectedbtn.classList[1]
  let parentClass = e.target.parentNode.classList[0]

  changeUserPicture(selectedSvg.textContent, selectedColor, parentClass)
  editCard.classList.remove("active")
})