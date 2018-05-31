import * as React from "react";
import ReactMde, {ReactMdeTypes} from "react-mde";
import * as Showdown from "showdown";
import { Button } from "semantic-ui-react"
import 'react-mde/lib/styles/css/react-mde-all.css'

export interface MDEState {
    mdeState: ReactMdeTypes.MdeState;
}

class MDE extends React.Component<{}, AppState> {

    converter: Showdown.Converter;

    constructor(props) {
        super(props);
        this.state = {
            mdeState: {markdown: (this.props.newArticle ? "" : this.props.markdown)},
        };
        this.converter = new Showdown.Converter({tables: true, simplifiedAutoLink: true});
    }

    handleValueChange = (mdeState: ReactMdeTypes.MdeState) => {
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
                /><br />
                <Button inverted onClick={this.submitContent}>Submit</Button>
            </div>
        );
    }
}

export default MDE
