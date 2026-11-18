// All site copy lives here. Edit this file to update the portfolio.
//
// Screenshots: drop originals in screenshots/<project>/, run `npm run images`,
// then reference them below as "/work/<project>/<name>.webp".

export const profile = {
  name: "Ethan Reyna",
  role: "Frontend Software Engineer",
  email: "dev@ethanreyna.com",
  linkedin: "https://www.linkedin.com/in/ethan-reyna-1086a314b/",
  github: "https://github.com/ethanreyna",
  resume: "/Ethan-Reyna-Resume.pdf",
  greeting: "Hi, I'm Ethan",
  headline: "I build web apps and stuff.",
  intro:
    "I'm a frontend engineer, mostly working in TypeScript, React, and Next.js. I tend to end up on the harder pieces of a product, like canvas editors, long multi-step flows, and report generators, and I like working closely with design and product to get the details right.",
  currently: "Software engineer at Strata",
};

export const stats = [
  { value: "4+", label: "years building production frontends" },
  { value: "100+", label: "pull requests merged at Strata" },
  { value: "8,000+", label: "reports made with a generator I rebuilt" },
  { value: "5,000+", label: "tenants using an app I made responsive" },
];

export type Shot = {
  src: string;
  alt: string;
  caption: string;
  /** "contain" for images far from ~16:9 (tall pages, small menus) so they aren't cropped. */
  fit?: "cover" | "contain";
};

export type Feature = {
  title: string;
  summary: string;
  points: string[];
  tags: string[];
  shots: Shot[];
};

export type CaseStudy = {
  id: string;
  company: string;
  product: string;
  role: string;
  period: string;
  blurb: string;
  accent: string;
  features: Feature[];
};

export const caseStudies: CaseStudy[] = [
  {
    id: "strata",
    company: "Strata",
    product: "Mailtech",
    role: "Software Engineer",
    period: "2025 to now",
    accent: "var(--accent)",
    blurb:
      "Mailtech is software for running large direct mail campaigns. I work on big parts of its Next.js/React frontend, from campaign setup to the mail designer to audience ordering.",
    features: [
      {
        title: "Campaign configuration",
        summary:
          "I designed and built the whole frontend for setting up a campaign. There are a lot of settings in one flow, so much of the work was keeping it easy to follow.",
        points: [
          "Mailer selection, variable mapping, and recipient setup",
          "Postage, webhooks, budget, and suppression settings",
          "Create/edit flows built to stay usable as campaigns get complex",
        ],
        tags: ["Next.js", "React", "TypeScript"],
        shots: [],
      },
      {
        title: "Visual mail designer",
        summary:
          "A canvas editor for laying out physical mail, with its state stored in RxDB. I added many of the editing features people expect from a design tool.",
        points: [
          "Layer copy/paste and right-click context menus",
          "Undo/history that holds up across complex edits",
          "Text copyfit and an eyedropper color picker",
        ],
        tags: ["Canvas", "RxDB", "React"],
        shots: [
          {
            src: "/work/strata/mail-designer.webp",
            alt: "Mail designer canvas showing a postcard layout with a layers panel, rulers, and postage settings",
            caption: "The designer: layers you can reorder, lock, and hide, rulers in inches, postage, and page thumbnails.",
          },
        ],
      },
      {
        title: "Data Requests: audience ordering",
        summary:
          "A new workflow I owned from start to finish. Users draw on a map, add include and exclude rules, and see the household count update as they go.",
        points: [
          "Mapbox geo targeting",
          "Trait-based include/exclude groups and suppression list upload",
          "Live precount status backed by Elasticsearch recipient-estimate APIs",
        ],
        tags: ["Mapbox", "Elasticsearch", "React"],
        shots: [
          {
            src: "/work/strata/data-requests.webp",
            alt: "Data Request draft with a live household count, criteria groups, and a map layers panel",
            caption: "A draft request: live household count, include/exclude criteria groups, suppression, schedule, and map layers.",
          },
        ],
      },
      {
        title: "Campaign operations",
        summary:
          "The screens the team uses every day to see what's running, how it's performing, and what needs attention.",
        points: [
          "Activity logging and a performance overview",
          "Error recovery, plus archive and recover actions",
        ],
        tags: ["Next.js", "TypeScript"],
        shots: [
          {
            src: "/work/strata/campaigns-list.webp",
            alt: "Campaigns table with tactic type, status, spend, and delivery columns plus filters",
            caption: "Campaigns list with tactic, status, and archive filters.",
          },
          {
            src: "/work/strata/campaign-detail.webp",
            alt: "Campaign detail page with budget summary, performance metrics, filters, and tabs for configuration and activity log",
            caption: "Campaign detail: budget and run status up top, with performance, configuration, and activity log tabs.",
          },
          {
            src: "/work/strata/dashboard.webp",
            alt: "Performance dashboard with sent, delivered, and click metrics, a trend chart, and audience breakdowns",
            caption: "Account-wide performance dashboard with filters and period-over-period change.",
          },
        ],
      },
      {
        title: "Mailtech Assistant",
        summary:
          "A chat panel where users can ask about their campaigns or tell it where they want to go in the app.",
        points: [
          "Suggested prompts for common questions and navigation",
          "Text and voice input with attachments",
        ],
        tags: ["React", "AI"],
        shots: [
          {
            src: "/work/strata/assistant.webp",
            alt: "Mailtech Assistant panel with a greeting, prompt box, and suggested questions",
            caption: "The assistant panel with suggested prompts.",
            fit: "contain",
          },
        ],
      },
    ],
  },
  {
    id: "trava",
    company: "Trava",
    product: "Cyber risk platform",
    role: "Software Engineer",
    period: "2022 to 2024",
    accent: "#5cc8b4",
    blurb:
      "Trava helps MSPs and businesses understand their cyber risk. I led feature work on its TypeScript/React web app, mostly reporting and client management.",
    features: [
      {
        title: "Reports section and multi-template generator",
        summary:
          "The old generator could only make one kind of document. I rebuilt it to work with any template and fill in the right data, then built the Reports section around it. It has generated more than 8,000 reports in production.",
        points: [
          "Template picker with a description of what each report needs",
          "Step-by-step wizard: client, assessments, controls, previous report, options",
          "Searchable, filterable report history with PDF and DOCX downloads",
        ],
        tags: ["React", "TypeScript", "Document generation"],
        shots: [
          {
            src: "/work/trava/reports-list.webp",
            alt: "Reports table listing generated reports with type, date, status, and download columns",
            caption: "Report history: filter by type, status, and author, then download.",
          },
          {
            src: "/work/trava/report-templates.webp",
            alt: "Start Report screen with an expandable list of report templates",
            caption: "Choosing a template. Each one explains the data it needs.",
          },
          {
            src: "/work/trava/wizard-1-client.webp",
            alt: "Wizard step 1, a paginated client table with radio selection",
            caption: "Step 1: pick the client out of 1,700+.",
          },
          {
            src: "/work/trava/wizard-2-assessments.webp",
            alt: "Wizard step 2, assessment selection with scores and status",
            caption: "Step 2: pick the vulnerability assessments to include.",
          },
          {
            src: "/work/trava/wizard-3-controls.webp",
            alt: "Wizard step 3, selecting a CISv8 IG1 controls survey",
            caption: "Step 3: attach a controls survey.",
          },
          {
            src: "/work/trava/wizard-5-options.webp",
            alt: "Wizard step 5, report options with toggles and a slider",
            caption: "Step 5: title, auto-download, and vulnerability options.",
          },
          {
            src: "/work/trava/reports-download.webp",
            fit: "contain",
            alt: "Download menu offering PDF and DOCX",
            caption: "Every report downloads as PDF or DOCX.",
          },
        ],
      },
      {
        title: "Bulk client import via CSV",
        summary:
          "Clients used to be added one at a time. With this feature, a tenant can upload a CSV and add or update up to 200 clients at once.",
        points: [
          "Drag-and-drop upload with a downloadable template",
          "A review step that splits new clients from updated ones before anything is saved",
          "A built-in guide to making the CSV in Excel, Numbers, or Sheets",
        ],
        tags: ["React", "CSV parsing", "Onboarding"],
        shots: [
          {
            src: "/work/trava/csv-review.webp",
            alt: "Import review table showing new clients to be created",
            caption: "Check new and updated clients before committing.",
          },
          {
            src: "/work/trava/csv-upload.webp",
            alt: "CSV upload dropzone",
            caption: "Upload screen with template download.",
          },
          {
            src: "/work/trava/csv-guide.webp",
            fit: "contain",
            alt: "Step-by-step guide for building a client CSV",
            caption: "The in-app guide to building the file.",
          },
          {
            src: "/work/trava/clients-actions.webp",
            fit: "contain",
            alt: "Clients Actions menu with Import Clients Via CSV option",
            caption: "Opened from the Clients page Actions menu.",
          },
        ],
      },
    ],
  },
];

