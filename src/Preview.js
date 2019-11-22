import PropTypes from "prop-types";
import React from "react";
import urlParser from "js-video-url-parser";

export default class Preview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			videoInfo: {}
		};

	}

	getImage(videoInfo) {
		if (videoInfo) {
			return urlParser.create({
				videoInfo,
				format: "longImage",
				params: { imageQuality: "maxresdefault" }
			});
		}
	}

	render() {
		const value = this.props.value;
		console.log({ xxxxx: value})
		let infoObj;
		if(!!value) {
			infoObj = {
				url: value.url || '',
				id: value.id || '',
				mediaType: value.mediaType || '',
				imageURL: value.imageURL || '',
				title: value.title || '',
				description: value.description || '',
				publishedAt: value.publishedAt || '',
				tags: Array.isArray(value.tags) ? value.tags.join() : value.tags,
				viewCount: value.viewCount,
				duration: value.duration,
			}
		}
		return (
			<div className="yt-widgetPreview">
				{JSON.stringify(infoObj)}
			</div>
		);
	}
}

Preview.propTypes = {
	value: PropTypes.node
};