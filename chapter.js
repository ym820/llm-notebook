// Shared by every chapter page: chapter map, node collapse and mastery, math, code highlighting.
// A page sets <body data-chapter="..."> and keeps its own worked-example script inline.
(() => {
  // [title, file]. No file = not written yet.
  const CHAPTERS = [["BPE"], ["Embedding"], ["RMSNorm", "rmsnorm.html"], ["RoPE"], ["Attention", "index.html"], ["SwiGLU"],
    ["Transformer block"], ["Loss"], ["AdamW"], ["Training runs"], ["Decoding"], ["Resource accounting"]];
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelector(".map").innerHTML = `<h2>One sentence through the model</h2><ol>${CHAPTERS.map(([t, f]) =>
    f === here ? `<li class="here" aria-current="page">${t}</li>` : f ? `<li><a href="${f}">${t}</a></li>` : `<li class="todo">${t}</li>`).join("")}</ol>`;

  const $ = id => document.getElementById(id);
  const KEY = "llm-notebook:" + document.body.dataset.chapter;
  let mastered = {};
  try { mastered = JSON.parse(localStorage.getItem(KEY)) || {}; } catch {}
  const nodes = [...document.querySelectorAll(".node")];
  nodes.forEach(() => $("progress").append(document.createElement("i")));
  function setOpen(n, open) {
    n.classList.toggle("closed", !open);
    n.querySelector(".node-toggle").setAttribute("aria-expanded", open);
  }
  function paint() {
    nodes.forEach((n, i) => {
      const m = !!mastered[n.dataset.id];
      n.classList.toggle("mastered", m);
      n.querySelector(".master").textContent = m ? "Mastered" : "Mark mastered";
      $("progress").children[i].classList.toggle("on", m);
    });
    const k = nodes.filter(n => mastered[n.dataset.id]).length;
    $("progressLabel").textContent = `${k} of ${nodes.length} mastered`;
    try { localStorage.setItem(KEY, JSON.stringify(mastered)); } catch {}
  }
  nodes.forEach(n => {
    n.querySelector(".node-toggle").onclick = () => setOpen(n, n.classList.contains("closed"));
    n.querySelector(".master").onclick = () => {
      mastered[n.dataset.id] = !mastered[n.dataset.id];
      setOpen(n, !mastered[n.dataset.id]); paint();
    };
    if (mastered[n.dataset.id]) setOpen(n, false);
  });
  $("masterAll").onclick = () => { nodes.forEach(n => { mastered[n.dataset.id] = true; setOpen(n, false); }); paint(); scrollTo({ top: 0 }); };
  // "Test me first" must open the self-check even if it is collapsed
  document.querySelector('a[href="#check"]').onclick = () => setOpen($("check"), true);
  paint();

  window.addEventListener("DOMContentLoaded", () => {
    renderMathInElement(document.body, { delimiters: [{ left: "$$", right: "$$", display: true }, { left: "\\(", right: "\\)", display: false }] });
    document.querySelectorAll(".cl code").forEach(el => {
      el.innerHTML = hljs.highlight(el.textContent, { language: "python" }).value;
      // hljs leaves call names plain; color identifiers followed by "("
      [...el.childNodes].filter(n => n.nodeType === 3).forEach(n => {
        const span = document.createElement("span");
        span.innerHTML = n.textContent.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]))
          .replace(/([A-Za-z_]\w*)(?=\()/g, '<span class="call">$1</span>');
        n.replaceWith(...span.childNodes);
      });
    });
  });
})();
