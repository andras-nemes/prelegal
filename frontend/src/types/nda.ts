export interface NdaFormData {
  purpose: string;
  effectiveDate: string;
  mndaTermYears: number;
  mndaTermType: "expires" | "continuous";
  confidentialityTermYears: number;
  confidentialityTermType: "fixed" | "perpetual";
  governingLaw: string;
  jurisdiction: string;
  party1Name: string;
  party1Title: string;
  party1Company: string;
  party1NoticeAddress: string;
  party2Name: string;
  party2Title: string;
  party2Company: string;
  party2NoticeAddress: string;
}
