export default class XmlService {
  _apiBase = 'http://localhost:3000'

  get = (url, body) => {
    const xhr = new XMLHttpRequest()

    xhr.timeout = 90000
    xhr.ontimeout = () => {
      console.log('Извините, запрос превысил максимальное время')
    }

    const params = body ? '?' + body : ''

    // var params = 'name=' + encodeURIComponent(name) + '&surname=' + encodeURIComponent(surname);

    xhr.open('GET', this._apiBase + url + params, true)
    xhr.send()

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status !== 200) {
          console.log(xhr.status + ': ' + xhr.statusText)
        } else {
          const answer = JSON.parse(xhr.responseText)
          return answer
        }
      }
    }
  }

  post = (url, params, callback) => {
    const xhr = new XMLHttpRequest()

    xhr.timeout = 90000
    xhr.ontimeout = function() {
      console.log('Извините, запрос превысил максимальное время')
    }

    xhr.open('POST', this._apiBase + url, true)
    xhr.setRequestHeader('Content-Type', 'application/json')

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status !== 200) {
          console.log(xhr.status + ': ' + xhr.statusText)
        } else {
          const answer = JSON.parse(xhr.responseText)
          callback(answer)
        }
      }
    }

    xhr.send(JSON.stringify(params))
  }
}