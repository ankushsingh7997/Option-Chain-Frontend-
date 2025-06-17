// pages/SignUp.tsx
import React, { useReducer } from 'react'
import { useMutation } from '@apollo/client'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Phone } from 'lucide-react'
import { registerUser } from '../graphql/user/user'
import { setUserData } from '../store/slices/userSlice'
import Input from '../components/ui/Input/Input'
import Button from '../components/ui/Button/Button'
import { RegisterVariables } from '../graphql/user/types'
import { extractErrorMessage } from '../apollo/error'
import FormWrapper from '../components/ui/general/FormWrapper'
import { useToast } from '../hooks/useToast'

// Form state interface
interface FormState {
  email: string
  name: string
  number: string
  password: string
  confirmPassword: string
  errors: {
    email?: string
    name?: string
    number?: string
    password?: string
    confirmPassword?: string
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
  email: '',
  name: '',
  number: '',
  password: '',
  confirmPassword: '',
  errors: {},
  isLoading: false
}

// Form reducer
const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_FIELD': return { ...state, [action.field]: action.value, errors: { ...state.errors, [action.field]: undefined, general: undefined } };
    case 'SET_ERROR': return { ...state, errors: { ...state.errors, [action.field]: action.error } };
    case 'CLEAR_ERRORS': return { ...state, errors: {} };
    case 'SET_LOADING': return { ...state, isLoading: action.loading };
    case 'RESET_FORM': return initialState;
    default: return state;
  }
};


const SignUp: React.FC = () => {
  const [state, dispatch] = useReducer(formReducer, initialState)
  const reduxDispatch = useDispatch()
  const navigate = useNavigate()
  const toast=useToast()
  
  const [register] = useMutation(registerUser, {onCompleted: (data) => {
        dispatch({ type: 'SET_LOADING', loading: false })
        if (data.register.status) { reduxDispatch(setUserData({name: data.register.user.name,email: data.register.user.email,number: data.register.user.number,loginStatus: true }))
        toast.success(data.register.message)
        navigate('/dashboard')
      } else {
        dispatch({ type: 'SET_ERROR', field: 'general',error: data.register.message || 'Registration failed'})
      }
    },
    onError: (error) => {
      dispatch({ type: 'SET_LOADING', loading: false })
      const errorMessage = extractErrorMessage(error, 'Registeration Failed');
      dispatch({ type: 'SET_ERROR', field: 'general', error: errorMessage })
    }
  })

  const validateForm = (): boolean => {
    let isValid = true

    // Email validation
    if (!state.email.trim()) {
      dispatch({ type: 'SET_ERROR', field: 'email', error: 'Email is required' })
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
      dispatch({ type: 'SET_ERROR', field: 'email', error: 'Please enter a valid email' })
      isValid = false
    }

    // Name validation
    if (!state.name.trim()) {
      dispatch({ type: 'SET_ERROR', field: 'name', error: 'Name is required' })
      isValid = false
    } else if (state.name.trim().length < 2) {
      dispatch({ type: 'SET_ERROR', field: 'name', error: 'Name must be at least 2 characters' })
      isValid = false
    }

    // Number validation
    if (!state.number.trim()) {
      dispatch({ type: 'SET_ERROR', field: 'number', error: 'Phone number is required' })
      isValid = false
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(state.number)) {
      dispatch({ type: 'SET_ERROR', field: 'number', error: 'Please enter a valid phone number' })
      isValid = false
    }

    // Password validation
    if (!state.password.trim()) {
      dispatch({ type: 'SET_ERROR', field: 'password', error: 'Password is required' })
      isValid = false
    } else if (state.password.length < 6) {
      dispatch({ type: 'SET_ERROR', field: 'password', error: 'Password must be at least 6 characters' })
      isValid = false
    }

    // Confirm password validation
    if (!state.confirmPassword.trim()) {
      dispatch({ type: 'SET_ERROR', field: 'confirmPassword', error: 'Please confirm your password' })
      isValid = false
    } else if (state.password !== state.confirmPassword) {
      dispatch({ type: 'SET_ERROR', field: 'confirmPassword', error: 'Passwords do not match' })
      isValid = false
    }

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    dispatch({ type: 'SET_LOADING', loading: true })
    dispatch({ type: 'CLEAR_ERRORS' })

    const variables: RegisterVariables = {
      input: {
        email: state.email,
        name: state.name,
        number: state.number,
        password: state.password,
        confirm_password: state.confirmPassword
      }
    }

    try {
      await register({ variables })
    } catch (error) {
      // Error handling is done in onError callback
    }
  }

  const handleInputChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_FIELD', field, value: e.target.value })
  }

  return (
    <FormWrapper
      height="550px"
      title="Create Account"
      message="Already have an account?"
      navigation="/signin"
      navigationText="Sign in"
      generalError={state.errors.general}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Full Name"
          value={state.name}
          onChange={handleInputChange('name')}
          icon={<User size={18} className="text-[#9A9A9A]" />}
          iconPosition="left"
          error={state.errors.name}
          disabled={state.isLoading}
          inputClassName="font-montserrat text-14"
        />
  
        <Input
          type="email"
          placeholder="Email Address"
          value={state.email}
          onChange={handleInputChange('email')}
          icon={<Mail size={18} className="text-[#9A9A9A]" />}
          iconPosition="left"
          error={state.errors.email}
          disabled={state.isLoading}
          inputClassName="font-montserrat text-14"
        />
  
        <Input
          type="tel"
          placeholder="Phone Number"
          value={state.number}
          onChange={handleInputChange('number')}
          icon={<Phone size={18} className="text-[#9A9A9A]" />}
          iconPosition="left"
          error={state.errors.number}
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
  
        <Input
          type="password"
          placeholder="Confirm Password"
          value={state.confirmPassword}
          onChange={handleInputChange('confirmPassword')}
          icon={<Lock size={18} className="text-[#9A9A9A]" />}
          iconPosition="left"
          error={state.errors.confirmPassword}
          disabled={state.isLoading}
          inputClassName="font-montserrat text-14"
        />
  
        <Button
          type="submit"
          text={state.isLoading ? "Creating Account..." : "Sign Up"}
          variant="primary"
          disabled={state.isLoading}
          className="w-full h-12 text-white bg-sec-blue hover:bg-[#3f59d8] disabled:bg-[#4B4C51] disabled:cursor-not-allowed rounded-lg font-ibm font-medium transition-colors"
        />
      </form>
    </FormWrapper>
  )
}

export default SignUp