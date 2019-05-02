import Joi from 'joi-browser';
import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'reactstrap'
import { Form } from 'informed';
import { post } from 'axios';
import { getJwt } from 'service/authService';
import BreadCrumb from 'components/common/forms/BreadCrumb';
import { Input } from "components/common/forms/Input";
import { CustomSelect } from "components/common/forms/custom-select";
import { addBanners, updateBanners } from 'service/bannerService';
import { apiUrl } from "./../../../config.json";
import 'styles/forms.css';
import img1 from 'images/2.svg';
import ReactNotification from "react-notifications-component";

class AddBanner extends PureComponent {

	constructor(props) {
		super(props)
		this.notificationDOMRef = React.createRef();
	}

	state = {
		data: {},
		editVal: false,
		Status: [{ id: "A", name: "Active" }, { id: "D", name: "InActive" }]
	}

	validateProperty = (name, value) => {
		const schema = Joi.reach(Joi.object(this.schema), name)
		const { error } = Joi.validate(value, schema);
		return error ? error.details[0].message : null;
	};

	schema = {
		imgUrl: Joi.string().required().label("Banner Image"),
		imageDescription: Joi.string().required().label("Description")
	};

	async componentDidMount() {
		this.getUserInfo()
		const { params: { pageName } } = this.props.props.props.match
		if (pageName === "edit") {
			await this.setState({ editVal: true })
			const { location: { state } } = this.props.props.props;
			return this.formStateCheck(state.row);
		}
	}

	formStateCheck = async (data) => {
		data.imageURL = document.getElementById("output_image").src = data.imageURL
		await this.setState({ data, imageId: data.imageId, imgUrl: data.imageURL });
		try {
			await this.formApi.setValues(data);
		} catch (err) {
		}
	}

	getUserInfo = async () => {
		let res = await getJwt('__info');
		const { uid } = res;
		await this.setState({ uid: uid, userInfo: res, userName: res.userName });	
	}

	optionSchema = {
		label: Joi.string().empty('').optional(),
		value: Joi.any().optional()
	}

	handleImage = async (e) => {
		await this.setState({ image: e.target.files[0] })
		var reader = new FileReader();
		reader.onload = function () {
			var output = document.getElementById('output_image');
			output.src = reader.result;
		}
		reader.readAsDataURL(this.state.image);
	}

	FileUpload(file) {
		const url = `${apiUrl}/uploadImage`;
		const formData = new FormData();
		formData.append('image', file)
		const config = {
			headers: { 'content-type': 'multipart/form-data' }
		}
		return post(url, formData, config)
	}

	handleChange = async ({ currentTarget: Input }) => {
		const { name, value } = Input;
		const { data } = this.state;
		data[name] = value;

		await this.setState({
			[name]: value
		})
	}

	onSubmit = async () => {
		const { image, userName } = this.state;
		let res = ''
		const { params: { pageName } } = this.props.props.props.match
		if (pageName === 'upload') {
			let imgUrl = await this.FileUpload(image);
			if (imgUrl.data.statusCode === 1) {
				const data = this.formApi.getState().values;
				let postData = {
					"imgDescription": data.imageDescription,
					"imgUrl": imgUrl.data.data,
					"imgStatus": data.imageStatus,
					"updatedBy": userName
				}
				res = await addBanners(postData)
				if (res.data.statusCode === 1) {
					this.addNotification(res.data.message)
					this.resetForm()
				}
			}
		} else if (pageName === 'edit') {
			const data = this.formApi.getState().values;
			let imgUrl = await this.FileUpload(image);
			let postData = {
				"imgDescription": data.imageDescription,
				"imgUrl": imgUrl.data.data || this.state.imgUrl,
				"imgStatus": data.imageStatus,
				"imgId": this.state.imageId,
				"updatedBy": userName
			}
			res = await updateBanners(postData)
			if (res.data.statusCode === 1) {
				this.addNotification(res.data.data)
				this.resetForm()
				this.props.props.props.history.push(`/banner/list`)
			}
		}
	}

	addNotification(data, type = "success") {
		this.notificationDOMRef.current.addNotification({
			title: `${type} Message`,
			message: data,
			type: type,
			insert: "top",
			container: "top-right",
			animationIn: ["animated", "fadeIn"],
			animationOut: ["animated", "fadeOut"],
			dismiss: { duration: 2000 },
			dismissable: { click: true }
		});
	}

	setFormApi = (formApi) => {
		this.formApi = formApi;
	}

	resetForm = async () => {
		this.formApi.reset();
		document.getElementById("output_image").src = img1;
	}

	render() {
		const breadCrumbItems = {
			title: " Upload Banner",
			items: [
				{ name: "Home", link: "/dashboard" },
				{ name: "Banner List", link: "/banner/list" },
				{ name: `Upload Banner `, active: true },
			]
		};
		return (
			<Fragment>
				<Form getApi={this.setFormApi} onSubmit={this.onSubmit}>
					{({ formApi, formState }) => (
						<div>
							<BreadCrumb data={breadCrumbItems} />
							<ReactNotification ref={this.notificationDOMRef} />
							<Row className="form-div">
								<Col md={3} sm={12} >
									<Input field="imgUrl" type="file" multiple label="Banner Image"
										name="imgUrl" onChange={this.handleImage} validateOnBlur validate={e => this.validateProperty('imgUrl', e)} />
								</Col>
								<Col md={6} sm={12} >
									<Input field="imageDescription" label="Banner Description" name="imgDescription" onChange={this.handleChange} validateOnBlur validate={e => this.validateProperty('imageDescription', e)} />
								</Col>
								<Col md={3} sm={12} >
									<CustomSelect field="imageStatus" label="Status" name="imageStatus" getOptionValue={option => option.id} getOptionLabel={option => option.name} options={this.state.Status} onChange={this.handleChange} />
								</Col>
								<Col>
									<img className="img-thumbnail" id="output_image" src={img1} alt=""></img>
								</Col>
							</Row>
							<div className="d-flex justify-content-end">
								<button type="button" className="btn btn-warning btn-sm mr-3" id="cancelbtn" onClick={() => this.resetForm()}>Cancel</button>
								<button type="submit" className="btn btn-primary btn-sm">Submit</button>
							</div>
						</div>
					)}
				</Form>
			</Fragment>
		)
	}
}

export default AddBanner;