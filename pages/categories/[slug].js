import Head from "next/head";
import { Component } from "react";
import orderBy from "lodash/orderBy";
import classnames from "classnames";
import slugify from 'slugify';

import Grid from "../../components/Grid";

class Category extends Component {

  componentDidMount() {
    document.documentElement.style.setProperty("--background-color", "");
    document.documentElement.style.setProperty("--text-color", "");
    document.documentElement.style.setProperty("--navmenu-text-color", "");
  }

  loadMorePosts = () => {
    console.log("TODO: Load more posts with offset");
  };

  handleLoadMoreButtonClick = (event) => {
    this.loadMorePosts();
  };

  render() {

    const { allPosts, categories, category } = this.props;

    const postArray = Object.keys(allPosts).map(
      (key) => allPosts[key]
    );

    const filteredPosts =
    postArray.filter((post) => {
            const slugifiedPostCategories = post.attributes.categories
                .map(cat => slugify(
                    cat,
                    { lower: true }
                ));
            return (
                slugifiedPostCategories.includes(category)
            );
          });


    const orderedPosts = orderBy(filteredPosts, ["attributes.date"], ["desc"]);

    const shouldDisplayPostsList = orderedPosts && orderedPosts.length > 0;
    return (
      <>
        <Head>
          <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>

          {/* TODO: catagory in title */}
        </Head>

        <article>
          <div className="page__header">
            <div className="container">
              <div className="row"></div>
            </div>
          </div>


          <div className="container">
            <div className="row">
              {shouldDisplayPostsList && (
                <Grid
                  list={orderedPosts}
                  useImagesLoaded={true}
                  withColorPalette
                  debuggModeInCards={false}
                  cols={{
                    480: 1,
                    768: 2,
                    1024: 2,
                    1366: 3,
                    1440: 3,
                    1680: 3,
                    1880: 3,
                    1920: 4,
                    99999: 4,
                  }}
                ></Grid>
              )}
            </div>
          </div>
        </article>
      </>
    );
  }
}


Category.getInitialProps = async (context) => {

  const {
    query: { slug },
  } = context;

  console.log({slug});

  const posts = await loadPosts();
  const categories = await loadCategories();

  return {
      allPosts: posts,
      categories,
      category: slug,
    };

}

async function loadPosts(nbOfPosts = 0) {
  const posts = {};

  function importAllPosts(r) {
    const postsToLoad = nbOfPosts > 0 ? r.keys().slice(0, nbOfPosts) : r.keys();
    // console.log('Loading ', nbOfPosts, ' posts... of ',r.keys(), ' Posts are: ', postsToLoad);
    postsToLoad.forEach((key) => {
      const post = r(key);

      const postSlug = key.substring(2, key.length - 3);
      post.attributes.slug = postSlug;
      posts[postSlug] = post;
    });
  }
  function importAllPostAdditionalImageData(r) {
    const dataFilesToLoad = nbOfPosts > 0 ? r.keys().slice(0, nbOfPosts) : r.keys();
    dataFilesToLoad.forEach((key) => {
      const jsonFile = r(key);
      const { colors } = jsonFile;
      const palette = colors.map(c => c[0]).slice(0, 5);
      const dominante = palette[0];
      const imageColorsInfo = {
        color: dominante,
        palette,
      };

      // console.log({jsonFile});
      const postSlug = key.substring(2, key.length - 10);
      // console.log({postSlug})
       posts[postSlug] = {
        ...posts[postSlug],
        featuredImageData: {
          ...jsonFile,
          imageColors: imageColorsInfo,
        },
      };
    });
  }

  await importAllPosts(require.context("../../content/posts", true, /\.md$/));
  await importAllPostAdditionalImageData(require.context("../../content/posts", true, /\.json$/));


  return posts;
}

async function loadCategories() {
  const categories = [];

  function importAllCategories(r) {
    const categoriesToLoad = r.keys();

    categoriesToLoad.forEach((key) => {
      const category = r(key);
      const categorySlug = key.substring(2, key.length - 3);
      category.slug = categorySlug;
      categories.push(category);
    });
  }

  await importAllCategories(require.context("../../content/categories", true, /\.md$/));

  return categories;
}

export default Category;