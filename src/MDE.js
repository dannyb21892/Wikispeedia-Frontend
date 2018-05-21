import * as React from "react";
import ReactMde, {ReactMdeTypes} from "react-mde";
import * as Showdown from "showdown";
import 'react-mde/lib/styles/css/react-mde-all.css'

export interface MDEState {
    mdeState: ReactMdeTypes.MdeState;
}

class MDE extends React.Component<{}, AppState> {

    converter: Showdown.Converter;

    constructor(props) {
        super(props);
        this.state = {
            mdeState: {markdown: this.props.markdown || ""},
        };
        this.converter = new Showdown.Converter({tables: true, simplifiedAutoLink: true});
    }

    handleValueChange = (mdeState: ReactMdeTypes.MdeState) => {
        console.log(mdeState)
        this.setState({mdeState});
    }

    submitContent = () => {
      this.props.submitContent(this.state.mdeState)
    }

    render() {
        return (
            <div className="container">
                <ReactMde
                    onChange={this.handleValueChange}
                    editorState={this.state.mdeState}
                    generateMarkdownPreview={(markdown) => Promise.resolve(this.converter.makeHtml(markdown))}
                />
                <button onClick={this.submitContent}>Submit</button>
            </div>
        );
    }
}

export default MDE
