import React, { useReducer } from 'react'
import { useMutation } from '@apollo/client'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { loginUser } from '../graphql/user/user'
import { setUserData } from '../store/slices/userSlice'
import Input from '../components/ui/Input/Input'
import Button from '../components/ui/Button/Button'
import { LoginVariables } from '../graphql/user/types'

import { extractErrorMessage } from '../apollo/error'
import FormWrapper from '../components/ui/general/FormWrapper'
import { useToast } from '../hooks/useToast'

// Form state interface
interface FormState {
  emailOrNumber: string
  password: string
  errors: {
    emailOrNumber?: string
    password?: string
    general?: string
  }
  isLoading: boolean
}

// Form actions
type FormAction =
  | { type: 'SET_FIELD'; field: keyof FormState; value: string }
  | { type: 'SET_ERROR'; field: keyof FormState['errors']; error: string }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'RESET_FORM' }

// Initial form state
const initialState: FormState = {
  emailOrNumber: '',
  password: '',
  errors: {},
  isLoading: false
}

// Form reducer
const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_FIELD':return {...state, [action.field]: action.value,errors: { ...state.errors, [action.field]: undefined, general: undefined }}
    case 'SET_ERROR':return {...state,errors: { ...state.errors, [action.field]: action.error }}
    case 'CLEAR_ERRORS':return {...state,errors: {}}
    case 'SET_LOADING':return {...state,isLoading: action.loading}
    case 'RESET_FORM':return initialState
    default:return state
  }

}

const SignIn: React.FC = () => {
  const [state, dispatch] = useReducer(formReducer, initialState)
  const reduxDispatch = useDispatch()
  const navigate = useNavigate()
  const toast=useToast()
  
  const [login] = useMutation(loginUser, {onCompleted: (data) => {
      if (data.login.status === true) {
        toast.success(data.login.message)
        reduxDispatch(setUserData({ name: data.login.user.name, email: data.login.user.email, number: data.login.user.number, loginStatus: true }))
        navigate('/dashboard');
      } else {
        dispatch({ type: 'SET_LOADING', loading: false })
        dispatch({ type: 'SET_ERROR', field: 'general', error: data.login.message || 'Login failed'})
      }
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error, 'Login failed');
    
      dispatch({ type: 'SET_LOADING', loading: false })
      dispatch({ type: 'SET_ERROR', field: 'general', error: errorMessage })
    }
  })

  const validateForm = (): boolean => {
    let isValid = true

    if (!state.emailOrNumber.trim()) {
      dispatch({ type: 'SET_ERROR', field: 'emailOrNumber', error: 'Email or phone number is required' })
      isValid = false
    }

    if (!state.password.trim()) {
      dispatch({ type: 'SET_ERROR', field: 'password', error: 'Password is required' })
      isValid = false
    }

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    dispatch({ type: 'SET_LOADING', loading: true })
    dispatch({ type: 'CLEAR_ERRORS' })

    const variables: LoginVariables = {
      input: {
        emailOrNumber: state.emailOrNumber,
        password: state.password
      }
    }

    try {
      await login({ variables })
    } catch (error) {
      // Error is handled in onError callback
    }
  }

  const handleInputChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_FIELD', field, value: e.target.value })
  }

  return (
    <FormWrapper
      height="450px"
      title="Welcome Back"
      message="Don't have an account yet?"
      navigation="/signup"
      navigationText="Sign up"
      generalError={state.errors.general}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="email address"
          value={state.emailOrNumber}
          onChange={handleInputChange('emailOrNumber')}
          icon={<Mail size={18} className="text-[#9A9A9A]" />}
          iconPosition="left"
          error={state.errors.emailOrNumber}
          disabled={state.isLoading}
          inputClassName="font-montserrat text-14"
        />
  
        <Input
          type="password"
          placeholder="Password"
          value={state.password}
          onChange={handleInputChange('password')}
          icon={<Lock size={18} className="text-[#9A9A9A]" />}
          iconPosition="left"
          error={state.errors.password}
          disabled={state.isLoading}
          inputClassName="font-montserrat text-14"
        />
  
        <Button
          type="submit"
          text={state.isLoading ? "Signing in..." : "Login"}
          variant="primary"
          disabled={state.isLoading}
          className="w-full h-12 text-white bg-sec-blue hover:bg-[#3f59d8] disabled:bg-[#4B4C51] disabled:cursor-not-allowed rounded-lg font-ibm font-medium transition-colors"
        />
      </form>
    </FormWrapper>
  )
}

export default SignIn