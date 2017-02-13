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
      loading: true,
      clientID: '',
      clientSecret: '',
      hostname: '',
      scope: '',
      verificationToken: '',
      apiToken: null
    }
  }

  componentDidMount() {
    this.fetchConfig()
    .then(() => {
      this.authenticate()
    })
  }

  // TODO handle error
  // TODO add eslint about missing class methodp

  getAxios = () => this.props.bp.axios
  mApi = (method, url, body) => this.getAxios()[method]('/api/botpress-slack' + url, body)
  mApiGet = (url, body) => this.mApi('get', url, body)
  mApiPost = (url, body) => this.mApi('post', url, body)

  fetchConfig = () => {
    return this.mApiGet('/config').then(({data}) => {
      this.setState({
        clientID: data.clientID,
        clientSecret: data.clientSecret,
        hostname: data.hostname,
        scope: data.scope,
        apiToken: data.apiToken,
        verificationToken: data.verificationToken,
        loading: false
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

  getOAuthTestLink = () => {
    return "https://slack.com/api/auth.test" + 
      "?token=" + this.state.apiToken
  }

  getParameterByName = (name) => {
    const url = window.location.href
    name = name.replace(/[\[\]]/g, "\\$&")
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, " "))
  }

  isAuthenticate = () => {
    if (!this.state.apiToken) return false

    return this.getAxios().get(this.getOAuthTestLink())
    .then(({data}) => {
      if (data.ok) return true
      console.log("You are not authenticate correctly, retry to authenticate again...")
      return false
    })
    .catch((err) => {
      console.log("You are not authenticate: " + err)
      return false
    })
  }

  authenticate = () => {
    const code = this.getParameterByName('code')

    if(!code || this.state.apiToken) return

    this.getAxios().get(this.getOAuthAccessLink(code))
    .then(({data}) => {
      if (!data.ok) {
        console.log("You encountered an error during authentification: " + data.error)
        return
      }

      this.setState({
        apiToken: data.access_token
      })

      setImmediate(() => {
        this.handleSaveConfig()
      })
    })
  }

  handleChange = event => {
    const { name, value } = event.target

    this.setState({
      [name]: value
    })
  }

  handleSaveConfig = () => {
    this.mApiPost('/config', {
      clientID: this.state.clientID,
      clientSecret: this.state.clientSecret,
      hostname: this.state.hostname,
      apiToken: this.state.apiToken,
      verificationToken: this.state.verificationToken,
      scope: this.state.scope
    })
    .then(({data}) => {
      console.log("New configurations have been saved successfully.")
      this.fetchConfig()
    })
    .catch(err => {
      console.log("An error occured while saving configurations...")
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

  renderTextAreaInput = (label, name, props = {}) => {
    return this.renderInput(label, name, {
      componentClass: 'textarea',
      rows: 2,
      ...props
    })
  }

  withNoLabel = (element) => (
    <FormGroup>
      <Col smOffset={3} sm={7}>
        {element}
      </Col>
    </FormGroup>
  )

  renderBtn = (label, handler) => (
    <Button  onClick={handler}>{label}</Button>
  )

  renderLinkButton = (label, link) => (
    <a href={link}>
      <Button className={style.formButton}>
        {label}
      </Button>
    </a>
  )

  renderAuthentificationButton = () => {
    return this.withNoLabel(this.renderLinkButton('Authenticate', this.getOAuthLink()))
  }

  renderApiToken = () => {
    return this.renderTextInput('API token', 'apiToken', {
      disabled: true
    })
  }


  renderConfigSection = () => {
    return (
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

        {this.renderTextInput('Verification Token', 'verificationToken', {
          placeholder: 'Select the scope here...'
        })}
    
        // TODO: Change for a dropdown
        {this.renderTextInput('Scope', 'scope', {
          placeholder: 'Select the scope here...'
        })}
    
        {!this.isAuthenticate()
          ? this.renderAuthentificationButton()
          : this.renderApiToken()}
    
        {this.withNoLabel(
          this.renderBtn('Save', this.handleSaveConfig)
        )}
      </div>
    )
  }


  render() {
    if (this.state.loading) return null
    return <Form horizontal>
      {this.renderConfigSection()}
    </Form>
  }
}
