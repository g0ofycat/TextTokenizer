document.addEventListener("DOMContentLoaded", () => {
  const inputText = document.getElementById("inputText");
  const tokenizeBtn = document.getElementById("tokenizeBtn");
  const outputArea = document.getElementById("outputArea");
  const lowercaseCheckbox = document.getElementById("lowercaseCheckbox");
  const typeSelect = document.getElementById("typeSelect");
  const inputCounters = document.getElementById("inputCounters");
  const tokenCounter = document.getElementById("tokenCounter");

  function updateInputCounters() {
    const text = inputText.value;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const characters = text.length;
    inputCounters.textContent = `Words: ${words} | Characters: ${characters}`;
  }

  tokenizeBtn.addEventListener("click", async () => {
    const text = inputText.value.trim();
    if (!text) {
      outputArea.innerHTML = `<div id="tokenCounter" class="counter">Tokens: 0</div><span>Please enter text to tokenize.</span>`;
      outputArea.classList.add("show");
      return;
    }

    const lowercase = lowercaseCheckbox.checked;
    const type = typeSelect.value;

    tokenizeBtn.classList.add("loading");
    outputArea.innerHTML = `<div id="tokenCounter" class="counter">Tokens: 0</div><span>Tokenizing...</span>`;
    outputArea.classList.add("show");

    try {
      const response = await fetch("https://backendtokenizer.onrender.com/tokenize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          lowercase,
          type,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      outputArea.innerHTML = `<div id="tokenCounter" class="counter">Tokens: 0</div>`;

      if (data.tokens && Array.isArray(data.tokens) && data.tokens.length > 0) {
        let cleanedTokenCount = 0;
        const tokens = data.tokens;
        tokens.forEach((token) => {
          const cleanedToken = token
            .replace(/^@@/, "")
            .replace(/^▁/, "")
            .replace(/^Ġ/, "")
            .trim();

          if (cleanedToken) {
            const tokenElement = document.createElement("span");
            tokenElement.className = "token";
            tokenElement.textContent = cleanedToken;
            outputArea.appendChild(tokenElement);
            cleanedTokenCount++;
          }
        });

        document.getElementById("tokenCounter").textContent = `Tokens: ${cleanedTokenCount}`;
        
      } else {
        outputArea.innerHTML = `<div id="tokenCounter" class="counter">Tokens: 0</div><span>No valid tokens returned.</span>`;
      }
    } catch (error) {
      console.error("Tokenization error:", error);
      outputArea.innerHTML = `<div id="tokenCounter" class="counter">Tokens: 0</div><span>Request failed: ${error.message}</span>`;
    } finally {
      tokenizeBtn.classList.remove("loading");
      outputArea.classList.add("show");
    }
  });

  inputText.addEventListener("input", updateInputCounters);
  updateInputCounters();
});
