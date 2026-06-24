import type { FieldErrors } from "@/lib/api/form-errors";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateLogin(
  email: string,
  password: string
): FieldErrors<"email" | "password"> {
  const errors: FieldErrors<"email" | "password"> = {};
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(trimmedEmail)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  }

  return errors;
}

export function validateSignup(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  termsAccepted: boolean;
}): FieldErrors<
  "firstName" | "lastName" | "email" | "password" | "terms"
> {
  const errors: FieldErrors<
    "firstName" | "lastName" | "email" | "password" | "terms"
  > = {};
  const trimmedEmail = data.email.trim();

  if (!data.firstName.trim()) {
    errors.firstName = "First name is required.";
  }

  if (!data.lastName.trim()) {
    errors.lastName = "Last name is required.";
  }

  if (!trimmedEmail) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(trimmedEmail)) {
    errors.email = "Enter a valid email address.";
  }

  if (!data.password) {
    errors.password = "Password is required.";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (!/[A-Z]/.test(data.password)) {
    errors.password = "Password must contain at least one uppercase letter.";
  } else if (!/\d/.test(data.password)) {
    errors.password = "Password must contain at least one number.";
  }

  if (!data.termsAccepted) {
    errors.terms =
      "You must agree to the Terms of Service and Privacy Policy.";
  }

  return errors;
}

export function validateForgotPassword(
  email: string
): FieldErrors<"email"> {
  const errors: FieldErrors<"email"> = {};
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(trimmedEmail)) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
}

export function validateResetPassword(
  password: string,
  confirmPassword: string
): FieldErrors<"password" | "confirmPassword"> {
  const errors: FieldErrors<"password" | "confirmPassword"> = {};

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (!/[A-Z]/.test(password)) {
    errors.password = "Password must contain at least one uppercase letter.";
  } else if (!/\d/.test(password)) {
    errors.password = "Password must contain at least one number.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export function validateProject(data: {
  title: string;
  description: string;
  imageUrl: string;
  imageUrls: string[];
  pendingImageCount: number;
  githubUrl: string;
  liveUrl: string;
}): FieldErrors<
  "title" | "description" | "imageUrl" | "githubUrl" | "liveUrl"
> {
  const errors: FieldErrors<
    "title" | "description" | "imageUrl" | "githubUrl" | "liveUrl"
  > = {};

  if (!data.title.trim()) {
    errors.title = "Project title is required.";
  }

  if (!data.description.trim()) {
    errors.description = "Project description is required.";
  }

  const hasImages =
    data.pendingImageCount > 0 ||
    data.imageUrls.some((url) => url.trim()) ||
    data.imageUrl.trim();

  if (!hasImages) {
    errors.imageUrl = "Please upload at least one project image.";
  }

  if (data.githubUrl.trim() && !isValidUrl(data.githubUrl.trim())) {
    errors.githubUrl = "Enter a valid GitHub URL.";
  }

  if (data.liveUrl.trim() && !isValidUrl(data.liveUrl.trim())) {
    errors.liveUrl = "Enter a valid live demo URL.";
  }

  return errors;
}

export function validateExperience(data: {
  position: string;
  company: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  isPresent: boolean;
  description: string;
}): FieldErrors<
  "position" | "company" | "startDate" | "endDate" | "description"
> {
  const errors: FieldErrors<
    "position" | "company" | "startDate" | "endDate" | "description"
  > = {};

  if (!data.position.trim()) {
    errors.position = "Job title is required.";
  }

  if (!data.company.trim()) {
    errors.company = "Company name is required.";
  }

  if (!data.startMonth || !data.startYear) {
    errors.startDate = "Start date is required.";
  }

  if (!data.isPresent && (!data.endMonth || !data.endYear)) {
    errors.endDate = "End date is required, or mark as Present.";
  }

  if (
    data.startMonth &&
    data.startYear &&
    !data.isPresent &&
    data.endMonth &&
    data.endYear
  ) {
    const start = Number(data.startYear) * 12 + Number(data.startMonth);
    const end = Number(data.endYear) * 12 + Number(data.endMonth);

    if (end < start) {
      errors.endDate = "End date cannot be before start date.";
    }
  }

  if (!data.description.trim()) {
    errors.description = "Description is required.";
  }

  return errors;
}

export function validateEducation(data: {
  degree: string;
  institution: string;
  startYear: string;
  endYear: string;
}): FieldErrors<"degree" | "institution" | "startYear" | "endYear"> {
  const errors: FieldErrors<"degree" | "institution" | "startYear" | "endYear"> =
    {};

  if (!data.degree.trim()) {
    errors.degree = "Degree or program name is required.";
  }

  if (!data.institution.trim()) {
    errors.institution = "Institution name is required.";
  }

  if (!data.startYear) {
    errors.startYear = "Start year is required.";
  }

  if (!data.endYear) {
    errors.endYear = "End year is required.";
  }

  if (
    data.startYear &&
    data.endYear &&
    Number(data.endYear) < Number(data.startYear)
  ) {
    errors.endYear = "End year cannot be before start year.";
  }

  return errors;
}

export function validateCertification(data: {
  name: string;
  organization: string;
  issueMonth: string;
  issueYear: string;
  credentialUrl: string;
}): FieldErrors<
  "name" | "organization" | "issueDate" | "credentialUrl"
> {
  const errors: FieldErrors<
    "name" | "organization" | "issueDate" | "credentialUrl"
  > = {};

  if (!data.name.trim()) {
    errors.name = "Certification name is required.";
  }

  if (!data.organization.trim()) {
    errors.organization = "Issuing organization is required.";
  }

  if (!data.issueMonth || !data.issueYear) {
    errors.issueDate = "Issue date is required.";
  }

  if (data.credentialUrl.trim() && !isValidUrl(data.credentialUrl.trim())) {
    errors.credentialUrl = "Enter a valid credential URL.";
  }

  return errors;
}

const PHONE_RE = /^[+]?[\d\s().-]{7,30}$/;

export function validateProfile(data: {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  website: string;
}): FieldErrors<"fullName" | "email" | "phone" | "linkedin" | "github" | "website"> {
  const errors: FieldErrors<
    "fullName" | "email" | "phone" | "linkedin" | "github" | "website"
  > = {};

  if (!data.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (data.email.trim() && !EMAIL_RE.test(data.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (data.phone.trim() && !PHONE_RE.test(data.phone.trim())) {
    errors.phone = "Enter a valid phone number.";
  }

  for (const [field, value] of [
    ["linkedin", data.linkedin],
    ["github", data.github],
    ["website", data.website],
  ] as const) {
    if (value.trim() && !isValidUrl(value.trim())) {
      errors[field] = "Enter a valid URL.";
    }
  }

  return errors;
}

export function validateAddSkills(data: {
  pendingSkills: string[];
  category: string;
}): FieldErrors<"skills" | "category"> {
  const errors: FieldErrors<"skills" | "category"> = {};

  if (data.pendingSkills.length === 0) {
    errors.skills = "Add at least one skill using the + button.";
  }

  if (!data.category.trim()) {
    errors.category = "Please select or enter a category.";
  }

  return errors;
}
