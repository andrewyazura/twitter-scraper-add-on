(async () => {
  let result = await browser.storage.local.get();
  document.body.innerHTML = `<code class="json">${JSON.stringify(
    result
  )}</code>`;
})();
