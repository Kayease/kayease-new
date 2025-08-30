import React from "react";
import Icon from "../../../components/AppIcon";

const partners = [
  {
    name: "DesignRush",
    href: "https://www.designrush.com/agency/profile/kayease",
    lightLogo: "/patners/designrush/DesignRush-black.png",
    darkLogo: "/patners/designrush/DesignRush-black.png",
    alt: "Kayease profile on DesignRush",
    tagline: "Rated among top web development companies in Jaipur",
  },
  {
    name: "GoodFirms",
    href: "https://www.goodfirms.co/",
    lightLogo: "/patners/goodfirms/GoodFirms_Partner.svg",
    darkLogo: "/patners/goodfirms/GoodFirms_Partner.svg",
    alt: "Kayease partner with GoodFirms",
    tagline: "Listed on the leading B2B research and reviews platform",
  },
];

const TrustedPartners = () => {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Our Trusted Partners
          </h2>
          <div className="hidden sm:flex items-center text-slate-500 text-sm">
            <Icon name="Shield" size={16} className="mr-2 text-primary" />
            Verified Listings
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {partners.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
              title={`Visit ${p.name}`}
            >
              <div className="p-6 sm:p-8 flex items-center">
                <div className="flex-shrink-0 w-40 sm:w-48">
                  {/* Light/Dark variants */}
                  <img
                    src={p.darkLogo}
                    alt={p.alt}
                    className="block w-full h-auto dark:hidden"
                    loading="lazy"
                    width="192"
                    height="64"
                  />
                  <img
                    src={p.darkLogo}
                    alt={p.alt}
                    className="hidden w-full h-auto dark:block"
                    loading="lazy"
                    width="192"
                    height="64"
                  />
                </div>
                <div className="ml-6 sm:ml-8 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-slate-700 text-sm sm:text-base">
                    {p.tagline}
                  </p>
                  <div className="mt-4 inline-flex items-center text-primary font-medium">
                    <span>View profile</span>
                    <Icon
                      name="ArrowUpRight"
                      size={16}
                      className="ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary to-primary/60 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedPartners;
