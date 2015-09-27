import React from 'react/addons';
import $ from 'jquery';
import _ from 'lodash';
import { Button, Row, Col } from 'react-bootstrap';
import { Card, CardActions, CardHeader, CardMedia,
    CardTitle, FlatButton } from 'material-ui';
let sprintf = require('sprintf-js').sprintf;

const BASE_URL = 'http://localhost:3000/api/tagsearch/%s?startDate=%s&endDate=%s&offset=%d';

/**
 * Creates a Material-UI Card for the given Instagram image
 * @param username
 * @param mediaURL
 * @param instagramURL
 * @param tag
 * @returns Card
 */
function buildImageCard(username, mediaURL, instagramURL, tag) {
    return (
        <Card key={mediaURL}>
            <CardHeader
                title={tag}
                subtitle={username}/>
            <CardMedia overlay={<CardTitle title={tag} subtitle={username}/>}>
                <img src={mediaURL}/>
            </CardMedia>
            <CardActions>
                <FlatButton linkButton={true} href={instagramURL} label="View on Instagram"/>
            </CardActions>
        </Card>
    );
}

/**
 * Creates a Material-UI Card for the given Instagram video
 * @param username
 * @param mediaURL
 * @param instagramURL
 * @param tag
 * @returns {XML}
 */
function buildVideoCard(username, mediaURL, instagramURL, tag) {
    return (
        <Card key={mediaURL}>
            <CardHeader
                title={tag}
                subtitle={username}/>
            <CardMedia>
                <video src={mediaURL} width="640" height="480" controls>
                    Your browser does not support the <code>video</code> element.
                </video>
            </CardMedia>
            <CardActions>
                <FlatButton linkButton={true} href={instagramURL} label="View on Instagram"/>
            </CardActions>
        </Card>
    );
}

/**
 * Required Props
 * tag: (string)
 * startDate: (string)
 * endDate: (string)
 */
class Results extends React.Component {

    constructor(props) {
        super(props);
        this.state = Object.assign({ offset: 0, data: [] }, this.state);
    }

    componentWillMount() {
        const url = sprintf(BASE_URL, this.props.data.tag, this.props.data.startDate, this.props.data.endDate, 0);
        console.log(url);
        $.get(url, (results) => {
           this.setState((previousState, currentProps) => {
               return {
                   data: results,
                   offset: previousState.offset + results.length
               };
           });
        });
    }

    onButtonClick(event) {
        const url = sprintf(BASE_URL, this.props.data.tag, this.props.data.startDate, this.props.data.endDate, this.state.offset);
        $.get(url, (results) => {
            var newState = React.addons.update(this.state, {
                data: {$push: results},
                offset: {$set: this.state.offset + results.length}
            });
            this.setState(newState);
        });
    }

    render() {
        return (
            <div>
                {_.map(this.state.data, (result) => {
                    if (result.media_type == 'image') {
                        return buildImageCard(result.username, result.media_url, result.instagram_url, this.props.data.tag);
                    } else {
                        return buildVideoCard(result.username, result.media_url, result.instagram_url, this.props.data.tag);
                    }
                })}
                <br />
                <Row>
                    <Col xs={0} md={5}><code></code></Col>
                    <Col xs={12} md={2}>
                        <code>
                            <Button bsStyle="primary" bsSize="large" onClick={this.onButtonClick.bind(this)}>Load More</Button>
                        </code>
                    </Col>
                    <Col xs={0} md={5}><code></code></Col>
                </Row>
            </div>
        );
    }
}

module.exports = Results;