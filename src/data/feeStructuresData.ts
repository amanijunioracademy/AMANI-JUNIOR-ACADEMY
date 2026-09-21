export interface FeeTermBreakdown {
  gradeOrItem: string;
  term1: number;
  term2: number;
  term3: number;
  yearTotal: number;
  notes?: string;
}

export interface FeeStructureItem {
  id: string;
  title: string;
  category: 'Grade 1 - 6' | 'Grade 7' | 'Grade 8' | 'Early Years' | string;
  headerTitle: string;
  applicableGrades: string[];
  tableHeaders: string[];
  rows: FeeTermBreakdown[];
  extraRowNote?: string;
  otherPayments: Array<{ item: string; amount: string; notes?: string }>;
  requirements: string[];
  feesPolicy: string;
  uniforms: {
    boys?: string;
    girls?: string;
    description?: string;
  };
  bankAccounts: Array<{
    method: string;
    details: string;
    accountNumber?: string;
    paybill?: string;
  }>;
  customPdfUrl?: string;
  customPdfName?: string;
  lastUpdated: string;
  updatedBy: string;
}

export const initialFeeStructures: FeeStructureItem[] = [
  {
    id: 'fee-primary-1-6',
    title: 'Grade 1 to Grade 6 Fee Structure (Primary & ECD)',
    category: 'Grade 1 - 6',
    headerTitle: 'AMANI JUNIOR ACADEMY & JUNIOR SECONDARY SCHOOL\nP.O Box 93- 80114, Mazeras. Tel: 0718540922',
    applicableGrades: ['Playgroup', 'PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
    tableHeaders: ['CLASS', '1ST TERM', '2ND TERM', '3RD TERM', 'YEAR TOTAL'],
    rows: [
      { gradeOrItem: 'PLAYGROUP', term1: 3000, term2: 3000, term3: 3000, yearTotal: 9000 },
      { gradeOrItem: 'PP1', term1: 4500, term2: 4500, term3: 4000, yearTotal: 13000 },
      { gradeOrItem: 'PP2', term1: 5000, term2: 5000, term3: 4500, yearTotal: 14500 },
      { gradeOrItem: 'GRADE 1', term1: 5200, term2: 5200, term3: 4800, yearTotal: 15200 },
      { gradeOrItem: 'GRADE 2', term1: 5200, term2: 5200, term3: 4800, yearTotal: 15200 },
      { gradeOrItem: 'GRADE 3', term1: 5200, term2: 5200, term3: 4800, yearTotal: 15200 },
      { gradeOrItem: 'GRADE 4', term1: 5500, term2: 5500, term3: 5000, yearTotal: 16000 },
      { gradeOrItem: 'GRADE 5', term1: 5500, term2: 5500, term3: 5000, yearTotal: 16000 },
      { gradeOrItem: 'GRADE 6', term1: 6500, term2: 6500, term3: 6000, yearTotal: 19000 },
    ],
    extraRowNote: 'COMPUTER FROM GRADE 1 - 6: 500/= PER TERM (Paid in Cash)',
    otherPayments: [
      { item: 'TRANSPORT', amount: 'Within Mazeras Ksh. 4,000/= | Outside Mazeras Ksh. 5,000/=' },
      { item: 'INTERVIEW FEE', amount: 'KSH. 200' },
      { item: 'ADMISSION FEE', amount: 'KSH. 1,000' },
      { item: 'ECDE PLASTIC CHAIR', amount: 'Required for ECD Learners' },
      { item: 'SCHOOL DIARY', amount: 'KSH. 150' },
      { item: 'SCHOOL TIE', amount: 'KSH. 150' },
      { item: 'LUNCH MEAL', amount: 'KSH. 3,000 PER TERM' },
      { item: 'PORRIDGE', amount: 'KSH. 600 PER TERM' },
      { item: 'SCHOOL BADGE', amount: 'KSH. 100' },
      { item: 'P.E KIT (TRACK SUIT)', amount: 'KSH. 2,350' },
      { item: 'EXAM FEE', amount: 'KSH. 250 (ECD - PP1 & PP2) | KSH. 450 (GRADE 1 - 4) | KSH. 650 (GRADE 5 - 6)' },
      { item: 'ASSESSMENT REPORT', amount: 'KSH. 400/=' },
    ],
    requirements: [
      'Birth certificate (Photocopy)',
      'Parent / guardian serving contacts / phone number / ID photocopy',
    ],
    feesPolicy:
      'SCHOOL FEES SHOULD BE PAID AT LEAST 1/2 OF YOUR SCHOOL FEES ON OPENING DAY AND BE CLEARED BY THE END OF THE 2ND MONTH OF EVERY TERM. FAILURE TO CLEAR BY THE END OF 2ND MONTH WILL ATTRACT A 20% PENALTY WHICH SHALL BE ADDED TO YOUR FEES.',
    uniforms: {
      boys: 'NURSERY: Checked blue shirt with navy blue strips. PRIMARY: Light blue shirt / navy blue short.',
      girls: 'NURSERY: Checked blue dress with navy blue strips. PRIMARY: Light blue shirt / navy blue dress.',
      description: 'Official school uniform sets available through school administration.',
    },
    bankAccounts: [
      {
        method: 'KCB Bank Account',
        details: 'KCB BANK ACCOUNT NO. 1169273831 OR KCB MTAANI AGENTS',
        accountNumber: '1169273831',
      },
      {
        method: 'M-PESA Paybill',
        details: 'MPESA PAYBILL: 522123 | ACCOUNT NUMBER: 62138K + PUPIL’S NAME',
        paybill: '522123',
      },
    ],
    lastUpdated: '2026-09-19',
    updatedBy: 'School Bursar & Chief Administration',
  },
  {
    id: 'fee-jss-grade-7',
    title: 'Grade 7 (Junior Secondary School) Fee Structure',
    category: 'Grade 7',
    headerTitle: 'AMANI JUNIOR ACADEMY JUNIOR SECONDARY SCHOOL\nP.O Box 93- 80114, Mazeras. Tel: 0718540922',
    applicableGrades: ['Grade 7', 'Grade 7A', 'Grade 7B'],
    tableHeaders: ['ITEM', '1ST TERM', '2ND TERM', '3RD TERM', 'YEAR TOTAL'],
    rows: [
      { gradeOrItem: 'FEE', term1: 6500, term2: 6500, term3: 6200, yearTotal: 19200 },
      { gradeOrItem: 'COMPUTER', term1: 500, term2: 500, term3: 500, yearTotal: 1500 },
      { gradeOrItem: 'MAINTENANCE', term1: 300, term2: 300, term3: 300, yearTotal: 900 },
      { gradeOrItem: 'TOTAL', term1: 7300, term2: 7300, term3: 7000, yearTotal: 21600 },
    ],
    extraRowNote: 'Total per term: Term 1: Ksh. 7,300 | Term 2: Ksh. 7,300 | Term 3: Ksh. 7,000 | Year Total: Ksh. 21,600',
    otherPayments: [
      { item: 'TRANSPORT', amount: 'Within Mazeras Ksh. 4,000/= | Outside Mazeras Ksh. 5,000/= (One way)' },
      { item: 'ADMISSION FEE', amount: 'KSH. 1,500' },
      { item: 'REAM PAPER', amount: 'ONCE PER YEAR (JANUARY)' },
      { item: 'ASSESSMENT BOOK', amount: 'KSH. 400' },
      { item: 'TOUR FEE', amount: '(SUBJECT TO CHANGE)' },
      { item: 'SCHOOL BADGE', amount: 'KSH. 200' },
      { item: 'EXAM FEE', amount: 'KSH. 650 PER TERM' },
      { item: 'LUNCH MEAL', amount: 'KSH. 3,000 PER TERM' },
    ],
    requirements: [
      'Birth certificate (Photocopy)',
      'Mathematical set',
      'Parent/guardian serving contacts/phone number',
      'Fee payments slip/receipt',
      'Transport is for those who pay for the service "picking & dropping"',
      'All fee payments should be wholly done for the term and in the bank.',
    ],
    feesPolicy:
      'All fee payments should be wholly completed for the term in the bank or via official school M-Pesa paybill. Keep bank slip for bursary clearance.',
    uniforms: {
      boys: 'White shirt, navy blue trouser, navy blue tie with white strips, navy blue blazer, navy blue sweater with a badge, navy blue tracksuits with white t-shirts with collar.',
      girls: 'White blouse, navy blue box pleat skirt, navy blue tie with white strips, navy blue blazer, navy blue sweater with a badge, white socks with blue strips at top, navy blue tracksuits with white t-shirts with collar.',
    },
    bankAccounts: [
      {
        method: 'M-PESA Paybill (Junior Secondary)',
        details: 'MPESA PAYBILL: 4404404 | ACCOUNT NUMBER: PB0755 + PUPIL’S NAME',
        paybill: '4404404',
      },
    ],
    lastUpdated: '2026-09-19',
    updatedBy: 'School Bursar & Chief Administration',
  },
  {
    id: 'fee-jss-grade-8',
    title: 'Grade 8 (Junior Secondary School) Fee Structure',
    category: 'Grade 8',
    headerTitle: 'AMANI JUNIOR ACADEMY JUNIOR SECONDARY SCHOOL\nP.O Box 93- 80114, Mazeras. Tel: 0718540922',
    applicableGrades: ['Grade 8', 'Grade 8 Champions'],
    tableHeaders: ['ITEM', '1ST TERM', '2ND TERM', '3RD TERM', 'YEAR TOTAL'],
    rows: [
      { gradeOrItem: 'FEE', term1: 7000, term2: 7000, term3: 6500, yearTotal: 20500 },
      { gradeOrItem: 'COMPUTER', term1: 500, term2: 500, term3: 500, yearTotal: 1500 },
      { gradeOrItem: 'MAINTENANCE', term1: 300, term2: 300, term3: 300, yearTotal: 900 },
      { gradeOrItem: 'TOTAL', term1: 7800, term2: 7800, term3: 7300, yearTotal: 22900 },
    ],
    extraRowNote: 'Total per term: Term 1: Ksh. 7,800 | Term 2: Ksh. 7,800 | Term 3: Ksh. 7,300 | Year Total: Ksh. 22,900',
    otherPayments: [
      { item: 'TRANSPORT', amount: 'Within Mazeras Ksh. 4,000/= | Outside Mazeras Ksh. 5,000/=' },
      { item: 'ADMISSION FEE', amount: 'KSH. 1,500' },
      { item: 'REAM PAPER', amount: 'ONCE PER YEAR (JANUARY)' },
      { item: 'ASSESSMENT BOOK', amount: 'KSH. 500' },
      { item: 'TOUR FEE', amount: '(SUBJECT TO CHANGE)' },
      { item: 'SCHOOL BADGE', amount: 'KSH. 200' },
      { item: 'EXAM FEE', amount: 'KSH. 800 PER TERM' },
      { item: 'LUNCH MEAL', amount: 'KSH. 3,000 PER TERM' },
    ],
    requirements: [
      'Birth certificate (Photocopy)',
      'Mathematical set',
      'Parent/guardian serving contacts/phone number',
      'Fee payments slip/receipt',
      'Transport is for those who pay for the service "picking & dropping"',
      'All fee payments should be wholly done for the term and in the bank.',
    ],
    feesPolicy:
      'All fee payments should be wholly completed for the term in the bank or via official school M-Pesa paybill. Keep bank slip for bursary clearance.',
    uniforms: {
      boys: 'White shirt, navy blue trouser, navy blue tie with white strips, navy blue blazer, navy blue sweater with a badge, navy blue tracksuits with white t-shirts with collar.',
      girls: 'White blouse, navy blue box pleat skirt, navy blue tie with white strips, navy blue blazer, navy blue sweater with a badge, white socks with blue strips at top, navy blue tracksuits with white t-shirts with collar.',
    },
    bankAccounts: [
      {
        method: 'M-PESA Paybill (Junior Secondary)',
        details: 'MPESA PAYBILL: 4404404 | ACCOUNT NUMBER: PB0755 + PUPIL’S NAME',
        paybill: '4404404',
      },
    ],
    lastUpdated: '2026-09-19',
    updatedBy: 'School Bursar & Chief Administration',
  },
];
