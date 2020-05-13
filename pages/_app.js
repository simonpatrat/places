import React from "react";
import Head from "next/head";
// import App, { AppContext } from "next/app"
// import { AppType, AppContextType } from "next/dist/next-server/lib/utils"
import NavMenu from "../components/NavMenu";
// import { AppContextType } from "next/dist/next-server/lib/utils"
import "../styles/global.scss";

import ThemeContext from "../components/ThemeContext";
import Theme from "../components/Theme";
import Layout from "../components/Layout";

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
      <Theme>
        <Head>
          <title>{pageTitle}</title>
          <meta property="og:title" content={pageTitle} key="title" />
          <link
            href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700&display=swap"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css"
          ></link>
          <script src="https://unpkg.com/leaflet@1.0.2/dist/leaflet.js"></script>
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.0.2/dist/leaflet.css"
          />
        </Head>

        <ThemeContext.Consumer>
          {(value) => (
            <Layout {...value}>
              <NavMenu {...value} />
              <div className="page">
                <Component {...pageProps} {...value} />
              </div>
            </Layout>
          )}
        </ThemeContext.Consumer>
      </Theme>
    </>
  );
};

export default MyApp;
