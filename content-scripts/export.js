browser.storage.local.get().then((result) => {
  document.body.innerHTML = `<code class="json">${JSON.stringify(
    result
  )}</code>`;
});
