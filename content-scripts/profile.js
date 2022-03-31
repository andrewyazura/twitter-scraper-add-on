var username = get_username(window.location);

browser.storage.local.get("users").then((result) => {
  browser.storage.local.set({
    users: {
      ...result.users,
      [username]: {
        followers: extract_number(username, "followers"),
        following: extract_number(username, "following"),
      },
    },
  });
});

function get_username(url) {
  return new URL(url).pathname.split("/")[1];
}

function extract_number(username, relation_type) {
  return document
    .querySelector(`a[href='/${username}/${relation_type}']`)
    .querySelector("span")
    .querySelector("span").innerHTML;
}
