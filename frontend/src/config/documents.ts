export interface DocumentField {
  name: string;
  label: string;
}

export interface DocumentConfig {
  slug: string;
  name: string;
  description: string;
  fields: DocumentField[];
  /** If true, routes to /nda instead of /documents/[slug] */
  useNdaRoute?: boolean;
}

export const DOCUMENTS: DocumentConfig[] = [
  {
    slug: "mutual-nda",
    name: "Mutual Non-Disclosure Agreement",
    description:
      "Standard terms for a mutual NDA allowing both parties to share confidential information for evaluating a potential business relationship.",
    useNdaRoute: true,
    fields: [],
  },
  {
    slug: "mutual-nda-coverpage",
    name: "Mutual NDA Cover Page",
    description:
      "Cover page template for the Common Paper Mutual NDA, containing fill-in fields for purpose, effective date, term, confidentiality period, governing law, jurisdiction, and party signature blocks.",
    fields: [
      { name: "purpose", label: "Purpose" },
      { name: "effectiveDate", label: "Effective Date" },
      { name: "mndaTermType", label: "MNDA Term Type" },
      { name: "mndaTermYears", label: "MNDA Term (years)" },
      { name: "confidentialityTermType", label: "Confidentiality Term Type" },
      { name: "confidentialityTermYears", label: "Confidentiality Term (years)" },
      { name: "governingLaw", label: "Governing Law" },
      { name: "jurisdiction", label: "Jurisdiction" },
      { name: "party1Name", label: "Party 1 Name" },
      { name: "party1Title", label: "Party 1 Title" },
      { name: "party1Company", label: "Party 1 Company" },
      { name: "party1NoticeAddress", label: "Party 1 Notice Address" },
      { name: "party2Name", label: "Party 2 Name" },
      { name: "party2Title", label: "Party 2 Title" },
      { name: "party2Company", label: "Party 2 Company" },
      { name: "party2NoticeAddress", label: "Party 2 Notice Address" },
    ],
  },
  {
    slug: "csa",
    name: "Cloud Service Agreement",
    description:
      "Standard terms for a SaaS cloud service subscription, covering access and use rights, restrictions, privacy and security obligations, payment and taxes, term and termination.",
    fields: [
      { name: "customer", label: "Customer" },
      { name: "provider", label: "Provider" },
      { name: "subscriptionPeriod", label: "Subscription Period" },
      { name: "technicalSupport", label: "Technical Support Level" },
      { name: "useLimitations", label: "Use Limitations" },
      { name: "paymentProcess", label: "Payment Process" },
      { name: "orderDate", label: "Order Date" },
      { name: "nonRenewalNoticeDate", label: "Non-Renewal Notice Date" },
      { name: "effectiveDate", label: "Effective Date" },
      { name: "governingLaw", label: "Governing Law" },
      { name: "chosenCourts", label: "Chosen Courts" },
    ],
  },
  {
    slug: "design-partner-agreement",
    name: "Design Partner Agreement",
    description:
      "Agreement for early-access design partner programs where a partner receives pre-release product access in exchange for providing structured feedback.",
    fields: [
      { name: "partner", label: "Partner" },
      { name: "provider", label: "Provider" },
      { name: "term", label: "Term" },
      { name: "program", label: "Program" },
      { name: "fees", label: "Fees" },
      { name: "effectiveDate", label: "Effective Date" },
      { name: "governingLaw", label: "Governing Law" },
      { name: "chosenCourts", label: "Chosen Courts" },
      { name: "partnerNoticeAddress", label: "Partner Notice Address" },
      { name: "providerNoticeAddress", label: "Provider Notice Address" },
    ],
  },
  {
    slug: "sla",
    name: "Service Level Agreement",
    description:
      "Standard terms defining uptime and support response time commitments for a cloud service, including calculation methods, service credit remedies, and termination rights.",
    fields: [
      { name: "provider", label: "Provider" },
      { name: "customer", label: "Customer" },
      { name: "targetUptime", label: "Target Uptime" },
      { name: "subscriptionPeriod", label: "Subscription Period" },
      { name: "targetResponseTime", label: "Target Response Time" },
      { name: "supportChannel", label: "Support Channel" },
      { name: "uptimeCredit", label: "Uptime Credit" },
      { name: "responseTimeCredit", label: "Response Time Credit" },
      { name: "scheduledDowntime", label: "Scheduled Downtime" },
    ],
  },
  {
    slug: "psa",
    name: "Professional Services Agreement",
    description:
      "Standard terms for consulting and deliverable-based professional services engagements, covering SOW management, IP assignment, payment, warranties, liability, and indemnification.",
    fields: [
      { name: "customer", label: "Customer" },
      { name: "provider", label: "Provider" },
      { name: "effectiveDate", label: "Effective Date" },
      { name: "sowTerm", label: "SOW Term" },
      { name: "deliverables", label: "Deliverables" },
      { name: "rejectionPeriod", label: "Rejection Period" },
      { name: "fees", label: "Fees" },
      { name: "paymentPeriod", label: "Payment Period" },
      { name: "generalCapAmount", label: "General Cap Amount" },
      { name: "increasedCapAmount", label: "Increased Cap Amount" },
      { name: "providerCoveredClaims", label: "Provider Covered Claims" },
      { name: "customerCoveredClaims", label: "Customer Covered Claims" },
      { name: "insuranceMinimums", label: "Insurance Minimums" },
      { name: "governingLaw", label: "Governing Law" },
      { name: "chosenCourts", label: "Chosen Courts" },
    ],
  },
  {
    slug: "dpa",
    name: "Data Processing Agreement",
    description:
      "GDPR-compliant agreement governing how a service provider processes personal data on behalf of a customer, including transfer mechanisms, security incident response, audit rights, and deletion obligations.",
    fields: [
      { name: "customer", label: "Customer" },
      { name: "provider", label: "Provider" },
      { name: "categoriesOfPersonalData", label: "Categories of Personal Data" },
      { name: "categoriesOfDataSubjects", label: "Categories of Data Subjects" },
      { name: "agreement", label: "Underlying Agreement" },
    ],
  },
  {
    slug: "software-license-agreement",
    name: "Software License Agreement",
    description:
      "Standard terms for licensing on-premise software, covering the license grant, permitted use, restrictions, updates, payment, warranties, liability limitations, indemnification, and confidentiality.",
    fields: [
      { name: "customer", label: "Customer" },
      { name: "provider", label: "Provider" },
      { name: "subscriptionPeriod", label: "Subscription Period" },
      { name: "permittedUses", label: "Permitted Uses" },
      { name: "orderDate", label: "Order Date" },
      { name: "nonRenewalNoticeDate", label: "Non-Renewal Notice Date" },
      { name: "deletionProcedure", label: "Deletion Procedure" },
      { name: "warrantyPeriod", label: "Warranty Period" },
      { name: "generalCapAmount", label: "General Cap Amount" },
      { name: "increasedCapAmount", label: "Increased Cap Amount" },
      { name: "providerCoveredClaims", label: "Provider Covered Claims" },
      { name: "customerCoveredClaims", label: "Customer Covered Claims" },
      { name: "effectiveDate", label: "Effective Date" },
      { name: "governingLaw", label: "Governing Law" },
      { name: "chosenCourts", label: "Chosen Courts" },
    ],
  },
  {
    slug: "partnership-agreement",
    name: "Partnership Agreement",
    description:
      "Standard terms for co-marketing and collaboration partnerships, covering mutual obligations, trademark licensing, payment, escalation procedures, term and termination, liability, indemnification, and confidentiality.",
    fields: [
      { name: "company", label: "Company" },
      { name: "partner", label: "Partner" },
      { name: "companyObligations", label: "Company Obligations" },
      { name: "partnerObligations", label: "Partner Obligations" },
      { name: "paymentSchedule", label: "Payment Schedule" },
      { name: "territory", label: "Territory" },
      { name: "brandGuidelines", label: "Brand Guidelines" },
      { name: "endDate", label: "End Date" },
      { name: "generalCapAmount", label: "General Cap Amount" },
      { name: "increasedCapAmount", label: "Increased Cap Amount" },
      { name: "companyCoveredClaim", label: "Company Covered Claims" },
      { name: "partnerCoveredClaims", label: "Partner Covered Claims" },
      { name: "governingLaw", label: "Governing Law" },
      { name: "chosenCourts", label: "Chosen Courts" },
      { name: "effectiveDate", label: "Effective Date" },
    ],
  },
  {
    slug: "pilot-agreement",
    name: "Pilot Agreement",
    description:
      "Standard terms for a time-limited product evaluation pilot, granting the customer access solely for evaluation purposes, with lightweight warranties, liability caps, and confidentiality obligations.",
    fields: [
      { name: "customer", label: "Customer" },
      { name: "provider", label: "Provider" },
      { name: "pilotPeriod", label: "Pilot Period" },
      { name: "effectiveDate", label: "Effective Date" },
      { name: "generalCapAmount", label: "General Cap Amount" },
      { name: "governingLaw", label: "Governing Law" },
      { name: "chosenCourts", label: "Chosen Courts" },
    ],
  },
  {
    slug: "baa",
    name: "Business Associate Agreement",
    description:
      "HIPAA-compliant agreement governing how a service provider handles Protected Health Information (PHI) on behalf of a covered entity, including safeguards, breach notification, and subcontractor requirements.",
    fields: [
      { name: "provider", label: "Provider" },
      { name: "company", label: "Company (Covered Entity)" },
      { name: "breachNotificationPeriod", label: "Breach Notification Period" },
      { name: "baaEffectiveDate", label: "BAA Effective Date" },
      { name: "agreement", label: "Underlying Agreement" },
      { name: "limitations", label: "PHI Use Limitations" },
    ],
  },
  {
    slug: "ai-addendum",
    name: "AI Addendum",
    description:
      "Addendum to an existing agreement governing the use of AI and machine learning features within a product, covering model training restrictions, input/output ownership, data protection obligations, and AI-specific disclaimers.",
    fields: [
      { name: "customer", label: "Customer" },
      { name: "provider", label: "Provider" },
      { name: "trainingData", label: "Training Data Permitted" },
      { name: "trainingPurposes", label: "Training Purposes" },
      { name: "trainingRestrictions", label: "Training Restrictions" },
      { name: "improvementRestrictions", label: "Improvement Restrictions" },
    ],
  },
];

export function getDocumentBySlug(slug: string): DocumentConfig | undefined {
  return DOCUMENTS.find((d) => d.slug === slug);
}

export function getDocumentHref(doc: DocumentConfig): string {
  return doc.useNdaRoute ? "/nda" : `/documents/${doc.slug}`;
}
