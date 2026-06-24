export const RESUME_FILE_ACCEPT =
  ".pdf,.docx,.doc,.rtf,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,text/plain,application/rtf";

export const RESUME_FILE_LABEL = "PDF, Word, RTF, or text";

const PLAIN_TEXT_EXTENSIONS = new Set([".txt", ".md"]);

export function isPlainTextResumeFile(filename: string): boolean {
  const extension = filename.slice(filename.lastIndexOf(".")).toLowerCase();
  return PLAIN_TEXT_EXTENSIONS.has(extension);
}
