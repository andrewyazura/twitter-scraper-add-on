var relation_type = get_url_part(window.location, 2);
var username = get_url_part(window.location);

(async () => {
  let users = await browser.storage.local.get("users");
  let count = users.users[username][relation_type];

  await wait_for_element("section.css-1dbjc4n");

  // promise is required to wait for the interval to finish
  await new Promise((resolve) => {
    let usernames = new Set();

    let interval = setInterval(async () => {
      let user_elements = document
        .querySelector("section.css-1dbjc4n")
        .querySelector("div.css-1dbjc4n")
        .querySelector("div").children;

      for (const element of user_elements) {
        let link = element.querySelector("a");
        if (!link) continue;

        usernames.add(get_url_part(link.href));
      }

      window.scrollTo(0, document.body.scrollHeight);

      if (usernames.size >= count) {
        clearInterval(interval);
        await store_connections(usernames);
        resolve(); // resolve promise when interval is cleared
      }
    }, 1000);
  });
})();

function get_url_part(url, index) {
  if (!index) index = 1;
  return new URL(url).pathname.split("/")[index];
}

function wait_for_element(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

async function store_connections(usernames_) {
  let usernames = Array.from(usernames_);

  let new_connections = usernames.map((element) => {
    if (relation_type == "followers") {
      return { source: element, target: username };
    } else if (relation_type == "following") {
      return { source: username, target: element };
    }
  });

  let new_users = Object.fromEntries(
    usernames.map((element) => {
      return [element, {}];
    })
  );

  let relations = await browser.storage.local.get("relations");
  await browser.storage.local.set({
    relations: [...relations.relations, ...new_connections],
  });

  let users = await browser.storage.local.get("users");
  await browser.storage.local.set({
    users: {
      ...new_users,
      ...users.users, // existing nodes should overwrite new ones
    },
  });
}
