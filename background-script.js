browser.runtime.onConnect.addListener((port) => {
  browser.tabs.remove(port.sender.tab.id);
});

// this function is used by popup.js
function main(settings_) {
  // have to make a deep copy of settings_ because it comes from popup.js script
  let settings = JSON.parse(JSON.stringify(settings_));

  if (settings.overwrite_cache) {
    browser.storage.local
      .set({
        users: {},
        relations: [],
      })
      .then(() => {
        store_current_user_data(settings);
      })
      .catch(console.error);
  } else {
    store_current_user_data(settings);
  }
}

function store_current_user_data(settings) {
  browser.tabs
    .query({ currentWindow: true, active: true })
    .then((tabs) => {
      store_user_data(settings, tabs[0]);
    })
    .catch(console.error);
}

function store_user_data(settings, user_tab) {
  let username = get_url_part(user_tab.url);

  browser.storage.local
    .get("users")
    .then((result) => {
      if (result.users?.[username]) return;

      browser.tabs.executeScript(user_tab.id, {
        file: "/content-scripts/profile.js",
      });

      for (const relation_type of settings.relation_types) {
        if (relation_type == "following" || relation_type == "followers") {
          browser.tabs
            .create({ url: get_twitter_url(username, relation_type) })
            .then((tab) => {
              browser.tabs.executeScript(tab.id, {
                file: "/content-scripts/user-lists.js",
              });
            })
            .catch(console.error);
        } else if (relation_type == "retweets") {
          console.warn("retweets are not implemented yet");
        } else {
          console.warn("unknown relation type:", relation_type);
        }
      }
    })
    .catch(console.error);
}

function get_url_part(url, index) {
  if (!index) index = 1;
  return new URL(url).pathname.split("/")[index];
}

function get_twitter_url(username, path) {
  return `https://twitter.com/${username}/${path || ""}`;
}
