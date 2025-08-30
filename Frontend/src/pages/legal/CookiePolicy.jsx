import React from "react";
import { Cookie, Settings, Shield, Database, Eye, Clock, Mail, Phone, AlertTriangle } from "lucide-react";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Cookie size={48} className="text-white" strokeWidth={1.5} />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Learn how we use cookies and similar technologies to enhance your browsing experience and improve our services.
            </p>
            <div className="mt-8 flex items-center justify-center space-x-6 text-white/80">
              <div className="flex items-center space-x-2">
                <Settings size={20} />
                <span className="text-sm">Manage Your Preferences</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield size={20} />
                <span className="text-sm">Last updated: {new Date().toLocaleDateString()}</span>
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
              <Cookie size={32} className="text-primary mr-3" />
              What Are Cookies?
            </h2>
            <div className="prose prose-lg max-w-none text-slate-600">
              <p className="mb-4">
                Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit our website. They help us provide you with a better browsing experience by remembering your preferences, analyzing how you use our site, and personalizing content.
              </p>
              <p className="mb-6">
                Cookies do not contain any personal information that can identify you directly, but they may contain information that can be linked to your personal data.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> By continuing to use our website, you consent to our use of cookies in accordance with this Cookie Policy. You can manage your cookie preferences at any time through your browser settings.
                </p>
              </div>
            </div>
          </section>

          {/* Types of Cookies */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
              <Database size={32} className="text-primary mr-3" />
              Types of Cookies We Use
            </h2>
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                  <Shield size={24} className="text-green-600 mr-2" />
                  Essential Cookies
                </h3>
                <p className="text-slate-600 mb-3">
                  These cookies are necessary for the website to function properly and cannot be disabled. They include:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li>• Authentication and security cookies</li>
                  <li>• Session management cookies</li>
                  <li>• Load balancing cookies</li>
                  <li>• Shopping cart functionality</li>
                </ul>
                <div className="mt-4 flex items-center text-sm text-green-700">
                  <Clock size={16} className="mr-2" />
                  <span>Duration: Session or up to 1 year</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                  <Eye size={24} className="text-blue-600 mr-2" />
                  Analytics Cookies
                </h3>
                <p className="text-slate-600 mb-3">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. They include:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li>• Google Analytics cookies</li>
                  <li>• Page view and session tracking</li>
                  <li>• User behavior analysis</li>
                  <li>• Performance monitoring</li>
                </ul>
                <div className="mt-4 flex items-center text-sm text-blue-700">
                  <Clock size={16} className="mr-2" />
                  <span>Duration: Up to 2 years</span>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                  <Settings size={24} className="text-purple-600 mr-2" />
                  Functional Cookies
                </h3>
                <p className="text-slate-600 mb-3">
                  These cookies enable enhanced functionality and personalization. They may be set by us or third-party providers. They include:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li>• Language and region preferences</li>
                  <li>• User interface customization</li>
                  <li>• Form auto-fill functionality</li>
                  <li>• Social media integration</li>
                </ul>
                <div className="mt-4 flex items-center text-sm text-purple-700">
                  <Clock size={16} className="mr-2" />
                  <span>Duration: Up to 1 year</span>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                  <Cookie size={24} className="text-orange-600 mr-2" />
                  Marketing Cookies
                </h3>
                <p className="text-slate-600 mb-3">
                  These cookies are used to track visitors across websites to display relevant and engaging advertisements. They include:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li>• Social media advertising cookies</li>
                  <li>• Retargeting and remarketing cookies</li>
                  <li>• Affiliate marketing tracking</li>
                  <li>• Campaign performance measurement</li>
                </ul>
                <div className="mt-4 flex items-center text-sm text-orange-700">
                  <Clock size={16} className="mr-2" />
                  <span>Duration: Up to 2 years</span>
                </div>
              </div>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
              <Database size={32} className="text-primary mr-3" />
              Third-Party Cookies
            </h2>
            <div className="prose prose-lg max-w-none text-slate-600">
              <p className="mb-4">
                Our website may use cookies from third-party services to enhance functionality and provide additional features. These third-party cookies are subject to their respective privacy policies.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-800 mb-2">Google Analytics</h4>
                  <p className="text-sm text-slate-600 mb-2">Website analytics and performance tracking</p>
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline">
                    Privacy Policy →
                  </a>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-800 mb-2">Social Media Platforms</h4>
                  <p className="text-sm text-slate-600 mb-2">Social sharing and integration features</p>
                  <a href="#" className="text-primary text-sm hover:underline">
                    Learn More →
                  </a>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-800 mb-2">Payment Processors</h4>
                  <p className="text-sm text-slate-600 mb-2">Secure payment processing and verification</p>
                  <a href="#" className="text-primary text-sm hover:underline">
                    Learn More →
                  </a>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-800 mb-2">Cloud Services</h4>
                  <p className="text-sm text-slate-600 mb-2">File storage and content delivery</p>
                  <a href="#" className="text-primary text-sm hover:underline">
                    Learn More →
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Cookie Management */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
              <Settings size={32} className="text-primary mr-3" />
              Managing Your Cookie Preferences
            </h2>
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Browser Settings</h3>
                <p className="text-slate-600 mb-4">
                  You can control and manage cookies through your browser settings. Here's how to access cookie settings in popular browsers:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-slate-800 mb-2">Chrome</h4>
                    <p className="text-sm text-slate-600">Settings → Privacy and Security → Cookies and other site data</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-slate-800 mb-2">Firefox</h4>
                    <p className="text-sm text-slate-600">Options → Privacy & Security → Cookies and Site Data</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-slate-800 mb-2">Safari</h4>
                    <p className="text-sm text-slate-600">Preferences → Privacy → Manage Website Data</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-slate-800 mb-2">Edge</h4>
                    <p className="text-sm text-slate-600">Settings → Cookies and site permissions → Cookies and site data</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                  <AlertTriangle size={24} className="text-yellow-600 mr-2" />
                  Important Notice
                </h3>
                <p className="text-slate-700 mb-3">
                  Please note that disabling certain cookies may affect the functionality of our website:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li>• Essential cookies cannot be disabled as they are necessary for basic website functionality</li>
                  <li>• Disabling analytics cookies may prevent us from improving our services</li>
                  <li>• Functional cookies enhance your user experience and personalization</li>
                  <li>• Marketing cookies help us provide relevant content and advertisements</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookie Consent */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
              <Shield size={32} className="text-primary mr-3" />
              Cookie Consent
            </h2>
            <div className="prose prose-lg max-w-none text-slate-600">
              <p className="mb-4">
                When you first visit our website, you will see a cookie consent banner that allows you to:
              </p>
              <ul className="space-y-2 mb-6">
                <li>• Accept all cookies</li>
                <li>• Reject non-essential cookies</li>
                <li>• Customize your cookie preferences</li>
                <li>• Learn more about our cookie policy</li>
              </ul>
              <p className="mb-4">
                You can change your cookie preferences at any time by:
              </p>
              <ul className="space-y-2 mb-6">
                <li>• Clicking the "Cookie Settings" link in our footer</li>
                <li>• Using your browser's cookie management tools</li>
                <li>• Contacting us directly</li>
              </ul>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  <strong>Your Choice:</strong> You have the right to withdraw your consent at any time. However, please note that some features of our website may not function properly if you disable certain cookies.
                </p>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
              <Clock size={32} className="text-primary mr-3" />
              Cookie Retention Periods
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-200 rounded-lg">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-800">Cookie Type</th>
                    <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-800">Purpose</th>
                    <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-800">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-200 px-4 py-3 text-slate-600">Session Cookies</td>
                    <td className="border border-slate-200 px-4 py-3 text-slate-600">Maintain user session</td>
                    <td className="border border-slate-200 px-4 py-3 text-slate-600">Until browser closes</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-200 px-4 py-3 text-slate-600">Authentication</td>
                    <td className="border border-slate-200 px-4 py-3 text-slate-600">User login and security</td>
                    <td className="border border-slate-200 px-4 py-3 text-slate-600">Up to 1 year</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-4 py-3 text-slate-600">Analytics</td>
                    <td className="border border-slate-200 px-4 py-3 text-slate-600">Website usage tracking</td>
                    <td className="border border-slate-200 px-4 py-3 text-slate-600">Up to 2 years</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-200 px-4 py-3 text-slate-600">Preferences</td>
                    <td className="border border-slate-200 px-4 py-3 text-slate-600">User settings and choices</td>
                    <td className="border border-slate-200 px-4 py-3 text-slate-600">Up to 1 year</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-4 py-3 text-slate-600">Marketing</td>
                    <td className="border border-slate-200 px-4 py-3 text-slate-600">Advertising and targeting</td>
                    <td className="border border-slate-200 px-4 py-3 text-slate-600">Up to 2 years</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Updates to Policy */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
              <Shield size={32} className="text-primary mr-3" />
              Updates to This Policy
            </h2>
            <div className="prose prose-lg max-w-none text-slate-600">
              <p className="mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices, technology, or legal requirements. We will notify you of any material changes by:
              </p>
              <ul className="space-y-2 mb-6">
                <li>• Posting the updated policy on our website</li>
                <li>• Displaying a prominent notice on our website</li>
                <li>• Sending email notifications to registered users</li>
                <li>• Updating the "Last updated" date at the top of this policy</li>
              </ul>
              <p>
                Your continued use of our website after any changes indicates your acceptance of the updated Cookie Policy.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
              <Mail size={32} className="text-primary mr-3" />
              Contact Us
            </h2>
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-8">
              <p className="text-slate-700 mb-6">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
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
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy; 