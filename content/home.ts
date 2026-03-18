// ─── Hero ───────────────────────────────────────────────────────────────────
export type HeroContent = {
  badgeInner: string;
  badgeOuter: string;
  titleBefore: string;
  titleHighlight: string;
  titleAfter: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  heroImageLight: string;
  heroImageDark: string;
  heroImageAlt: string;
};

// ...types unchanged...

export const defaultHomeContent: HomeContent = {
  // ── Hero ─────────────────────────────────────────────────────────────────
  hero: {
    badgeInner: "Welcome",
    badgeOuter: "FlowCRM is ready",
    titleBefore: "Supercharge your",
    titleHighlight: "CRM",
    titleAfter: "operations with speed",
    subtitle:
      "FlowCRM is your modern, minimal Next.js starter, crafted for building streamlined, production-ready internal CRM tools. Built with robust authentication, extensibility, and a beautiful UI — everything you need to launch your internal workflow platform.",
    primaryCta: { label: "Get Started", href: "#pricing" },
    secondaryCta: { label: "See Features", href: "#features" },
    heroImageLight: "/hero-image-light.jpeg",
    heroImageDark: "/hero-image-dark.jpeg",
    heroImageAlt: "FlowCRM dashboard preview",
  },

  sponsors: {
    heading: "Built with trusted tools",
    items: [
      { icon: "Crown", name: "Vercel" },
      { icon: "Vegan", name: "Stripe" },
      { icon: "Ghost", name: "OpenAI" },
      { icon: "Puzzle", name: "Supabase" },
      { icon: "Squirrel", name: "Clerk" },
      { icon: "Cookie", name: "Resend" },
      { icon: "Drama", name: "Sentry" },
    ],
  },

  benefits: {
    eyebrow: "Why FlowCRM",
    heading: "A starter built for real CRM workflows",
    description:
      "Designed for business teams and developers that need a serious, scalable baseline for internal customer management — not another throwaway demo.",
    items: [
      {
        icon: "Blocks",
        title: "Production-Ready Foundations",
        description: "Avoid boilerplate traps. Start with real authentication, data models, and team flows.",
      },
      {
        icon: "LineChart",
        title: "Accelerate Operations",
        description: "Launch your CRM workflows, integrations, and automations in record time.",
      },
      {
        icon: "Wallet",
        title: "Save Engineering Hours",
        description: "No more auth, teams, or dashboard rewrites. Extend and ship features, not glue code.",
      },
      {
        icon: "Sparkle",
        title: "Instantly Adaptable",
        description: "A clean component system lets you rebrand, extend, or morph the UI for any workflow.",
      },
    ],
  },

  features: {
    eyebrow: "Features",
    heading: "Ready-to-use internal CRM tooling",
    subtitle:
      "FlowCRM is a minimal template, but ships with authentication, team structure, UI sections, extensible dashboard, and DB models — so you can focus on CRM logic, not setup.",
    items: [
      { icon: "TabletSmartphone", title: "Responsive By Default", description: "All layouts and sections automatically scale to fit mobile or desktop." },
      { icon: "BadgeCheck", title: "Credential Authentication", description: "Email/password sign-up, secure sessions, email verification, password resets." },
      { icon: "Goal", title: "Teams & Permissions", description: "Multi-tenant team layout manages users, roles, and invites." },
      { icon: "PictureInPicture", title: "Dashboard Scaffold", description: "Canonical sections for settings, teams, features, and settings. Add new modules in minutes." },
      { icon: "MousePointerClick", title: "Contact & Forms", description: "Contact CTA, form validation, and email flows built-in." },
      { icon: "Newspaper", title: "Modern UI/UX", description: "Brandable, WYSIWYG layout, responsive theming, and a polished component system." },
    ],
  },

  services: {
    eyebrow: "Services",
    heading: "Template, not SaaS – your data, your workflows",
    subtitle:
      "FlowCRM is a tech foundation, not a product subscription. Fork, launch, and own your stack — add any CRM or workflow module you need.",
    items: [
      { title: "Authentication Foundation", description: "Real email sign-up, password reset, and team features (no placeholders).", pro: false },
      { title: "Extensible Dashboard", description: "Sidebar-driven dashboard, ready for new modules and integration patterns.", pro: false },
      { title: "Developer Experience", description: "Typesafe code, fast dev workflow, and clear patterns for growing the codebase.", pro: false },
      { title: "Production Hardening", description: "Environment validation, E2E flows, and structure designed for scaling teams.", pro: true },
    ],
  },

  testimonials: {
    eyebrow: "Customer Stories",
    heading: "Early adopters of FlowCRM",
    reviews: [
      { image: "/demo-img.jpg", name: "Aarav Shah", role: "Founder, FinchFlow", comment: "We used FlowCRM to launch an internal sales pipeline for our ops team. Ready-to-ship foundations, real auth, and a beautiful UI out of the box.", rating: 5.0 },
      { image: "/demo-img.jpg", name: "Maya Patel", role: "Head of RevOps, OrbitDesk", comment: "The ready team & auth patterns let us finally polish our CRM without wasting sprint time on boilerplate.", rating: 4.8 },
      { image: "/demo-img.jpg", name: "Nikhil Rao", role: "CTO, TeamForge", comment: "Super clear structure and fast to extend for lead management, support tickets, and more.", rating: 4.9 },
      { image: "/demo-img.jpg", name: "Emma Brooks", role: "Product Manager, Nimbus", comment: "Everyone asked if this was an off-the-shelf SaaS. Clean UI, secure flows — ready for production.", rating: 5.0 },
      { image: "/demo-img.jpg", name: "Daniel Kim", role: "Developer, PulseOps", comment: "Deployment, Section edits, and integrations were all seamless. A true template, not just a demo.", rating: 5.0 },
      { image: "/demo-img.jpg", name: "Sofia Green", role: "COO, LaunchPad AI", comment: "Fastest MVP experience so far. Easy to deploy, secure, and up to modern UI standards.", rating: 4.9 },
    ],
  },

  team: {
    eyebrow: "Team",
    heading: "FlowCRM is built for you",
    members: [
      {
        imageUrl: "/team1.jpg",
        firstName: "Chirag",
        lastName: "Dodiya",
        positions: ["Founder · Owner", "Product & Engineering"],
        socialNetworks: [
          { name: "LinkedIn", url: "https://www.linkedin.com/in/chiragdodiya" },
          { name: "Github", url: "https://github.com/chiragdodiya" },
        ],
      },
      // Optionally list actual contributors or keep below as placeholders:
      {
        imageUrl: "/team2.jpg",
        firstName: "Elizabeth",
        lastName: "Moore",
        positions: ["Product Designer"],
        socialNetworks: [
          { name: "LinkedIn", url: "https://www.linkedin.com/in/elizabethmoore" },
          { name: "Github", url: "https://github.com/elizabethmoore" },
        ],
      },
      {
        imageUrl: "/team3.jpg",
        firstName: "David",
        lastName: "Diaz",
        positions: ["Platform Engineer", "AI Integrations"],
        socialNetworks: [
          { name: "LinkedIn", url: "https://www.linkedin.com/in/daviddiaz" },
          { name: "Github", url: "https://github.com/daviddiaz" },
        ],
      },
      // Add more as desired...
    ],
  },

  pricing: {
    eyebrow: "Pricing",
    heading: "Simple, open template and code",
    subtitle: "Fork and launch for free forever — use in your business, change as needed.",
    priceSuffix: "/month",
    plans: [
      {
        title: "Community",
        popular: true,
        price: 0,
        description: "100% open-source starter. Use, fork, and extend for your business or internal CRM.",
        buttonText: "Use for free",
        benefits: ["Unlimited teammates", "Open code", "Modern auth", "Production DB scaffolding", "Ready-to-customize dashboard"],
      },
      {
        title: "Pro Support",
        popular: false,
        price: 399,
        description: "Premium onboarding, integration help, and ongoing implementation Q&A. (Contact Chirag)",
        buttonText: "Contact Sales",
        benefits: ["1:1 onboarding call", "CRM/Workflow architecture review", "Custom module design", "Support SLA", "Priority fixes"],
      },
    ],
  },

  contact: {
    eyebrow: "Contact",
    heading: "Contact the FlowCRM team",
    description:
      "Want help customizing FlowCRM, planning your internal CRM, or need support? Reach out to Chirag directly.",
    mailtoAddress: "chirag@bidx.ai",
    info: {
      address: { label: "Find us", value: "Remote-first • San Francisco, CA" },
      phone: { label: "Call us", value: "" },
      email: { label: "Email us", value: "chirag@bidx.ai" },
      hours: { label: "Hours", value: ["Monday - Friday", "9AM - 6PM PT"] },
    },
    formSubjects: ["FlowCRM Demo", "Custom Implementation", "Support", "Internal CRM Architecture", "Pro Onboarding"],
    formSubmitLabel: "Send Message",
  },

  faq: {
    eyebrow: "FAQ",
    heading: "Common Questions",
    items: [
      { question: "Is FlowCRM free and open source?", answer: "Yes. You can deploy, fork, and grow your internal CRM directly from the template." },
      { question: "Can I use this as a production internal tool?", answer: "Yes. FlowCRM is built for real production deployment — not just demo code." },
      { question: "Does it come with authentication and teams?", answer: "All major foundations are prebuilt: sign-up, login, password reset, email verification, teams, roles, and more." },
      { question: "How do I deploy or extend features?", answer: "Just fork, configure environment variables, and ship. All logic is typesafe and easy to extend." },
      { question: "Where do I get support?", answer: "Email chirag@bidx.ai or choose Pro Support for architecture reviews and integration help." },
    ],
  },

  footer: {
    brandName: "FlowCRM",
    columns: [
      {
        heading: "Contact",
        links: [
          { label: "chirag@bidx.ai", href: "mailto:chirag@bidx.ai" },
          { label: "Github", href: "https://github.com/chiragdodiya" },
          { label: "LinkedIn", href: "https://linkedin.com/in/chiragdodiya" },
        ],
      },
      {
        heading: "Product",
        links: [
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" },
          { label: "Contact", href: "#contact" },
        ],
      },
      {
        heading: "Help",
        links: [
          { label: "Contact Us", href: "#contact" },
          { label: "FAQ", href: "#faq" },
        ],
      },
      {
        heading: "Socials",
        links: [
          { label: "GitHub", href: "https://github.com/chiragdodiya" },
          { label: "LinkedIn", href: "https://linkedin.com/in/chiragdodiya" },
        ],
      },
    ],
    copyright: "© 2026 FlowCRM. All rights reserved.",
    attribution: { label: "Built on Next.js", href: "https://nextjs.org" },
  },

  navbar: {
    brandName: "FlowCRM",
    routes: [
      { href: "/#features", label: "Features" },
      { href: "/#testimonials", label: "Testimonials" },
      { href: "/#team", label: "Team" },
      { href: "/#contact", label: "Contact" },
      { href: "/#faq", label: "FAQ" },
    ],
    featureDropdownLabel: "Features",
    featureImage: { src: "/demo-img.jpg", alt: "FlowCRM dashboard preview" },
    features: [
      { title: "Auth, Teams", description: "Signin/up, password reset, email verification, orgs." },
      { title: "Dashboard Scaffold", description: "Settings, team, customizable feature sections, and fast CRUD." },
      { title: "Ready to Grow", description: "Integration-ready, open code, and production hardening supported." },
    ],
    signInLabel: "Sign in",
    signUpLabel: "Sign up",
    dashboardLabel: "Dashboard",
    githubLink: { href: "https://github.com/chiragdodiya", ariaLabel: "View Chirag's GitHub" },
  },
};

export function getHomeContent(): HomeContent {
  return defaultHomeContent;
}