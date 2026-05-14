import { Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./pdfStyles";
import { STANDARD_TERMS } from "@/content/mutual-nda-standard-terms";

export default function StandardTermsPage() {
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Standard Terms</Text>
      {STANDARD_TERMS.map(({ index, text }) => (
        <View key={index} style={styles.termsParagraph}>
          <Text style={styles.termsIndex}>{index}.</Text>
          <Text style={styles.termsText}>{text}</Text>
        </View>
      ))}
      <Text style={styles.footer}>
        Common Paper Mutual Non-Disclosure Agreement Version 1.0 free to use under CC BY 4.0.
      </Text>
    </Page>
  );
}
