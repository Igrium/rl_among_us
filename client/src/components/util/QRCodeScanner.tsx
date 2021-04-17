import React, { Component } from "react"
import QrReader from "react-qr-reader"

interface IProps {
  onScan: (value?: string) => void
  displayText?: string
}

export class QRCodeScanner extends Component<IProps> {

  constructor(props: IProps) {
    super(props);
  }

  handleClose = () => {
    this.props.onScan("");
  }

  handleScan = (data: any) => {
    if (data) this.props.onScan(data);
  }
  handleError = (err: any) => {
    console.error(err);
    // TODO: Handle error
  }

  openImageDialog() {
    // @ts-ignore
    this.ref.openImageDialog();
  }

  private isIOS() {
    return [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod"
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
  }

  renderButton() {
    // TODO: Waiting for answer in issue: https://github.com/JodusNodus/react-qr-reader/issues/194
    return (
      <input type="button" value="Make a picture" onClick={() => {alert("Need to add this!")}} />
    )
  }

  render() {
    return (
      <div>
        <button className='CloseButton' onClick={this.handleClose}>X</button>
        <h2>{this.props.displayText}</h2>

        <QrReader
          delay={300}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: "100%" }}
          legacyMode={this.isIOS()}
        />
        {this.isIOS() ? this.renderButton() : ""}
      </div>
    )
  }
}

export default QRCodeScanner
