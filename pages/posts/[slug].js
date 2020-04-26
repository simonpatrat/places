const Post = (props) => {
  if (!props.post) {
    return <div>Loading...</div>;
  }
  const {
    post: {
      attributes: { title, thumbnail, rating, date, body },
      html,
    },
  } = props;

  return (
    <>
      <article>
        <h1>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <div>{date}</div>
        <div>{rating}</div>
        <div>{body}</div>
        <div>{thumbnail}</div>
      </article>
    </>
  );
};

Post.getInitialProps = async (ctx) => {
  const {
    query: { slug },
  } = ctx;

  if (slug) {
    const post = await import(`../../content/posts/${slug}.md`);
    return { post };
  }
  return {};
};

export default Post;
