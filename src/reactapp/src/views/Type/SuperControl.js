// import React, { Component } from "react";
// import { connect } from "react-redux";
// import { updateSelectedType } from "../../redux/actions/index";
// // import Navbar from "react-bootstrap/lib/Navbar";
// // import { Button } from "reactstrap";
// // import {
// //   Form,
// //   FormGroup,
// //   FormControl,
// //   ControlLabel,
// //   Checkbox,
// // } from "react-bootstrap";

// // It will let you add and remove attributes.
// // Each needs to have a unique name as part of validation.
// // Each also needs to have a valid type.
// // The type can be string, integer, double, enum, any Type 
// // already defined for this world, or a list of any of the 
// // other types.  
// // In future versions I will add support for additional types:
// // Color, DateTime, Schedule.

// const mapStateToProps = state => {
//   // // console.log(state);
//   return { 
//     selectedType: state.app.selectedType, 
//     attributesArr: state.app.attributesArr 
//   };
// };
// function mapDispatchToProps(dispatch) {
//   return {
//     updateSelectedType: type => dispatch(updateSelectedType(type))
//   };
// }
// class Control extends Component {
//   // constructor(props) {
//   //   super(props);
//   //   this.state = {
//   //     attributes: 
//   //   };
//   // }

//   componentDidMount() {
//     // // console.log(this.props);
//   }

//   newAttribute = () => {
//     // // console.log(this.props);
//     const type = this.props.selectedType;
//     type.AttributesArr.push({Name: "", Type: ""});
//     this.props.updateSelectedType(type);
//     // const arr = this.props.attributesArr;
//     // arr.push({Name: "", Type: ""});
//     // this.props.updateAttributesArr(arr);
//     // I need to put it into state and do setstate.  
//     // Actually, I may need to put the active type into the main state.
//   }

//   render() {
//     // // console.log(this.props);
//     return (
//       <div className="Super">
//         Super Control<br/>
//       </div>
//     );
//   }
// }

// const SuperControl = connect(mapStateToProps, mapDispatchToProps)(Control);
// export default SuperControl;
