import React from 'react';
import $ from 'jquery';
var sprintf = require('sprintf-js').sprintf;
import _ from 'lodash';
let mui = require('material-ui');
let {
    Avatar,
    Card,
    CardActions,
    CardExpandable,
    CardHeader,
    CardMedia,
    CardText,
    CardTitle,
    FlatButton
    } = mui;

const BASE_URL = 'http://localhost:3000/api/tagsearch/%s?startDate=%s&endDate=%s&offset=%d';

function buildImageCard(data, tag) {
    console.log(data);
    return (
        <Card>
            <CardHeader
                title={tag}
                subtitle={data.username}/>
            <CardMedia overlay={<CardTitle title={tag} subtitle={data.username}/>}>
                <img src={data.media_url}/>
            </CardMedia>
            <CardActions>
                <FlatButton linkButton={true} href={data.instagram_url} label="View on Instagram"/>
            </CardActions>
        </Card>
    );
}

function buildVideoCard(data, tag) {
    console.log(data);
    return (
        <Card key={data.media_url}>
            <CardHeader
                title={tag}
                subtitle={data.username}/>
            <CardMedia>
                <video src={data.media_url} width="640" height="480" controls>
                    Your browser does not support the <code>video</code> element.
                </video>
            </CardMedia>
            <CardActions>
                <FlatButton linkButton={true} href={data.instagram_url} label="View on Instagram"/>
            </CardActions>
        </Card>
    );
}

class Results extends React.Component {

    constructor(props) {
        super(props);
        this.state = Object.assign({ offset: 0, data: [] }, this.state);
    }

    componentWillMount() {
        const url = sprintf(BASE_URL, this.props.data.tag, this.props.data.startDate, this.props.data.endDate, 0);
        $.get(url, (results) => {
           this.setState(function(previousState, currentProps) {
               return {
                   data: results,
                   offset: previousState.offset + results.length
               };
           });
        });
    }

    render() {
        return (
            <div>
                {_.map(this.state.data, (result) => {
                    if (result.mediaType == 'image') {
                        return buildImageCard(result, this.props.data.tag);
                    } else {
                        return buildVideoCard(result, this.props.data.tag);
                    }
                })}</div>
        );
    }
}

module.exports = Results;