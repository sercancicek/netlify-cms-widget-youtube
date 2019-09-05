import PropTypes from "prop-types";
import React from "react";
import urlParser from "js-video-url-parser";


export default class Control extends React.Component {
	constructor(props) {
		super(props);
		console.log({aaaxxx: props});
		this.state = { valid: false, data: {} };
	}
	static propTypes = {
		onChange: PropTypes.func.isRequired,
		field: PropTypes.object,
		forID: PropTypes.string,
		value: PropTypes.node,
		classNameWrapper: PropTypes.string.isRequired,
		setActiveStyle: PropTypes.func.isRequired,
		setInactiveStyle: PropTypes.func.isRequired
	};

	static defaultProps = {
		value: ""
	};

	componentDidMount() {
		console.log({ xx: this.props.value });
		console.log({ yy: this.props.field });
		console.log({ zz: this.props.field.get('title') });
		if (this.props.value === '' || typeof this.props.value !== 'object' ) {
			return
		}
		let entries;
		if (this.props.value.title) {
			const { value } = this.props;
			this.setState({
				data: {
					url: value.url,
					title: value.title,
					description: value.description,
					publishedAt: value.publishedAt,
					tags: value.tags,
					viewCount: value.viewCount,
					thumbnails: {
						default: {
							url: value.imageURL,
						}
					}
				},
				valid: true,
			})
			return
		} else if (this.props.entry) {
			const { entry } = this.props
			const innerObj = entry.find(x => x.entry[0] === 'data')
			entries = innerObj.entry[1]._root.nodes.map(x => x.entry)
			return
		} else {
			entries = this.props.value._root.entries
		}
		console.log({ 11: entries });
		if (!entries) {
			entries = this.props.value._root.nodes.map(x => x.entry)
		}
		 console.log({ 12: entries });
		let tags = entries.find(x => x.includes("tags"))[1];
		if (tags && tags._tail) {
			tags = tags._tail.array.join();
		}
		if (entries) {
			this.setState({
				data: {
					url: entries.find(x => x.includes("url"))[1],
					title: entries.find(x => x.includes("title"))[1],
					description: entries.find(x => x.includes("description"))[1],
					publishedAt: entries.find(x => x.includes("publishedAt"))[1],
					tags,
					viewCount: entries.find(x => x.includes("viewCount"))[1],
					thumbnails: {
						default: {
							url: entries.find(x => x.includes("imageURL"))[1]
						}
					}
				},
				valid: true,
			})
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { data, valid } = this.state;
		console.log({data, data2: prevState.data});
		const hasDataChanged = (JSON.stringify(data) !== JSON.stringify(prevState.data));
		if (valid && hasDataChanged) {
			try {
				const { id, provider, mediaType } = urlParser.parse(data.url);
				this.props.onChange({
					url: data.url,
					id: id,
					mediaType: mediaType,
					imageURL: data.thumbnails.default.url,
					title: data.title,
					description: data.description,
					publishedAt: data.publishedAt,
					tags: data.tags,
					viewCount: data.viewCount,
				});
			} catch (err) {
				console.error("Not a valid Youtube URL");
				this.props.onChange(data.url);
			}
		}
	}

	fetchFromAPI = e => {
		const url = e.target.value;
		const { id = "" } = urlParser.parse(url) || "";
		const APIKey = this.props.field.get("APIkey");
		const data = fetch(
			`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${APIKey}`
		)
			.then(res => res.json())
			.then(json => {
				console.log({ json });
				if (json !== undefined) {
					this.setState({
						valid: true,
						data: { ...json.items[0].snippet, ...json.items[0].statistics, url },
					});
				} else {
					this.setState({ valid: false });
				}
			})
			.catch(err => {
				console.log({ err });
				this.setState({ valid: false, data: {} });
				return false;
			});

		this.validateURL(e);
	};

	validateURL = e => {
		if (urlParser.parse(e.target.value)) {
			this.setState({ valid: true });
		} else {
			this.setState({ valid: false });
		}

		// this.writeOut(e);
	};

	writeOut = e => {
		if (!this.props.field.get("extraInfo")) {
			this.props.onChange(e.target.value);
		}
	};

	isValid = () => {
		return this.state.valid;
	};

	handleTitleChange = (e) => {
		const { data } = this.state;
		this.setState({
			data: { ...data, title: e.target.value },
			valid: true,
		})
	}

	handleDescriptionChange = (e) => {
		const { data } = this.state;
		this.setState({
			data: { ...data, description: e.target.value },
			valid: true,
		})
	}

	handleTagsChange = (e) => {
		const { data } = this.state;
		this.setState({
			data: { ...data, tags: e.target.value },
			valid: true,
		})
	}

	render() {
		const {
			forID,
			value,
			onChange,
			classNameWrapper,
			setActiveStyle,
			setInactiveStyle
		} = this.props;
		const { valid } = this.state;
		const extraInfo = this.props.field.get("extraInfo");
		const APIKey = this.props.field.get("APIkey");
		const { data } = this.state;
		console.log({ data });
		const srcImgUrl = data.thumbnails && data.thumbnails.maxres ?
			data.thumbnails.maxres.url : data.thumbnails.default.url
		return (
			<div id={forID} className={classNameWrapper}>
				{
					data.title &&
					<img
						src={srcImgUrl}
						style={{
							width: 120,
							height: 67.5,
							objectFit: "cover",
							marginBottom: "20px",
						}}
						alt={data.title}
					/>
				}
				<div>
					<label
						style={{
							backgroundColor: "#dfdfe3",
							border: "0",
							borderRadius: "3px 3px 0 0",
							color: "#7a8291",
							fontSize: "12px",
							fontWeight: "600",
							margin: "0",
							padding: "3px 6px 2px",
							position: "relative",
							textTransform: "uppercase",
							transition: "all .2s ease"
						}}
					>
						Youtube URL
				</label>
					<input
						type="text"
						style={{
							width: "100%",
							fontSize: "1rem",
							marginBottom: "20px",
						}}
						className={classNameWrapper}
						value={data.url}
						valid={`${valid}`}
						placeholder={`Youtube URL`}
						onChange={this.fetchFromAPI}
					/>
				</div>

				<div>
					<label
						style={{
							backgroundColor: "#dfdfe3",
							border: "0",
							borderRadius: "3px 3px 0 0",
							color: "#7a8291",
							fontSize: "12px",
							fontWeight: "600",
							margin: "0",
							padding: "3px 6px 2px",
							position: "relative",
							textTransform: "uppercase",
							transition: "all .2s ease"
						}}
					>
						Başlık
				</label>
					<input
						type="text"
						className={classNameWrapper}
						placeholder="Başlık"
						style={{ width: "100%", fontSize: "1rem", marginBottom: "20px" }}
						value={data.title}
						onChange={this.handleTitleChange}
					/>
				</div>
				<div>
					<label
						style={{
							backgroundColor: "#dfdfe3",
							border: "0",
							borderRadius: "3px 3px 0 0",
							color: "#7a8291",
							fontSize: "12px",
							fontWeight: "600",
							margin: "0",
							padding: "3px 6px 2px",
							position: "relative",
							textTransform: "uppercase",
							transition: "all .2s ease"
						}}
					>
						Açıklama
					</label>
					<textarea
						id="description"
						className={classNameWrapper} n
						style={{
							backgroundColor: "#fff",
							border: "2px solid #dfdfe3",
							borderRadius: "5px",
							borderTopLeftTadius: "0",
							boxShadow: "none",
							color: "#444a57",
							display: "block",
							fontSize: "15px",
							lineHeight: "1.5",
							margin: "0",
							outline: "0",
							padding: "16px 20px",
							position: "relative",
							transition: "border-color .2s ease",
							width: "100%"
						}}
						style={{ minHeight: "140px", height: "58px" }}
						value={data.description}
						onChange={this.handleDescriptionChange}
					/>
				</div>
				<div>
					<label
						style={{
							backgroundColor: "#dfdfe3",
							border: "0",
							borderRadius: "3px 3px 0 0",
							color: "#7a8291",
							fontSize: "12px",
							fontWeight: "600",
							margin: "0",
							padding: "3px 6px 2px",
							position: "relative",
							textTransform: "uppercase",
							transition: "all .2s ease"
						}}
					>
						Anahtar Kelimeler
				</label>
					<input
						type="text"
						className={classNameWrapper}
						placeholder="Anahtar Kelimeler"
						style={{ width: "100%", fontSize: "1rem", marginBottom: "20px" }}
						value={data.tags}
						onChange={this.handleTagsChange}
					/>
				</div>
			</div >
		);
	}
}
