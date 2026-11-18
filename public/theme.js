// Runs before first paint (render-blocking on purpose) so the page never flashes the wrong theme.
// Kept as a file rather than inline so the Content-Security-Policy can stay script-src 'self'.
try {
  var t = localStorage.getItem("theme");
  if (t === "light" || (!t && matchMedia("(prefers-color-scheme: light)").matches)) {
    document.documentElement.classList.add("light");
    document.querySelector('meta[name="theme-color"]').setAttribute("content", "#f7f7f9");
  }
} catch (e) {}
