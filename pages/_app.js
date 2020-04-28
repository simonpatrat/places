import Head from 'next/head';
// import App, { AppContext } from "next/app"
// import { AppType, AppContextType } from "next/dist/next-server/lib/utils"
import NavMenu from "../components/NavMenu";
// import { AppContextType } from "next/dist/next-server/lib/utils"

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
  const pageTitle = `${post ? post.attributes.title + ' | ': ''}Places`;
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} key="title" />
      </Head>

      <NavMenu />
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
