import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import type { Child, Entry, DailyLog, DoctorVisit } from "./store";

interface ReportInput {
  child: Child | null;
  daily: DailyLog[];
  entries: Entry[];
  visits: DoctorVisit[];
  shareCode: string;
}

export function buildMedicalReport({ child, daily, entries, visits, shareCode }: ReportInput): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(241, 245, 249);
  doc.rect(0, 0, pageW, 90, "F");
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("AlleNest AI — Medical Report", 40, 45);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(`Generated: ${format(new Date(), "PPpp")}`, 40, 64);
  doc.text(`Doctor share code: ${shareCode}`, 40, 78);

  let y = 110;

  // Child block
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text("Child profile", 40, y);
  y += 8;
  autoTable(doc, {
    startY: y,
    theme: "plain",
    styles: { fontSize: 10, textColor: [51, 65, 85] },
    body: [
      ["Name", child?.name ?? "—"],
      ["Birthdate", child?.birthdate ?? "—"],
      ["Gender", child?.gender ?? "—"],
      ["Feeding", child?.feeding ?? "—"],
      ["Known allergies", (child?.allergies ?? []).join(", ") || "—"],
    ],
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 130 } },
  });
  y = (doc as any).lastAutoTable.finalY + 20;

  // Daily logs
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Daily illness log", 40, y);
  y += 6;
  autoTable(doc, {
    startY: y + 4,
    head: [["Date", "Temp °C", "Mood", "Sleep h", "Symptoms", "Medication", "Notes"]],
    body: daily.length
      ? daily.map((d) => [
          d.date,
          d.temperature?.toFixed(1) ?? "—",
          d.mood,
          d.sleepHours?.toString() ?? "—",
          d.symptoms.join(", ") || "—",
          d.medication ?? "—",
          d.notes ?? "—",
        ])
      : [["—", "—", "—", "—", "—", "—", "No daily logs"]],
    headStyles: { fillColor: [99, 102, 241], textColor: 255, fontSize: 9 },
    styles: { fontSize: 9, cellPadding: 4 },
  });
  y = (doc as any).lastAutoTable.finalY + 20;

  // Food/symptom entries
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Food & symptom entries", 40, y);
  autoTable(doc, {
    startY: y + 6,
    head: [["When", "Food", "Symptoms", "Severity"]],
    body: entries.length
      ? entries.map((e) => [
          format(e.timestamp, "PP HH:mm"),
          e.food,
          e.symptoms.join(", ") || "—",
          `${e.severity}/100`,
        ])
      : [["—", "—", "—", "No entries"]],
    headStyles: { fillColor: [16, 185, 129], textColor: 255, fontSize: 9 },
    styles: { fontSize: 9, cellPadding: 4 },
  });
  y = (doc as any).lastAutoTable.finalY + 20;

  // Doctor visits
  if (y > 720) {
    doc.addPage();
    y = 60;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Doctor visits", 40, y);
  autoTable(doc, {
    startY: y + 6,
    head: [["Date", "Doctor", "Notes"]],
    body: visits.length
      ? visits.map((v) => [v.date, v.doctor, v.notes || "—"])
      : [["—", "—", "No visits recorded"]],
    headStyles: { fillColor: [244, 114, 182], textColor: 255, fontSize: 9 },
    styles: { fontSize: 9, cellPadding: 4 },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      "AlleNest AI • Educational guidance only — confirm with your pediatrician.",
      40,
      doc.internal.pageSize.getHeight() - 20,
    );
    doc.text(`${i}/${pageCount}`, pageW - 50, doc.internal.pageSize.getHeight() - 20);
  }

  return doc;
}

export async function downloadReport(input: ReportInput, filename = "allenest-report.pdf") {
  const doc = buildMedicalReport(input);
  doc.save(filename);
}

export async function shareReport(input: ReportInput, filename = "allenest-report.pdf") {
  const doc = buildMedicalReport(input);
  const blob = doc.output("blob");
  const file = new File([blob], filename, { type: "application/pdf" });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.canShare && nav.canShare({ files: [file] })) {
    await nav.share({ files: [file], title: "AlleNest medical report" });
    return true;
  }
  // fallback: download
  doc.save(filename);
  return false;
}
