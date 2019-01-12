import React, { Component } from 'react'

import './PhoneInputForm.scss'

import XmlService from '../../services/xml-service';

export default class PhoneInputForm extends Component {

  xmlService = new XmlService();

  state = {
    phone: '',
    warning: false,
    time: 0
  }

  componentDidMount() {
    const { inputValue } = this.props
    if (inputValue) {
      this.setState({phone: inputValue})
    }
  }

  onPhoneChange = e => {
    const phone = this.checkPhone(e.target.value)

    if (phone || phone === '') {
      this.setState({
        phone
      })
    }

    return false
  }

  checkPhone = phoneToCheck => {
    let phone = phoneToCheck.slice()
    const allowedСhars = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '+', '-', ' ']

    for (let i = 0; i < phone.length; i++) {
      if (allowedСhars.indexOf(phone[i]) < 0) {
        return false
      }
    }

    if (phone[0] === '8' || phone.slice(0, 2) === '+7') {
      if (phone[0] === '8') {
        phone = '+7' + phone.slice(1)
      }
      if (phone[2] && phone[2] !== ' ') {
        phone = phone.slice(0, 2) + ' ' + phone.slice(2)
      }
      if (phone[6] && phone[6] !== ' ') {
        phone = phone.slice(0, 6) + ' ' + phone.slice(6)
      }
      if (phone[10] && phone[10] !== '-') {
        phone = phone.slice(0, 10) + '-' + phone.slice(10)
      }
      if (phone[13] && phone[13] !== '-') {
        phone = phone.slice(0, 13) + '-' + phone.slice(13)
      }
      if (phone.length > 16) {
        return false
      }
      if (phone.length === 16) {
        this.setState({ warning: false })
      }
    }
    return phone
  }

  onSubmit = e => {
    e.preventDefault()
    const { phone } = this.state
    
    if (this.state.time) {
      return false
    }
    const timer = () => {
      this.setState(({time}) => {
        if (time > 1) {
          return { time: time - 1 }
        }
        clearInterval(this.interval)
        return {time: 0}
      })
    }

    const serverCallback = (answer) => {
      const time = answer.time
      console.log(answer)

      if (time) {
        this.setState({ time }, () => {
          this.interval = setInterval(timer, 1000)
        })
      } else {
        this.props.onSubmit(phone)
      }
    }

    if (phone.slice(0, 2) === '+7') {
      phone.length === 16 ? this.xmlService.post('/send-sms-login', { phone }, serverCallback) : this.setState({ warning: true })
    } else {
      this.xmlService.post('/send-sms-login', { phone }, serverCallback)
    }
  }

  render() {
    return (
      <FormView
        onSubmit={this.onSubmit}
        phone={this.state.phone}
        onChange={this.onPhoneChange}
        warning={this.state.warning}
        time={this.state.time}
      />
    )
  }
}

const FormView = props => {
  const { phone, onSubmit, onChange, warning, time } = props

  const warningText = warning ? 'Введите номер корректно' : null
  const timerMessage = time ? `Количество попыток превышено. Повторить можно через ${time}` : null

  return (
    <form onSubmit={onSubmit}>
      <input
        value={phone}
        onChange={onChange}
        type="tel"
        placeholder='+7 912 345-67-89'
        className="phone-input"
        name="phone"
      />
      <span>{warningText}</span>
      <span>{timerMessage}</span>

      <button className="phone-button">Далее</button>
    </form>
  )
}