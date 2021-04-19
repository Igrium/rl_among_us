import React, { Component } from "react"
// @ts-ignore
import QrReader from "react-webcam-barcode-scanner"

interface IProps {
  onScan: (value?: string) => void
  displayText?: string
}
interface IResult {
  text: string
}

export class QRCodeScanner extends Component<IProps> {

  constructor(props: IProps) {
    super(props);
  }

  handleClose = () => {
    this.props.onScan("");
  }
  
  onUpdate(err: any, result: IResult) {
    if (err) this.handleError(err);
    else this.handleScan(result.text);
  }
  handleScan = (data: any) => {
    if (data) this.props.onScan(data);
  }
  handleError = (err: any) => {
    console.error(err);
    // TODO: Handle error
  }

  render() {
    return (
      <div>
        <button className='CloseButton' onClick={this.handleClose}>X</button>
        <h2>{this.props.displayText}</h2>

        <QrReader
          width={500}
          height={500}
          // @ts-ignore
          onUpdate={(...args) => {this.onUpdate(...args)}}
        />
      </div>
    )
  }
}

export default QRCodeScanner
