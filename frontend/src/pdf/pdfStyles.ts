import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 50,
    paddingBottom: 60,
    paddingHorizontal: 55,
    color: "#1a1a1a",
  },
  title: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginTop: 14,
    marginBottom: 4,
  },
  label: {
    fontSize: 8,
    color: "#666666",
    marginBottom: 2,
    fontStyle: "italic",
  },
  bodyText: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 4,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  checkBox: {
    width: 10,
    height: 10,
    border: "1pt solid #333",
    marginRight: 6,
    marginTop: 1,
    flexShrink: 0,
  },
  checkBoxChecked: {
    width: 10,
    height: 10,
    border: "1pt solid #333",
    marginRight: 6,
    marginTop: 1,
    flexShrink: 0,
    backgroundColor: "#1a1a1a",
  },
  checkMark: {
    color: "#ffffff",
    fontSize: 7,
    lineHeight: 1,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    marginVertical: 10,
  },
  signatureTable: {
    marginTop: 12,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingBottom: 4,
    marginBottom: 6,
  },
  tableHeaderCell: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    flex: 1,
    textAlign: "center",
  },
  tableHeaderLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    width: 100,
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-end",
  },
  tableRowLabel: {
    fontSize: 9,
    width: 100,
    paddingRight: 8,
    color: "#444",
  },
  tableCell: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    height: 16,
    marginHorizontal: 4,
  },
  footer: {
    fontSize: 8,
    color: "#777",
    textAlign: "center",
    marginTop: 20,
  },
  termsParagraph: {
    flexDirection: "row",
    marginBottom: 8,
  },
  termsIndex: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    width: 20,
    flexShrink: 0,
  },
  termsText: {
    fontSize: 10,
    lineHeight: 1.5,
    flex: 1,
  },
});
