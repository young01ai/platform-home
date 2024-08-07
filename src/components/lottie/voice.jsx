import React from 'react'
import voiceLottie from './voice.json'
import * as LottiePlayer from "@lottiefiles/lottie-player"

class Voice extends React.Component {
  constructor(props) {
    super(props)
    this.player = React.createRef() // initialize your ref
  }
  render() {
    return (
        <lottie-player
        ref={this.player} // attach the ref to your component
        loop
        mode="normal"
        src={JSON.stringify(voiceLottie)}
        style={{
            width: "40px",
            height: "40px"
        }}
        autoplay
      ></lottie-player>
    )
  }
}

export default Voice