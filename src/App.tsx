import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Send } from 'lucide-react';
import { ProgressBar } from './components/ProgressBar';
import { FormStep } from './components/FormStep';
import { FormField } from './components/FormField';
import { RadioGroup } from './components/RadioGroup';
import { FormData, FormErrors, SERVICE_TYPES, PROJECT_TYPES, BUDGET_RANGES, TIMELINES, CAR_SERVICES, PROPERTY_TYPES, FITNESS_GOALS } from './types/form';
import { validateStep } from './utils/validation';
import { submitFormData } from './utils/supabase';

const STEP_TITLES = ['Personal Info', 'Service Type', 'Details', 'Final Details'];

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    serviceType: '',
    additionalRequirements: '',
    hearAboutUs: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const nextStep = () => {
    const stepErrors = validateStep(currentStep, formData);
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    setErrors({});
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    const stepErrors = validateStep(currentStep, formData);
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // const result = await submitFormData(formData);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-12 max-w-md w-full text-center border border-white/20">
          <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Thank You!</h2>
          <p className="text-gray-200 mb-8 text-lg">
            Your form has been submitted successfully. We'll get back to you within 24 hours.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setCurrentStep(1);
              setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                serviceType: '',
                additionalRequirements: '',
                hearAboutUs: ''
              });
            }}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 transform hover:scale-105 font-semibold"
          >
            Submit Another Form
          </button>
        </div>
      </div>
    );
  }

  const serviceOptions = Object.entries(SERVICE_TYPES).map(([value, label]) => ({
    value,
    label,
    description: getServiceDescription(value)
  }));

  const projectOptions = Object.entries(PROJECT_TYPES).map(([value, label]) => ({ value, label }));
  const budgetOptions = Object.entries(BUDGET_RANGES).map(([value, label]) => ({ value, label }));
  const timelineOptions = Object.entries(TIMELINES).map(([value, label]) => ({ value, label }));
  const carServiceOptions = Object.entries(CAR_SERVICES).map(([value, label]) => ({ value, label }));
  const propertyOptions = Object.entries(PROPERTY_TYPES).map(([value, label]) => ({ value, label }));
  const fitnessGoalOptions = Object.entries(FITNESS_GOALS).map(([value, label]) => ({ value, label }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <ProgressBar 
          currentStep={currentStep} 
          totalSteps={4} 
          stepTitles={STEP_TITLES}
        />

        {currentStep === 1 && (
          <FormStep 
            title="Personal Information" 
            description="Let's start with some basic information about you"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                required
                placeholder="Enter your first name"
              />
              <FormField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                required
                placeholder="Enter your last name"
              />
            </div>
            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              required
              placeholder="your.email@example.com"
            />
            <FormField
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              error={errors.phone}
              required
              placeholder="+1 (555) 123-4567"
            />
          </FormStep>
        )}

        {currentStep === 2 && (
          <FormStep 
            title="Service Selection" 
            description="What type of service are you interested in?"
          >
            <RadioGroup
              name="serviceType"
              label="Choose a Service"
              options={serviceOptions}
              value={formData.serviceType}
              onChange={(value) => handleRadioChange('serviceType', value)}
              error={errors.serviceType}
              required
            />
            
            {formData.serviceType === 'custom' && (
              <FormField
                label="Please specify your service type"
                name="customServiceType"
                value={formData.customServiceType || ''}
                onChange={handleInputChange}
                error={errors.customServiceType}
                required
                placeholder="e.g., Photography, Legal Services, etc."
              />
            )}
          </FormStep>
        )}

        {currentStep === 3 && (
          <FormStep 
            title="Project Details" 
            description="Tell us more about your specific needs"
          >
            {(formData.serviceType === 'web_development' || formData.serviceType === 'mobile_app') && (
              <>
                <FormField
                  label="Project Type"
                  name="projectType"
                  type="select"
                  value={formData.projectType || ''}
                  onChange={handleInputChange}
                  error={errors.projectType}
                  options={projectOptions}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Budget Range"
                    name="budget"
                    type="select"
                    value={formData.budget || ''}
                    onChange={handleInputChange}
                    error={errors.budget}
                    options={budgetOptions}
                    required
                  />
                  <FormField
                    label="Timeline"
                    name="timeline"
                    type="select"
                    value={formData.timeline || ''}
                    onChange={handleInputChange}
                    error={errors.timeline}
                    options={timelineOptions}
                    required
                  />
                </div>
              </>
            )}

            {formData.serviceType === 'business_consulting' && (
              <>
                <FormField
                  label="Business Name"
                  name="businessName"
                  value={formData.businessName || ''}
                  onChange={handleInputChange}
                  error={errors.businessName}
                  required
                  placeholder="Your business name"
                />
                <FormField
                  label="Industry"
                  name="industry"
                  type="select"
                  value={formData.industry || ''}
                  onChange={handleInputChange}
                  error={errors.industry}
                  options={[
                    { value: 'technology', label: 'Technology' },
                    { value: 'healthcare', label: 'Healthcare' },
                    { value: 'finance', label: 'Finance' },
                    { value: 'retail', label: 'Retail' },
                    { value: 'manufacturing', label: 'Manufacturing' },
                    { value: 'other', label: 'Other' }
                  ]}
                  required
                />
              </>
            )}

            {formData.serviceType === 'event_planning' && (
              <>
                <FormField
                  label="Event Type"
                  name="eventType"
                  type="select"
                  value={formData.eventType || ''}
                  onChange={handleInputChange}
                  error={errors.eventType}
                  options={[
                    { value: 'wedding', label: 'Wedding' },
                    { value: 'corporate', label: 'Corporate Event' },
                    { value: 'birthday', label: 'Birthday Party' },
                    { value: 'conference', label: 'Conference' },
                    { value: 'other', label: 'Other' }
                  ]}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Event Date"
                    name="eventDate"
                    type="date"
                    value={formData.eventDate || ''}
                    onChange={handleInputChange}
                    error={errors.eventDate}
                    required
                  />
                  <FormField
                    label="Guest Count"
                    name="guestCount"
                    type="select"
                    value={formData.guestCount || ''}
                    onChange={handleInputChange}
                    error={errors.guestCount}
                    options={[
                      { value: '1-25', label: '1-25 guests' },
                      { value: '26-50', label: '26-50 guests' },
                      { value: '51-100', label: '51-100 guests' },
                      { value: '100+', label: '100+ guests' }
                    ]}
                    required
                  />
                </div>
              </>
            )}

            {formData.serviceType === 'car' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    label="Car Make"
                    name="carMake"
                    value={formData.carMake || ''}
                    onChange={handleInputChange}
                    error={errors.carMake}
                    required
                    placeholder="e.g., Toyota, Honda"
                  />
                  <FormField
                    label="Car Model"
                    name="carModel"
                    value={formData.carModel || ''}
                    onChange={handleInputChange}
                    error={errors.carModel}
                    required
                    placeholder="e.g., Camry, Civic"
                  />
                  <FormField
                    label="Year"
                    name="carYear"
                    value={formData.carYear || ''}
                    onChange={handleInputChange}
                    error={errors.carYear}
                    required
                    placeholder="e.g., 2020"
                  />
                </div>
                <FormField
                  label="Service Needed"
                  name="serviceNeeded"
                  type="select"
                  value={formData.serviceNeeded || ''}
                  onChange={handleInputChange}
                  error={errors.serviceNeeded}
                  options={carServiceOptions}
                  required
                />
                <FormField
                  label="Current Mileage"
                  name="mileage"
                  value={formData.mileage || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., 45,000 miles"
                />
              </>
            )}

            {formData.serviceType === 'real_estate' && (
              <>
                <FormField
                  label="Property Type"
                  name="propertyType"
                  type="select"
                  value={formData.propertyType || ''}
                  onChange={handleInputChange}
                  error={errors.propertyType}
                  options={propertyOptions}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Location"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleInputChange}
                    error={errors.location}
                    required
                    placeholder="City, State"
                  />
                  <FormField
                    label="Property Value Range"
                    name="propertyValue"
                    type="select"
                    value={formData.propertyValue || ''}
                    onChange={handleInputChange}
                    options={[
                      { value: 'under_100k', label: 'Under $100,000' },
                      { value: '100k_300k', label: '$100,000 - $300,000' },
                      { value: '300k_500k', label: '$300,000 - $500,000' },
                      { value: '500k_1m', label: '$500,000 - $1,000,000' },
                      { value: 'over_1m', label: 'Over $1,000,000' }
                    ]}
                  />
                </div>
              </>
            )}

            {formData.serviceType === 'fitness' && (
              <>
                <FormField
                  label="Fitness Goal"
                  name="fitnessGoal"
                  type="select"
                  value={formData.fitnessGoal || ''}
                  onChange={handleInputChange}
                  error={errors.fitnessGoal}
                  options={fitnessGoalOptions}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Experience Level"
                    name="experience"
                    type="select"
                    value={formData.experience || ''}
                    onChange={handleInputChange}
                    error={errors.experience}
                    options={[
                      { value: 'beginner', label: 'Beginner' },
                      { value: 'intermediate', label: 'Intermediate' },
                      { value: 'advanced', label: 'Advanced' }
                    ]}
                    required
                  />
                  <FormField
                    label="Availability"
                    name="availability"
                    type="select"
                    value={formData.availability || ''}
                    onChange={handleInputChange}
                    options={[
                      { value: 'morning', label: 'Morning (6AM-12PM)' },
                      { value: 'afternoon', label: 'Afternoon (12PM-6PM)' },
                      { value: 'evening', label: 'Evening (6PM-10PM)' },
                      { value: 'flexible', label: 'Flexible' }
                    ]}
                  />
                </div>
              </>
            )}

            {formData.serviceType === 'digital_marketing' && (
              <div className="text-center py-12">
                <p className="text-gray-200 text-lg">
                  We'll discuss your digital marketing needs in detail during our consultation call.
                </p>
              </div>
            )}

            {formData.serviceType === 'custom' && formData.customServiceType && (
              <div className="text-center py-12">
                <p className="text-gray-200 text-lg">
                  Thank you for specifying "{formData.customServiceType}". We'll discuss your specific needs in detail during our consultation.
                </p>
              </div>
            )}
          </FormStep>
        )}

        {currentStep === 4 && (
          <FormStep 
            title="Final Details" 
            description="Just a few more details to complete your submission"
          >
            <FormField
              label="Additional Requirements"
              name="additionalRequirements"
              type="textarea"
              value={formData.additionalRequirements}
              onChange={handleInputChange}
              placeholder="Tell us about any specific requirements, goals, or additional information..."
              rows={4}
            />
            <FormField
              label="How did you hear about us?"
              name="hearAboutUs"
              type="select"
              value={formData.hearAboutUs}
              onChange={handleInputChange}
              error={errors.hearAboutUs}
              options={[
                { value: 'google', label: 'Google Search' },
                { value: 'social_media', label: 'Social Media' },
                { value: 'referral', label: 'Referral from friend/colleague' },
                { value: 'advertisement', label: 'Advertisement' },
                { value: 'other', label: 'Other' }
              ]}
              required
            />
          </FormStep>
        )}

        <div className="flex justify-between items-center mt-12 pt-8">
          {currentStep > 1 ? (
            <button
              onClick={prevStep}
              className="flex items-center px-8 py-4 text-white hover:text-gray-200 transition-all duration-200 transform hover:scale-105 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Previous
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              className="flex items-center px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg"
            >
              Next
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Form
                  <Send className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function getServiceDescription(serviceType: string): string {
  const descriptions = {
    web_development: 'Custom websites and web applications',
    mobile_app: 'iOS and Android mobile applications',
    digital_marketing: 'SEO, social media, and online advertising',
    business_consulting: 'Strategic business advice and planning',
    event_planning: 'Complete event management and coordination',
    car: 'Automotive services and maintenance',
    real_estate: 'Property buying, selling, and management',
    fitness: 'Personal training and fitness coaching',
    custom: 'Tell us about your specific needs'
  };
  return descriptions[serviceType as keyof typeof descriptions] || '';
}

export default App;