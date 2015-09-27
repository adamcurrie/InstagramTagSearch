import React from 'react';
import $ from 'jquery';
import moment from 'moment';
var StyleSheet = require('react-style');
require('jquery-ui');

/**
 * Required Props
 * minDate: (moment) Minimum date that can be selected
 * maxDate: (moment) Maximum date that can be selected
 * updateDate: (function) Function that is called when date is selected
 * date: (moment) Selected date
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
        <input readOnly placeholder="Date" className={"form-control"} type="text" ref="datePick" value={this.state.date}/>
      </div>
    );
  }
};

module.exports = DatePicker;