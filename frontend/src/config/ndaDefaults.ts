import type { NdaFormData } from "@/types/nda";

export const DEFAULT_NDA: NdaFormData = {
  purpose:
    "Evaluating whether to enter into a business relationship with the other party.",
  effectiveDate: new Date().toISOString().split("T")[0],
  mndaTermYears: 1,
  mndaTermType: "expires",
  confidentialityTermYears: 1,
  confidentialityTermType: "fixed",
  governingLaw: "",
  jurisdiction: "",
  party1Name: "",
  party1Title: "",
  party1Company: "",
  party1NoticeAddress: "",
  party2Name: "",
  party2Title: "",
  party2Company: "",
  party2NoticeAddress: "",
};
