import React, { PureComponent, Fragment } from 'react';

class DashBox extends PureComponent {

  componentDidMount = async () => {
  }

  redirect = async () => {
    const { id, path, name, data } = this.props;
    if (name === 'ProductDetails') {
      this.props.props.history.push({
        pathname: path,
        state: { id: id },
      })
    } else {
      this.props.props.history.push({
        pathname: path,
        state: { data: data },
      })
    }
  }

  render() {
    const { bgClass, topic, value, status, icon, } = this.props;
    return (
      <Fragment>
        <div className={bgClass} onClick={this.redirect} style={{ cursor: "pointer" }}>
          {icon}
          <p className="sml-title">{topic}</p>
          <p className="price">{value}</p>
          <p className="percent">{status} </p>
        </div>
      </Fragment>
    )
  }
}

export default DashBox;