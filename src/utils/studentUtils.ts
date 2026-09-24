import { Student } from '../types';

/**
 * Normalizes CBC grade from class names or explicit strings.
 * Handles Grade 1 through 9, Pre-Primary 1, Pre-Primary 2, Daycare, Playgroup, etc.
 * Avoids truncating to just "Grade".
 */
export function normalizeGrade(className?: string, explicitGrade?: string): string {
  if (explicitGrade && explicitGrade.trim() && explicitGrade.trim().toLowerCase() !== 'grade') {
    return explicitGrade.trim();
  }
  if (!className) return 'Grade 7';
  const c = className.trim();
  const gradeMatch = c.match(/Grade\s*(\d+[A-Za-z]?)/i);
  if (gradeMatch) {
    const raw = gradeMatch[1].trim();
    const num = raw.match(/^\d+/)?.[0];
    return num ? `Grade ${num}` : `Grade ${raw}`;
  }
  if (/pp\s*1|pre-primary\s*1/i.test(c)) return 'Pre-Primary 1';
  if (/pp\s*2|pre-primary\s*2/i.test(c)) return 'Pre-Primary 2';
  if (/daycare/i.test(c)) return 'Daycare';
  if (/playgroup/i.test(c)) return 'Playgroup';
  return c.split('(')[0].trim() || 'Grade 7';
}

/**
 * Generate sequential student ID
 */
export function generateStudentIdFromList(existingStudents: Student[]): string {
  const maxNum = existingStudents.reduce((max, s) => {
    const match = s.studentId?.match(/STU-(\d+)/);
    if (match) {
      const n = parseInt(match[1], 10);
      return n > max ? n : max;
    }
    return max;
  }, 25);
  return `STU-${String(maxNum + 1).padStart(5, '0')}`;
}
