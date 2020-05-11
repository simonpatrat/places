import Head from "next/head";
import { Component } from "react";

import Grid from "../components/Grid";
import content from "../content/home.md";

export default class Home extends Component {
  componentDidMount() {}
  render() {
    const {
      html,
      attributes: { title },
    } = content;

    const { allPosts } = this.props;
    const posts = Object.keys(allPosts).map((key) => allPosts[key]);
    const shouldDisplayPostsList = posts && posts.length > 0;
    return (
      <>
        <Head>
          <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
        </Head>

        <article>
          <div
            className="page__content"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {shouldDisplayPostsList && (
            <Grid
              list={posts}
              useImagesLoaded={true}
              withColorPalette
              cols={{
                480: 1,
                768: 1,
                1024: 2,
                1366: 2,
                1920: 2,
                99999: 4,
              }}
              gap={40}
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

  const posts = {};

  function importAll(r) {
    r.keys().forEach((key) => {
      const post = r(key);
      const postSlug = key.substring(2, key.length - 3);
      post.attributes.slug = postSlug;
      posts[postSlug] = post;
    });
  }

  importAll(require.context("../content/posts", true, /\.md$/));

  return {
    props: {
      allPosts: posts,
    },
  };
}
