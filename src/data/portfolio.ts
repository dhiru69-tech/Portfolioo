export type Project = {
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  github?: string;
  demo?: string;
  image: string;
  accent: "blue" | "cyan" | "blush";
};

export type Experience = {
  role: string;
  organization: string;
  date: string;
  description: string;
  tags: string[];
  image?: string;
};

const experienceData: Experience[] = [
  {
    role: "Cybersecurity Intern",
    organization: "CodeAlpha",
    date: "June 2025 — July 2025",
    description:
      "Completed a hands-on cybersecurity internship covering practical security tasks, vulnerability analysis, and applied security research under real-world constraints.",
    tags: ["Cybersecurity", "Internship", "Vulnerability Analysis", "Security Research"],
    image: "/experience/company1.svg",
     
  },
  {
    role: "CTF Participant",
    organization: "Online capture-the-flag events",
    date: "2025 — present",
    description:
      "Regular participation in web, forensics and OSINT categories. Notes and write-ups are kept privately until cleaned up for publishing.",
    tags: ["CTF", "Web", "OSINT"],
    image: "/experience/company2.svg",
  },
  {
    role: "Hackathon Participant",
    organization: "Various hackathons & tech events",
    date: "2025 — present",
    description:
      "Regular participant across multiple hackathons, building projects under time constraints and collaborating with teams on rapid prototyping.",
    tags: ["Hackathon", "Team Collaboration", "Rapid Prototyping"],
    image: "/experience/company3.svg",
  },
  {
    role: "Open-source & tooling",
    organization: "Personal projects",
    date: "Ongoing",
    description:
      "Building and maintaining small security and automation tools, mostly in Python, and publishing the ones that are useful to others.",
    tags: ["Python", "Tooling"],
    image: "/experience/company4.svg",
  },
];

export const portfolio = {
  name: "Dhiru",
  role: "Cybersecurity Developer",
  email: "dk2770044@gmail.com",
  location: "India",

  social: {
    github: "https://github.com/dhiru69-tech",
    linkedin: "https://www.linkedin.com/in/dhiraj-k69/",
  },

  hero: {
    eyebrow: "Cybersecurity • Development • Security Research",
    title: "I build, break, and secure digital systems.",
    description:
      "I'm a cybersecurity-focused developer interested in offensive security, OSINT, CTFs, secure development, and building practical tools.",
  },

  about: {
    heading: "About Me",
    image: "/profile.jpg",
    paragraphs: [
      "I'm a student and developer who spends most of my time between an editor and a terminal. I started with writing small scripts to automate boring things, and that slowly turned into an interest in how systems break — and how to keep them from breaking.",
      "Most of my practice comes from CTFs, lab environments, and reading write-ups. I work mainly on web security, reconnaissance and OSINT workflows, and Linux tooling. When I find a task I repeat too often, I usually end up writing a tool for it in Python.",
      "On the development side I build with React, TypeScript, Node and FastAPI. I care about writing code that is readable first, and secure by default rather than patched later.",
    ],
    exploring: ["Cyber Security", "OSINT", "DFIR", "Red Teaming", "Security Automation", "Web Development", "Python Tooling"],
  },

  skills: [
    {
      category: "Cybersecurity",
      icon: "shield",
      items: [
        "Web Security",
        "OSINT",
        "Reconnaissance",
        "CTF",
        "Red Teaming Concepts",
        "Network Security",
        "Digital Forensics",
      ],
    },
    {
      category: "Programming",
      icon: "code",
      items: ["Python", "C", "C++"],
    },
    {
      category: "Tools",
      icon: "terminal",
      items: [
        "Linux",
        "Kali Linux",
        "Nmap",
        "Burp Suite",
        "Wireshark",
        "Metasploit",
        "SQLMap",
      ],
    },
    {
      category: "Development",
      icon: "layers",
      items: ["React", "Node.js", "FastAPI", "REST APIs", "PostgreSQL", "Git", "GitHub"],
    },
  ],

  projects: [
    {
      name: "ReconMind",
      tagline: "AI-assisted reconnaissance",
      description:
        "An AI-assisted reconnaissance and security analysis platform that collects, correlates and summarises findings from multiple recon sources into a single reviewable workspace.",
      stack: ["Python", "FastAPI", "PostgreSQL", "React", "Security Automation"],
      github: "https://github.com/dhiru69-tech/CAP-PRO",
      demo: "",
      image: "/projects/reconmind.jpg",
      accent: "blue",
    },
    {
      name: "GamiFY",
      tagline: "Learn programming by playing",
      description:
        "A gamified platform for learning programming through interactive challenges and levels, with progress tracking and incremental difficulty.",
      stack: ["React", "JavaScript", "Supabase", "Vercel"],
      github: "https://g3mify.vercel.app",
      demo: "",
      image: "/projects/gamify.jpg",
      accent: "blush",
    },
    {
      name: "OSINT Tool",
      tagline: "Structured open-source intelligence",
      description:
        "A practical OSINT tool for collecting and organising publicly available information, with a Telegram interface for quick lookups on the move.",
      stack: ["Python", "Telegram Bot", "SQLite", "OSINT"],
      github: "https://github.com/dhiru-tech",
      demo: "",
      image: "/projects/osint.jpg",
      accent: "cyan",
    },
    {
      name: "WeatherLive Pro",
      tagline: "Responsive weather dashboard",
      description:
        "A responsive weather application built on API-based weather data, with location search, forecasts and a lightweight server-rendered interface.",
      stack: ["Python", "Flask", "API"],
      github: "https://github.com/dhiru69-tech/device_inspector",
      demo: "",
      image: "/projects/weather.jpg",
      accent: "blue",
    },
  ] satisfies Project[],

  experience: experienceData,

  certifications: [
    {
      name: "Certification name — to be added",
      organization: "Issuing organization",
      date: "—",
      credential: "",
    },
    {
      name: "CTF participation certificate",
      organization: "Event organiser",
      date: "—",
      credential: "",
    },
    {
      name: "Hackathon certificate",
      organization: "Event organiser",
      date: "—",
      credential: "",
    },
    {
      name: "Internship certificate",
      organization: "Organization",
      date: "—",
      credential: "",
    },
  ],

  contact: {
    heading: "Let's connect.",
    description:
      "Have a project, collaboration, or cybersecurity opportunity? Feel free to reach out.",
  },

  nav: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },

    { label: "Contact", href: "#contact" },
  ],
};