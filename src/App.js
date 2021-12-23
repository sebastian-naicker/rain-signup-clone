import debounce from 'lodash.debounce'
import Header from './components/Header'
import Heading from './components/Heading'
import Input from './components/Input'
import Button from './components/Button'
import Paragraph from "./components/Paragraph";
// import usePasswordStrength from "./hooks/usePasswordStrength";

import './App.css';
import {useEffect, useState} from "react";

function App() {
  const [passwordStrength, setPasswordStrength] = useState(null)
  const [error, setError] = useState()
  const [signUpData, setSignUpData] = useState({
    signUpSuccess: false,
    signUpError: undefined,
    user_id: null
  })
  const [state, setState] = useState({
    'first_name': '',
    'middle_name': '',
    'last_name': '',
    email: '',
    password: ''
  })
  
  const handleChange = ({ target: { name, value } }) => {
    setState({
      ...state,
      [name]: value
    })
  }
  
  const getPasswordStrength = async () => {
    const { password, first_name, last_name, middle_name, email } = state
    
    const payload = {
      password: password,
      'related_terms': [first_name, last_name, middle_name, email]
    }
    
    return await fetch('https://api-staging-0.rain.bh/api/1/password/strength', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      },
    })
  }
  
  const signUp = async () => {
    return await fetch('https://api-staging-0.rain.bh/api/2/signup', {
      method: 'POST',
      body: JSON.stringify(state),
      headers: {
        'Content-Type': 'application/json'
      },
    })
  }
  
  const handleOnPasswordChange = debounce(({ target: { value } }) => {
    setState({
      ...state,
      password: value
    })
  }, 200)
  
  const handleSubmit = () => {
    signUp()
      .then((res) => {
        console.log({res})
        if (res.status === 200) {
          setSignUpData({
            signUpSuccess: true,
            // user_id,
            signUpError: undefined
          })
        } else {
          setSignUpData({
            signUpSuccess: false,
            user_id: null,
            signUpError: res.message
          })
        }
      })
      .catch(err => {
        setSignUpData({
          signUpSuccess: false,
          user_id: null,
          signUpError: err
        })
      })
  }
  
  useEffect(() => {
    if (state.password !== '') {
      getPasswordStrength().then(({score}) => {
        setPasswordStrength(score)
      }).catch(err => setError(err))
    }
  }, [state.password])
  
  useEffect(() => {
    console.log('SIGN_UP_DATA', signUpData)
    console.log('PASSWORD_STRENGTH', passwordStrength)
    console.log('ERROR', error)
  }, [signUpData, passwordStrength, error])
  
  // const { isLoading, data, error } = usePasswordStrength()
  
  return (
    <div className="App">
      <Header />
      {signUpData.signUpError && (
        <div>
          {JSON.stringify(signUpData.signUpError)}
        </div>
      )}
      <div>
        <Heading>Create Account</Heading>
        <form action="https://api-staging-0.rain.bh/api/2/signup">
          <div>
            <Input onChange={handleChange} name='first_name' placeholder='First name' type="text"/>
            <Input onChange={handleChange} name="middle_name" placeholder='Middle name (optional)' type="text"/>
          </div>
          <Input onChange={handleChange} name='last_name' placeholder="Last name" type="text"/>
          <Input onChange={handleChange} name='email' placeholder="Email" type='email' />
          <Input onChange={handleOnPasswordChange} name='password' placeholder="Password" type='password' />
        </form>
        <Paragraph>
          By clicking below to create your account, you are confirming that you are 21 years of age or older and agreeing to our
          <a href="https://rain-react-staging-0.rain.bh/en/legal-policies/terms/agreement">Terms of Service</a>
        </Paragraph>
        <Button onClick={handleSubmit}>Create account</Button>
        <a href="https://rain-react-staging-0.rain.bh/signin">Already have an account? Sign in now</a>
      </div>
    </div>
  );
}

export default App;
