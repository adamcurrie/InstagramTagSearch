import React from 'react';
import $ from 'jquery';
import moment from 'moment';
var StyleSheet = require('react-style');
require('jquery-ui');

/*
 * Required props:
 * maxDate: maxDate
 * updateDate(dateString): methods to call to update the values of the enclosing object
 */
class DatePicker extends React.Component {

  componentWillMount() {
    this.setState({date: ''});
  }

  componentDidMount() {
    $(React.findDOMNode(this.refs.datePick)).datepicker({
      minDate: this.props.dates.minDate.toDate(),
      maxDate: this.props.dates.maxDate.toDate(),
      onSelect: (dateString) => {
        this.props.updateDate(moment(dateString, "MM/DD/YYYY"));
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.date) {
      this.setState({date: nextProps.date.format('MM-DD-YYYY')});
    }
    if (nextProps.dates) {
      if (nextProps.dates.minDate.toDate() != $(React.findDOMNode(this.refs.datePick)).datepicker('option', 'minDate')) {
        $(React.findDOMNode(this.refs.datePick)).datepicker('option', 'minDate', nextProps.dates.minDate.toDate());
      }
      if (nextProps.dates.maxDate.toDate() != $(React.findDOMNode(this.refs.datePick)).datepicker('option', 'maxDate')) {
        $(React.findDOMNode(this.refs.datePick)).datepicker('option', 'maxDate', nextProps.dates.maxDate.toDate());
      }
    }
  }

  render() {
    return (
      <div>
        <input readOnly placeholder="Date" styles={{marginRight: '1em', lineHeight: '27px',}} type="text" ref="datePick" size="10" value={this.state.date}/>
      </div>
    );
  }
};

module.exports = DatePicker;