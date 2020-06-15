import Head from "next/head";
import Link from 'next/link';
import { Component } from "react";
import orderBy from "lodash/orderBy";
import classnames from "classnames";
import slugify from 'slugify';

import Grid from "../components/Grid";
import content from "../content/home.md";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postsToDisplay: props.allPosts,
      categories: props.categories,
    };
  }

  handleCategoryFilterSelection = (category) => {
    const { categories } = this.state;

    if (!category) {
      return;
    }
    if (category === "*") {
      this.setState({
        categories: categories.map((cat) => {
          cat.attributes.selected = false;
          return cat;
        }),
      });
    }

    const updatedCategories = [...categories].map((cat, index) => {
      if (cat.attributes.name === category) {
        cat.attributes.selected = !cat.attributes.selected;
      }
      return cat;
    });

    this.setState({
      categories: updatedCategories,
    });
  };

  handleCategoryFilterButtonClick = (event, categoryName) => {
    this.handleCategoryFilterSelection(categoryName);
  };

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
    const {
      html,
      attributes: { title },
    } = content;
    const { postsToDisplay, categories } = this.state;

    const selectedCategories = categories.filter(
      (cat) => cat.attributes.selected
    );
    const postArray = Object.keys(postsToDisplay).map(
      (key) => postsToDisplay[key]
    );
    const filteredPosts =
      selectedCategories.length > 0
        ? postArray.filter((post) => {
            return (
              post.attributes.categories &&
              selectedCategories.some((category) => {
                return post.attributes.categories.includes(
                  category.attributes.name
                );
              })
            );
          })
        : postArray;

    const orderedPosts = orderBy(filteredPosts, ["attributes.date"], ["desc"]);

    const categoriesMenu = categories && categories.length > 0 && (
      <ul className="categories-filters-menu">
        <>
          <li
            className="categories-filters-menu__item"
            key={`category-filters-menu__item#ALL`}
          >
            <button
              type="button"
              className="categories-filters-button"
              onClick={(event) =>
                this.handleCategoryFilterButtonClick(event, "*")
              }
            >
              All
            </button>
          </li>
          {categories.map((category, index) => {
            const { slug, attributes } = category;
            const { name, description, selected } = attributes;
            const categoriesMenuItemClassNames = classnames(
              "categories-filters-menu__item",
              {
                selected,
              }
            );

            return (
              <li
                className={categoriesMenuItemClassNames}
                key={`category-filters-menu__item#${index}#${slug}`}
              >
{/*                 <Link href={`/categories/${slugify(slug, { lower: true })}`}>
                  <a>{name}</a>
                </Link> */}
                <button
                  type="button"
                  className="categories-filters-button"
                  onClick={(event) =>
                    this.handleCategoryFilterButtonClick(event, name)
                  }
                >
                  {name}
                </button>
              </li>
            );
          })}
        </>
      </ul>
    );

    const shouldDisplayPostsList = orderedPosts && orderedPosts.length > 0;
    return (
      <>
        <Head>
          <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
          <title>{title === "Places" ? title : `${title} | Places`}</title>
        </Head>

        <article>
          <div className="page__header">
            <div className="container">
              <div className="row">{categoriesMenu}</div>
            </div>
          </div>

          <div className="page__content">
            <div className="container">
              <div className="row">
                <section dangerouslySetInnerHTML={{ __html: html }} />
              </div>
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

export async function getStaticProps() {
  //get posts & context from folder

  const posts = await loadPosts();
  const categories = await loadCategories();

  return {
    props: {
      allPosts: posts,
      categories,
    },
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

  await importAllPosts(require.context("../content/posts", true, /\.md$/));
  await importAllPostAdditionalImageData(require.context("../content/posts", true, /\.json$/));


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

  await importAllCategories(require.context("../content/categories", true, /\.md$/));

  return categories;
}