export type Job = {
  company: string;
  role: string;
  period: string;
  points: string[];
};

export const experience: Job[] = [
  {
    company: "Strata",
    role: "Software Engineer",
    period: "Mar 2025 to now",
    points: [
      "Designed and built the full frontend for Mailtech's campaign configuration experience.",
      "Shipped major features in the visual mail designer: copy/paste, context menus, undo/history, copyfit, eyedropper.",
      "Owned the greenfield Data Requests audience-ordering workflow from start to finish.",
      "Merged 100+ pull requests across the frontend codebase.",
    ],
  },
  {
    company: "Onit",
    role: "Senior Software Analyst",
    period: "Apr 2024 to Mar 2025",
    points: [
      "Built features and custom solutions in Apptitude, a platform for managing complex legal processes, fitted to each client's environment.",
      "Fixed client-reported bugs quickly to keep downtime low.",
      "Was handling support on my own within a month, when the plan was three.",
    ],
  },
  {
    company: "Trava",
    role: "Software Engineer",
    period: "May 2022 to Apr 2024",
    points: [
      "Led feature development on a TypeScript/React web app.",
      "Rebuilt the report generator to support multiple templates; it has produced 8,000+ reports.",
      "Built CSV client import, letting tenants add up to 200 clients at once.",
      "Made the app responsive and easier to use for 5,000+ tenants, without a dedicated designer.",
    ],
  },
];

export const education = {
  school: "University of Houston",
  degree: "B.S. Computer Science",
  year: "2022",
};

export const skills = [
  {
    group: "Frontend",
    items: ["TypeScript", "JavaScript", "React", "Next.js", "Vite", "HTML", "CSS", "Tailwind", "Material UI"],
  },
  {
    group: "Backend & APIs",
    items: ["Node.js", "Express", "GraphQL", "Python", "FastAPI", "PostgreSQL", "Hono"],
  },
  {
    group: "Platform & tools",
    items: ["Git", "GitHub", "Cloudflare Workers", "GCP", "Docker", "Linux", "Figma", "Jira"],
  },
];
