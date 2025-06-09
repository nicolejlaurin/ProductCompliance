import { FormData, FormErrors } from '../types/form';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const validateStep = (step: number, formData: FormData): FormErrors => {
  const errors: FormErrors = {};

  switch (step) {
    case 1:
      if (!formData.firstName.trim()) {
        errors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        errors.lastName = 'Last name is required';
      }
      if (!formData.email.trim()) {
        errors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
      if (!formData.phone.trim()) {
        errors.phone = 'Phone number is required';
      } else if (!validatePhone(formData.phone)) {
        errors.phone = 'Please enter a valid phone number';
      }
      break;

    case 2:
      if (!formData.serviceType) {
        errors.serviceType = 'Please select a service type';
      }
      if (formData.serviceType === 'custom' && !formData.customServiceType?.trim()) {
        errors.customServiceType = 'Please specify your service type';
      }
      break;

    case 3:
      if (formData.serviceType === 'web_development' || formData.serviceType === 'mobile_app') {
        if (!formData.projectType) {
          errors.projectType = 'Please select a project type';
        }
        if (!formData.budget) {
          errors.budget = 'Please select a budget range';
        }
        if (!formData.timeline) {
          errors.timeline = 'Please select a timeline';
        }
      }
      
      if (formData.serviceType === 'business_consulting') {
        if (!formData.businessName?.trim()) {
          errors.businessName = 'Business name is required';
        }
        if (!formData.industry) {
          errors.industry = 'Please select an industry';
        }
      }
      
      if (formData.serviceType === 'event_planning') {
        if (!formData.eventType) {
          errors.eventType = 'Please select an event type';
        }
        if (!formData.eventDate) {
          errors.eventDate = 'Event date is required';
        }
        if (!formData.guestCount) {
          errors.guestCount = 'Please select guest count';
        }
      }

      if (formData.serviceType === 'car') {
        if (!formData.carMake?.trim()) {
          errors.carMake = 'Car make is required';
        }
        if (!formData.carModel?.trim()) {
          errors.carModel = 'Car model is required';
        }
        if (!formData.carYear?.trim()) {
          errors.carYear = 'Car year is required';
        }
        if (!formData.serviceNeeded) {
          errors.serviceNeeded = 'Please select service needed';
        }
      }

      if (formData.serviceType === 'real_estate') {
        if (!formData.propertyType) {
          errors.propertyType = 'Please select property type';
        }
        if (!formData.location?.trim()) {
          errors.location = 'Location is required';
        }
      }

      if (formData.serviceType === 'fitness') {
        if (!formData.fitnessGoal) {
          errors.fitnessGoal = 'Please select your fitness goal';
        }
        if (!formData.experience) {
          errors.experience = 'Please select your experience level';
        }
      }
      break;

    case 4:
      if (!formData.hearAboutUs) {
        errors.hearAboutUs = 'Please let us know how you heard about us';
      }
      break;
  }

  return errors;
};