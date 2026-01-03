document.addEventListener("DOMContentLoaded", () => {
  // Elements
  let words;
  let caret;
  let typingArea;
  let wpm;
  let accuracy;

  // state
  let wordIdx;
  let charIdx;
  let incorrectCount;
  let startTime;
  let isTyping;
  let correctChar;
  let errorCount;
  let lineHieght;

  // Init
  function init() {
    words = document.getElementsByClassName("word");
    if (words.length > 0) {
      // Elements
      caret = document.getElementById("caret");
      typingArea = document.getElementById("typing-area");
      wpm = document.getElementById("wpm");
      accuracy = document.getElementById("Accuracy");

      // state
      wordIdx = 0;
      charIdx = 0;
      incorrectCount = 0;
      startTime = null;
      isTyping = false;
      correctChar = 0;
      errorCount = 0;
      lineHieght = parseFloat(window.getComputedStyle(typingArea).lineHeight);

      const updateStat = setInterval(() => {
        if (!document.getElementById("home")) {
          clearInterval(updateStat);
          return;
        }
        updateWpm();
        updateAccuracy();
      }, 500);

      words[wordIdx].classList.add("active");
      typingArea.tabIndex = 0;
      typingArea.focus();
      typingArea.removeEventListener("keydown", HandleTyping);
      typingArea.addEventListener("keydown", HandleTyping);
      setTimeout(() => {
        updateCaret();
      }, 100);
      wpm.innerText = 0;
      accuracy.innerText = 100;
    }
  }
  init();

  function HandleTyping(e) {
    if (!isTyping) {
      const isModifier = ["Control", "Alt", "Shift", "Meta", "CapsLock"].includes(e.key);
      if (!isModifier) {
        isTyping = true;
        startTime = new Date().getTime();
      }
    }

    let currWord = words[wordIdx];
    let currChar = currWord.children[charIdx];
    // console.log(
    //   `word idx: ${wordIdx}, char idx: ${charIdx}, active word: ${currWord.innerHTML}, active char: ${currChar.innerHTML}, key pressed: ${e.key}`,
    // );

    // Handle correct characters
    if (currChar && !currChar.classList.contains("incorrect") && e.key === currChar.innerText) {
      currChar.classList.add("correct");
      charIdx++;
      correctChar++;
    }
    // Handle Space
    else if (e.code == "Space") {
      // e.preventDefault(); // Prevent scrolling
      if (charIdx !== 0 && wordIdx + 1 < words.length) {
        if (currChar) {
          errorCount++;
        }
        currWord.classList.remove("active");
        while (charIdx < currWord.children.length) {
          currWord.children[charIdx].classList.add("skipped");
          charIdx++;
        }
        wordIdx++;
        charIdx = 0;
        currWord = words[wordIdx];
        currWord.classList.add("active");
        incorrectCount = 0;
        deleteTopLine();
      }
    }

    // custom Backspace
    else if (e.ctrlKey && e.key === "h") {
      e.preventDefault();
      performBackspace();
    }
    // Handle Backspace
    else if (e.key == "Backspace") {
      const isCtrl = e.ctrlKey;
      // Handle Ctrl+Backspace
      if (isCtrl) {
        if (charIdx === 0) {
          performBackspace();
        }
        let idx = charIdx - 1;
        while (idx >= 0) {
          let char = words[wordIdx].children[idx];
          if (char.classList.contains("incorrect")) {
            char.remove();
            incorrectCount--;
          } else {
            if (char.classList.contains("correct")) correctChar--;
            char.classList.remove("correct", "skipped");
          }
          idx--;
        }
        charIdx = idx + 1;
      } else {
        performBackspace();
      }
    }

    // Handle Wrong keys
    else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      errorCount++;
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
  }

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
  function performBackspace() {
    if (charIdx > 0) {
      charIdx--;
      let currWord = words[wordIdx];
      let prev = currWord.children[charIdx];
      if (prev.classList.contains("incorrect")) {
        prev.remove();
        incorrectCount--;
      } else {
        if (prev.classList.contains("correct")) correctChar--;
        prev.classList.remove("correct");
      }
    } else if (wordIdx > 0) {
      words[wordIdx].classList.remove("active");
      wordIdx--;
      words[wordIdx].classList.add("active");
      charIdx = words[wordIdx].children.length;
      let prev = words[wordIdx].children[charIdx - 1];
      while (prev.classList.contains("skipped")) {
        prev.classList.remove("skipped");
        charIdx--;
        prev = prev.previousSibling;
      }
    }
  }
  function updateWpm() {
    if (!isTyping) return;
    let time = (new Date().getTime() - startTime) / 60000;
    const wpm = document.getElementById("wpm");
    wpm.innerText = Math.floor(correctChar / 5 / time);
  }
  function updateAccuracy() {
    let acc = Math.floor((correctChar / (correctChar + errorCount)) * 100);
    accuracy.innerText = acc >= 0 ? acc : 100;
  }
  function deleteTopLine() {
    firstLine = words[0].offsetTop;
    activeLine = words[wordIdx].offsetTop;
    if (activeLine - firstLine >= 2 * lineHieght) {
      // TODO: Delete all from firstLine
      let wordsToDelete = [];
      let currOffset = firstLine;
      for (let i = 0; currOffset === firstLine; i++) {
        currOffset = words[i + 1].offsetTop;
        wordsToDelete.push(words[i]);
      }
      wordsToDelete.forEach((word) => word.remove());
      wordIdx -= wordsToDelete.length;
    }
  }

  document.addEventListener("htmx:afterSwap", (e) => {
    if (e.detail.target.id === "typing-area" || e.detail.target.id === "result-page") {
      init();
    }
  });
});
