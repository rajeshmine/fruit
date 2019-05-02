import React, { PureComponent, Fragment } from 'react';

import * as IonIcons from 'react-icons/io';
import * as FaIcons from 'react-icons/fa';

import 'styles/style.css';

class Card extends PureComponent {
  // componentDidMount(){
  //   console.log(this.props)
  // }
  render() {
    const { prodname, fixprice, offerprice, prodcount, imgsource, offcount } = this.props;
    return (
      <Fragment>
        <div className="text-center">
          <div className="card">
            <img src={imgsource} className="imgsource" id="cardimage" />
           
            <div className="cardcontainerpadding">
              <div className="row text-center">
                <div className="col-md-12">

                  <span className="prodname" id="paragraph2">{prodname}</span>

                </div>

              </div>
              <div className="row text-center rowpadding1">
                <div className="col-md-12">

                  <span id="showrupeecolor" className="fixprice"> <FaIcons.FaRupeeSign /> {fixprice}</span>
                  <span id="hiderupeecolor" className="offerprice"><i class="fa fa-rupee"></i> {offerprice}</span>
                  <span id="gmscolor" className="prodcount"> {prodcount}</span>

                </div>
              </div>
              <div className="row text-center rowpadding1">
                <div className="col-md-12">
                  <button type="button" className="btn btn-default" id="cardbtn1">
                    <IonIcons.IoIosAdd />  <IonIcons.IoMdCart />   </button>
                  <button type="button" className="btn btn-default" id="cardbtn2">   <IonIcons.IoIosAdd />   <IonIcons.IoMdHeart /></button>
                </div>
              </div>

            </div>

          </div>
        </div>

      </Fragment>
    )
  }
}

export default Card;