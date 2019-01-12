import React, { Component } from 'react'

import XmlService from '../../services/xml-service';

export default class SmsInputForm extends Component {

  xmlService = new XmlService();

  state = {
    sms: '',
    timer: false,
    lengthWarning: false,
    miss: false,
    time: 60
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  updateTime = () => {
    this.setState(({ time }) => {
      if (time > 1) {
        return {
          time: time - 1
        }
      }

      clearInterval(this.interval)
      return {
        timer: false,
        time: 60
      }
    })
  }

  onSubmit = e => {
    e.preventDefault()

    const { sms, timer } = this.state

    if (timer) {
        return false
    }

    this.setState({miss: false})

    const serverCallback = (answer) => {
        console.log(answer);
        switch (answer.key) {
            case 0:
                this.setState({ miss: true })
                break
            case 1:
                console.log('Код введен верно, из JS')
                this.props.onSubmit(answer.phone, answer.sms);
                break
            case 2:
                this.setState({ timer: true })
                this.interval = setInterval(this.updateTime, 1000)
                break
            case 3:
                this.setState({ timer: true,
                                time: answer.time })
                this.interval = setInterval(this.updateTime, 1000)
                break
            default:
                console.log('default');
        }
    }

    sms.length === 4 ? this.xmlService.post('/receive-sms-login', 
                                            { sms }, 
                                            serverCallback) :
                       this.setState({ lengthWarning: true })
  }

  onChange = e => {
    const sms = e.target.value

    if (sms.length > 4) {
      return false
    }
    this.setState({ sms, lengthWarning: false })

    // sms.length === 4 ? this.setState({sms}, this.onSubmit) : this.setState({sms});
  }

  render() {
    return (
      <SmsView
        onSubmit={this.onSubmit}
        onChange={this.onChange}
        sms={this.state.sms}
        timer={this.state.timer}
        time={this.state.time}
        lengthWarning = {this.state.lengthWarning}
        miss = {this.state.miss}
      />
    )
  }
}

const SmsView = props => {
  const { onSubmit, onChange, sms, timer, time, lengthWarning, miss } = props
  const timerMessage = timer ? `Количество попыток превышено. Повторить можно через ${time}` : null
  const lengthMessage = lengthWarning ? 'Код должен состоять из 4 символов' : null
  const missMessage = miss && !timer ? 'Введен неверный код' : null

  return (
    <form onSubmit={onSubmit}>
      <input type="tel" onChange={onChange} value={sms} className="phone-input" name="sms" />
      <span>{timerMessage}</span>
      <span>{lengthMessage}</span>
      <span>{missMessage}</span>
      <button className="phone-button">Готово</button>
    </form>
  )
}