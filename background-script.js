// this function is used by popup.js
async function main(settings_) {
  // have to make a deep copy of settings_ because it comes from popup.js script
  let settings = JSON.parse(JSON.stringify(settings_));

  if (settings.overwrite_cache) {
    await browser.storage.local.set({
      users: {},
      relations: [],
    });
  }

  await store_current_user_data(settings);
}

async function store_current_user_data(settings) {
  let tabs = await browser.tabs.query({ currentWindow: true, active: true });
  await store_user_data(settings, tabs[0]);
}

async function store_user_data(settings, user_tab) {
  let username = get_url_part(user_tab.url);

  let result = await browser.storage.local.get("users");
  if (result.users?.[username]) return;

  await browser.tabs.executeScript(user_tab.id, {
    file: "/content-scripts/profile.js",
  });

  for (const relation_type of settings.relation_types) {
    if (relation_type == "following" || relation_type == "followers") {
      let tab = await browser.tabs.create({
        url: get_twitter_url(username, relation_type),
      });

      await browser.tabs.executeScript(tab.id, {
        file: "/content-scripts/user-lists.js",
      });

      await browser.tabs.remove(tab.id);
    } else if (relation_type == "retweets") {
      console.warn("retweets are not implemented yet");
    } else {
      console.warn("unknown relation type:", relation_type);
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
