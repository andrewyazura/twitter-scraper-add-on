setTimeout(() => {
  let followers = document
    .querySelector('div[aria-label="Timeline: Followers"]')
    .querySelector("div").children;

  console.log(followers);
}, 5000);
