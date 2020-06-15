require("dotenv").config();
const glob = require("glob");

module.exports = {
  webpack: config => {
    config.module.rules.push(
      {
        test: /\.md$/,
        loader: "frontmatter-markdown-loader"
      },
      {
        test: /\.ya?ml$/,
        type: "json", // Required by Webpack v4
        use: "yaml-loader"
      }
    );
    return config;
  },
  exportPathMap: async function(defaultPathMap) {
    // get all .md files in the posts dir
    const blogPostFiles = glob.sync("content/posts/**/*.md");

    // remove path and extension to leave filename only
    const blogPostSlugs = blogPostFiles.map(file =>
      file
        .split("/")[2]
        .replace(/ /g, "-")
        .slice(0, -3)
        .trim()
    );
    const createPathObject = (pathObject, slug) => {
      return {
        ...pathObject,
        [`/posts/${slug}`]: {
          page: "/posts/[slug]",
          query: { slug: slug }
        }
      };
    };
    const blogPostsPathMap = blogPostSlugs.reduce(createPathObject, {});

    const categoriesFiles = glob.sync("content/categories/**/*.md");

    // remove path and extension to leave filename only
    const categoriesSlugs = categoriesFiles.map((file) =>
      file.split("/")[2].replace(/ /g, "-").slice(0, -3).trim()
    );
    const createPathObjectForCategories = (pathObject, slug) => {
      return {
        ...pathObject,
        [`/categories/${slug}`]: {
          page: "/categories/[slug]",
          query: { slug: slug },
        },
      };
    };
    const categoriesPathMap = categoriesSlugs.reduce(createPathObjectForCategories, {});

    return {
      ...defaultPathMap,
      ...blogPostsPathMap,
      ...categoriesPathMap,
    };
  }
};
