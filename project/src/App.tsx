import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Send } from 'lucide-react';
import { ProgressBar } from './components/ProgressBar';
import { FormStep } from './components/FormStep';
import { FormField } from './components/FormField';
import { RadioGroup } from './components/RadioGroup';
import { FormData, FormErrors, SERVICE_TYPES, PROJECT_TYPES, BUDGET_RANGES, TIMELINES, CAR_SERVICES, PROPERTY_TYPES, FITNESS_GOALS } from './types/form';
import { validateStep } from './utils/validation';
import { submitFormData } from './utils/supabase';

const STEP_TITLES = ['Personal Info', 'Declaration', 'Product Structure', 'Final Details'];

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    uniqueID: '',
    uniqueIDAuthority: '',
    contactName: '',
    email: '',
    phone: '',
    authorizedcontactName: '',
    authorizedemail: '',
    authorizedphone: '',
    legalDeclaration: 'Supplier certifies that it gathered the provided information and such information is true and correct to the best of its knowledge and belief, as of the date that Supplier completes this form. Supplier acknowledges that Company will rely on this certification in determining the compliance of its products. Company acknowledges that Supplier may have relied on information provided by others in completing this form, and that Supplier may not have independently verified such information. However, in situations where Supplier has not independently verified information provided by others, Supplier agrees that, at a minimum, its suppliers have provided certifications regarding their contributions to the part(s), and those certifications are at least as comprehensive as the certification in this paragraph. If the Company and the Supplier enter into a written agreement with respect to the identified part(s), the terms and conditions of that agreement, including any warranty rights and/or remedies provided as part of that agreement, will be the sole and exclusive source of the Supplier\'s liability and the Company\'s remedies for issues that arise regarding information the Supplier provides in this form.',
    uncertaintyStatement: '',
    supplierAcceptance: false,
    serviceType: '',
    customServiceType: '',
    selectedIndex: null,
    products: [],
    newProductName: '',
    newSubProductName: '',
    selectedProductIndex: -1,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [useContractText, setUseContractText] = useState(true);

  const [newProductName, setNewProductName] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const addProduct = () => {
    if (!formData.newProductName.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      products: [
        ...prev.products,
        {
          name: prev.newProductName,
          subProducts: [],
          status: 'INCOMPLETE'
        }
      ],
      newProductName: '', // Clear input
    }));
  };
  const addSubProduct = (index: number) => {
  const { newSubProductName, products } = formData;
  if (!products[index] || !newSubProductName.trim()) return;
  const updatedProducts = [...products];
  updatedProducts[index].subProducts.push(newSubProductName);
  setFormData(prev => ({
    ...prev,
    products: updatedProducts,
    newSubProductName: '',
  }));
  };

  const removeSubProduct = (productIndex: number, subIndex: number) => {
    const updatedProducts = [...formData.products];
    updatedProducts[productIndex].subProducts.splice(subIndex, 1);
    setFormData((prev) => ({
      ...prev,
      products: updatedProducts,
    }));
  };
  
  
  const handleToggleContract = () => {
    setUseContractText((prev) => {
      const newValue = !prev;
  
      setFormData((form) => ({
        ...form,
        legalDeclaration: newValue
          ? 'Supplier certifies that it gathered the provided information and such information is true and correct to the best of its knowledge and belief, as of the date that Supplier completes this form. Supplier acknowledges that Company will rely on this certification in determining the compliance of its products. Company acknowledges that Supplier may have relied on information provided by others in completing this form, and that Supplier may not have independently verified such information. However, in situations where Supplier has not independently verified information provided by others, Supplier agrees that, at a minimum, its suppliers have provided certifications regarding their contributions to the part(s), and those certifications are at least as comprehensive as the certification in this paragraph. If the Company and the Supplier enter into a written agreement with respect to the identified part(s), the terms and conditions of that agreement, including any warranty rights and/or remedies provided as part of that agreement, will be the sole and exclusive source of the Supplier\'s liability and the Company\'s remedies for issues that arise regarding information the Supplier provides in this form.'
          : '',
        }));
  
      if (errors.legalDeclaration) {
        setErrors((e) => ({ ...e, legalDeclaration: '' }));
      }
  
      return newValue;
    });
  };
  

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
                companyName: '',
                uniqueID: '',
                uniqueIDAuthority: '',
                contactName: '',
                email: '',
                phone: '',
                authorizedcontactName: '',
                authorizedemail: '',
                authorizedphone: '',
                legalDeclaration: 'Supplier certifies that it gathered the provided information and such information is true and correct to the best of its knowledge and belief, as of the date that Supplier completes this form. Supplier acknowledges that Company will rely on this certification in determining the compliance of its products. Company acknowledges that Supplier may have relied on information provided by others in completing this form, and that Supplier may not have independently verified such information. However, in situations where Supplier has not independently verified information provided by others, Supplier agrees that, at a minimum, its suppliers have provided certifications regarding their contributions to the part(s), and those certifications are at least as comprehensive as the certification in this paragraph. If the Company and the Supplier enter into a written agreement with respect to the identified part(s), the terms and conditions of that agreement, including any warranty rights and/or remedies provided as part of that agreement, will be the sole and exclusive source of the Supplier\'s liability and the Company\'s remedies for issues that arise regarding information the Supplier provides in this form.',
                uncertaintyStatement: '',
                supplierAcceptance: false,
                serviceType: '',
                customServiceType: '',
                selectedIndex: null,
                products: [],
                newProductName: '',
                newSubProductName: '',
                selectedProductIndex: -1,
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
            title="Company Details" 
            description="Let's start with some basic information about your company"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                error={errors.companyName}
                required
                placeholder="Enter your Company Name"
              />
              <FormField
                label="Company Unique ID"
                name="uniqueID"
                value={formData.uniqueID}
                onChange={handleInputChange}
                error={errors.uniqueID}
                required
                placeholder="Enter your Company unique ID"
              />
              <FormField
                 label="Unique ID Authority"
                 name="uniqueIDAuthority"
                 value={formData?.uniqueIDAuthority ?? ''}
                 onChange={handleInputChange}
                 error={errors?.uniqueIDAuthority}
                />
              <FormField
                label="Contact Name"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                error={errors.contactName}
                required
                placeholder="Enter your Contact Name"
              />
              <FormField
                label="Contact Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                required
                placeholder="your.email@example.com"
              />
            <FormField
              label="Contact Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              error={errors.phone}
              required
              placeholder="+1 (555) 123-4567"
            />
            <FormField
                label="Authorized Representative Name"
                name="authorizedcontactName"
                value={formData.authorizedcontactName}
                onChange={handleInputChange}
                error={errors.authorizedcontactName}
                required
                placeholder="Enter your Authorized Contact Name"
              />
              <FormField
              label="Authorized Representative Email Address"
              name="authorizedemail"
              type="email"
              value={formData.authorizedemail}
              onChange={handleInputChange}
              error={errors.authorizedemail}
              required
              placeholder="your.email@example.com"
            />
            <FormField
              label="Authorized Representative Phone Number"
              name="authorizedphone"
              type="tel"
              value={formData.authorizedphone}
              onChange={handleInputChange}
              error={errors.authorizedphone}
              required
              placeholder="+1 (555) 123-4567"
            />
            </div>

          </FormStep>
        )}

        {currentStep === 2 && (
          <FormStep 
            title="Declaration - Legal Statement " 
            description="What type of service are you interested in?"
          >
            <FormField
              label="Legal Declaration"
              name="legalDeclaration"
              type="textarea"
              value={formData.legalDeclaration}
              onChange={handleInputChange}
              error={errors.legalDeclaration}
              rows={4}
            />     
            <label className="flex items-center space-x-3 mb-6 mt-2">
              <input
                type="checkbox"
                checked={useContractText}
                onChange={handleToggleContract}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-white text-sm">
              Use Legal Declaration Type 
              </span>
            </label>

            <FormField
              label="Uncertainty Statement"
              name="uncertaintyStatement"
              type="textarea"
              value={formData.uncertaintyStatement || ''}
              onChange={handleInputChange}
              error={errors.uncertaintyStatement}
              placeholder="Enter any uncertainties, concerns, or open-ended thoughts here..."
              rows={4}
            />
            
            <label className="flex items-start space-x-3 mb-6 mt-2">
              <input
                type="checkbox"
                name="supplierAcceptance"
                checked={formData.supplierAcceptance || false}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    supplierAcceptance: e.target.checked,
                  }))
                }
                className="form-checkbox h-5 w-5 mt-1 text-green-600"
              />
              <span className="text-white text-sm">
                I, the supplier, confirm that I have reviewed the information provided and accept the terms outlined in this declaration.
              </span>
            </label>
              


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
    title="Add Product" 
    description="Add your product or Subproduct below"
  >
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-white mb-1">New Product Name</label>
          <input
            type="text"
            name="newProductName"
            value={formData.newProductName}
            onChange={handleInputChange}
            placeholder="Enter Product Name"
            className="w-full px-4 py-2 border rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 border-white/30 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>
        <div>
          <button
            onClick={addProduct}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition"
          >
            Add Product
          </button>
        </div>
      </div>

      {formData.products.length > 0 && (
        <div className="space-y-6">
          {formData.products.map((product, index) => (
            <div key={index} className="bg-white/10 p-4 rounded-xl border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-semibold text-lg">{product.name}</h4>
                <button
                  onClick={() => {
                    const updated = [...formData.products];
                    updated.splice(index, 1);
                    setFormData(prev => ({
                      ...prev,
                      products: updated,
                      selectedIndex: null,
                    }));
                  }}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  Remove Product
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <input
                  type="text"
                  name="newSubProductName"
                  value={formData.newSubProductName}
                  onChange={handleInputChange}
                  placeholder="Enter SubProduct Name"
                  className="w-full px-4 py-2 border rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 border-white/30"
                />
                <button
                  onClick={() => addSubProduct(index)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
                >
                  Add SubProduct
                </button>
              </div>

              {product.subProducts.length > 0 && (
                <ul className="mt-3 list-disc list-inside text-sm text-gray-200">
                  {product.subProducts.map((sub, subIdx) => (
                    <li key={subIdx} className="flex justify-between items-center">
                      <span>{sub}</span>
                      <button
                        onClick={() => removeSubProduct(index, subIdx)}
                        className="text-red-300 hover:text-red-500 text-xs ml-2"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>

    <div className="mt-6">
  <h3 className="text-white text-xl font-semibold mb-4">Current Product Structure:</h3>

  <div className="border-l-2 border-white/30 pl-4 space-y-4">
    {formData.products.map((product, index) => (
      <div key={index} className="relative pl-4 border-l-2 border-white/30">
        {/* Product */}
        <div className="flex items-center space-x-3 mb-1">
          <div className="w-3 h-3 bg-red-500 rounded-sm" />
          <span className="text-white font-semibold">{product.name}</span>
          <button
            onClick={() => setSelectedIndex(index)}
            className="text-xs px-2 py-1 bg-white text-gray-700 rounded-md ml-2"
          >
            Select
          </button>
        </div>

        {/* SubProducts */}
        {product.subProducts?.length > 0 && (
          <div className="pl-6 mt-2 space-y-2 border-l-2 border-white/20">
            {product.subProducts.map((sub, subIdx) => (
              <div key={subIdx} className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-sm" />
                <span className="text-white text-sm">{sub}</span>
                <button
                  onClick={() => removeSubProduct(index, subIdx)}
                  className="text-xs px-2 py-1 bg-white text-gray-700 rounded-md"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
</div>

  </FormStep>
)}

        {currentStep === 4 && (
          <FormStep 
            title="Final Details" 
            description="Just a few more details to complete your submission"
          >
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