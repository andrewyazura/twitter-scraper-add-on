document
  .querySelector("form")
  .addEventListener("submit", () => start_background_script());

document
  .querySelector("button#export")
  .addEventListener("click", () => export_data());

async function start_background_script() {
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
  let background_window = await browser.runtime.getBackgroundPage();
  background_window.main(settings);
}

async function export_data() {
  let tab = await browser.tabs.create({ url: "https://twitter.com" });
  browser.tabs.executeScript(tab.id, {
    file: "/content-scripts/export.js",
  });
}
