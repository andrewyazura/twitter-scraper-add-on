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

  for (let i = 0; i < settings.relation_degree; ++i) {
    await store_empty_users_data(settings);
  }
}

async function store_current_user_data(settings) {
  let tabs = await browser.tabs.query({ currentWindow: true, active: true });
  await store_user_data(settings, get_url_part(tabs[0].url), tabs[0].id);
}

async function store_empty_users_data(settings) {
  let empty_users = await get_empty_users();

  for (const username of empty_users) {
    let tab = await browser.tabs.create({ url: get_twitter_url(username) });
    await store_user_data(settings, username, tab.id);
    await browser.tabs.remove(tab.id);
  }
}

async function get_empty_users() {
  let users = (await browser.storage.local.get("users")).users;
  let empty_users = [];

  for (const key in users) {
    if (Object.keys(users[key]).length == 0) {
      empty_users.push(key);
    }
  }

  return empty_users;
}

async function store_user_data(settings, username, tab_id) {
  let users = await browser.storage.local.get("users");
  let user_data = users.users[username];
  if (user_data && Object.keys(user_data).length != 0) {
    return;
  }

  await browser.tabs.executeScript(tab_id, {
    file: "/content-scripts/profile.js",
  });

  await Promise.all([
    get_promise(settings, username, "following"),
    get_promise(settings, username, "followers"),
  ]);
}

function get_url_part(url, index) {
  if (!index) index = 1;
  return new URL(url).pathname.split("/")[index];
}

function get_twitter_url(username, path) {
  return `https://twitter.com/${username}/${path || ""}`;
}

function get_promise(settings, username, type) {
  return settings.relation_types.includes(type)
    ? parse_user_list(username, type)
    : Promise.resolve();
}

async function parse_user_list(username, relation_type) {
  let tab = await browser.tabs.create({
    url: get_twitter_url(username, relation_type),
  });

  await browser.tabs.executeScript(tab.id, {
    file: "/content-scripts/user-lists.js",
  });

  await browser.tabs.remove(tab.id);
}
