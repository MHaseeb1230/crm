'use client'

import PhoneInputWithCountry from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

interface PhoneInputProps {
  value: string
  onChange: (value: string | undefined) => void
  className?: string
}

export default function PhoneInput({ value, onChange, className = '' }: PhoneInputProps) {
  return (
    <div className={`phone-input-wrapper ${className}`}>
      <PhoneInputWithCountry
        international
        defaultCountry="US"
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <style jsx global>{`
        .phone-input-wrapper .PhoneInputInput {
          border: none;
          outline: none;
          width: 100%;
          padding: 0.5rem;
        }
        .phone-input-wrapper .PhoneInputInput:focus {
          outline: none;
        }
        .phone-input-wrapper .PhoneInputCountryIcon {
          width: 1.5rem;
          height: 1.5rem;
        }
      `}</style>
    </div>
  )
}

