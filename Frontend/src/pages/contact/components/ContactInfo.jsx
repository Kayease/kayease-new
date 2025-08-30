import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const ContactInfo = () => {
  const contactMethods = [
    {
      icon: "Mail",
      title: "Email Us",
      primary: "sales@kayease.com",
      secondary: "support@kayease.com • hr@kayease.com",
      description: "Get a response within 24 hours",
      action: "mailto:sales@kayease.com",
      actionText: "Send Email",
    },
    {
      icon: "Phone",
      title: "Call Us",
      primary: "+91 98876 64666",
      secondary: "",
      description: "Mon-Fri, 9AM-6PM IST",
      action: "tel:+919887664666",
      actionText: "Call Now",
    },
    {
      icon: "MapPin",
      title: "Visit Us",
      primary: "11B 3rd Floor RSEB Officers Colony",
      secondary: "Opp- Inox, D-Block, Vaishali Nagar, Jaipur-302021",
      description: "",
      action:
        "https://maps.app.goo.gl/nUKR2UFdBRZ7dEzT7",
      actionText: "Get Directions",
    },
  ];


  const handleContactClick = (action) => {
    if (action.startsWith("mailto:") || action.startsWith("tel:")) {
      window.location.href = action;
    } else{
      // Open Google Maps
      window.open(
        "https://maps.app.goo.gl/nUKR2UFdBRZ7dEzT7",
        "_blank"
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Contact Methods */}
      <div className="bg-white rounded-2xl shadow-brand p-8">
        <h3 className="text-2xl font-bold text-text-primary mb-6">
          Get In Touch
        </h3>

        <div className="space-y-6">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={method.icon} size={24} className="text-primary" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-text-primary mb-1">
                  {method.title}
                </h4>
                <p className="text-text-primary font-medium">
                  {method.primary}
                </p>
                <p className="text-text-secondary text-sm">
                  {method.secondary}
                </p>
                <p className="text-text-secondary text-sm mt-1">
                  {method.description}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => handleContactClick(method.action)}
                  iconName="ExternalLink"
                  iconPosition="right"
                  iconSize={14}
                >
                  {method.actionText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Office Hours */}
      <div className="bg-white rounded-2xl shadow-brand p-8">
        <h3 className="text-xl font-bold text-text-primary mb-6">
          Office Hours
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <span className="text-text-secondary">Monday - Friday</span>
            <span className="text-text-primary font-medium">
              9:00 AM - 6:00 PM
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-text-secondary">Saturday</span>
            <span className="text-text-primary font-medium">
              10:00 AM - 4:00 PM
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-text-secondary">Sunday</span>
            <span className="text-text-primary font-medium">Closed</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-accent/10 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-accent" />
            <span className="text-sm font-medium text-text-primary">
              Emergency Support Available 24/7 for Existing Clients
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
