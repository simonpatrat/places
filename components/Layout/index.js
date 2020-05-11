import React from "react";

class Layout extends React.Component {
  render() {
    const { children } = this.props;

    return (
      <div className="page-layout">
        <div style={{ zIndex: 1 }}>{children}</div>
      </div>
    );
  }
}

export default Layout;
