import React from "react";
import { FileText, Scale, Shield, Users, AlertTriangle, CheckCircle, Mail, Phone } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <FileText size={48} className="text-white" strokeWidth={1.5} />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Please read these terms carefully before using our services. These terms govern your use of Kayease's website and services.
            </p>
            <div className="mt-8 flex items-center justify-center space-x-6 text-white/80">
              <div className="flex items-center space-x-2">
                <Scale size={20} />
                <span className="text-sm">Legally Binding</span>
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
              <FileText size={32} className="text-primary mr-3" />
              Agreement to Terms
            </h2>
            <div className="prose prose-lg max-w-none text-slate-600">
              <p className="mb-4">
                These Terms of Service ("Terms") govern your use of the Kayease website and services operated by Kayease ("we," "us," or "our"). By accessing or using our services, you agree to be bound by these Terms and all applicable laws and regulations.
              </p>
              <p className="mb-4">
                If you do not agree with any of these terms, you are prohibited from using or accessing our services. The materials contained in our services are protected by applicable copyright and trademark law.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle size={20} className="text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-yellow-800 text-sm">
                    <strong>Important:</strong> These terms constitute a legally binding agreement between you and Kayease. Please read them carefully before using our services.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Services Description */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
              <Users size={32} className="text-primary mr-3" />
              Description of Services
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Web Development</h3>
                <ul className="space-y-2 text-slate-600 text-sm">
                  <li>• Custom website development</li>
                  <li>• E-commerce solutions</li>
                  <li>• Web application development</li>
                  <li>• Website maintenance and support</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Mobile Development</h3>
                <ul className="space-y-2 text-slate-600 text-sm">
                  <li>• iOS and Android app development</li>
                  <li>• Cross-platform solutions</li>
                  <li>• App maintenance and updates</li>
                  <li>• App store optimization</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Design Services</h3>
                <ul className="space-y-2 text-slate-600 text-sm">
                  <li>• UI/UX design</li>
                  <li>• Brand identity design</li>
                  <li>• Graphic design</li>
                  <li>• Prototyping and wireframing</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Digital Marketing</h3>
                <ul className="space-y-2 text-slate-600 text-sm">
                  <li>• SEO optimization</li>
                  <li>• Social media marketing</li>
                  <li>• Content marketing</li>
                  <li>• Analytics and reporting</li>
                </ul>
              </div>
            </div>
          </section>

          {/* User Responsibilities */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
              <Shield size={32} className="text-primary mr-3" />
              User Responsibilities
            </h2>
            <div className="space-y-6">
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                  <CheckCircle size={24} className="text-green-600 mr-2" />
                  Acceptable Use
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Provide accurate and complete information</li>
                  <li>• Maintain the security of your account</li>
                  <li>• Use our services for lawful purposes only</li>
                  <li>• Respect intellectual property rights</li>
                  <li>• Comply with all applicable laws and regulations</li>
                </ul>
              </div>
              
              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                  <AlertTriangle size={24} className="text-red-600 mr-2" />
                  Prohibited Activities
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Violating any applicable laws or regulations</li>
                  <li>• Infringing on intellectual property rights</li>
                  <li>• Attempting to gain unauthorized access to our systems</li>
                  <li>• Transmitting harmful or malicious code</li>
                  <li>• Interfering with the proper functioning of our services</li>
                  <li>• Using our services for spam or unsolicited communications</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
              <FileText size={32} className="text-primary mr-3" />
              Intellectual Property Rights
            </h2>
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Our Rights</h3>
                <p className="text-slate-600 mb-4">
                  All content, features, and functionality of our services, including but not limited to text, graphics, logos, images, software, and design, are owned by Kayease or its licensors and are protected by copyright, trademark, and other intellectual property laws.
                </p>
                <p className="text-slate-600">
                  You may not reproduce, distribute, modify, or create derivative works of our content without our express written consent.
                </p>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Your Rights</h3>
                <p className="text-slate-600 mb-4">
                  You retain ownership of any content you submit to our services. By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and distribute your content in connection with our services.
                </p>
                <p className="text-slate-600">
                  You represent and warrant that you have all necessary rights to grant this license and that your content does not infringe on any third-party rights.
                </p>
              </div>
            </div>
          </section>

          {/* Payment Terms */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
              <Scale size={32} className="text-primary mr-3" />
              Payment Terms
            </h2>
            <div className="space-y-6">
              <div className="border border-slate-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Pricing and Payment</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• All prices are quoted in Indian Rupees (INR) unless otherwise specified</li>
                  <li>• Payment terms will be specified in individual project agreements</li>
                  <li>• We accept payment through secure payment gateways</li>
                  <li>• Late payments may result in suspension of services</li>
                </ul>
              </div>
              
              <div className="border border-slate-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Refunds and Cancellations</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Refund policies vary by service type and will be specified in project agreements</li>
                  <li>• Cancellation fees may apply for projects in progress</li>
                  <li>• We reserve the right to refuse service or terminate projects for policy violations</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
              <AlertTriangle size={32} className="text-primary mr-3" />
              Limitation of Liability
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-slate-700 mb-4">
                To the maximum extent permitted by law, Kayease shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul className="space-y-2 text-slate-600 mb-4">
                <li>• Loss of profits, data, or business opportunities</li>
                <li>• Service interruptions or technical issues</li>
                <li>• Third-party actions or content</li>
                <li>• Security breaches or data loss</li>
              </ul>
              <p className="text-slate-700">
                Our total liability to you for any claims arising from these terms or your use of our services shall not exceed the amount you paid to us in the twelve months preceding the claim.
              </p>
            </div>
          </section>

          {/* Disclaimers */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
              <Shield size={32} className="text-primary mr-3" />
              Disclaimers
            </h2>
            <div className="space-y-4 text-slate-600">
              <div className="bg-slate-50 rounded-lg p-4">
                <p><strong>Service Availability:</strong> We strive to maintain high service availability but do not guarantee uninterrupted access to our services.</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p><strong>Third-Party Services:</strong> Our services may integrate with third-party services. We are not responsible for the availability or content of these services.</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p><strong>Accuracy of Information:</strong> While we strive for accuracy, we do not guarantee that all information on our website is complete, accurate, or up-to-date.</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p><strong>Security:</strong> We implement security measures but cannot guarantee that our services will be completely secure or free from vulnerabilities.</p>
              </div>
            </div>
          </section>

          {/* Termination */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
              <AlertTriangle size={32} className="text-primary mr-3" />
              Termination
            </h2>
            <div className="prose prose-lg max-w-none text-slate-600">
              <p className="mb-4">
                We may terminate or suspend your access to our services immediately, without prior notice, for any reason, including but not limited to:
              </p>
              <ul className="space-y-2 mb-6">
                <li>• Violation of these Terms of Service</li>
                <li>• Non-payment of fees</li>
                <li>• Fraudulent or illegal activities</li>
                <li>• Extended periods of inactivity</li>
              </ul>
              <p>
                Upon termination, your right to use our services will cease immediately. We may delete your account and any associated data at our discretion.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
              <Scale size={32} className="text-primary mr-3" />
              Governing Law and Dispute Resolution
            </h2>
            <div className="bg-slate-50 rounded-lg p-6">
              <p className="text-slate-700 mb-4">
                These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms or your use of our services shall be resolved through:
              </p>
              <ol className="space-y-2 text-slate-600">
                <li>1. <strong>Negotiation:</strong> Parties will attempt to resolve disputes through good faith negotiation</li>
                <li>2. <strong>Mediation:</strong> If negotiation fails, parties may seek mediation through a neutral third party</li>
                <li>3. <strong>Arbitration:</strong> Disputes may be resolved through binding arbitration in accordance with Indian law</li>
                <li>4. <strong>Court Proceedings:</strong> As a last resort, disputes may be brought before courts in India</li>
              </ol>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
              <FileText size={32} className="text-primary mr-3" />
              Changes to Terms
            </h2>
            <div className="prose prose-lg max-w-none text-slate-600">
              <p className="mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of material changes by:
              </p>
              <ul className="space-y-2 mb-6">
                <li>• Posting updated terms on our website</li>
                <li>• Sending email notifications to registered users</li>
                <li>• Displaying prominent notices on our website</li>
              </ul>
              <p>
                Your continued use of our services after any changes indicates your acceptance of the updated Terms. If you do not agree to the changes, you should discontinue using our services.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
              <Mail size={32} className="text-primary mr-3" />
              Contact Information
            </h2>
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-8">
              <p className="text-slate-700 mb-6">
                If you have any questions about these Terms of Service, please contact us:
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

export default TermsOfService; 