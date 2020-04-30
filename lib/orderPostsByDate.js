export const orderPostsByDate = (posts = {}) => {
  const orderedPostsByDate = Object.keys(posts)
    .map((postKey, index) => {
      const post = posts[postKey];
      return post;
    })
    .sort((a, b) => {
      return a.attributes.date < b.attributes.date
        ? -1
        : a.attributes.date > b.attributes.date
        ? 1
        : 0;
    });
  return orderedPostsByDate;
};
