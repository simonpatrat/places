import Head from "next/head";
import { Component } from "react";
import orderBy from "lodash/orderBy";
import classnames from 'classnames';

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
    if (category === '*') {
      this.setState({
        categories: categories.map(cat => {
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

  }

  handleCategoryFilterButtonClick = (event, categoryName) => {
    this.handleCategoryFilterSelection(categoryName);
  }

  componentDidMount() {}

  loadMorePosts = () => {
    console.log('TODO: Load more posts with offset');
  }

  handleLoadMoreButtonClick = (event) => {
    this.loadMorePosts();
  }

  render() {
    const {
      html,
      attributes: { title },
    } = content;
    const { postsToDisplay, categories } = this.state;

    const selectedCategories = categories.filter(cat => cat.attributes.selected);
    const postArray = Object.keys(postsToDisplay).map((key) => postsToDisplay[key]);
    const filteredPosts = selectedCategories.length > 0 ? postArray.filter((post) => {
        return post.attributes.categories && selectedCategories.some(category => {

          return post.attributes.categories.includes(
            category.attributes.name
          );
        });
    }) : postArray;

    const orderedPosts = orderBy(
      filteredPosts,
      ["attributes.date"],
      ["desc"]
    );

    const categoriesMenu = categories && categories.length > 0 && (
      <ul className="categories-filters-menu">
          <>
            <li className="categories-filters-menu__item" key={`category-filters-menu__item#ALL`}>
                <button
                  type="button"
                  className="categories-filters-button"
                  onClick={(event) => this.handleCategoryFilterButtonClick(event, '*')}
                >
                  All
                </button>
            </li>
            {
              categories.map((category, index) => {
                const {
                  slug,
                  attributes,
                } = category;
                const { name, description, selected } = attributes;
                const categoriesMenuItemClassNames = classnames('categories-filters-menu__item', {
                  selected
                })

                return (
                  <li className={categoriesMenuItemClassNames} key={`category-filters-menu__item#${index}#${slug}`}>
                      <button
                        type="button"
                        className="categories-filters-button"
                        onClick={(event) => this.handleCategoryFilterButtonClick(event, name)}
                      >
                        {name}
                      </button>
                  </li>
                )
              })
            }
          </>
      </ul>
    );

    const shouldDisplayPostsList = orderedPosts && orderedPosts.length > 0;
    return (
      <>
        <Head>
          <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
        </Head>

        <article>
          <div className="page__header">
            {categoriesMenu}
          </div>
          <div
            className="page__content"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {shouldDisplayPostsList && (
            <Grid
              list={orderedPosts}
              useImagesLoaded={true}
              withColorPalette
              cols={{
                480: 1,
                768: 1,
                1024: 2,
                1366: 2,
                1440: 3,
                1920: 3,
                99999: 4,
              }}
              gap={100}
              debuggModeInCards={false}
            ></Grid>
          )}
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


  function importAll(r) {
    const postsToLoad = nbOfPosts > 0 ? r.keys().slice(0, nbOfPosts) : r.keys();
    // console.log('Loading ', nbOfPosts, ' posts... of ',r.keys(), ' Posts are: ', postsToLoad);
    postsToLoad.forEach((key) => {
      const post = r(key);
      const postSlug = key.substring(2, key.length - 3);
      post.attributes.slug = postSlug;
      posts[postSlug] = post;
    });
  }

  await importAll(require.context("../content/posts", true, /\.md$/));

  return posts;
}

async function loadCategories() {
  const categories = [];

  function importAll(r) {
    const categoriesToLoad = r.keys();
    console.log('categoriesToLoad: ', categoriesToLoad)
    categoriesToLoad.forEach((key,) => {
      const category = r(key);
      const categorySlug = key.substring(2, key.length - 3);
      category.slug = categorySlug;
      categories.push(category);
    });
  }

  await importAll(require.context("../content/categories", true, /\.md$/));

  return categories;
}
