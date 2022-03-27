document
  .querySelector("form")
  .addEventListener("submit", start_background_script);

function start_background_script() {
  let settings = {
    "connections-degree": parseInt(
      document.querySelector("input#connections-degree").value
    ),
    "connection-types": [
      ...document.querySelectorAll("input.connection-type:checked"),
    ].map((input) => input.name),
    "overwrite-cache": document.querySelector("input#overwrite-cache").checked,
  };

  // access window object of background.js script and execute export_user_data function
  browser.runtime
    .getBackgroundPage()
    .then((background_window) => {
      background_window.export_current_user_data(settings);
    })
    .catch(console.error);
}
