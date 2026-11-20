import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import QRCode from "qrcode";
import { prettyDate, prettyTime, visitConfig } from "./config";
import type { Booking } from "./types";

/** A print-ready A4 pass. The QR remains vector artwork at any print scale. */
export async function createVisitPassPdf(booking: Booking, verificationUrl: string) {
  const campus = visitConfig.campuses.find(c => c.id === booking.slot.campusId)!;
  const document = await PDFDocument.create();
  document.setTitle("SRM | Campus visit pass");
  document.setAuthor("SRM Campus Visits");
  const regular = await document.embedFont(StandardFonts.Helvetica);
  const bold = await document.embedFont(StandardFonts.HelveticaBold);
  const page = document.addPage([595.28, 841.89]);
  const height = page.getHeight();
  const navy = rgb(.043, .176, .322), muted = rgb(.34, .40, .46);
  const gold = rgb(.69, .50, .18), pale = rgb(.96, .95, .92), rule = rgb(.85, .88, .90);

  // Standard PDF fonts use WinAnsi. Never let an unsupported visitor character
  // prevent downloading the rest of their reservation.
  function printable(value: string, font: PDFFont) {
    return Array.from(value.normalize("NFC")).map(character => {
      try { font.encodeText(character); return character; } catch { return "?"; }
    }).join("");
  }
  function lines(value: string, width: number, size: number, font: PDFFont) {
    const result: string[] = [];
    let line = "";
    for (const word of printable(value, font).split(/\s+/)) {
      if (line && font.widthOfTextAtSize(`${line} ${word}`, size) > width) {
        result.push(line); line = "";
      }
      for (const character of (line ? ` ${word}` : word)) {
        if (font.widthOfTextAtSize(line + character, size) > width) {
          result.push(line); line = "";
        }
        line += character;
      }
    }
    if (line) result.push(line);
    return result;
  }
  function text(value: string, x: number, top: number, width: number, size = 11, font = regular, color = navy) {
    const wrapped = lines(value, width, size, font);
    wrapped.forEach((line, index) => page.drawText(line, { x, y: height - top - size - index * size * 1.4, size, font, color }));
    return wrapped.length * size * 1.4;
  }
  function box(x: number, top: number, width: number, boxHeight: number, color = pale) {
    page.drawRectangle({ x, y: height - top - boxHeight, width, height: boxHeight, color });
  }
  function divider(top: number) {
    page.drawLine({ start: { x: 36, y: height - top }, end: { x: 559, y: height - top }, thickness: .7, color: rule });
  }
  box(0, 0, 596, 124, navy);
  box(36, 29, 30, 3, gold);
  text("SRM / CAMPUS VISITS", 36, 44, 440, 11, bold, rgb(1, 1, 1));
  text("Your campus visit pass", 36, 66, 523, 27, regular, rgb(1, 1, 1));
  text("A guided introduction to campus life.", 36, 103, 523, 10, regular, rgb(.83, .87, .91));

  text("LEAD VISITOR", 36, 148, 523, 9, bold, gold);
  let nameSize = 24;
  while (nameSize > 16 && lines(booking.visitor.name, 523, nameSize, bold).length > 2) nameSize--;
  const nameHeight = text(booking.visitor.name, 36, 166, 523, nameSize, bold);
  const campusTop = 166 + nameHeight + 7;
  const campusHeight = text(`${campus.name} campus | ${campus.location}`, 36, campusTop, 523, 11, regular, muted);
  const scheduleTop = campusTop + campusHeight + 23;
  box(36, scheduleTop, 523, 85);
  text("VISIT DATE", 50, scheduleTop + 14, 220, 8, bold, gold);
  text(prettyDate(booking.slot.date), 50, scheduleTop + 31, 220, 12, bold);
  text("TOUR TIME", 310, scheduleTop + 14, 235, 8, bold, gold);
  text(`${prettyTime(booking.slot.start)} - ${prettyTime(booking.slot.end)}`, 310, scheduleTop + 31, 235, 12, bold);
  text("India Standard Time (UTC +05:30)", 310, scheduleTop + 54, 235, 9, regular, muted);

  const detailTop = scheduleTop + 110;
  let cursor = detailTop;
  const visitors = booking.visitor.accompanying + 1;
  const fields = [
    ["REPORTING VENUE", booking.slot.venue],
    ["YOUR GROUP", `${visitors} ${visitors === 1 ? "visitor" : "visitors"}, including the lead visitor`],
    ["CAMPUS GUIDE", booking.slot.guide.replace(`${campus.name} / `, "")],
    ["VISIT COORDINATOR", booking.slot.coordinator.replace(/^Demo\s+/i, "")],
  ];
  for (const [label, value] of fields) {
    text(label, 36, cursor, 310, 8, bold, gold);
    cursor += 17;
    cursor += text(value, 36, cursor, 310, 11) + 19;
  }

  const qr = QRCode.create(verificationUrl, { errorCorrectionLevel: "M" });
  const qrSize = 160, quietZone = 4;
  const cell = qrSize / (qr.modules.size + quietZone * 2);
  const qrX = 399, qrTop = detailTop - 4;
  for (let row = 0; row < qr.modules.size; row++) {
    for (let column = 0; column < qr.modules.size; column++) {
      if (qr.modules.get(row, column)) page.drawRectangle({
        x: qrX + (column + quietZone) * cell,
        y: height - qrTop - (row + quietZone + 1) * cell,
        width: cell, height: cell, color: rgb(0, 0, 0),
      });
    }
  }
  text("SCAN TO VERIFY", qrX + 10, qrTop + 164, 150, 8, bold);
  text("Check the current visit status", qrX + 10, qrTop + 180, 150, 9, regular, muted);

  const arrivalTop = Math.max(cursor + 5, qrTop + 218);
  box(36, arrivalTop, 523, 54);
  box(36, arrivalTop, 3, 54, gold);
  text("BEFORE YOU ARRIVE", 50, arrivalTop + 10, 490, 8, bold, gold);
  text("Arrive 15 minutes early. Keep this pass and a photo ID ready.", 50, arrivalTop + 27, 490, 10);

  divider(706);
  text("BOOKING REFERENCE", 36, 720, 523, 8, bold, gold);
  text(booking.id, 36, 738, 523, 10, bold);
  text("Demonstration pass - not an official university entry permit.", 36, 770, 523, 9, regular, muted);
  text("Confirm arrangements with Admissions before travelling. Download a new pass after rescheduling.", 36, 786, 523, 8, regular, muted);
  return document.save();
}
