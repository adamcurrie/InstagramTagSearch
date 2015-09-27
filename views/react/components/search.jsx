import React from 'react';
import DatePicker from './datePicker.jsx';
import moment from 'moment';
import _ from 'lodash';
import Input from 'react-input-autosize';
import { Button } from 'react-bootstrap';

const INSTAGRAM_MIN_DATE = moment("10-06-2010", "MM-DD-YYYY");

/**
 * Required Props
 * onSearch: (function) function called after all input fields are filled in
 */
class Search extends React.Component {

    componentWillMount() {
        this.setState({
           startDate: {
               minDate: INSTAGRAM_MIN_DATE,
               maxDate: moment().subtract(1, 'days')
           },
           startDateValue: null,
           endDate: {
               minDate: INSTAGRAM_MIN_DATE,
               maxDate: moment()
           },
           endDateValue: null,
           tag: ''
        });
    }

    updateStartDate(updatedDate) {
        var newEndDate = _.extend({}, this.state.endDate);
        newEndDate.minDate = moment(updatedDate).add(1, 'days');
        this.setState({
            endDate: newEndDate,
            startDateValue: updatedDate
        });
    }

    updateEndDate(updatedDate) {
        var newStartDate = _.extend({}, this.state.startDate);
        newStartDate.maxDate = moment(updatedDate).subtract(1, 'days');
        this.setState({
            startDate: newStartDate,
            endDateValue: updatedDate
        });
    }

    updateTag(event) {
        this.setState({
            tag: event.target.value
        });
    }

    onButtonClick(event) {
        if (this.state.startDateValue && this.state.endDateValue && this.state.tag.trim().length != 0) {
            this.props.onSearch({
                tag: this.state.tag,
                startDate: this.state.startDateValue.format('MM-DD-YYYY'),
                endDate: this.state.endDateValue.format('MM-DD-YYYY')
            });
        }
    }

    render() {
        return (
            <div>
                <h2>Search</h2>
                <Input placeholder="Instagram Tag" name="tag" value={this.state.tag} onChange={this.updateTag.bind(this)}
                       style={{ background: '#eee', borderRadius: 5, padding: 5 }}
                       inputStyle={{ border: '1px solid #999', borderRadius: 3, padding: 3, fontSize: 14 }}/>
                <DatePicker date={this.state.startDateValue} dates={this.state.startDate} updateDate={this.updateStartDate.bind(this)}/>
                <DatePicker date={this.state.endDateValue} dates={this.state.endDate} updateDate={this.updateEndDate.bind(this)}/>
                <Button bsStyle="success" bsSize="small" onClick={this.onButtonClick.bind(this)}>Search</Button>
            </div>
        );
    }
}

module.exports = Search;