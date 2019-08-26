import PropTypes from "prop-types";
import React from "react";
import urlParser from "js-video-url-parser";


export default class Control extends React.Component {
	constructor(props) {
		super(props);
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

	componentDidUpdate(prevProps, prevState) {
		const { data, valid } = this.state;
		const isDataChanged = (data.title !== prevState.data.title);
		if (valid && isDataChanged) {
			try {
				const { id, provider, mediaType } = urlParser.parse(data.url);
				const videoInfo = urlParser.parse(data.url);
				this.props.onChange({
					url: data.url,
					id: id,
					mediaType: mediaType,
					imageURL: urlParser.create({
						videoInfo,
						format: "longImage",
						params: { imageQuality: "maxresdefault" }
					}),
					title: data.title,
					description: data.description,
					publishedAt: data.publishedAt,
					tags: data.tags
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
			`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${APIKey}`
		)
			.then(res => res.json())
			.then(json => {
				if (json !== undefined) {
					this.setState({
						valid: true,
						data: { ...json.items[0].snippet, url }
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

		this.writeOut(e);
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
		this.setState({ data: { ...data, title: e.target.value } })
	}

	handleDescriptionChange = (e) => {
		const { data } = this.state;
		this.setState({ data: { ...data, description: e.target.value } })
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
		return (
			<div id={forID} className={classNameWrapper}>
				{
					data.title &&
					<img
						src={data.thumbnails && data.thumbnails.default.url}
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
						value={extraInfo ? value.url : value}
						valid={valid}
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
						className="nc-controlPane-widget"
						style={{ minHeight: "140px", height: "58px" }}
						value={data.description}
						onChange={this.handleDescriptionChange}
					/>
				</div>
			</div >
		);
	}
}
