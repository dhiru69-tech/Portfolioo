export type Tool = {
  name: string;
  /** simpleicons.org slug used for the logo mark. */
  slug: string;
  category: string;
  blurb: string;
};

/** Edit freely — the reel is fully data driven. */
export const tools: Tool[] = [
  {
    name: "React",
    slug: "react",
    category: "Frontend",
    blurb: "Component architecture for every interface I ship.",
  },
  {
    name: "TypeScript",
    slug: "typescript",
    category: "Language",
    blurb: "Typed end to end — fewer runtime surprises.",
  },
  {
    name: "Next.js",
    slug: "nextdotjs",
    category: "Frontend",
    blurb: "Routing, rendering and edge delivery out of the box.",
  },
  {
    name: "Tailwind CSS",
    slug: "tailwindcss",
    category: "Frontend",
    blurb: "Design tokens as utilities, consistent at any scale.",
  },
  {
    name: "Framer Motion",
    slug: "framer",
    category: "Motion",
    blurb: "Spring physics behind every transition on this site.",
  },
  {
    name: "Python",
    slug: "python",
    category: "Language",
    blurb: "Automation, tooling and offensive security scripting.",
  },
  {
    name: "C++",
    slug: "cplusplus",
    category: "Language",
    blurb: "Low-level fundamentals: memory, structures, performance.",
  },
  {
    name: "Node.js",
    slug: "nodedotjs",
    category: "Backend",
    blurb: "APIs, workers and glue services in one runtime.",
  },
  {
    name: "Docker",
    slug: "docker",
    category: "Cloud",
    blurb: "Reproducible labs and deployments, everywhere.",
  },
  { name: "Git", slug: "git", category: "Tooling", blurb: "Branching discipline and clean history." },
  {
    name: "GitHub",
    slug: "github",
    category: "Tooling",
    blurb: "Reviews, actions and everything open I publish.",
  },
  {
    name: "Linux",
    slug: "linux",
    category: "Systems",
    blurb: "Daily driver — shell first, GUI second.",
  },
  {
    name: "Kali Linux",
    slug: "kalilinux",
    category: "Cyber Security",
    blurb: "The offensive toolkit I run engagements from.",
  },
  {
    name: "Burp Suite",
    slug: "portswigger",
    category: "Cyber Security",
    blurb: "Intercepting, fuzzing and breaking web apps.",
  },
  {
    name: "Nmap",
    slug: "nmap",
    category: "Cyber Security",
    blurb: "Recon and service mapping on every target scope.",
  },
  {
    name: "Wireshark",
    slug: "wireshark",
    category: "Cyber Security",
    blurb: "Packet-level truth when logs disagree.",
  },
  {
    name: "Supabase",
    slug: "supabase",
    category: "Database",
    blurb: "Postgres, auth and storage without the setup tax.",
  },
  {
    name: "Firebase",
    slug: "firebase",
    category: "Database",
    blurb: "Realtime data for quick product experiments.",
  },
  {
    name: "MongoDB",
    slug: "mongodb",
    category: "Database",
    blurb: "Document modelling for flexible schemas.",
  },
  {
    name: "PostgreSQL",
    slug: "postgresql",
    category: "Database",
    blurb: "Relational workhorse — SQL, indexes, RLS.",
  },
  {
    name: "VS Code",
    slug: "vscodium",
    category: "Tooling",
    blurb: "Where all of the above actually gets written.",
  },
];

export const toolLogoUrl = (slug: string, color = "ffffff") =>
  `https://cdn.simpleicons.org/${slug}/${color}`;
