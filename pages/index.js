import Head from "next/head";
import { Component } from "react";
import Link from "next/link";

import content from "../content/home.md";

export default class Home extends Component {
  componentDidMount() {
    document.documentElement.style.setProperty("--background-color", "white");
    document.documentElement.style.setProperty("--text-color", "black");
  }

  render() {
    const {
      html,
      attributes: { title },
    } = content;

    const { allPosts } = this.props;
    const posts = Object.keys(allPosts).map((key) => allPosts[key]);

    return (
      <>
        <Head>
          <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
        </Head>
        <article>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </article>
        <ul className="posts-list">
          {posts &&
            posts.length > 0 &&
            posts.map((post, index) => {
              const {
                attributes: { slug, featuredImage },
              } = post;
              return (
                <li className="posts-list__item" key={slug + "#" + index}>
                  <Link href="/posts/[slug]" as={`/posts/${slug}`}>
                    <a>
                      <img
                        className="post-list__item__image"
                        src={featuredImage}
                        crossOrigin="anonymous"
                      />
                      <div className="posts-list__item__overlay">
                        <h3 className="posts-list__item__text">
                          {post.attributes.title}
                        </h3>
                      </div>
                    </a>
                  </Link>
                </li>
              );
            })}
        </ul>
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
