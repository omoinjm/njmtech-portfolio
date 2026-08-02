import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import { computeInvoiceTotals, formatZar } from "@/lib/invoice";
import type { Invoice } from "@/types/invoice_model";
import { siteConfig } from "@/utils/seo";

const colors = {
  ink: "#0f2b30",
  muted: "#4a6670",
  line: "#d5e0e3",
  teal: "#26c6b0",
  soft: "#f4fafb",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: colors.ink,
    paddingTop: 40,
    paddingBottom: 48,
    paddingHorizontal: 40,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  brandNjm: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: colors.teal,
  },
  brandTech: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: colors.ink,
  },
  siteUrl: {
    marginTop: 4,
    fontSize: 9,
    color: colors.muted,
  },
  metaBlock: {
    alignItems: "flex-end",
  },
  metaLabel: {
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.muted,
    fontFamily: "Helvetica-Bold",
  },
  invoiceNumber: {
    marginTop: 4,
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
  },
  metaLine: {
    marginTop: 4,
    color: colors.muted,
  },
  parties: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 24,
  },
  party: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 9,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: colors.muted,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
  },
  partyName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    marginBottom: 2,
  },
  partyLine: {
    color: colors.muted,
    marginBottom: 1,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.soft,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.line,
    paddingVertical: 7,
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  colDesc: { flex: 4, paddingRight: 8 },
  colQty: { flex: 1, paddingRight: 4 },
  colUnit: { flex: 1.4, paddingRight: 4 },
  colAmount: { flex: 1.6, textAlign: "right" },
  headerCell: {
    fontSize: 8,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.muted,
    fontFamily: "Helvetica-Bold",
  },
  totalsWrap: {
    marginTop: 16,
    alignItems: "flex-end",
  },
  totalsBox: {
    width: 220,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalLabel: {
    color: colors.muted,
  },
  totalValue: {
    fontFamily: "Helvetica-Bold",
  },
  grandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  grandLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
  },
  grandValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: colors.teal,
  },
  notes: {
    marginTop: 28,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  notesBody: {
    marginTop: 6,
    color: colors.muted,
    lineHeight: 1.4,
  },
  accentBar: {
    height: 4,
    marginBottom: 18,
    backgroundColor: colors.teal,
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    color: colors.muted,
    fontSize: 8,
  },
});

function PartyBlock({
  label,
  party,
}: {
  label: string;
  party: Invoice["from"];
}) {
  return (
    <View style={styles.party}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <Text style={styles.partyName}>{party.name || "—"}</Text>
      {party.email ? <Text style={styles.partyLine}>{party.email}</Text> : null}
      {party.phone ? <Text style={styles.partyLine}>{party.phone}</Text> : null}
      {party.address ? (
        <Text style={styles.partyLine}>{party.address}</Text>
      ) : null}
    </View>
  );
}

export function InvoicePdfDocument({ invoice }: { invoice: Invoice }) {
  const totals = computeInvoiceTotals(invoice);
  const taxPercent = invoice.taxPercent ?? 0;
  const siteHost = siteConfig.url.replace(/^https?:\/\//, "");

  return (
    <Document
      title={`${invoice.number} · ${siteConfig.name}`}
      author={siteConfig.name}
      subject={`Invoice ${invoice.number}`}
      creator={siteConfig.name}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.accentBar} />

        <View style={styles.header}>
          <View>
            <View style={styles.brandRow}>
              <Text style={styles.brandNjm}>NJM</Text>
              <Text style={styles.brandTech}>TECH</Text>
            </View>
            <Text style={styles.siteUrl}>{siteHost}</Text>
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Invoice</Text>
            <Text style={styles.invoiceNumber}>{invoice.number || "—"}</Text>
            <Text style={styles.metaLine}>Issued {invoice.issuedAt || "—"}</Text>
            {invoice.dueAt ? (
              <Text style={styles.metaLine}>Due {invoice.dueAt}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.parties}>
          <PartyBlock label="From" party={invoice.from} />
          <PartyBlock label="Bill to" party={invoice.to} />
        </View>

        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.colDesc]}>Description</Text>
          <Text style={[styles.headerCell, styles.colQty]}>Qty</Text>
          <Text style={[styles.headerCell, styles.colUnit]}>Unit</Text>
          <Text style={[styles.headerCell, styles.colAmount]}>Amount</Text>
        </View>

        {invoice.lineItems.map((item) => (
          <View key={item.id} style={styles.tableRow} wrap={false}>
            <Text style={styles.colDesc}>{item.description || "—"}</Text>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colUnit}>{formatZar(item.unitPrice)}</Text>
            <Text style={styles.colAmount}>
              {formatZar(item.quantity * item.unitPrice)}
            </Text>
          </View>
        ))}

        {invoice.customFields.map((field) => (
          <View key={field.id} style={styles.tableRow} wrap={false}>
            <Text style={[styles.colDesc, { flex: 6.4 }]}>
              {field.label || "Additional amount"}
            </Text>
            <Text style={styles.colAmount}>{formatZar(field.amount)}</Text>
          </View>
        ))}

        <View style={styles.totalsWrap}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{formatZar(totals.subtotal)}</Text>
            </View>
            {taxPercent > 0 ? (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tax ({taxPercent}%)</Text>
                <Text style={styles.totalValue}>{formatZar(totals.tax)}</Text>
              </View>
            ) : null}
            <View style={styles.grandRow}>
              <Text style={styles.grandLabel}>Total</Text>
              <Text style={styles.grandValue}>{formatZar(totals.total)}</Text>
            </View>
          </View>
        </View>

        {invoice.notes ? (
          <View style={styles.notes}>
            <Text style={styles.sectionLabel}>Notes</Text>
            <Text style={styles.notesBody}>{invoice.notes}</Text>
          </View>
        ) : null}

        <View style={styles.footer} fixed>
          <Text>
            {siteConfig.name} · {siteHost}
          </Text>
          <Text>
            {invoice.currency} · {invoice.number}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderInvoicePdf(invoice: Invoice): Promise<Buffer> {
  const buffer = await renderToBuffer(
    <InvoicePdfDocument invoice={invoice} />,
  );
  return Buffer.from(buffer);
}

export function invoicePdfFilename(invoice: Invoice): string {
  const safeNumber = (invoice.number || invoice.id)
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${safeNumber || "invoice"}.pdf`;
}
