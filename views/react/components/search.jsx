import React from 'react';
import DatePicker from './datePicker.jsx';
import moment from 'moment';
import _ from 'lodash';
import { Button, Row, Col, Input } from 'react-bootstrap';

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

    updateTag() {
        console.log(this.refs.input.getValue());
        this.setState({
            tag: this.refs.input.getValue()
        });
    }

    onButtonClick(event) {
        if (this.state.startDateValue && this.state.endDateValue && this.state.tag.trim().length != 0) {
            this.props.onSearch({
                tag: this.state.tag.replace('#', ''),
                startDate: this.state.startDateValue.format('MM-DD-YYYY'),
                endDate: this.state.endDateValue.format('MM-DD-YYYY')
            });
        }
    }

    render() {
        return (
            <div>
                <Row>
                    <Col xs={0} md={4}><code></code></Col>
                    <Col xs={12} md={4}>
                        <code>
                            <h2>Search</h2>
                        </code>
                    </Col>
                    <Col xs={0} md={4}><code></code></Col>
                </Row>
                <Row>
                    <Col xs={12} md={4}>
                        <code>
                            <Input
                                type="text"
                                value={this.state.tag}
                                placeholder="#hashtag"
                                ref="input"
                                groupClassName="group-class"
                                labelClassName="label-class"
                                onChange={this.updateTag.bind(this)} />

                        </code>
                    </Col>
                    <Col xs={12} md={4}>
                        <code>
                            <DatePicker date={this.state.startDateValue} dates={this.state.startDate} updateDate={this.updateStartDate.bind(this)}/>
                        </code>
                    </Col>
                    <Col xs={12} md={4}>
                        <code>
                            <DatePicker date={this.state.endDateValue} dates={this.state.endDate} updateDate={this.updateEndDate.bind(this)}/>
                        </code>
                    </Col>
                </Row>
                <Row>
                    <Col xs={0} md={5}><code></code></Col>
                    <Col xs={12} md={2}>
                        <code>
                            <Button bsStyle="success" bsSize="large" onClick={this.onButtonClick.bind(this)}>Search</Button>
                        </code>
                    </Col>
                    <Col xs={0} md={5}><code></code></Col>
                </Row>
            </div>
        );
    }
}

module.exports = Search;