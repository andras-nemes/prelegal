import { Page, View, Text } from "@react-pdf/renderer";
import type { NdaFormData } from "@/types/nda";
import { styles } from "./pdfStyles";

interface Props {
  data: NdaFormData;
}

function formatDate(iso: string): string {
  if (!iso) return "[Date]";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function CheckBox({ checked }: { checked: boolean }) {
  return (
    <View style={checked ? styles.checkBoxChecked : styles.checkBox}>
      {checked && <Text style={styles.checkMark}>✓</Text>}
    </View>
  );
}

export default function CoverPage({ data }: Props) {
  const signatureRows = [
    { label: "Signature",      val1: "",                       val2: "" },
    { label: "Print Name",     val1: data.party1Name,          val2: data.party2Name },
    { label: "Title",          val1: data.party1Title,         val2: data.party2Title },
    { label: "Company",        val1: data.party1Company,       val2: data.party2Company },
    { label: "Notice Address", val1: data.party1NoticeAddress, val2: data.party2NoticeAddress },
    { label: "Date",           val1: "",                       val2: "" },
  ];
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Mutual Non-Disclosure Agreement</Text>

      <Text style={styles.sectionTitle}>USING THIS MUTUAL NON-DISCLOSURE AGREEMENT</Text>
      <Text style={styles.bodyText}>
        This Mutual Non-Disclosure Agreement (the &quot;MNDA&quot;) consists of: (1) this Cover
        Page (&quot;Cover Page&quot;) and (2) the Common Paper Mutual NDA Standard Terms
        Version 1.0 (&quot;Standard Terms&quot;) identical to those posted at
        commonpaper.com/standards/mutual-nda/1.0. Any modifications of the Standard
        Terms should be made on the Cover Page, which will control over conflicts with
        the Standard Terms.
      </Text>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Purpose</Text>
      <Text style={styles.label}>How Confidential Information may be used</Text>
      <Text style={styles.bodyText}>
        {data.purpose || "[Evaluating whether to enter into a business relationship with the other party.]"}
      </Text>

      <Text style={styles.sectionTitle}>Effective Date</Text>
      <Text style={styles.bodyText}>{formatDate(data.effectiveDate)}</Text>

      <Text style={styles.sectionTitle}>MNDA Term</Text>
      <Text style={styles.label}>The length of this MNDA</Text>
      <View style={styles.checkRow}>
        <CheckBox checked={data.mndaTermType === "expires"} />
        <Text style={styles.bodyText}>
          Expires {data.mndaTermYears} year{data.mndaTermYears !== 1 ? "s" : ""} from Effective Date.
        </Text>
      </View>
      <View style={styles.checkRow}>
        <CheckBox checked={data.mndaTermType === "continuous"} />
        <Text style={styles.bodyText}>
          Continues until terminated in accordance with the terms of the MNDA.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Term of Confidentiality</Text>
      <Text style={styles.label}>How long Confidential Information is protected</Text>
      <View style={styles.checkRow}>
        <CheckBox checked={data.confidentialityTermType === "fixed"} />
        <Text style={styles.bodyText}>
          {data.confidentialityTermYears} year{data.confidentialityTermYears !== 1 ? "s" : ""} from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws.
        </Text>
      </View>
      <View style={styles.checkRow}>
        <CheckBox checked={data.confidentialityTermType === "perpetual"} />
        <Text style={styles.bodyText}>In perpetuity.</Text>
      </View>

      <Text style={styles.sectionTitle}>Governing Law &amp; Jurisdiction</Text>
      <Text style={styles.bodyText}>
        Governing Law: {data.governingLaw || "[State]"}
      </Text>
      <Text style={styles.bodyText}>
        Jurisdiction: {data.jurisdiction || "[City or county and state]"}
      </Text>

      <Text style={styles.sectionTitle}>MNDA Modifications</Text>
      <Text style={styles.bodyText}>None.</Text>

      <Text style={{ ...styles.bodyText, marginTop: 8 }}>
        By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.
      </Text>

      <View style={styles.signatureTable}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderLabel}> </Text>
          <Text style={styles.tableHeaderCell}>PARTY 1</Text>
          <Text style={styles.tableHeaderCell}>PARTY 2</Text>
        </View>
        {signatureRows.map(({ label, val1, val2 }) => (
          <View key={label} style={styles.tableRow}>
            <Text style={styles.tableRowLabel}>{label}</Text>
            <View style={styles.tableCell}>
              {val1 ? <Text style={{ fontSize: 9 }}>{val1}</Text> : null}
            </View>
            <View style={styles.tableCell}>
              {val2 ? <Text style={{ fontSize: 9 }}>{val2}</Text> : null}
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>
        Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use under CC BY 4.0.{"\n"}
        Generated by PreLegal. This document is a draft only and is subject to legal review before use.
      </Text>
    </Page>
  );
}
