(async () => {
  await wait_for_element("div.css-1dbjc4n.r-1ifxtd0.r-ymttw5.r-ttdzmv");

  let username = get_username(window.location);
  let users = await browser.storage.local.get("users");
  let settings = await browser.storage.local.get("settings");
  const max_size = settings.settings.max_list_size;

  await browser.storage.local.set({
    users: {
      ...users.users,
      [username]: {
        followers: Math.min(max_size, extract_number(username, "followers")),
        following: Math.min(max_size, extract_number(username, "following")),
      },
    },
  });
})();

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

function get_username(url) {
  return new URL(url).pathname.split("/")[1];
}

function extract_number(username, relation_type) {
  try {
    return parseInt(
      document
        .querySelector(`a[href='/${username}/${relation_type}']`)
        .querySelector("span")
        .querySelector("span")
        .innerHTML.replace(/,/g, "")
        .replace(/K/g, "000")
        .replace(/M/g, "000000")
    );
  } catch {
    return -1;
  }
}
