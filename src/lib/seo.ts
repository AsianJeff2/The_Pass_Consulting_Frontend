import type { Metadata } from "next";
import { publicSiteUrl } from "./site.ts";

export const SITE_NAME = "The Pass Consulting";
export const HOME_TITLE = "Restaurant Consulting";
export const HOME_DESCRIPTION = "Restaurant consulting for independent operators. Michael Park helps you examine staffing, food costs, sales, and operating priorities in Southern California and beyond.";

export const SERVICES = [
  {
    slug: "restaurant-operational-diagnostics",
    title: "The whole operation",
    tag: "Operational diagnostics",
    text: "Bring your numbers, processes, and owner perspective together to understand where to focus.",
    searchTitle: "Restaurant Operational Diagnostics",
    description: "Examine your restaurant's operating data and processes with Michael Park. Identify questions, assess constraints, and agree on priorities for your next steps.",
    intro: "You may see several pressures at once: uneven sales, staffing strain, or costs that leave less room than expected. An operational diagnostic helps you examine the connections before you choose where to spend time and money.",
    fit: "This work starts with a decision you need to make. You might be weighing a change to opening hours, trying to understand a cost increase, or deciding which operating problem to address first. Michael brings your perspective into the analysis so the findings reflect how your restaurant runs.",
    examination: "Depending on the scope, Michael can examine sales summaries, cost categories, staffing patterns, and the processes behind them. He checks which periods and locations you can compare, identifies gaps in the records, and discusses assumptions with you. A busy week, a closure, or a change in how you record costs can affect the interpretation.",
    questions: [
      "Which parts of the operation need a closer review before you act?",
      "Do sales, staffing, and cost records cover comparable periods?",
      "Which constraints can you change, and which need a different plan?",
    ],
    deliverables: "A scoped diagnostic can include a written findings brief, a list of assumptions and data gaps, and an action roadmap. You and Michael agree on the decisions to support, the records to use, and the deliverables before work begins. You retain responsibility for business decisions and implementation.",
  },
  {
    slug: "restaurant-labor-staffing",
    title: "Your team, in rhythm",
    tag: "Labor & staffing",
    text: "Look at scheduling alongside demand. Understand how staffing patterns support service, and where the fit could be better.",
    searchTitle: "Restaurant Labor & Staffing Consulting",
    description: "Review restaurant scheduling alongside sales and service demand. Michael Park helps independent operators assess staffing patterns and practical trade-offs.",
    intro: "You need enough people to deliver service while keeping staffing decisions within your restaurant's budget. Reviewing the schedule alongside demand gives you a basis for discussing the trade-offs with your managers.",
    fit: "A staffing review can help you investigate repeated overtime, uneven coverage, or a schedule that no longer matches your busiest periods. Michael starts with your service model, opening hours, and team constraints. You explain the work that takes place outside guest service, including preparation, closing, and training.",
    examination: "Within the agreed scope, Michael can compare aggregated labor hours and costs with sales by day or daypart. He checks how you classify roles, accounts for changes in operating hours, and asks about service requirements that a sales total cannot capture. You can review possible scheduling changes against those requirements before choosing a trial.",
    questions: [
      "Do you schedule preparation and closing work as well as service coverage?",
      "Which periods have repeated coverage gaps or unused capacity?",
      "How would you judge a scheduling trial through cost and service measures?",
    ],
    deliverables: "A scoped review can include a staffing pattern analysis, questions for your managers, and a proposed trial with measures to revisit. You and Michael agree on the output before work begins. You make employment decisions and obtain qualified advice on wage, hour, and other employment requirements.",
  },
  {
    slug: "restaurant-food-operating-costs",
    title: "Room in the margins",
    tag: "Food & operating costs",
    text: "Examine the relationship between food costs, labor, and sales to make sense of your cost structure.",
    searchTitle: "Restaurant Food & Operating Cost Consulting",
    description: "Examine restaurant food costs, labor, and sales together. Michael Park helps independent operators review cost assumptions and decide where to investigate.",
    intro: "You may know that costs have risen without knowing how much comes from purchasing, volume, or day-to-day operations. A cost review helps you separate those questions and decide where further work would help.",
    fit: "This work can support an owner who needs to understand a change in food costs or review the relationship between sales and operating expenses. Michael starts with the decision you face and the records you have. He distinguishes recorded costs from estimates so you can judge the limits of each comparison.",
    examination: "The agreed review may include food purchases, inventory summaries, labor costs, and sales for matching periods. Michael asks about stock movements, waste, supplier changes, and unusual expenses before interpreting a percentage. If the records do not support a conclusion, he identifies the missing information and a way for you to collect it.",
    questions: [
      "Are you comparing purchases or food usage with sales?",
      "Did changes in inventory or timing affect the cost comparison?",
      "Which operating changes would you test before making a wider commitment?",
    ],
    deliverables: "A scoped review can include a cost summary, documented assumptions, and a short sequence of investigations or operating trials. You and Michael agree on the records and output before work begins. This engagement concerns restaurant operations; you should use qualified accounting, tax, or investment advisers for those services.",
  },
  {
    slug: "restaurant-sales-guest-demand",
    title: "The patterns behind demand",
    tag: "Sales & guest demand",
    text: "Explore sales by day and daypart, alongside repeat-guest patterns. Find the questions that matter for your next decision.",
    searchTitle: "Restaurant Sales & Demand Consulting",
    description: "Explore restaurant sales by day and daypart with Michael Park. Review demand patterns and data limits before changing hours, staffing, or operating plans.",
    intro: "You make decisions about hours, staffing, and the guest experience with an incomplete view of demand. Reviewing sales patterns can help you choose a narrower question to investigate before changing the operation.",
    fit: "This work can help you compare dayparts, understand uneven weeks, or consider a change to opening hours. Michael asks which decision you want to support and which periods reflect normal trading. You discuss events, promotions, closures, and changes to your service model that may affect the comparison.",
    examination: "Within the agreed scope, Michael can review aggregated sales, transaction counts, and daypart summaries. Repeat-guest analysis depends on the data you have and the permissions to use it. Where summaries can answer the question, Michael plans the review around aggregates and avoids requesting identifiable guest records.",
    questions: [
      "Do stronger sales reflect more transactions, higher spend, or a different mix?",
      "Are you comparing equivalent weekdays, hours, and trading conditions?",
      "Which measure would help you assess a change to hours or service?",
    ],
    deliverables: "A scoped review can include a demand pattern brief, notes on the limits of the data, and a proposal for a focused operating trial. You and Michael agree on the analysis and output before work begins. Observed patterns support investigation; they do not establish that a promotion or operating change caused a result.",
  },
] as const;

