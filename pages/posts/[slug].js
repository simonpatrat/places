const Post = (props) => {
  if (!props.post) {
    return <div>Loading...</div>;
  }
  const {
    post: {
      attributes: { title, featuredImage, rating, date, resume },
      html,
    },
  } = props;
  console.log(props);

  return (
    <>
      <article>
        <h1>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <div>{date}</div>
        <div>{resume}</div>
        <div>{rating}</div>
        <div>
          <img src={featuredImage} alt={title} />
        </div>
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
