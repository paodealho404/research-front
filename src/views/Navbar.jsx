import { Component } from 'react';

class NavBar extends Component {
  constructor(props)
  {
    super(props);
    this.state={
      pathname:"/admin/",
      classroomId:"",
      teacherId:"",
      courseId:"",
      isSelected: false
    };
  }
  componentWillMount()
  {
    this.state.classroomId = this.props.classroomId;
    this.state.courseId = this.props.courseId;
    this.state.teacherId = this.props.teacherId;
  }
}

export default NavBar; 