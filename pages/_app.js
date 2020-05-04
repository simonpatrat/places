import Head from "next/head";
// import App, { AppContext } from "next/app"
// import { AppType, AppContextType } from "next/dist/next-server/lib/utils"
import NavMenu from "../components/NavMenu";
// import { AppContextType } from "next/dist/next-server/lib/utils"
import "../styles/global.scss";

const MyApp = (props) => {
  // Only uncomment this method if you have blocking data requirements for
  // every single page in your application. This disables the ability to
  // perform automatic static optimization, causing every page in your app to
  // be server-side rendered.
  //
  // static async getInitialProps(appContext) {
  //   // calls page's `getInitialProps` and fills `appProps.pageProps`
  //   const appProps = await App.getInitialProps(appContext);
  //
  //   return { ...appProps }
  // }

  const { Component, pageProps } = props;
  const { post } = pageProps;
  const pageTitle = `${post ? post.attributes.title + " | " : ""}Places`;
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} key="title" />
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <NavMenu />
      <div className="layout">
        <Component {...pageProps} />
      </div>
    </>
  );
};

export default MyApp;
