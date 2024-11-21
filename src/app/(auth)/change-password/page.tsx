"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Eye, EyeOff } from 'lucide-react'
import axios from 'axios'
import { useSession } from 'next-auth/react'

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const { data: session } = useSession();
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  const validatePasswords = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match')
      return false
    }
    if (formData.newPassword === formData.currentPassword) {
      setError('New password must be different from current password')
      return false
    }
    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePasswords()) {
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await axios.post('/api/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        email: session?.user?.email,
      })
      
      setSuccess('Password successfully changed')
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  return (
    <div className=" relative flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="relative z-10 w-full max-w-lg">

        {/* Change Password Card */}
        <Card className="mx-4 sm:mx-0 border-none shadow-2xl bg-white/95 backdrop-blur">
          <CardHeader className="space-y-1 px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl font-normal text-gray-700 text-center">
              Update Your Password
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-gray-600">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="bg-white/50 border border-gray-200 focus:bg-white transition-colors pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-gray-600">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="bg-white/50 border border-gray-200 focus:bg-white transition-colors pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-600">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="bg-white/50 border border-gray-200 focus:bg-white transition-colors pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500 text-white w-fit text-sm py-1 px-3 rounded-md">
                  {success}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primaryBlue hover:bg-blue-700 text-white font-semibold py-3 rounded-full transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Updating Password..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}