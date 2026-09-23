import { jsPDF } from 'jspdf';
import { FeeStructureItem } from '../data/feeStructuresData';
import { Assignment, StudentReportCard } from '../types';

export function generateFeeStructurePdf(feeItem: FeeStructureItem, download = true): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 18;

  // Header Box / Badge
  doc.setFillColor(15, 30, 54); // #0F1E36 deep institutional navy
  doc.rect(margin, y - 6, pageWidth - margin * 2, 28, 'F');

  doc.setTextColor(245, 158, 11); // Amber / Gold
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('AMANI JUNIOR ACADEMY & JUNIOR SECONDARY SCHOOL', pageWidth / 2, y, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('P.O. Box 93 - 80114, Mazeras, Kenya | Tel: 0718 540 922 / 0746 529 712', pageWidth / 2, y + 6, { align: 'center' });
  doc.text('Motto: "STRIVE TO ACHIEVE" | Ministry Reg: MoE/PRI/2026/089', pageWidth / 2, y + 12, { align: 'center' });

  y += 30;

  // Document Title
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y - 4, pageWidth - margin * 2, 10, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y - 4, pageWidth - margin * 2, 10, 'S');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(feeItem.title.toUpperCase(), pageWidth / 2, y + 2.5, { align: 'center' });

  y += 14;

  // Table
  const tableX = margin;
  const tableWidth = pageWidth - margin * 2;
  const colWidths = [tableWidth * 0.32, tableWidth * 0.17, tableWidth * 0.17, tableWidth * 0.17, tableWidth * 0.17];

  // Table Header
  doc.setFillColor(30, 41, 59);
  doc.rect(tableX, y, tableWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);

  let currentX = tableX;
  feeItem.tableHeaders.forEach((th, idx) => {
    const align = idx === 0 ? 'left' : 'right';
    const posX = idx === 0 ? currentX + 3 : currentX + colWidths[idx] - 3;
    doc.text(th, posX, y + 5, { align });
    currentX += colWidths[idx];
  });

  y += 7;

  // Table Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  feeItem.rows.forEach((row, rIdx) => {
    const isEven = rIdx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(tableX, y, tableWidth, 6, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(tableX, y + 6, tableX + tableWidth, y + 6);

    doc.setTextColor(15, 23, 42);
    if (row.gradeOrItem === 'TOTAL') {
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(254, 243, 199);
      doc.rect(tableX, y, tableWidth, 6, 'F');
    } else {
      doc.setFont('helvetica', 'normal');
    }

    currentX = tableX;
    // Col 0
    doc.text(row.gradeOrItem, currentX + 3, y + 4.2);
    currentX += colWidths[0];
    // Col 1
    doc.text(row.term1.toLocaleString('en-KE') + '/=', currentX + colWidths[1] - 3, y + 4.2, { align: 'right' });
    currentX += colWidths[1];
    // Col 2
    doc.text(row.term2.toLocaleString('en-KE') + '/=', currentX + colWidths[2] - 3, y + 4.2, { align: 'right' });
    currentX += colWidths[2];
    // Col 3
    doc.text(row.term3.toLocaleString('en-KE') + '/=', currentX + colWidths[3] - 3, y + 4.2, { align: 'right' });
    currentX += colWidths[3];
    // Col 4
    doc.text(row.yearTotal.toLocaleString('en-KE') + '/=', currentX + colWidths[4] - 3, y + 4.2, { align: 'right' });

    y += 6;
  });

  if (feeItem.extraRowNote) {
    y += 2;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(180, 83, 9);
    doc.text(`* ${feeItem.extraRowNote}`, margin, y + 3);
    y += 5;
  }

  y += 4;

  // Other payments & Requirements in two columns
  const colW = (pageWidth - margin * 2 - 6) / 2;
  const leftX = margin;
  const rightX = margin + colW + 6;
  const startY = y;

  // Left: Other Payments
  doc.setFillColor(241, 245, 249);
  doc.rect(leftX, y, colW, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('OTHER SCHOOL PAYMENTS', leftX + 2, y + 4);

  let leftY = y + 7.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  feeItem.otherPayments.slice(0, 10).forEach((op) => {
    doc.setTextColor(51, 65, 85);
    doc.text(`• ${op.item}: `, leftX + 2, leftY);
    const itemWidth = doc.getTextWidth(`• ${op.item}: `);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(`${op.amount}`, leftX + 2 + itemWidth, leftY);
    doc.setFont('helvetica', 'normal');
    leftY += 4.2;
  });

  // Right: Requirements & Uniforms
  doc.setFillColor(241, 245, 249);
  doc.rect(rightX, y, colW, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('OTHER REQUIREMENTS & UNIFORM', rightX + 2, y + 4);

  let rightY = y + 7.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  feeItem.requirements.slice(0, 5).forEach((req) => {
    const lines = doc.splitTextToSize(`• ${req}`, colW - 4);
    doc.text(lines, rightX + 2, rightY);
    rightY += lines.length * 3.8;
  });

  if (feeItem.uniforms.boys) {
    const bLines = doc.splitTextToSize(`Uniform Boys: ${feeItem.uniforms.boys}`, colW - 4);
    doc.setFont('helvetica', 'italic');
    doc.text(bLines, rightX + 2, rightY);
    rightY += bLines.length * 3.8;
  }
  if (feeItem.uniforms.girls) {
    const gLines = doc.splitTextToSize(`Uniform Girls: ${feeItem.uniforms.girls}`, colW - 4);
    doc.text(gLines, rightX + 2, rightY);
    rightY += gLines.length * 3.8;
  }

  y = Math.max(leftY, rightY) + 3;

  // Fees Policy Box
  if (y < 240) {
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 14, 2, 2, 'FD');
    doc.setTextColor(153, 27, 27);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('OFFICIAL SCHOOL FEES POLICY:', margin + 3, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    const policyLines = doc.splitTextToSize(feeItem.feesPolicy, pageWidth - margin * 2 - 6);
    doc.text(policyLines, margin + 3, y + 8);
    y += 18;
  }

  // Payment Banking Channels
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 15, 2, 2, 'FD');

  doc.setTextColor(22, 101, 52);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('APPROVED SCHOOL PAYMENT CHANNELS', margin + 3, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(20, 83, 45);
  feeItem.bankAccounts.forEach((acc, aIdx) => {
    doc.text(`• ${acc.method}: ${acc.details}`, margin + 3, y + 8.5 + aIdx * 4);
  });

  y += 20;

  // Signatures / Stamp
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Constance Mwaka Pole - School Director', margin, y + 8);
  doc.text('Official Stamp: APPROVED & ADOPTED FOR 2026 ACADEMIC YEAR', pageWidth - margin, y + 8, { align: 'right' });
  doc.text('GOD BLESS YOU', pageWidth / 2, y + 14, { align: 'center' });

  if (download) {
    const filename = `${feeItem.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;
    doc.save(filename);
  }

  return doc;
}

export function generateAssignmentPdf(assignment: Assignment, download = true): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 20;

  // Header
  doc.setFillColor(15, 30, 54);
  doc.rect(margin, y - 6, pageWidth - margin * 2, 26, 'F');

  doc.setTextColor(245, 158, 11);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('AMANI JUNIOR ACADEMY & JUNIOR SECONDARY SCHOOL', pageWidth / 2, y, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('CBC LEARNING & HOMEWORK ASSIGNMENT SHEET', pageWidth / 2, y + 6, { align: 'center' });
  doc.text('P.O. Box 93 - 80114, Mazeras | Tel: 0718540922', pageWidth / 2, y + 11, { align: 'center' });

  y += 28;

  // Metadata Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 22, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(`Title: ${assignment.title}`, margin + 4, y + 5.5);
  doc.text(`Subject: ${assignment.subjectName || 'General CBC'}`, margin + 4, y + 11);
  doc.text(`Target Cohort: ${assignment.className}`, margin + 4, y + 16.5);

  doc.text(`Teacher: ${assignment.teacherName || 'Subject Teacher'}`, pageWidth / 2 + 10, y + 5.5);
  doc.text(`Due Date: ${assignment.dueDate || 'Check with Teacher'}`, pageWidth / 2 + 10, y + 11);
  doc.text(`Status: Published for Learner Practice`, pageWidth / 2 + 10, y + 16.5);

  y += 28;

  // Description / Instructions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('ASSIGNMENT BRIEF & OBJECTIVES', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const descLines = doc.splitTextToSize(assignment.description || 'Complete the exercises as directed by the subject teacher.', pageWidth - margin * 2);
  doc.text(descLines, margin, y);
  y += descLines.length * 5 + 6;

  if (assignment.instructions) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('INSTRUCTIONS & TASKS TO COMPLETE', margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    const instLines = doc.splitTextToSize(assignment.instructions, pageWidth - margin * 2);
    doc.text(instLines, margin, y);
    y += instLines.length * 5 + 6;
  }

  // Learner Answer Grid / Working Space
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 60, 2, 2, 'S');

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Learner Name: __________________________   Adm No: _________   Score: ____ / 50', margin + 4, y + 6);
  doc.text('[ Learner Working Space & Teacher Remarks ]', margin + 4, y + 14);

  y += 75;

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Amani Junior Academy & JSS • Mazeras • Strive to Achieve', pageWidth / 2, y, { align: 'center' });

  if (download) {
    const cleanTitle = assignment.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    doc.save(`${cleanTitle}_assignment.pdf`);
  }

  return doc;
}

export function downloadFeeStructure(feeItem: FeeStructureItem): void {
  if (feeItem.customPdfUrl) {
    const link = document.createElement('a');
    link.href = feeItem.customPdfUrl;
    link.download = feeItem.customPdfName || `${feeItem.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }
  generateFeeStructurePdf(feeItem, true);
}

export function downloadAssignmentPdf(assignment: Assignment): void {
  if (assignment.attachmentUrl) {
    const link = document.createElement('a');
    link.href = assignment.attachmentUrl;
    link.download = assignment.attachmentName || `${assignment.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }
  generateAssignmentPdf(assignment, true);
}

/**
 * Generates an official, strictly single-page per learner PDF report card (A4 portrait).
 * When multiple cards are provided, each learner is placed on a completely new page.
 */
export function generateReportCardsPdf(
  cards: StudentReportCard[],
  issueDate: string,
  download = true
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 8;
  const contentWidth = pageWidth - margin * 2; // 194mm

  cards.forEach((card, index) => {
    if (index > 0) {
      doc.addPage();
    }

    // Outer Navy Border
    doc.setDrawColor(15, 30, 54);
    doc.setLineWidth(0.8);
    doc.rect(margin, margin, contentWidth, pageHeight - margin * 2);

    // Inner Gold Fine Border
    doc.setDrawColor(197, 155, 39);
    doc.setLineWidth(0.3);
    doc.rect(margin + 1.5, margin + 1.5, contentWidth - 3, pageHeight - margin * 2 - 3);

    let y = margin + 7;

    // --- Institutional Header ---
    doc.setTextColor(15, 30, 54);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('AMANI JUNIOR ACADEMY AND JSS', pageWidth / 2, y, { align: 'center' });

    y += 4.5;
    doc.setTextColor(180, 83, 9); // Amber 700
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(`MOTTO: "${card.schoolMotto || 'STRIVE TO ACHIEVE'}"`, pageWidth / 2, y, { align: 'center' });

    y += 4;
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(
      'Mazeras, Kilifi County, Kenya • P.O. Box 93-80114 | Tel: 0718 540 922 / 0114 623 408 / 0746 529 712',
      pageWidth / 2,
      y,
      { align: 'center' }
    );

    y += 3.5;
    // Title Banner Ribbon
    doc.setFillColor(15, 30, 54);
    doc.rect(margin + 3, y, contentWidth - 6, 5.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(
      'OFFICIAL LEARNER CONTINUOUS ASSESSMENT & PROGRESS REPORT',
      pageWidth / 2,
      y + 3.8,
      { align: 'center' }
    );

    y += 8;

    // --- Learner Info Box ---
    const boxX = margin + 3;
    const boxW = contentWidth - 6;
    const boxH = 15;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(boxX, y, boxW, boxH, 'FD');

    const colW = boxW / 4;
    doc.setFontSize(6.5);

    // Row 1
    // Col 1
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text('Learner Full Name:', boxX + 2, y + 3.5);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(card.studentName || '—', boxX + 2, y + 6.8);

    // Col 2
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text('Student ID:', boxX + colW + 2, y + 3.5);
    doc.setTextColor(15, 30, 54);
    doc.setFont('helvetica', 'bold');
    doc.text(card.studentId || '—', boxX + colW + 2, y + 6.8);

    // Col 3
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text('Admission Number:', boxX + colW * 2 + 2, y + 3.5);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(card.admissionNumber || '—', boxX + colW * 2 + 2, y + 6.8);

    // Col 4
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text('Class & Cohort:', boxX + colW * 3 + 2, y + 3.5);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(card.class || '—', boxX + colW * 3 + 2, y + 6.8);

    // Row 2
    // Col 1
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text('Academic Year:', boxX + 2, y + 10.5);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(card.academicYear || '2026', boxX + 2, y + 13.8);

    // Col 2
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text('Assessment Term:', boxX + colW + 2, y + 10.5);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(card.term || 'Term 1', boxX + colW + 2, y + 13.8);

    // Col 3
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text('Attendance Register:', boxX + colW * 2 + 2, y + 10.5);
    doc.setTextColor(22, 101, 52);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `${card.attendanceDaysPresent}/${card.attendanceDaysTotal} Days (${card.attendancePercentage}%)`,
      boxX + colW * 2 + 2,
      y + 13.8
    );

    // Col 4
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text('Class Standing / Rank:', boxX + colW * 3 + 2, y + 10.5);
    doc.setTextColor(49, 46, 129);
    doc.setFont('helvetica', 'bold');
    doc.text(card.classPosition ? `Rank: ${card.classPosition}` : 'CBC Competency', boxX + colW * 3 + 2, y + 13.8);

    y += boxH + 3;

    // --- Subject Assessment Matrix Table ---
    const tableX = margin + 3;
    const tableW = contentWidth - 6;
    const colWidths = [56, 22, 18, 16, tableW - (56 + 22 + 18 + 16)]; // Total = tableW

    // Header
    doc.setFillColor(15, 30, 54);
    doc.rect(tableX, y, tableW, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('SUBJECT / LEARNING AREA', tableX + 2, y + 4.2);
    doc.text('SCORE', tableX + colWidths[0] + colWidths[1] / 2, y + 4.2, { align: 'center' });
    doc.text('PERCENT', tableX + colWidths[0] + colWidths[1] + colWidths[2] / 2, y + 4.2, { align: 'center' });
    doc.text('GRADE', tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] / 2, y + 4.2, {
      align: 'center',
    });
    doc.text(
      'COMPETENCIES & TEACHER REMARK',
      tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 2,
      y + 4.2
    );

    y += 6;

    // Subject Rows
    const subjects = card.subjects || [];
    const maxSubjectDisplay = 14;
    const displayedSubjects = subjects.slice(0, maxSubjectDisplay);
    const rowHeight = subjects.length > 10 ? 5.1 : 5.8;

    displayedSubjects.forEach((sub, sIdx) => {
      const isEven = sIdx % 2 === 0;
      doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
      doc.rect(tableX, y, tableW, rowHeight, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.line(tableX, y + rowHeight, tableX + tableW, y + rowHeight);

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      const name = sub.subjectName.length > 32 ? sub.subjectName.substring(0, 30) + '...' : sub.subjectName;
      doc.text(name, tableX + 2, y + rowHeight * 0.7);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      // Score
      doc.text(
        `${sub.marksObtained}/${sub.maxMarks}`,
        tableX + colWidths[0] + colWidths[1] / 2,
        y + rowHeight * 0.7,
        { align: 'center' }
      );
      // Percentage
      doc.text(
        `${sub.percentage}%`,
        tableX + colWidths[0] + colWidths[1] + colWidths[2] / 2,
        y + rowHeight * 0.7,
        { align: 'center' }
      );

      // Grade
      doc.setTextColor(180, 83, 9);
      doc.setFont('helvetica', 'bold');
      doc.text(
        sub.grade,
        tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] / 2,
        y + rowHeight * 0.7,
        { align: 'center' }
      );

      // Remark
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      const comment = sub.teacherComment || 'Satisfactory achievement in CBC core competencies.';
      const truncatedComment = comment.length > 55 ? comment.substring(0, 52) + '...' : comment;
      doc.text(
        truncatedComment,
        tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 2,
        y + rowHeight * 0.7
      );

      y += rowHeight;
    });

    // Summary / Aggregate Footer Row
    doc.setFillColor(241, 245, 249);
    doc.rect(tableX, y, tableW, 6.5, 'F');
    doc.setDrawColor(15, 30, 54);
    doc.setLineWidth(0.4);
    doc.line(tableX, y, tableX + tableW, y);
    doc.line(tableX, y + 6.5, tableX + tableW, y + 6.5);

    doc.setTextColor(15, 30, 54);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('Aggregate Academic Summary', tableX + 2, y + 4.5);

    doc.text(
      `${card.totalMarksObtained} / ${card.totalMaxPossible}`,
      tableX + colWidths[0] + colWidths[1] / 2,
      y + 4.5,
      { align: 'center' }
    );
    doc.setTextColor(22, 101, 52);
    doc.text(
      `${card.averagePercentage}%`,
      tableX + colWidths[0] + colWidths[1] + colWidths[2] / 2,
      y + 4.5,
      { align: 'center' }
    );
    doc.setTextColor(180, 83, 9);
    doc.text(
      card.overallGrade,
      tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] / 2,
      y + 4.5,
      { align: 'center' }
    );

    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.5);
    const summaryRemark =
      card.overallRemark ||
      (card.averagePercentage >= 75
        ? 'Exceeding Expectations (EE) — High academic dedication'
        : card.averagePercentage >= 50
        ? 'Meeting Expectations (ME) — Steady consistent progress'
        : 'Approaching Expectations (AE) — Targeted reinforcement');
    doc.text(
      summaryRemark.length > 55 ? summaryRemark.substring(0, 52) + '...' : summaryRemark,
      tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 2,
      y + 4.5
    );

    y += 10;

    // --- Administrative Sign-off Section ---
    const signBoxW = (tableW - 4) / 2;
    const signBoxH = 24;

    // Left: Headteacher Remarks
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(tableX, y, signBoxW, signBoxH, 'FD');

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.text("HEADTEACHER'S OFFICIAL REMARKS", tableX + 3, y + 4);

    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.5);
    const htRemarks =
      card.headteacherRemarks ||
      `Learner ${card.studentName} exhibits commendable potential. Strive to achieve excellence.`;
    const splitHt = doc.splitTextToSize(htRemarks, signBoxW - 6);
    doc.text(splitHt.slice(0, 2), tableX + 3, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(15, 23, 42);
    doc.text(
      `${card.headteacherName || 'Nadhiri Chacha Salim'} (Headteacher)`,
      tableX + 3,
      y + signBoxH - 3
    );
    doc.setTextColor(100, 116, 139);
    doc.text(`Date: ${issueDate.split('-').reverse().join('/')}`, tableX + signBoxW - 3, y + signBoxH - 3, {
      align: 'right',
    });

    // Right: Director's Seal & Authorization
    doc.setFillColor(248, 250, 252);
    doc.rect(tableX + signBoxW + 4, y, signBoxW, signBoxH, 'FD');

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.text("DIRECTOR'S INSTITUTIONAL SEAL & AUTHORIZATION", tableX + signBoxW + 7, y + 4);

    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text('Amani Junior Academy and JSS — Mazeras, Kilifi County', tableX + signBoxW + 7, y + 8);

    // Official Seal Stamp Box
    doc.setDrawColor(197, 155, 39);
    doc.setLineWidth(0.3);
    doc.setFillColor(254, 243, 199);
    doc.rect(tableX + signBoxW * 2 + 4 - 24, y + 6.5, 21, 10, 'FD');
    doc.setTextColor(180, 83, 9);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.text('OFFICIAL SEAL', tableX + signBoxW * 2 + 4 - 13.5, y + 10.5, { align: 'center' });
    doc.setFontSize(4.5);
    doc.text('MAZERAS', tableX + signBoxW * 2 + 4 - 13.5, y + 13.5, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(15, 23, 42);
    doc.text(
      `${card.directorName || 'Constance Mwaka Pole'} (Director)`,
      tableX + signBoxW + 7,
      y + signBoxH - 3
    );

    y += signBoxH + 4;

    // --- Footer Motto ---
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text(
      '"STRIVE TO ACHIEVE" • MAZERAS, KILIFI COUNTY, KENYA • P.O. BOX 93-80114',
      pageWidth / 2,
      pageHeight - margin - 3,
      { align: 'center' }
    );
  });

  if (download) {
    const filename =
      cards.length === 1
        ? `${cards[0].studentName.replace(/[^a-zA-Z0-9]/g, '_')}_Report_Card.pdf`
        : `Amani_Report_Cards_Batch_${cards.length}_Students.pdf`;
    doc.save(filename);
  }

  return doc;
}

export function downloadReportCardsPdf(
  cards: StudentReportCard[],
  issueDate: string
): void {
  generateReportCardsPdf(cards, issueDate, true);
}
