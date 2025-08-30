import React from "react";
import Icon from "../../../components/AppIcon";

const LocationMap = () => {
  return (
    <div className="bg-white rounded-2xl shadow-brand overflow-hidden">
      <div className="p-8 pb-0">
        <h3 className="text-2xl font-bold text-text-primary mb-3">
          Our Location
        </h3>
        <p className="text-text-secondary mb-6">
          Visit our modern office in the heart of San Francisco's tech district.
        </p>

        <div className="space-y-4 mb-6">
          <div className="flex items-start space-x-3">
            <Icon name="MapPin" size={20} className="text-primary mt-1" />
            <div>
              <p className="font-medium text-text-primary">
                Kayease Digital Agency
              </p>
              <p className="text-text-secondary">
                11B 3rd Floor RSEB Officers Colony
              </p>
              <p className="text-text-secondary">
                Opp- Inox, D-Block, Vaishali Nagar, Jaipur-302021
              </p>
            </div>
          </div>          
        </div>
      </div>

      <div className="h-80 w-full">
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Kayease Digital Agency Location"
          referrerPolicy="no-referrer-when-downgrade"
           src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.7133089950316!2d75.7443255!3d26.9125923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db5a5f1f91a61%3A0xffd97c5ea7acd554!2sKayEase%20Global!5e0!3m2!1sen!2sin!4v1753347553118!5m2!1sen!2sin"
          className="border-0"
        />
      </div>

      <div className="p-6 bg-muted">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-text-primary">Need directions?</p>
            <p className="text-sm text-text-secondary">
              Get turn-by-turn navigation
            </p>
          </div>

          <button
            onClick={() =>
              window.open(
                "https://maps.google.com/?q=11B%203rd%20Floor%20RSEB%20officers%20colony,%20Opp-%20Inox,%20D-Block,%20Vaishali%20Nagar,%20Jaipur-302021",
                "_blank"
              )
            }
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Icon name="Navigation" size={16} />
            <span className="text-sm font-medium">Get Directions</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
