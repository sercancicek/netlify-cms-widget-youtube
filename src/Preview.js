import PropTypes from "prop-types";
import React from "react";
import urlParser from "js-video-url-parser";

export default class Preview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			videoInfo: {}
		};
		console.log({props});

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
		console.log({value});

		if (!value) {
			let { entries } = this.props._root
			if (!entries) {
				entries = this.props.value._root.nodes.map(x => x.entry)
			}
	
			let tags = entries.find(x => x.includes("tags"))[1]
			if (tags && tags._tail) {
				tags = tags._tail.array.join()
			}
	
			return (
				<div className="yt-widgetPreview">
					<span>
						URL: {entries.find(x => x.includes("url"))[1]}
					</span>
					<span>
						Title: {entries.find(x => x.includes("title"))[1]}
					</span>
					<span>
						Description: {entries.find(x => x.includes("description"))[1]}
					</span>
					<span>
						Published At: {entries.find(x => x.includes("publishedAt"))[1]}
					</span>
					<span>
						View: {entries.find(x => x.includes("viewCount"))[1]}
					</span>
				</div>
			);
		}

		const { url, id, mediaType, provider = "youtube" } = value;

		return (
			<div className="yt-widgetPreview">
				{JSON.stringify(value)}
			</div>
		);
	}
}

Preview.propTypes = {
	value: PropTypes.node
};

/*
const value = this.props.value
		let { entries } = this.props.value._root
		if (!entries) {
			entries = this.props.value._root.nodes.map(x => x.entry)
		}

		let tags = entries.find(x => x.includes("tags"))[1]
		if (tags && tags._tail) {
			tags = tags._tail.array.join()
		}

		return (
			<div className="yt-widgetPreview">
				<span>
					URL: {entries.find(x => x.includes("url"))[1]}
				</span>
				<span>
					Title: {entries.find(x => x.includes("title"))[1]}
				</span>
				<span>
					Description: {entries.find(x => x.includes("description"))[1]}
				</span>
				<span>
					Published At: {entries.find(x => x.includes("publishedAt"))[1]}
				</span>
				<span>
					View: {entries.find(x => x.includes("viewCount"))[1]}
				</span>
			</div>
		);
	} 
*/