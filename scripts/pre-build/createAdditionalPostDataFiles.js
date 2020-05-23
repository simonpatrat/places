require('dotenv').config();
const glob = require("glob");
const matter = require('gray-matter');
const fs = require('fs').promises;
const path = require('path');
const cloudinary = require('cloudinary').v2;

async function createAdditionalPostDataFiles() {
    const blogPostFiles = glob.sync("content/posts/**/*.md");
    await Promise.all(blogPostFiles.map((blogpost) => {

      return new Promise(async (resolve, reject) => {

        const blogPostSlug = blogpost.split("/")[2].replace(/ /g, "-").slice(0, -3).trim();
        const content = await (await fs.readFile(blogpost)).toString();
        const jsContent = matter(content);

        const { data: {featuredImage} } = jsContent;
        const splittedFeaturedImageUrl = featuredImage.split('/');
        const imageFileName = splittedFeaturedImageUrl[splittedFeaturedImageUrl.length - 1]
        const imageId = path.parse(imageFileName).name;
        const imageInfo = await cloudinary.api.resource(imageId, { colors: true, exif: true });

        const imageInfoJSON = JSON.stringify({
          ...imageInfo,
          postSlug: blogPostSlug,
          rate_limit_reset_at: null,
          rate_limit_remaining: null,
        }, null, 2);

        const fileName = `${blogpost.replace(/.md$/gi, '_data.json')}`
        await fs.writeFile(fileName, imageInfoJSON);

        resolve(fileName);

      });

    }));
}

module.exports = createAdditionalPostDataFiles;