import Head from "next/head";
import { Component } from "react";
import Link from "next/link";

import content from "../content/home.md";
export default class Home extends Component {
  render() {
    const {
      html,
      attributes: { title, cats },
    } = content;

    const { allPosts } = this.props;
    const posts = Object.keys(allPosts).map((key) => allPosts[key]);

    return (
      <>
        <Head>
          <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
        </Head>
        <article>
          <h1>{title}</h1>
          <div dangerouslySetInnerHTML={{ __html: html }} />
          <ul>
            {cats.map((cat, k) => (
              <li key={k}>
                <h2>{cat.name}</h2>
                <p>{cat.description}</p>
              </li>
            ))}
          </ul>
        </article>
        <ul className="post-list">
          {posts &&
            posts.length > 0 &&
            posts.map((post, index) => {
              const {
                attributes: { slug },
              } = post;
              return (
                <li className="post-list__item" key={slug + "#" + index}>
                  <Link href="/posts/[slug]" as={`/posts/${slug}`}>
                    <a>{post.attributes.title}</a>
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
      const {
        attributes: { slug },
      } = post;
      posts[slug] = post;
    });
  }

  importAll(require.context("../content/posts", true, /\.md$/));

  return {
    props: {
      allPosts: posts,
    },
  };
}
