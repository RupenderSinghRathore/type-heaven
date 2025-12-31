// console.log("hello fucker");

// NOTE: handle backspace
// NOTE: Handle wrong letters

let wordIdx = 0;
let charIdx = 0;
// const letters = document.querySelectorAll(".char");
const words = document.querySelectorAll(".word");
const caret = document.getElementById("caret");

if (words.length > 0) {
  words[wordIdx].classList.add("active");
  updateCaret(); // Move cursor to start
}

document.addEventListener("keydown", (e) => {
  let currWord = words[wordIdx];
  let currChar = currWord.children[charIdx];
  console.log(
    // `word idx: ${wordIdx}, char idx: ${charIdx}, active word: ${currWord.innerHTML}, active char: ${currChar.innerHTML}, key pressed: ${e.key}`,
  );
  if (!currChar.classList.contains("correct") && e.key === currWord.children[charIdx].innerText) {
    currChar.classList.add("correct");
    if (currWord.children[charIdx + 1]) {
      charIdx++;
    }
  } else if (e.code == "Space") {
    if (currChar.classList.contains("correct")) {
      // console.log(`reached here`);
      wordIdx++;
      charIdx = 0;
    }
  }
  // else if (e.ctrlKey && e.key == "Backspace") {
  //   let idx = activeIndex;
  //   if (idx > 0) {
  //     letters[idx].classList.remove("active");
  //     if (letters[idx - 1].classList.contains("space")) {
  //       idx--;
  //     }
  //     while (idx > 0 && !letters[idx - 1].classList.contains("space")) {
  //       idx--;
  //       letters[idx].classList.remove("correct");
  //     }
  //     letters[idx].classList.add("active");
  //     activeIndex = idx;
  //   }
  // } else if (e.key == "Backspace") {
  //   if (activeIndex > 0) {
  //     letters[activeIndex].classList.remove("active");
  //     letters[activeIndex - 1].classList.remove("active");
  //     activeIndex--;
  //   }
  // }
  updateCaret();
});

function updateCaret() {
  const activeChar = words[wordIdx].children[charIdx];
  if (activeChar) {
    // Move the caret to the active span's position
    let left = activeChar.offsetLeft;
    let top = activeChar.offsetTop;
    if (activeChar.classList && activeChar.classList.contains("correct")) {
      // console.log(`left: ${left}, right: ${activeChar.offsetRight}`);
      left += activeChar.offsetWidth;
    }
    caret.style.left = left + "px";
    caret.style.top = top + "px";
    caret.style.opacity = "1";
  }
}