export type Service = (typeof SERVICES)[number];

export function servicePath(service: Service): string {
  return `/services/${service.slug}`;
}

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const site = publicSiteUrl();
  const url = site ? new URL(path, site).href : undefined;
  const fullTitle = `${title} | ${SITE_NAME}`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: { title: fullTitle, description, url, siteName: SITE_NAME, type: "website", locale: "en_US" },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}

export function websiteStructuredData() {
  const site = publicSiteUrl();
  if (!site) return null;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.href}#website`,
    url: site.href,
    name: SITE_NAME,
    description: HOME_DESCRIPTION,
    inLanguage: "en-US",
    publisher: { "@type": "Person", name: "Michael Park", url: `${site.href}#about` },
  };
}

export function serviceStructuredData(service: Service) {
  const site = publicSiteUrl();
  if (!site) return null;
  const url = new URL(servicePath(service), site).href;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.searchTitle,
        serviceType: service.tag,
        description: service.description,
        url,
        provider: { "@type": "Person", name: "Michael Park", url: `${site.href}#about` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.href },
          { "@type": "ListItem", position: 2, name: "Restaurant consulting services", item: new URL("/services", site).href },
          { "@type": "ListItem", position: 3, name: service.tag, item: url },
        ],
      },
    ],
  };
}

/** Escape HTML delimiters even when the current payload contains only authored text. */
export function serializeStructuredData(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
