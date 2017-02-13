import React from 'react'

import {
  Form,
  FormGroup,
  FormControl,
  Col,
  Button,
  ControlLabel,
  Link
} from 'react-bootstrap'

import style from './style.scss'

export default class SlackModule extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      clientID: '',
      clientSecret: '',
      hostname: '',
      scope: ''
    }
  }

  componentDidMount() {
    this.fetchConfig()
    .then(() => {
      this.authenticate()
    })

  }

  // TODO handle error
  // TODO add eslint about missing class method

  getAxios = () => this.props.bp.axios
  mApi = (method, url, body) => this.getAxios()[method]('/api/botpress-slack' + url, body)
  mApiGet = (url, body) => this.mApi('get', url, body)
  mApiPost = (url, body) => this.mApi('post', url, body)

  fetchConfig = () => {
    return this.mApiGet('/config').then(({data}) => {
      console.log('config', data)
      this.setState({
        clientID: data.clientID,
        clientSecret: data.clientSecret,
        hostname: data.hostname,
        scope: data.scope
      })
    })
  }

  getRedictURI = () => {
    return this.state.hostname + "/modules/botpress-slack"
  }

  getOAuthLink = () => {
    return "https://slack.com/oauth/pick" +
      "?client_id=" + this.state.clientID +
      "&scope=" + this.state.scope +
      "&redirect_uri=" + this.getRedictURI()
  }

  getOAuthAccessLink = (code) => {
    return "https://slack.com/api/oauth.access" +
      "?client_id=" + this.state.clientID +
      "&client_secret=" + this.state.clientSecret +
      "&code=" + code +
      "&redirect_uri=" + this.getRedictURI()
  }



  getParameterByName = (name) => {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  authenticate = () => {
    const code = this.getParameterByName('code')

    if(!code) return

    this.getAxios().get(this.getOAuthAccessLink(code))
    .then(({data}) => {
      console.log(data)
    })

  }

  // ----- event handle functions -----
  handleChange = event => {
    var { name, value } = event.target

    this.setState({
      [name]: value
    })
  }

  handleSaveConfig = () => {
    this.mApiPost('/config', {
      clientID: this.state.clientID,
      clientSecret: this.state.clientSecret
    })
    // TODO handle error and response
  }

  handleAuthentification = () => {
    this.mApiPost('/config', {
      clientID: this.state.clientID,
      clientSecret: this.state.clientSecret
    })
    // TODO handle error and response
  }

  // ----- render functions -----

  renderHeader = title => (
    <div className={style.header}>
      <h4>{title}</h4>
    </div>
  )

  renderLabel = label => {
    return (
      <Col componentClass={ControlLabel} sm={3}>
        {label}
      </Col>
    )
  }

  renderInput = (label, name, props = {}) => (
    <FormGroup>
      {this.renderLabel(label)}
      <Col sm={7}>
        <FormControl name={name} {...props}
          value={this.state[name]}
          onChange={this.handleChange} />
      </Col>
    </FormGroup>
  )

  renderTextInput = (label, name, props = {}) => this.renderInput(label, name, {
    type: 'text', ...props
  })

  renderTextAreaInput = (label, name, props = {}) => this.renderInput(label, name, {
    componentClass: 'textarea',
    ...props
  })

  withNoLabel = (element) => (
    <FormGroup>
      <Col smOffset={3} sm={7}>
        {element}
      </Col>
    </FormGroup>
  )

  renderBtn = (label, handler) => (
    <Button  onClick={handler}>
      {label}
    </Button>
  )

  renderLinkButton = (label, link) => (
    <a href={link}>
      <Button className={style.formButton}>
        {label}
      </Button>
    </a>
  )

  renderConfigSection = () => (
    <div className={style.section}>
      {this.renderHeader('Configuration')}

      {this.renderTextInput('Client ID', 'clientID', {
        placeholder: 'Paste your client id here...'
      })}

      {this.renderTextInput('Client Secret', 'clientSecret', {
        placeholder: 'Paste your client secret here...'
      })}

      {this.renderTextInput('Hostname', 'hostname', {
        placeholder: 'Select the scope here...'
      })}


      // TODO: Change for a dropdown
      {this.renderTextInput('Scope', 'scope', {
        placeholder: 'Select the scope here...'
      })}

      {this.withNoLabel(
        this.renderLinkButton('Authenticate', this.getOAuthLink())
      )}

      {this.renderTextInput('Code', 'code', {
        disabled: true
      })}

      {this.renderTextInput('API token', 'apiToken', {
        disabled: true
      })}


      {this.withNoLabel(
        this.renderBtn('Save', this.handleSaveConfig)
      )}
    </div>
  )


  render() {
    return <Form horizontal>
      {this.renderConfigSection()}
    </Form>
  }
}
