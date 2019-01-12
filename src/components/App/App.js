import React, { Component } from 'react'

import './App.scss'

import AppHeader from '../AppHeader'
import PhoneInputForm from '../PhoneInputForm'
import SmsInputForm from '../SmsInputForm'
import Backspace from '../Backspace/'


export default class App extends Component {

  state = {
    phone: null,
    sms: null,
    inputValue: null
  }

  phoneOnSubmit = (phone) => {
    this.setState({
      phone,
      inputValue: phone
    })
  }

  smsOnSubmit = (phone, sms) => {
    this.setState({
      phone,
      sms,
    }, ()=>console.log(this.state))
  }

  backspaceOnClick = () => {
    this.setState({ phone: null })
    console.log(this.state)
  }

  render() {
    const headerText = this.state.phone ? 'Введите код из смс' : 'Введите свой номер телефона'

    const header =<AppHeader header={headerText} />
    const input = this.state.phone ? <SmsInputForm onSubmit={this.smsOnSubmit} /> : <PhoneInputForm onSubmit={this.phoneOnSubmit} inputValue={this.state.inputValue}/>
    const backSpace = this.state.phone ? <Backspace backspace={this.backspaceOnClick}/> : null

    return (
      <div className="main-container">
        {backSpace}
        {header}
        {input}
      </div>
    )
  }
}
