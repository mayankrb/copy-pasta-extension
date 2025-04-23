
(function () {
  const existing = document.getElementById("job-snippet-panel");
  if (existing) {
    existing.remove();
    return;
  }

  const panel = document.createElement("div");
  panel.id = "job-snippet-panel";
  panel.className = "snippet-panel";
  panel.style.top = "80px";
  panel.style.left = "calc(100vw - 360px)";
  panel.style.position = "fixed";

  const header = document.createElement("div");
  header.className = "snippet-header";
  header.style.cursor = "move";

  const title = document.createElement("span");
  title.textContent = "📋 Snippets";

  const switchWrapper = document.createElement("div");
  switchWrapper.className = "switch-wrapper";
  switchWrapper.innerHTML = `
    <label class="switch">
      <input type="checkbox" id="theme-toggle" />
      <span class="slider"></span>
    </label>
  `;

  header.appendChild(title);
  header.appendChild(switchWrapper);
  panel.appendChild(header);

  const titleInput = document.createElement("input");
  titleInput.id = "title-input";
  titleInput.placeholder = "e.g. LinkedIn";

  const snippetInput = document.createElement("textarea");
  snippetInput.id = "snippet-input";
  snippetInput.placeholder = "Enter snippet text...";

  const saveBtn = document.createElement("button");
  saveBtn.id = "save-snippet";
  saveBtn.textContent = "Add Snippet";

  const searchInput = document.createElement("input");
  searchInput.id = "search-input";
  searchInput.placeholder = "🔍 Search snippets...";

  const container = document.createElement("div");
  container.id = "snippets-container";

  [titleInput, snippetInput, saveBtn, searchInput, container].forEach(el => panel.appendChild(el));

  const style = document.createElement("style");
style.textContent = `
  .snippet-panel {
    position: fixed;
    top: 80px;
    left: calc(100vw - 300px);
    width: 260px;
    background: #fff;
    color: #000;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
    padding: 15px;
    z-index: 100000;
    font-family: 'Segoe UI', sans-serif;
  }
  .snippet-panel.dark {
  background: rgba(30, 30, 30, 0.95);
  color: #f1f1f1;
  border: 1px solid #555;
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(6px);
}
.snippet-panel.dark input,
.snippet-panel.dark textarea {
  background-color: #2b2b2b;
  color: #f1f1f1;
  border: 1px solid #555;
}
  .snippet-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    font-weight: bold;
    cursor: move;
  }
  .switch-wrapper {
    display: flex;
    align-items: center;
  }
  #title-input, #snippet-input, #search-input {
    width: 100%;
    padding: 6px;
    margin-bottom: 8px;
    border-radius: 5px;
    font-size: 12px;
    border: 1px solid #ccc;
  }
  #save-snippet {
    width: 100%;
    padding: 6px;
    font-size: 12px;
    background: #1976d2;
    color: #fff;
    border: none;
    border-radius: 5px;
    margin-bottom: 10px;
    cursor: pointer;
  }
#snippets-container {
  max-height: 240px;
  overflow-y: auto;
  padding-right: 4px;
}
  .snippet-card {
    background: inherit;
    border: 1px solid #444;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
  }
  .snippet-title {
    font-weight: bold;
    font-size: 12px;
    margin-bottom: 5px;
  }
  .snippet-body {
    font-size: 11px;
    margin-bottom: 10px;
  }
  .btns {
    display: flex;
    justify-content: space-between;
  }
  .btns button {
    padding: 4px;
    border: none;
    font-size: 11px;
    border-radius: 5px;
    cursor: pointer;
    color: #fff;
    flex: 1;
    margin-right: 5px;
  }
  .btns button:last-child {
    margin-right: 0;
  }
  .copy-btn { background: #4caf50; }
  .edit-btn { background: #2196f3; }
  .delete-btn { background: #f44336; }

  .switch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
  }
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 20px;
  }
  .slider:before {
    position: absolute;
    content: "";
    height: 14px;
    width: 14px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  input:checked + .slider {
    background-color: #2196f3;
  }
  input:checked + .slider:before {
    transform: translateX(20px);
  }
`;
document.head.appendChild(style);
  document.body.appendChild(panel);

  const toggle = panel.querySelector("#theme-toggle");

  function loadSnippets(filter = "") {
    chrome.storage.local.get("floatingSnippets", (result) => {
      const snippets = result.floatingSnippets || [];
      container.innerHTML = "";
      snippets.forEach(({ title, text }, index) => {
        if (
          title.toLowerCase().includes(filter.toLowerCase()) ||
          text.toLowerCase().includes(filter.toLowerCase())
        ) {
          const card = document.createElement("div");
          card.className = "snippet-card";

          const titleEl = document.createElement("div");
          titleEl.className = "snippet-title";
          titleEl.textContent = title;

          const bodyEl = document.createElement("div");
          bodyEl.className = "snippet-body";
          bodyEl.textContent = text.length > 100 ? text.substring(0, 100) + "..." : text;

          const btns = document.createElement("div");
          btns.className = "btns";

          const copyBtn = document.createElement("button");
          copyBtn.className = "copy-btn";
          copyBtn.textContent = "Copy";
          copyBtn.onclick = () => navigator.clipboard.writeText(text);

          const editBtn = document.createElement("button");
          editBtn.className = "edit-btn";
          editBtn.textContent = "Edit";
          editBtn.onclick = () => {
            titleInput.value = title;
            snippetInput.value = text;
            snippets.splice(index, 1);
            chrome.storage.local.set({ floatingSnippets: snippets });
            loadSnippets(searchInput.value);
          };

          const deleteBtn = document.createElement("button");
          deleteBtn.className = "delete-btn";
          deleteBtn.textContent = "Delete";
          deleteBtn.onclick = () => {
            snippets.splice(index, 1);
            chrome.storage.local.set({ floatingSnippets: snippets });
            loadSnippets(searchInput.value);
          };

          [copyBtn, editBtn, deleteBtn].forEach(btn => btns.appendChild(btn));
          [titleEl, bodyEl, btns].forEach(el => card.appendChild(el));
          container.appendChild(card);
        }
      });
    });
  }

  saveBtn.onclick = () => {
    const title = titleInput.value.trim();
    const text = snippetInput.value.trim();
    if (!title || !text) return;
    chrome.storage.local.get("floatingSnippets", (result) => {
      const snippets = result.floatingSnippets || [];
      snippets.push({ title, text });
      chrome.storage.local.set({ floatingSnippets: snippets }, () => {
        titleInput.value = "";
        snippetInput.value = "";
        loadSnippets(searchInput.value);
      });
    });
  };

  searchInput.oninput = () => loadSnippets(searchInput.value);

  toggle.onchange = () => {
    const dark = toggle.checked;
    panel.classList.toggle("dark", dark);
    chrome.storage.local.set({ panelThemeDark: dark });
  };

  chrome.storage.local.get("panelThemeDark", (result) => {
    const dark = result.panelThemeDark || false;
    toggle.checked = dark;
    if (dark) panel.classList.add("dark");
  });

  loadSnippets();

  // DRAG
  let offsetX = 0, offsetY = 0, isDragging = false;
  header.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - panel.offsetLeft;
    offsetY = e.clientY - panel.offsetTop;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  function onMouseMove(e) {
    if (!isDragging) return;
    panel.style.left = (e.clientX - offsetX) + "px";
    panel.style.top = (e.clientY - offsetY) + "px";
  }

  function onMouseUp() {
    isDragging = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }
})();
