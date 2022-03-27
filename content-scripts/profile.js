var username = get_username(window.location);

browser.storage.local.set({
  [username]: {
    followers: extract_number(username, "followers"),
    following: extract_number(username, "following"),
  },
});

function get_username(url) {
  return new URL(url).pathname.split("/")[1];
}

function extract_number(username, link_type) {
  return document
    .querySelector(`a[href='/${username}/${link_type}']`)
    .querySelector("span")
    .querySelector("span").innerHTML;
}
