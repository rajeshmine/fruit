import React, { PureComponent, Fragment } from 'react'

import logo from 'images/favicon.png';
import 'styles/nav.css';
import { Form } from 'informed';
import SearchField from "react-search-field";
import efv from './../../../images/efv.png';
import * as MdnIcons from 'react-icons/md';
import Modal from 'react-responsive-modal';
import * as IonIcons from 'react-icons/io';
import feedbackimage from '../../../images/newfeedback.svg';
import StarRatingComponent from 'react-star-rating-component';
import { getfeedback, addFeedback } from '../../../service/feedback';
import { Textarea } from "components/common/forms/textarea";


class Feedback extends PureComponent {
  constructor() {
    super();

    this.state = {
      userRating: 0
    };
  }
  onStarClick(nextValue, prevValue, name) {
    console.log(nextValue)
    this.setState({ userRating: nextValue });
    console.log(this.state.userRating)
  }
  state = {
    open: false,
    open1: false

  };
  onOpenModal = () => {
    this.setState({ open: true });
  };
  onCloseModal = () => {
    this.setState({ open: false });
  };
  onOpenModal1 = () => {
    this.setState({ open1: true });
  };
  onCloseModal1 = () => {
    this.setState({ open1: false });
  };



  setFormApi = (formApi) => {
    this.formApi = formApi;
  } 
  onSubmit = async () => {

    let res = ''
    
 
    const data = this.formApi.getState().values;

    console.log(data)
    
    let postData = {
      "userId": data.userId,
      "userRating": "1",
      "comments": data.comments
    }
    // res = await addFeedback(postData)
   console.log(postData)
    res = await addFeedback(postData)
    console.log(res)

    return false;
    // console.log(res)


  }

  handleChange = async ({ currentTarget: Input }) => {
    const { name, value } = Input;
    const { data } = this.state;
    data[name] = value;

    await this.setState({
      [name]: value
    })
  }


  render() {
    const { open } = this.state;
    const { open1 } = this.state;
    const { userRating } = this.state;
    return (
      <Fragment>
        {/* feedback */}
        <div id="mybutton">

          <MdnIcons.MdFeedback class="feedback" onClick={this.onOpenModal} />

        </div>
      
        {/* modal for feedback*/}

        <div>
          {/* <button onClick={this.onOpenModal}>Open modal</button> */}
          <Modal open={open} onClose={this.onCloseModal} center>
            <img

              src={feedbackimage} width={20} height={21}

            /> Feedback


          <Form getApi={this.setFormApi} onSubmit={this.onSubmit}>
              {({ formApi, formState }) => (

                <div>
                  <br />
                  <div class="col-lg-12 col-md-12 col-xs-12">
                    <div class="form-group">
                    <h2>Rating from state: {userRating}</h2>
                      <label>Rating</label>
                      <StarRatingComponent id="starpadding" field="userRating" name="userRating"
                        starCount={5}
                        value={userRating}
                        onStarClick={this.onStarClick.bind(this)}
                        update={(val)=>{this.setState({stars: val})}}
                      />

                      <div class="help-block with-errors"></div>
                    </div>
                  </div>
                  <div class="col-lg-12 col-md-12 col-xs-12">
                    <div class="form-group">
                      <Textarea field="comments" label="Comments" name="comments" rows="3" id="comment" autocomplete="off"
                        maxlength="120" placeholder="Type your comments" />


                      <div class="help-block with-errors"></div>
                    </div>
                  </div>

                  <div id="submitbtnpadding">
                    <button type="submit" id="submitbtn" class="btn btn-common btn-form-submit">Submit</button>
                  </div>


                </div>
              )}
            </Form>
          </Modal>
        </div>







      </Fragment >
    )
  }

}

export default Feedback;

