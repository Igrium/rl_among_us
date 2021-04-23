import React, { Component } from "react"

interface IProps {
  onExit: () => void
  url?: string
}

export class QRCodeScanner extends Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  handleClose = () => {
    this.props.onExit();
  }


  render() {
    return (
      <div>
        <button className='CloseButton' onClick={this.handleClose}>X</button>

        <iframe width="560" height="315" src={this.props.url+"?autoplay=1"} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>

      </div>
    )
  }
}

export default QRCodeScanner
