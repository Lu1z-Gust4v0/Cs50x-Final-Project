// Quiz functionality

const cardList = document.querySelector(".card-list")
const cards = cardList.querySelectorAll(".quiz-card")
const list = document.querySelectorAll(".quiz-card ul")
const prevBtns = document.querySelectorAll(".previous")
const confirmBtns = document.querySelectorAll(".confirm-option")
const startBtn = cardList.querySelector(".start-quiz")
const finishBtn = cardList.querySelector(".finish-quiz")

const cardWidth = cards[0].getBoundingClientRect().width

let startTime
const userAnswers = []

// set cards position
const setCardPosition = (card, index) => {
  card.style.left = `${cardWidth * index}px`
}

cards.forEach(setCardPosition)

const moveToTarget = (currentCard, targetCard) => {
  cardList.style.transform = "translateX(-" + targetCard.style.left + ")"

  currentCard.classList.remove("current-card")
  targetCard.classList.add("current-card")
}

const selectOption = function(e) {
  let targetOption = e.target.closest("li")
  let options = Array.from(this.children)

  options.forEach((option) => {
    option.classList.remove("selected")
  })

  if(!targetOption) return

  targetOption.classList.add("selected")
}

// Change user's last choice

const changeOption = () => {
  userAnswers.pop()
}

const confirmOption = function(_this) {

  // in this case we use the grandparent node because the buttons are in the div element.

  let grandparent = _this.parentNode.parentNode
  let selectedOption = grandparent.querySelector(".selected")

  if (!selectedOption) {
    window.alert("Please, choose an option.")
    return false
  }

  userAnswers.push(selectedOption.classList[1])
  return true
}

list.forEach(item => {
  item.addEventListener("click", selectOption)
})

// Send the results to the server

const postResults = async (score, correct, incorrect, duration) => {
  const data = {
    "score": score,
    "correct": correct,
    "incorrect": incorrect,
    "duration": duration
  }

  let response = await fetch("/quiz", {
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

const getAnswers = fetch("/data")
  .then(response => response.json())
  .then(data => data)
  .catch(error => {
    console.error("Error", error)
  })

// start the quiz time counter

const startQuiz = () => {
  const currentCard = cardList.querySelector(".current-card")
  const nextCard = currentCard.nextElementSibling

  startTime = Date.now()

  moveToTarget(currentCard, nextCard)
}

// it gives the user score and fills the respective areas

const giveScore = async () => {

  const correctAnswers = await getAnswers
  const scoreField = cardList.querySelector(".score")
  const timeField = cardList.querySelector(".time")
  const duration = (Date.now() - startTime) / 1000

  let score = 0
  let correct = 0
  let incorrect = 0

  for (let i = 0; i < correctAnswers.length; i++) {
    if (userAnswers[i] === correctAnswers[i]) {
      score += 100
      correct++
    }
    else if(userAnswers[i] !== correctAnswers[i]) {
      incorrect++
    }
  }

  scoreField.textContent = score
  timeField.textContent = duration

  postResults(score, correct, incorrect, duration)
}

// finish the quiz and display the result

const finishQuiz = () => {
  const currentCard = cardList.querySelector(".current-card")
  const nextCard = currentCard.nextElementSibling

  moveToTarget(currentCard, nextCard)
  giveScore()
}

prevBtns.forEach(button => {
  button.addEventListener("click", (e) => {
    const currentCard = cardList.querySelector(".current-card")
    const previousCard = currentCard.previousElementSibling

    changeOption()
    moveToTarget(currentCard, previousCard)
  })
})

confirmBtns.forEach(button => {
  button.addEventListener("click", (e) => {
    const currentCard = cardList.querySelector(".current-card")
    const nextCard = currentCard.nextElementSibling

    let isConfirmed = confirmOption(e.target)

    if (!isConfirmed) return

    moveToTarget(currentCard, nextCard)
  })
})

startBtn.addEventListener("click", startQuiz)

finishBtn.addEventListener("click", (e) => {
  let isConfirmed = confirmOption(e.target)

  if (!isConfirmed) return

  finishQuiz()
})
