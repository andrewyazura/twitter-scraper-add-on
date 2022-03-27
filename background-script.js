browser.runtime.onConnect.addListener((port) => {
  browser.tabs.remove(port.sender.tab.id);
});

// this function is used by popup.js
function export_current_user_data(settings) {
  browser.tabs
    .query({ currentWindow: true, active: true })
    .then((tabs) => {
      if (settings["overwrite-cache"]) {
        browser.storage.local
          .clear()
          .then(() => {
            export_user_data(tabs[0], settings["connection-types"]);
          })
          .catch(console.error);
      } else {
        export_user_data(tabs[0], settings["connection-types"]);
      }
    })
    .catch(console.error);
}

function export_user_data(user_tab, connection_types) {
  let username = get_url_part(user_tab.url);

  for (const type of connection_types) {
    if (type == "following" || type == "followers") {
      browser.storage.local
        .get(username)
        .then((result) => {
          if (result[username]) return;

          browser.tabs.executeScript(user_tab.id, {
            file: "/content-scripts/profile.js",
          });

          browser.tabs
            .create({ url: get_twitter_url(username, type) })
            .then((tab) => {
              browser.tabs.executeScript(tab.id, {
                file: `/content-scripts/user-lists.js`,
              });
            })
            .catch(console.error);
        })
        .catch(console.error);
    } else if (type == "retweets") {
      console.warn("retweets are not implemented yet");
    } else {
      console.warn("unknown type:", type);
    }
  }
}

function get_url_part(url, index) {
  if (!index) index = 1;
  return new URL(url).pathname.split("/")[index];
}

function get_twitter_url(username, path) {
  return `https://twitter.com/${username}/${path || ""}`;
}
