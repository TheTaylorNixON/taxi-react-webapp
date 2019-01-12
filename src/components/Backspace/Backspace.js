import React, { Component } from 'react'

import './Backspace.scss'


export default class Backspace extends Component {
    state = {
        click: false
    }

    render() {
        return (
            <BackspaceView backspace={this.props.backspace}/>
        )
    }
}


const BackspaceView = (props) => {
    const { backspace } = props

    return (
        <button onClick={backspace}>Клавиша назад</button>
    )
}