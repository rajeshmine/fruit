import React, { PureComponent, Fragment } from 'react'
import BreadCrumb from 'components/common/forms/BreadCrumb';
import { Row, Col } from 'reactstrap';

import { Form } from 'informed';

import { getJwt } from 'service/authService';

import { Input } from "components/common/forms/Input";
import { Textarea } from "components/common/forms/textarea";
import Joi from 'joi-browser';


import { getProfileDetails, updateProfileDetails } from 'service/profileService'
import 'styles/style.css';

import 'styles/userstyle.css';


class Details extends PureComponent {


	state = {
		data: {}
	}

 	componentDidMount = async() => {
    await this.getUserInfo();
		await	this.profileDetails()
	}

	validateProperty = (name, value) => {
		const schema = Joi.reach(Joi.object(this.schema), name)
		const { error } = Joi.validate(value, schema);
		return error ? error.details[0].message : null;
	};

	schema = {
		userName: Joi.string().required().label("Name"),
		email: Joi.string().required().label("Mail"),
		phone: Joi.string().required().label("Mobile"),
		address1: Joi.string().required().label("Address"),
	};

	handleChange = async ({ currentTarget: Input }) => {
		const { name, value } = Input;
		const { data } = this.state;
		data[name] = value;

		await this.setState({
			[name]: value
		})

	}

	getUserInfo = async () => {
    let res = await getJwt('__info');
    const { uid } = res;
    await this.setState({ uid: uid, userInfo: res });
  }

	onSubmit = async () => {


		const data = this.formApi.getState().values;
		console.log(data)
		const { address1, email, userName, phone } = data
		const {uid} = this.state
		let postData = {
			"address1": address1,
			"city1": "",
			"pincode1": "",
			"address2": "",
			"city2": "",
			"pincode2": "",
			"state2": "",
			"addType2": "",
			"email": email,
			"defaultAddress": "",
			"state1": "",
			"name": userName,
			"secondaryContactNo": "",
			"primaryContactNo": phone,
			"addType1": "",
			"userId": uid
		}
		console.log(postData)
		let res = await updateProfileDetails(postData)
		console.log(res)
		if (res.data.statusCode === 1) {
			alert(res.data.message)
			this.profileDetails()
		}
	}

	setFormApi = (formApi) => {
		this.formApi = formApi;
		console.log(this.formApi)
	}


	async profileDetails() {
		const {uid} = this.state
		let params = `userId=${uid}`
		let res = await getProfileDetails(params)	 
		console.log(res)
		if (res.data.statusCode === 0) {
			await this.setState({ profileData: res.data.data })
			await this.sampleData()
		} else {
			await this.setState({ profileData: [] })
		}
	}

	async sampleData() {
		const { profileData } = this.state
		console.log(profileData)
		if (profileData && profileData.length > 0) {

			this.formApi.setValues(profileData[0])
		}

	}

	render() {
		const { profileData } = this.state
		const breadCrumbItems = {
			title: 'Details',
			items: [
			  { name: 'Profile', active: false, link: '/' },
			  { name: 'Details', active: true },
			]
		  };
		return (
			<Fragment>
 <BreadCrumb data={breadCrumbItems} />
				<div className="container">
					<div className="row">
						<div className="col-md-9 cartcolumnpadding1">
							<h3 id="h3heading10">Account Information</h3>
						</div>
					</div>
				</div>
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							{profileData && profileData.length > 0 &&

								<div className="row">
									<div className="col-md-5">
										<div className="cartwell" >
											<div className="row text-center myprofilerowpadding1     flex-column">
												<i className="fa fa-user-circle-o" id="myprofileimage1"></i>
												<Row>

													<Col sm={1}></Col>
													 
													<Col md={5} sm={12} style={{textAlign:'left'}}>
														<p id="profileparagraph">
															<i className="fa fa-user" id="facoloruser"></i> Name : </p>
															<p id="profileparagraph">
															<i className="fa fa-envelope-o" id="facoloremail"></i> Email : </p>
															<p id="profileparagraph">
															<i className="fa fa-phone" id="facolorcontactno"></i>  Contact No : </p>
															<p id="profileparagraph"><i className="fa fa-map-marker" id="facoloraddress"></i> Address :
												</p>
													</Col>
													<Col md={5} sm={12} style={{textAlign:'left'}} >
													<p id="profileparagraph">{profileData[0].userName}</p>
													<p id="profileparagraph">{profileData[0].email}</p>
													<p id="profileparagraph">{profileData[0].phone}</p>
													<p id="profileparagraph">{profileData[0].address1}</p>
													</Col>
													<Col sm={1}></Col>
													 
												</Row>
											 



											</div>
										</div>
									</div>
									<div className="col-md-7">
										<div className="well cartwell">
											<div className="row text-center">
												<div className="col-md-12 " >
													{/* <img src="/images/userimages/profileimage.jpg" alt="profile logo" className="img-responsive" id="myprofileimage1" /> */}
													<i className="fa fa-user-circle-o" id="myprofileimage1"></i>

												</div>
											</div>
											<div className="row myprofilerowpadding">

												<Form getApi={this.setFormApi} onSubmit={this.onSubmit} style={{ width: '100%', padding: '10px' }}>
													{({ formApi, formState }) => (

														<div >
															<Row>
																<Col md={6} sm={12} >
																	<Input field="userName" label="Name"
																		name="userName" onChange={this.handleImage} validateOnBlur validate={e => this.validateProperty('userName', e)} />
																</Col>
																<Col md={6} sm={12} >
																	<Input field="email" name="email" label="Mail" onChange={this.handleChange} validateOnBlur validate={e => this.validateProperty('email', e)} />
																</Col>
															</Row>
															<Row>

																<Col md={6} sm={12} >

																	<Input field="phone" name="phone" label="Mobile" onChange={this.handleChange} validateOnBlur validate={e => this.validateProperty('phone', e)} />
																</Col>
																 
															</Row>
															<Textarea field="address1" label="Address" name="address1" validateOnBlur validate={e => this.validateProperty('address1', e)} />
															<div className="d-flex justify-content-end">
																<button type="submit" className="btn btn-primary btn-sm">Update</button>
															</div>
														</div>
													)}
												</Form>
											</div>
										</div>
									</div>
								</div>
							}
						</div>
					</div>
				</div>
			</Fragment>
		)
	}
}

export default Details;