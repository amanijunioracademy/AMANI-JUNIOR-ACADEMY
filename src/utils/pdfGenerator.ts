import { jsPDF } from 'jspdf';
import { FeeStructureItem } from '../data/feeStructuresData';
import { Assignment } from '../types';

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
