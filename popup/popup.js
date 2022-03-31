document
  .querySelector("form")
  .addEventListener("submit", start_background_script);

document.querySelector("button#export").addEventListener("click", export_data);

function start_background_script() {
  let settings = {
    relation_degree: parseInt(
      document.querySelector("input#relation-degree").value
    ),
    relation_types: [
      ...document.querySelectorAll("input.relation-type:checked"),
    ].map((input) => input.name),
    overwrite_cache: document.querySelector("input#overwrite-cache").checked,
  };

  // access window object of background.js script and execute main function
  browser.runtime
    .getBackgroundPage()
    .then((background_window) => {
      background_window.main(settings);
    })
    .catch(console.error);
}

function export_data() {
  browser.tabs
    .create({ url: "https://twitter.com" })
    .then((tab) => {
      browser.tabs.executeScript(tab.id, {
        file: "/content-scripts/export.js",
      });
    })
    .catch(console.error);
}
