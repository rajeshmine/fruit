import React, { PureComponent, Fragment } from 'react'

import Static from 'service/static'; 
import 'styles/userstyle.css';
import { getContactList } from 'service/contactService';
import logo from './../../../images/userimages/EFV-Logo.png';


class Footers extends PureComponent {

    state = {
        data: [],
    }

    componentDidMount = async () => { 
        await this.getContactList()
    }

    getContactList = async () => {
        const res = await getContactList();
        const { data: { statusCode, data } } = res;
        if (!statusCode)
            return this.setState({ data: [], isTableLoading: false });
        await this.setState({ data, isTableLoading: false }) 
    }

    render() { 
         
        const { data } = this.state;
        return (
            <Fragment>
                {data && data.length > 0 &&

                    <div style={{ marginTop: '100px' }}>
                        <div className="container">
                            <div className="row text-center cartrowpadding2">
                                <div className="col-md-4 footercolumnpadding">
                                    <img src={logo} className="img-responsive" style={{ width: '100%'}} />
                                </div>
                                <div className="col-md-8 text-left"> 
                                    <p id="footerparagraph"> {data[0].aboutus}</p><br /> 
                                </div> 
                            </div>
                        </div>

                        <footer id="fooerpadding2" >
                            <div className="parallax">
                                <div style={{ background: '#e6e6e65e' }}>

                                    <div className="container">

                                        <div className="row footercenter">
                                            <div className="col-4">
                                                <div className="footer-title">
                                                    <h3 id="h3heading8">Address</h3>
                                                </div>
                                                <div className="footer-text">
                                                    <p>Address : {data[0].address1}</p>
                                                    <p>{data[0].address2}</p>
                                                    <p>Phone : {data[0].contactNo}</p>
                                                    <p>Email : <a href="#" id="alinkcolor2" ><u>{data[0].email}</u></a>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="footer-title">
                                                    <h3 id="h3heading8">Quick Links</h3>
                                                </div>
                                                <div className="footer-text">
                                                    <p><a href="pages/basket.html" id="alinkcolor1">
                                                        Fruits Baskets</a></p>
                                                    <p><a href="pages/basket.html" id="alinkcolor1">
                                                        Veggies Baskets</a></p>
                                                    <p><a href="pages/basket.html" id="alinkcolor1">
                                                        Fruits Baskets</a></p>
                                                    <p><a href="pages/basket.html" id="alinkcolor1">
                                                        Veggies Baskets</a></p>
                                                    <p><a href="pages/basket.html" id="alinkcolor1">
                                                        Fruits Baskets</a></p>
                                                </div>
                                            </div>
                                            <div className="col-4 text-right">
                                                <div className="footer-title">
                                                    <h3 id="h3heading8">Follow Us On</h3>
                                                </div>
                                                <a href={data[0].facebook} target="_blank"><button className="btn btn-default" id="facebookbtn"><i className="fa fa-facebook"></i> Facebook</button></a>
                                                <br />
                                                <a href={data[0].twitter} target="_blank"><button className="btn btn-default" id="twitterbtn"><i className="fa fa-twitter"></i> Twitter</button></a>
                                                <br />
                                                <a href={data[0].youtube} target="_blank"><button className="btn btn-default" id="youtubebtn"><i className="fa fa-youtube"></i> Youtube</button></a>
                                                <br />

                                                <a href={data[0].whatsapp} target="_blank"> <button className="btn btn-default" id="whatsappbtn"><i className="fa fa-whatsapp"></i> Whatsapp</button></a>
                                            </div>
                                        </div>

                                        <div className="row text-center">
                                            <div className="col-md-12">
                                                <p id="paragraph5">&copy; 2019, Prematix Software Solution Pvt. Ltd., All Rights Reserved.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> 
                        </footer> 
                    </div> 
                } 
            </Fragment>
        )
    }
}

export default Footers;