import PropTypes from "prop-types";
import React from "react";
import urlParser from "js-video-url-parser";

export default class Control extends React.Component {
	constructor(props) {
		super(props);
		this.state = { valid: false, data: {}};
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
		this.setState({ data: { ...data, title: e.target.value }})
	}

	handleDescriptionChange = (e) => {
		const { data } = this.state;
		this.setState({ data: { ...data, description: e.target.value }})
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
			<div
				className="nc-imageControl-imageUpload"
				id={forID}
				className={classNameWrapper}
				onFocus={setActiveStyle}
				onBlur={setInactiveStyle}>
				<span className="nc-imageControl-message">
					<div className="nc-imageControl-content">
						<div
							style={{ flexShrink: 0, width: 120, height: 82 }}
							className="nc-imageControl-imageWrapper">
							<img
								src={data.thumbnails && data.thumbnails.default.url}
								style={{
									width: 120,
									height: 67.5,
									objectFit: "cover"
								}}
								alt={data.title}
							/>
						</div>
						<div
							className="nc-imageControl-textWrapper"
							style={{
								width: "100%",
							}}
						>
							<div className="nc-controlPane-control" style={{ marginTop: 0 }}>
								<ul className="nc-controlPane-errors"></ul>
								<label className="nc-controlPane-label" for="youtube_widget4">Youtube URL</label>
								<div className="nc-controlPane-widget" id="youtube_widget1">
									<span className="nc-imageControl-message">
										<input
											type="text"
											style={{
												width: "100%",
												fontSize: "1rem"
											}}
											value={extraInfo ? value.url : value}
											valid={valid}
											placeholder={`Youtube URL`}
											onChange={this.fetchFromAPI}
										/>
									</span>
								</div>
							</div>
							<div className="nc-controlPane-control">
								<ul className="nc-controlPane-errors"></ul>
								<label className="nc-controlPane-label" for="youtube_widget4">Başlık</label>
								<div className="nc-controlPane-widget" id="youtube_widget1">
									<span className="nc-imageControl-message">
										<input
											type="text"
											placeholder="Başlık"
											style={{ width: "100%", fontSize: "1rem" }}
											value={data.title}
											onChange={this.handleTitleChange}
										/>
									</span>
								</div>
							</div>
							<div className="nc-controlPane-control">
								<ul className="nc-controlPane-errors"></ul>
								<label className="nc-controlPane-label" for="description">Açıklama</label>
								<textarea
									id="description"
									className="nc-controlPane-widget"
									style={{ minHeight: "140px", height: "58px" }}
									value={data.description}
									onChange={this.handleDescriptionChange}
								/>
							</div>
							{/* <div className="nc-controlPane-control">
								<ul className="nc-controlPane-errors"></ul>
								<label className="nc-controlPane-label" for="publishedAt">Yayım Tarihi</label>
								<div className="nc-controlPane-widget" id="publishedAt">
									<span className="nc-imageControl-message">
										<input
											type="text"
											placeholder="Yayım Tarihi"
											style={{ width: "100%", fontSize: "1rem" }}
											value={data.publishedAt}
										/>
									</span>
								</div>
							</div>
							<div className="nc-controlPane-control">
								<ul className="nc-controlPane-errors"></ul>
								<label className="nc-controlPane-label" for="keywords">Anahtar Kelimeler</label>
								<div className="nc-controlPane-widget" id="keywords">
									<span className="nc-imageControl-message">
										<input
											type="text"
											placeholder="Yayım Tarihi"
											style={{ width: "100%", fontSize: "1rem" }}
											value={data.tags && data.tags.join(', ')}
										/>
									</span>
								</div>
							</div> */}
							<span
								style={{
									position: "absolute",
									bottom: -2,
									right: -2,
									padding: "5px 10px",
									borderRadius: "5px 0",
									color: "white",
									backgroundColor: "#00A86B"
								}}
								className="nc-imageControl-validation">
								✓
									</span>
						</div>
					</div>
				</span>
			</div>
		);
	}
}
