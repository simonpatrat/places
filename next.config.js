require('dotenv').config();
const glob = require("glob");
const matter = require('gray-matter');
const fs = require('fs').promises;
const path = require('path');
const cloudinary = require('cloudinary').v2;

module.exports = {
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.md$/,
        loader: "frontmatter-markdown-loader",
      },
      {
        test: /\.ya?ml$/,
        type: "json", // Required by Webpack v4
        use: "yaml-loader",
      }
    );
    return config;
  },
  exportPathMap: async function (defaultPathMap) {
    // get all .md files in the posts dir
    const blogPostFiles = glob.sync("content/posts/**/*.md");
    await Promise.all(blogPostFiles.map(async (blogpost) => {
      // console.log({blogpost});
      const blogPostSlug = blogpost.split("/")[2].replace(/ /g, "-").slice(0, -3).trim();
      const content = await (await fs.readFile(blogpost)).toString();
      // console.log({content})
      const jsContent = matter(content);

      const { data: {featuredImage} } = jsContent;
      // console.log(featuredImage);
      const splittedFeaturedImageUrl = featuredImage.split('/');
      const imageFileName = splittedFeaturedImageUrl[splittedFeaturedImageUrl.length - 1]
      const imageId = path.parse(imageFileName).name;
/*       console.log({
        featuredImage,
        imageId
      }); */
      // console.log(Object.keys(cloudinary.api))
      const imageInfo = await cloudinary.api.resource(imageId, { colors: true, exif: true });
      // console.log({ info: imageInfo });
      const imageInfoJSON = JSON.stringify({
        ...imageInfo,
        postSlug: blogPostSlug,
        rate_limit_reset_at: null,
        rate_limit_remaining: null,
      }, null, 2);

      await fs.writeFile(blogpost.replace(/.md$/gi, '.json'), imageInfoJSON);

    }));

    // remove path and extension to leave filename only
    const blogPostSlugs = blogPostFiles.map((file) =>
      file.split("/")[2].replace(/ /g, "-").slice(0, -3).trim()
    );
    const createPathObject = (pathObject, slug) => {
      return {
        ...pathObject,
        [`/posts/${slug}`]: {
          page: "/posts/[slug]",
          query: { slug: slug },
        },
      };
    };
    const blogPostsPathMap = blogPostSlugs.reduce(createPathObject, {});

    return {
      ...defaultPathMap,
      ...blogPostsPathMap,
    };
  },
};
