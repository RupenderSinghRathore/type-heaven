document.addEventListener("DOMContentLoaded", () => {
  // state
  let wordIdx = 0;
  let charIdx = 0;
  let incorrectCount = 0;

  // Elements
  const words = document.querySelectorAll(".word");
  const caret = document.getElementById("caret");
  const typingArea = document.getElementById("typing-area");

  // Init
  if (words.length > 0) {
    words[wordIdx].classList.add("active");
    typingArea.tabIndex = 0;
    typingArea.focus();
    updateCaret();
  }

  typingArea.addEventListener("keydown", (e) => {
    let currWord = words[wordIdx];
    let currChar = currWord.children[charIdx];
    // console.log(
    //   `word idx: ${wordIdx}, char idx: ${charIdx}, active word: ${currWord.innerHTML}, active char: ${currChar.innerHTML}, key pressed: ${e.key}`,
    // );

    // Handle correct characters
    if (currChar && !currChar.classList.contains("incorrect") && e.key === currChar.innerText) {
      currChar.classList.add("correct");
      charIdx++;
    }
    // Handle Space
    else if (e.code == "Space") {
      // e.preventDefault(); // Prevent scrolling
      if (!currChar) {
        currWord.classList.remove("active");
        wordIdx++;
        if (wordIdx < words.length) {
          words[wordIdx].classList.add("active");
        }
        charIdx = 0;
      }
    } else if (e.key == "Backspace") {
      const isCtrl = e.ctrlKey;
      const performBackspace = () => {
        if (charIdx > 0) {
          charIdx--;
          let prev = currWord.children[charIdx];
          if (prev.classList.contains("incorrect")) {
            prev.remove();
            incorrectCount--;
          } else {
            currWord.children[charIdx].classList.remove("correct");
          }
        } else if (wordIdx > 0) {
          words[wordIdx].classList.remove("active");
          wordIdx--;
          words[wordIdx].classList.add("active");
          charIdx = words[wordIdx].children.length;
        }
      };

      // Handle Ctrl+Backspace
      if (isCtrl) {
        if (charIdx === 0) {
          performBackspace();
        }
        let idx = charIdx - 1;
        while (idx > 0) {
          let char = words[wordIdx].children[idx];
          if (char.classList.contains("incorrect")) {
            char.remove();
            incorrectCount--;
          } else {
            char.classList.remove("correct");
          }
          idx--;
        }
        charIdx = idx;
      } else {
        performBackspace();
      }
    }

    // Handle Wrong keys
    else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (incorrectCount < 5) {
        const newChar = document.createElement("span");
        newChar.innerText = e.key;
        newChar.classList.add("char", "incorrect");

        if (currChar) currChar.before(newChar);
        else currWord.appendChild(newChar);

        charIdx++;
        incorrectCount++;
      }
    }
    updateCaret();
  });

  function updateCaret() {
    const activeChar = words[wordIdx].children[charIdx];
    let left, top;
    if (activeChar) {
      left = activeChar.offsetLeft;
      top = activeChar.offsetTop;
    } else {
      let prevChar = words[wordIdx].children[charIdx - 1];
      left = prevChar.offsetLeft + prevChar.offsetWidth;
      top = prevChar.offsetTop;
    }
    caret.style.transform = `translate(${left}px, ${top}px)`;
    // caret.style.opacity = "1";
  }
});
