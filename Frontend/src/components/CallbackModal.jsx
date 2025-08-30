import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Icon from "./AppIcon";
import { callbackRequestApi } from "../utils/callbackRequestApi";

const CallbackModal = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Convert local datetime to ISO string
      const preferredTime = new Date(data.preferredTime).toISOString();

      const response = await callbackRequestApi.submit({
        ...data,
        preferredTime,
      });

      toast.success(
        response.message || "Callback request submitted successfully!"
      );
      reset();
      onSuccess();
    } catch (error) {
      console.error("Error submitting callback request:", error);
      toast.error(
        error.error || "Failed to submit callback request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto h-[100svh]"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative my-8 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 max-h-[88svh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary px-6 py-4 text-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Icon name="Phone" size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Request Callback</h2>
                <p className="text-sm text-white/80">
                  We'll call you at your preferred time
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-6 py-2 space-y-2 overflow-y-auto flex-1 min-h-0"
        >
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("name", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 ${
                errors.name
                  ? "border-red-300 bg-red-50"
                  : "border-slate-300 hover:border-slate-400"
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[\+]?[1-9][\d]{0,15}$/,
                  message: "Please enter a valid phone number",
                },
              })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 ${
                errors.phone
                  ? "border-red-300 bg-red-50"
                  : "border-slate-300 hover:border-slate-400"
              }`}
              placeholder="+1234567890"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Email (Optional) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address{" "}
              <span className="text-slate-400 text-xs">(Optional)</span>
            </label>
            <input
              type="email"
              {...register("email", {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address",
                },
              })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 ${
                errors.email
                  ? "border-red-300 bg-red-50"
                  : "border-slate-300 hover:border-slate-400"
              }`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Preferred Time */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Preferred Callback Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              {...register("preferredTime", {
                required: "Preferred time is required",
                validate: (value) => {
                  const selectedTime = new Date(value);
                  const now = new Date();
                  if (selectedTime <= now) {
                    return "Please select a future time";
                  }
                  return true;
                },
              })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 ${
                errors.preferredTime
                  ? "border-red-300 bg-red-50"
                  : "border-slate-300 hover:border-slate-400"
              }`}
            />
            {errors.preferredTime && (
              <p className="mt-1 text-sm text-red-600">
                {errors.preferredTime.message}
              </p>
            )}
            <p className="mt-1 text-xs text-slate-500">
              Select when you'd like us to call you
            </p>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("message", {
                required: "Message is required",
                minLength: {
                  value: 10,
                  message: "Message must be at least 10 characters",
                },
                maxLength: {
                  value: 1000,
                  message: "Message must be less than 1000 characters",
                },
              })}
              rows={4}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none ${
                errors.message
                  ? "border-red-300 bg-red-50"
                  : "border-slate-300 hover:border-slate-400"
              }`}
              placeholder="Tell us what you'd like to discuss..."
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-primary text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Icon name="Phone" size={20} />
                <span>Request Callback</span>
              </div>
            )}
          </button>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-slate-500">
              We'll call you at your preferred time. No spam, just a friendly
              conversation.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CallbackModal;
