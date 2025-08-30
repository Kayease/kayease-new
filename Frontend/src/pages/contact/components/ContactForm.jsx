import React, { useState } from "react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { Checkbox } from "../../../components/ui/Checkbox";
import Icon from "../../../components/AppIcon";
import { contactApi } from "../../../utils/contactApi";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    description: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [recaptchaError, setRecaptchaError] = useState("");

  const subjectOptions = [
    { value: "hire-us", label: "Hire Us" },
    { value: "join-us", label: "Join Us" },
    { value: "partnership", label: "Partnership" },
    { value: "general-inquiry", label: "General Inquiry" },
    { value: "support", label: "Support" },
    { value: "feedback", label: "Feedback" },
    { value: "other", label: "Other" },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
    setRecaptchaError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.subject) newErrors.subject = "Please select a subject";
    if (!formData.description.trim())
      newErrors.description = "Please provide a description";
    if (!formData.terms)
      newErrors.terms = "You must agree to the terms and conditions";
    if (!recaptchaToken) {
      setRecaptchaError("Please verify that you are not a robot.");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !!recaptchaToken;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Pass recaptchaToken to your API if needed
      const response = await contactApi.submit({ ...formData, recaptchaToken });

      // Show success toast
      toast.success(
        response.message ||
          "Thank you for your message! We'll get back to you soon."
      );

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        description: "",
        terms: false,
      });

      // Clear any existing errors
      setErrors({});
    } catch (error) {
      console.error("Contact form submission error:", error);

      // Show error toast
      if (error.message.includes("already submitted")) {
        toast.error(
          "You have already submitted a contact form recently. Please wait 24 hours before submitting again."
        );
      } else if (error.message.includes("Validation failed")) {
        toast.error("Please check your form data and try again.");
      } else {
        toast.error("Failed to submit your message. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
      setRecaptchaToken("");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-brand p-8 lg:p-10">
      <div className="mb-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Icon name="MessageCircle" size={16} />
            <span>Let's Start Something Amazing</span>
          </div>

          <h3 className="text-3xl font-bold text-text-primary mb-3">
            Get In Touch
          </h3>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Send us a message and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <div className="w-2 h-2 bg-primary/60 rounded-full"></div>
          <div className="w-2 h-2 bg-primary/40 rounded-full"></div>
          <div className="w-2 h-2 bg-primary/20 rounded-full"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            type="text"
            name="fullName"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleInputChange}
            error={errors.fullName}
            required
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            placeholder="+91 9876543210"
            value={formData.phone}
            onChange={handleInputChange}
            error={errors.phone}
            required
          />

          <Select
            label="Subject"
            placeholder="Select subject"
            options={subjectOptions}
            value={formData.subject}
            onChange={(value) => handleSelectChange("subject", value)}
            error={errors.subject}
            required
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-text-primary mb-3">
            Description <span className="text-destructive">*</span>
          </label>

          <div className="relative group">
            <textarea
              name="description"
              rows={5}
              placeholder="Tell us about your inquiry, project, or how we can help you..."
              value={formData.description}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 resize-none bg-white group-hover:bg-gray-50/30 ${
                errors.description ? "border-destructive" : "border-border"
              }`}
              required
            />

            {/* Floating label effect */}
            <div className="absolute top-3 left-3 pointer-events-none">
              <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full opacity-60"></div>
            </div>

            {/* Character count indicator */}
            <div className="absolute bottom-2 right-3 text-xs text-text-secondary">
              {formData.description.length}/2000
            </div>
          </div>

          {errors.description && (
            <div className="flex items-center space-x-2 text-sm text-destructive mt-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <Icon name="AlertCircle" size={16} className="text-red-500" />
              <span>{errors.description}</span>
            </div>
          )}

          {/* Help text */}
          <p className="text-xs text-text-secondary mt-2 flex items-center space-x-1">
            <Icon name="Info" size={14} className="text-accent" />
            <span>
              Be as detailed as possible to help us understand your needs better
            </span>
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <div className="border border-border rounded-lg p-4 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300">
              <Checkbox
                label={
                  <span className="text-sm text-text-primary">
                    I agree to the{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 underline font-medium transition-colors duration-200"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 underline font-medium transition-colors duration-200"
                    >
                      Privacy Policy
                    </a>
                  </span>
                }
                checked={formData.terms}
                onChange={(e) => handleInputChange(e)}
                name="terms"
                error={errors.terms}
                required
              />

              {errors.terms && (
                <div className="flex items-center space-x-2 text-sm text-destructive mt-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  <Icon name="AlertCircle" size={16} className="text-red-500" />
                  <span>{errors.terms}</span>
                </div>
              )}
            </div>

            {/* Decorative corner elements */}
            <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-primary rounded-tl-lg"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-primary rounded-br-lg"></div>
          </div>
        </div>

        {/* reCAPTCHA */}
        <div className="space-y-3">
          <div className="ml-5">
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_GOOGLE_SITE_KEY}
              onChange={handleRecaptchaChange}
              theme="light"
              className="transform scale-105"
            />
          </div>

          {recaptchaError && (
            <div className="flex items-center space-x-2 text-sm text-destructive bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <Icon name="AlertCircle" size={16} className="text-red-500" />
              <span>{recaptchaError}</span>
            </div>
          )}

          <p className="text-xs text-text-secondary text-center">
            This helps us prevent spam and ensure you're human
          </p>
        </div>

        <div className="pt-6">
          <div className="relative">
            <Button
              type="submit"
              variant="default"
              fullWidth
              loading={isSubmitting}
              iconName="Send"
              iconPosition="right"
              className="cta-button text-white font-medium h-14 text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending your message...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Icon name="Send" size={20} />
                  <span>Send Message</span>
                </div>
              )}
            </Button>

            {/* Decorative elements around button */}
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-full animate-pulse"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-br from-secondary/40 to-accent/40 rounded-full animate-pulse delay-100"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-br from-accent/40 to-primary/40 rounded-full animate-pulse delay-200"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-full animate-pulse delay-300"></div>
          </div>

          {/* Success message preview */}
          <p className="text-xs text-text-secondary text-center mt-3">
            We'll get back to you within 24 hours
          </p>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-border">
        <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-lg p-4 border border-green-200/50">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Icon name="Shield" size={16} className="text-green-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-green-800">
                Your information is secure and protected
              </p>
              <p className="text-xs text-green-600 mt-1">
                We use industry-standard encryption and never share your data
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
