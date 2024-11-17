// app/api/send-permit/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import jsPDF from 'jspdf';
import path from 'path';
import fs from 'fs';

interface StudentData {
  name: string;
  college: string;
  semester: string;
  schoolYear: string;
  courses: Array<{
    code: string;
    section: string;
  }>;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

async function generatePermitPDF(studentData: StudentData) {
  const doc = new jsPDF();

  // Read logo from public folder
  const logoPath = path.join(process.cwd(), 'public', 'unorlogo.png');
  const logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });
  
  // Add background logo with transparency
  const gstate = new (doc as any).GState({ opacity: 0.1 });
  (doc as any).saveGraphicsState();
  (doc as any).setGState(gstate);
  doc.addImage(
    `data:image/png;base64,${logoBase64}`,
    'PNG',
    50,  // x position
    70,  // y position
    100, // width
    100  // height
  );
  (doc as any).restoreGraphicsState();


  
  // Set font size and style
  doc.setFontSize(16);
  
  // Add header text
  doc.text('UNIVERSITY OF NEGROS OCCIDENTAL-RECOLETOS, INC.', 105, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text('Accounting Office', 105, 30, { align: 'center' });
  doc.text('Bacolod City', 105, 40, { align: 'center' });
  
  // Add permit title
  doc.setFontSize(14);
  doc.text('PRELIMINARY EXAMINATION PERMIT', 105, 55, { align: 'center' });
  
  // Add permit number
  doc.setFontSize(10);
  const permitNo = Math.random().toString().slice(2, 10);
  doc.text(`Permit No. ${permitNo}`, 170, 65, { align: 'right' });
  
  // Add main content
  doc.setFontSize(12);
  doc.text('To all Whom it may Concern:', 20, 75);
  
  const mainText = `This is to certify that ${studentData.name} of the ${studentData.college} is officially enrolled as of this ${studentData.semester} Semester ${studentData.schoolYear}, and is hereby permitted to take examination(s) in the following courses only.`;
  
  doc.setFontSize(10);
  const splitText = doc.splitTextToSize(mainText, 170);
  doc.text(splitText, 20, 85);
  
  // Add table
  let yPos = 110;
  
  // Table headers
  doc.setFontSize(10);
  doc.text('Courses', 20, yPos);
  doc.text('Section', 70, yPos);
  doc.text('Proctor', 120, yPos);
  doc.text('Remarks', 170, yPos);
  
  // Underline for headers
  doc.line(20, yPos + 2, 190, yPos + 2);
  
  // Table content
  yPos += 10;
  studentData.courses.forEach(course => {
    doc.text(course.code, 20, yPos);
    doc.text(course.section, 70, yPos);
    yPos += 8;
  });
  
  // Add notes
  yPos += 10;
  doc.setFontSize(10);
  doc.text('NOTE:', 20, yPos);
  yPos += 10;
  
  const note1 = 'This permit should be presented to the PROCTOR for inspection during the administration of the examination.';
  const note2 = 'This permit is valid only for the period indicated on this form.';
  
  const splitNote1 = doc.splitTextToSize(note1, 170);
  const splitNote2 = doc.splitTextToSize(note2, 170);
  
  doc.text(splitNote1, 20, yPos);
  doc.text(splitNote2, 20, yPos + 10);
  
  // Add signature
  yPos += 30;
  doc.text('REV. FR. AMADEO OAR', 140, yPos);
  doc.text('VP - Finance', 140, yPos + 5);
  
  return doc.output('arraybuffer');
}

export async function POST(request: Request) {
  try {
    const { name, college, semester, schoolYear, courses } = await request.json();

    const studentData: StudentData = {
      name: name || 'N/A',
      college: college || 'N/A',
      semester: semester || '1st',
      schoolYear: schoolYear || '2024-2025',
      courses: courses || [
        { code: 'ADVACC669', section: 'C20' },
        { code: 'MACRSH730', section: 'C20' },
        { code: 'MANREP030', section: 'C20' },
        { code: 'VALMET539', section: 'C20' }
      ]
    };

    const pdfBuffer = await generatePermitPDF(studentData);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'zhaztedv@gmail.com',
      subject: 'Examination Permit',
      text: 'Good day! Please find attached your examination permit.',
      attachments: [
        {
          filename: 'exam_permit.pdf',
          content: Buffer.from(pdfBuffer),
          contentType: 'application/pdf'
        }
      ]
    });

    return NextResponse.json(
      { 
        success: true, 
        messageId: info.messageId 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending permit:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send permit', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}