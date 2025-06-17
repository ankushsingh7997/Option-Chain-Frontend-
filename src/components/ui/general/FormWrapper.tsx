import React from 'react'
import BackGroundTheme from '../Theme/BackgroundTheme'
import Logo from '../general/Logo'
import Title from '../general/Title'
import GeneralError from '../general/GeneralError'

interface FormWrapperProps {
  // Form container props
  height?: string | number
  maxWidth?: string
  
  // Title props
  title: string
  message?: string
  navigation?: string
  navigationText?: string
  
  // Error handling
  generalError?: string
  
  // Form content
  children: React.ReactNode
  
  // Optional custom classes
  containerClassName?: string
  formClassName?: string
}

const FormWrapper: React.FC<FormWrapperProps> = ({
  height = '550px',
  maxWidth = 'max-w-md',
  title,
  message,
  navigation,
  navigationText,
  generalError,
  children,
  containerClassName = '',
  formClassName = ''
}) => {
  // Convert height to appropriate format
  const heightClass = typeof height === 'number' ? `h-[${height}px]` : `h-[${height}]`

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#010e1e] via-[#0a1829] to-[#010e1e] flex items-center justify-center p-4 relative overflow-hidden ${containerClassName}`}>
      <BackGroundTheme />

      <div className={`relative z-10 w-full ${maxWidth} ${heightClass}`}>
        <div className={`bg-background-3 h-full backdrop-blur-lg border border-light-gray rounded-2xl p-8 shadow-2xl ${formClassName}`}>
          <Logo />
          
          <Title 
            title={title}
            message={message}
            navigation={navigation}
            text={navigationText}
          />
          
          {generalError && (
            <GeneralError message={generalError} />
          )}

          {/* Form content */}
          {children}
        </div>
      </div>
    </div>
  )
}

export default FormWrapper