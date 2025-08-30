import React, { useState } from "react";
import { motion } from "framer-motion";
import Icon from "../../../components/AppIcon";

const TechnologyShowcase = () => {
  const [activeCategory, setActiveCategory] = useState("frontend");

  const techCategories = [
    {
      id: "frontend",
      name: "Frontend",
      icon: "Monitor",
      technologies: [
        {
          name: "HTML5",
          description:
            "Markup language for structuring and presenting content on the web.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
        },
        {
          name: "CSS3",
          description:
            "Style sheet language for designing visually engaging web pages.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
        },
        {
          name: "JavaScript",
          description:
            "High-level programming language for interactive web applications.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
        },
        {
          name: "React.js",
          description:
            "JavaScript library for building user interfaces with reusable components.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        },
        {
          name: "Vue.js",
          description:
            "Progressive JavaScript framework for building user interfaces.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
        },
        {
          name: "Angular",
          description:
            "TypeScript-based open-source web application framework.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
        },
        {
          name: "Next.js",
          description:
            "React framework for server-side rendering and static site generation.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
        },
        {
          name: "Tailwind CSS",
          description: "Utility-first CSS framework for rapid UI development.",
          logo: "/tech/tailwind.svg",
        },
        {
          name: "Bootstrap",
          description:
            "Popular CSS framework for responsive, mobile-first web development.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
        },
        {
          name: "SASS/SCSS",
          description:
            "CSS preprocessor for writing maintainable and scalable styles.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg",
        },
        {
          name: "TypeScript",
          description:
            "Typed superset of JavaScript that compiles to plain JavaScript.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
        },
        {
          name: "jQuery",
          description: "Fast, small, and feature-rich JavaScript library.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jquery/jquery-original.svg",
        },
        {
          name: "Redux / Zustand / Recoil",
          description:
            "State management libraries for predictable and scalable app state.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
        },
      ],
    },
    {
      id: "backend",
      name: "Backend",
      icon: "Server",
      technologies: [
        {
          name: "Node.js",
          description:
            "JavaScript runtime built on Chrome's V8 JavaScript engine.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
        },
        {
          name: "Express.js",
          description:
            "Fast, unopinionated, minimalist web framework for Node.js.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
        },
        {
          name: "Django",
          description:
            "High-level Python Web framework that encourages rapid development and clean, pragmatic design.",
          logo: "/tech/Django.svg",
        },
        {
          name: "Flask",
          description:
            "Micro web framework for Python based on Werkzeug, Jinja2 and good intentions.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
        },
        {
          name: "Spring Boot",
          description:
            "Framework for creating stand-alone, production-grade Spring-based applications.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
        },
        {
          name: "Laravel",
          description:
            "PHP framework for building web applications following the MVC pattern.",
          logo: "/tech/Laravel.svg",
        },
        {
          name: "GraphQL / REST APIs",
          description:
            "API standard for data fetching and manipulation, often over HTTP.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
        },
        {
          name: "Socket.io",
          description:
            "Library for real-time, bidirectional and event-based communication.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg",
        },
      ],
    },
    {
      id: "mobile",
      name: "Mobile",
      icon: "Smartphone",
      technologies: [
        {
          name: "React Native",
          description: "Framework for building native apps using React.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        },
        {
          name: "Flutter",
          description:
            "UI software development kit for building natively compiled applications for mobile, web, and desktop from a single codebase.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
        },
        {
          name: "Swift",
          description:
            "General-purpose, multi-paradigm, compiled programming language developed by Apple Inc.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
        },
        {
          name: "Kotlin",
          description:
            "Statically typed, general-purpose programming language.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
        },
        {
          name: "Firebase",
          description: "Platform for building mobile and web applications.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
        },
        {
          name: "Expo",
          description:
            "Framework and platform for universal React applications.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/expo/expo-original.svg",
        },
      ],
    },
   
    {
      id: "databases",
      name: "Databases",
      icon: "Database",
      technologies: [
        {
          name: "MongoDB",
          description:
            "NoSQL database that stores data in a flexible, JSON-like format.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
        },
        {
          name: "PostgreSQL",
          description: "Open-source object-relational database system.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
        },
        {
          name: "MySQL",
          description: "Open-source relational database management system.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
        },
        {
          name: "Redis",
          description:
            "In-memory data structure store, used as a database, cache, and message broker.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
        },
        {
          name: "Firebase Firestore",
          description:
            "NoSQL cloud database for building scalable applications.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
        },
        {
          name: "SQLite",
          description:
            "Lightweight, serverless, and self-contained database engine.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
        },
        {
          name: "Supabase",
          description:
            "Open-source Firebase alternative for building web and mobile applications.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg",
        },
      ],
    },
    {
      id: "tools",
      name: "Tools & Utilities",
      icon: "Tool",
      technologies: [
        {
          name: 'Git',
          description: 'Distributed version control system for tracking code changes.',
          logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg'
        },
        {
          name: 'GitHub / GitLab / Bitbucket',
          description: 'Popular platforms for hosting and collaborating on code repositories.',
          logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg'
        },
        {
          name: 'VS Code',
          description: 'Powerful, extensible code editor for developers.',
          logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg'
        },
        {
          name: 'Postman',
          description: 'API development and testing tool for building and using APIs.',
          logo: 'https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg'
        },
        
        {
          name: 'Adobe Photoshop',
          description: 'Industry-standard software for photo editing and graphic design.',
          logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg'
        },
        {
          name: 'Adobe Illustrator',
          description: 'Vector graphics editor for creating illustrations and artwork.',
          logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg'
        },
        {
          name: 'Adobe XD',
          description: 'UI/UX design and prototyping tool for web and mobile apps.',
          logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-plain.svg'
        },
        {
          name: 'Sketch',
          description: 'Vector graphics editor for UI, mobile, and web design.',
          logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sketch/sketch-original.svg'
        },
        {
          name: 'Canva',
          description: 'Online design tool for creating graphics, presentations, and more.',
          logo: 'https://cdn.worldvectorlogo.com/logos/canva-1.svg'
        },
        {
          name: 'Notion',
          description: 'All-in-one workspace for notes, tasks, wikis, and databases.',
          logo: 'https://cdn.worldvectorlogo.com/logos/notion-2.svg'
        },
        {
          name: 'Slack',
          description: 'Messaging app for teams and workplace communication.',
          logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg'
        },
        {
          name: 'Trello',
          description: 'Visual project management tool using boards, lists, and cards.',
          logo: 'https://cdn.worldvectorlogo.com/logos/trello.svg'
        },
      ]
    },
    {
      id: "uiux",
      name: "UI/UX & Design",
      icon: "PenTool",
      technologies: [
        {
          name: "Figma",
          description: "Collaborative interface design tool for UI/UX design.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
        },
        {
          name: "Adobe XD",
          description: "Professional design tool for user experience design.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-original.svg",
        },
        {
          name: "Storybook",
          description:
            "Open-source tool for developing UI components in isolation.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/storybook/storybook-original.svg",
        },
        {
          name: "Chakra UI",
          description:
            "Component library for building accessible, production-ready, and beautiful React applications.",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chakraui/chakraui-original.svg",
        },
      ],
    },
  ];

  const activeData = techCategories.find((cat) => cat.id === activeCategory);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6"
          >
            Our Technology <span className="brand-gradient-text">Stack</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto"
          >
            We carefully select cutting-edge technologies that deliver
            exceptional performance, scalability, and maintainability.
          </motion.p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {techCategories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-3 px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-blue-500 border-blue-500 text-white shadow-lg"
                  : "bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              <Icon name={category.icon} size={20} />
              <span className="font-medium">{category.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Technology Grid */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {activeData.name} Technologies
            </h3>
            {/* No description for new categories */}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeData.technologies.map((tech, index) => (
              <div
                key={tech.name}
                className="bg-slate-50 rounded-xl p-6 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300 hover:bg-white border border-slate-200 hover:border-blue-200 h-full"
              >
                <img
                  src={tech.logo}
                  alt={tech.name + " logo"}
                  className="w-12 h-12 mb-3 object-contain"
                  onError={e => { e.target.onerror = null; e.target.src = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/code/code-original.svg'; }}
                />
                <h4 className="font-bold text-slate-900 mb-1 text-base">
                  {tech.name}
                </h4>
                <p className="text-xs text-slate-600">{tech.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Technology Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            Why Our Tech Stack Matters
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "Zap",
                title: "Performance First",
                description:
                  "Optimized for speed and efficiency with modern build tools and best practices",
              },
              {
                icon: "Shield",
                title: "Enterprise Security",
                description:
                  "Built-in security features and regular updates to protect your applications",
              },
              {
                icon: "TrendingUp",
                title: "Future-Proof",
                description:
                  "Technologies with strong community support and long-term viability",
              },
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon name={benefit.icon} size={24} color="white" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  {benefit.title}
                </h4>
                <p className="text-slate-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechnologyShowcase;
