'use client'
import { useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    course: '',
    year: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const courses = [
    "BS Information Technology",
    "BS Computer Science",
    "BS Civil Engineering",
    "BS Mechanical Engineering",
    "BS Electrical Engineering",
    // Add more courses as needed
  ]

  const yearLevels = ["1st Year", "2nd Year", "3rd Year", "4th Year"]

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isLogin) {
        console.log('Logging in with:', formData.email, formData.password)
      } else {
        console.log('Signing up with:', formData)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/uno-r-campus.jpg')",
        }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gray-900/75" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-lg">
        {/* Welcome Text */}
        <div className="text-center text-white mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 px-4">
            Welcome to UNO-R Portal
          </h1>
          <p className="text-base sm:text-lg text-gray-200 px-4">
            Pay tuition fees and request exam permits seamlessly
          </p>
        </div>

        {/* Login/Signup Card */}
        <Card className="mx-4 sm:mx-0 border-none shadow-2xl bg-white/95 backdrop-blur">
          <CardHeader className="space-y-1 px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl font-normal text-gray-700 text-center">
              {isLogin ? 'Log In to UNO-R Portal' : 'Create Your Account'}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={onSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-600">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="bg-white/50 border border-gray-200 focus:bg-white transition-colors"
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-600">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-white/50 border border-gray-200 focus:bg-white transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-600">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="bg-white/50 border border-gray-200 focus:bg-white transition-colors pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="course" className="text-gray-600">
                      Course
                    </Label>
                    <Select 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, course: value }))}
                    >
                      <SelectTrigger className="bg-white/50 border border-gray-200 focus:bg-white transition-colors">
                        <SelectValue placeholder="Select your course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course} value={course}>
                            {course}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-gray-600">
                      Year Level
                    </Label>
                    <Select
                      onValueChange={(value) => setFormData(prev => ({ ...prev, year: value }))}
                    >
                      <SelectTrigger className="bg-white/50 border border-gray-200 focus:bg-white transition-colors">
                        <SelectValue placeholder="Select your year level" />
                      </SelectTrigger>
                      <SelectContent>
                        {yearLevels.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full bg-primaryBlue hover:bg-blue-700 text-white font-semibold py-3 rounded-full transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (isLogin ? "Logging in..." : "Creating Account...") : (isLogin ? "Sign In" : "Create Account")}
              </Button>
              
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  {isLogin ? "Don't have an account yet?" : "Already have an account?"}{' '}
                  <button 
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-primaryBlue hover:text-blue-700 underline underline-offset-2 font-medium transition-colors"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 px-4">
          <p className="text-sm text-gray-300">
            © 2024 University of Negros Occidental-Recoletos. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}