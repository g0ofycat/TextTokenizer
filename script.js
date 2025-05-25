document.addEventListener("DOMContentLoaded", () => {
  const inputText = document.getElementById("inputText");
  const tokenizeBtn = document.getElementById("tokenizeBtn");
  const outputArea = document.getElementById("outputArea");

  const lowercaseCheckbox = document.getElementById("lowercaseCheckbox");
  const typeSelect = document.getElementById("typeSelect");

  tokenizeBtn.addEventListener("click", async () => {
    const text = inputText.value.trim();
    if (!text) return;

    const lowercase = lowercaseCheckbox.checked;
    const type = typeSelect.value;

    tokenizeBtn.classList.add("loading");
    outputArea.innerHTML = "<span>Tokenizing...</span>";
    outputArea.classList.add("show");

    try {
      const response = await fetch(
        "https://backendtokenizer.onrender.com/tokenize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            lowercase,
            type,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      outputArea.innerHTML = "";

      if (data.tokens && Array.isArray(data.tokens)) {
        data.tokens.forEach((token) => {
          const cleanedToken = token
            .replace(/^@@/, "")
            .replace(/^▁/, "")
            .replace(/^Ġ/, "");

          if (cleanedToken.trim() !== "") {
            const tokenElement = document.createElement("span");
            tokenElement.className = "token";
            tokenElement.textContent = cleanedToken;
            outputArea.appendChild(tokenElement);
          }
        });
      } else {
        outputArea.innerHTML = "<span>Error: No tokens returned.</span>";
      }
    } catch (error) {
      console.error("Full error:", error);
      outputArea.innerHTML = `<span>Request failed: ${error.message}</span>`;
    } finally {
      tokenizeBtn.classList.remove("loading");
      outputArea.classList.add("show");
    }
  });
});
