 
 
// import logo from './../../../images/userimages/EFV-Logo.png';
// import Orders from './../../../images/userimages/newmyorder.svg';
// import Profile from './../../../images/userimages/newuser.svg';
// import Cart from './../../../images/userimages/newcart.svg';
// import Wishlist from './../../../images/userimages/newwishlist.svg';
// import ChangePassword from './../../../images/userimages/changepassword.svg';
// import Logout from './../../../images/userimages/newlogout.svg';

import Logout from 'images/userimages/newlogout.svg';


export default class Static {
     
  
    
  
    static navlinkitems() {
      const keys = {
        home: {
          label: "Home",
          icon: ""
        },
        fruits: {
          label: "Fruits",
          icon: ""
        },
        baskets: {
            label: "Baskets",
            icon: ""
          },
          minibaskets: {
            label: "Mini Baskets",
            icon: ""
          },
          veggies: {
            label: "Veggies",
            icon: ""
          },
          organics: {
            label: "Organics",
            icon: ""
          },
      }
      const order = [
        "home","baskets", "minibaskets","veggies","fruits","organics"
      ]
      return {
        keys,
        order
      }
    }
   
    static dropdownitems() {
      const keys = {
        profile: {
          label: "My Profile",
          icon : "/images/userimages/newuser.svg"
        },
        orders: {
          label: "My Orders",
          icon: "/images/userimages/newmyorder.svg"
        },
        cart: {
            label: "Cart",
            icon: "/images/userimages/newcart.svg"
          },
          wishlist: {
            label: "Wishlist",
            icon: "/images/userimages/newwishlist.svg"
          },
          changepassword: {
            label: "Change Password",
            icon:  "/images/userimages/changepassword.svg"
          },
          logout: {
            label: "Logout",
            icon: "/images/userimages/newlogout.svg"
          },
      }
      const order = [
        "profile","orders", "cart","wishlist","changepassword","logout"
      ]
      return {
        keys,
        order
      }
    }
  
  
  }