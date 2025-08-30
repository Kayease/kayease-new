import React from "react";
import { Shield, Eye, Lock, Database, Users, Mail, Phone } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Shield size={48} className="text-white" strokeWidth={1.5} />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your personal information.
            </p>
            <div className="mt-8 flex items-center justify-center space-x-6 text-white/80">
              <div className="flex items-center space-x-2">
                <Eye size={20} />
                <span className="text-sm">Last updated: {new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock size={20} />
                <span className="text-sm">GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
              <Database size={32} className="text-primary mr-3" />
              Introduction
            </h2>
            <div className="prose prose-lg max-w-none text-slate-600">
              <p className="mb-4">
                At Kayease ("we," "our," or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us in any way.
              </p>
              <p>
                By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
              </p>
            </div>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
              <Eye size={32} className="text-primary mr-3" />
              Information We Collect
            </h2>
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Personal Information</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Name and contact information (email, phone number)</li>
                  <li>• Company name and job title</li>
                  <li>• Resume and employment history (for job applications)</li>
                  <li>• Communication preferences</li>
                  <li>• Payment information (processed securely through third-party providers)</li>
                </ul>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Automatically Collected Information</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• IP address and device information</li>
                  <li>• Browser type and version</li>
                  <li>• Operating system</li>
                  <li>• Pages visited and time spent on our website</li>
                  <li>• Referring website or source</li>
                  <li>• Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
              <Users size={32} className="text-primary mr-3" />
              How We Use Your Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Service Delivery</h3>
                <ul className="space-y-2 text-slate-600 text-sm">
                  <li>• Provide and maintain our services</li>
                  <li>• Process job applications</li>
                  <li>• Respond to inquiries and support requests</li>
                  <li>• Send important service updates</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Communication</h3>
                <ul className="space-y-2 text-slate-600 text-sm">
                  <li>• Send newsletters and marketing materials (with consent)</li>
                  <li>• Provide customer support</li>
                  <li>• Share important updates about our services</li>
                  <li>• Respond to feedback and reviews</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Analytics & Improvement</h3>
                <ul className="space-y-2 text-slate-600 text-sm">
                  <li>• Analyze website usage and performance</li>
                  <li>• Improve our services and user experience</li>
                  <li>• Develop new features and functionality</li>
                  <li>• Conduct research and analysis</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Legal & Security</h3>
                <ul className="space-y-2 text-slate-600 text-sm">
                  <li>• Comply with legal obligations</li>
                  <li>• Protect against fraud and abuse</li>
                  <li>• Ensure security of our systems</li>
                  <li>• Enforce our terms and policies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
              <Lock size={32} className="text-primary mr-3" />
              Information Sharing & Disclosure
            </h2>
            <div className="prose prose-lg max-w-none text-slate-600">
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
              </p>
              <ul className="space-y-2 mb-6">
                <li>• <strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our website and providing services</li>
                <li>• <strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights and safety</li>
                <li>• <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred</li>
                <li>• <strong>Consent:</strong> We may share information with your explicit consent</li>
              </ul>
              <p>
                All third-party service providers are contractually obligated to maintain the confidentiality and security of your information.
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
              <Shield size={32} className="text-primary mr-3" />
              Data Security
            </h2>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
              <p className="text-slate-700 mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-slate-600">SSL encryption for data transmission</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-slate-600">Regular security assessments and updates</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-slate-600">Access controls and authentication</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-slate-600">Data backup and recovery procedures</span>
                </div>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
              <Users size={32} className="text-primary mr-3" />
              Your Rights
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-slate-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Access & Control</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Access your personal information</li>
                  <li>• Update or correct your information</li>
                  <li>• Request deletion of your data</li>
                  <li>• Opt-out of marketing communications</li>
                </ul>
              </div>
              
              <div className="border border-slate-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Data Portability</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Request a copy of your data</li>
                  <li>• Transfer your data to another service</li>
                  <li>• Restrict processing of your data</li>
                  <li>• Object to certain processing activities</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
              <Database size={32} className="text-primary mr-3" />
              Cookies & Tracking Technologies
            </h2>
            <div className="prose prose-lg max-w-none text-slate-600">
              <p className="mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our website. These technologies help us:
              </p>
              <ul className="space-y-2 mb-6">
                <li>• Remember your preferences and settings</li>
                <li>• Analyze website traffic and usage patterns</li>
                <li>• Provide personalized content and advertisements</li>
                <li>• Improve website functionality and performance</li>
              </ul>
              <p>
                You can control cookie settings through your browser preferences. However, disabling certain cookies may affect website functionality.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
              <Mail size={32} className="text-primary mr-3" />
              Contact Us
            </h2>
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-8">
              <p className="text-slate-700 mb-6">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Mail size={20} className="text-primary" />
                  <div>
                    <p className="font-semibold text-slate-800">Email</p>
                    <a href="mailto:sales@kayease.com" className="text-primary hover:underline">
                      sales@kayease.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone size={20} className="text-primary" />
                  <div>
                    <p className="font-semibold text-slate-800">Phone</p>
                    <a href="tel:+919887664666" className="text-primary hover:underline">
                      +91 98876 64666
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-sm text-slate-600">
                  <strong>Address:</strong> Kayease, India<br />
                  We will respond to your inquiry within 48 hours.
                </p>
              </div>
            </div>
          </section>

          {/* Updates to Policy */}
          <section>
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
              <Shield size={32} className="text-primary mr-3" />
              Updates to This Policy
            </h2>
            <div className="prose prose-lg max-w-none text-slate-600">
              <p className="mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by:
              </p>
              <ul className="space-y-2 mb-6">
                <li>• Posting the updated policy on our website</li>
                <li>• Sending an email notification to registered users</li>
                <li>• Displaying a prominent notice on our website</li>
              </ul>
              <p>
                Your continued use of our services after any changes indicates your acceptance of the updated Privacy Policy.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 