export class AdminValidationError extends Error {}

export function requiredText(value: unknown, field: string, maxLength: number) {
  if (typeof value !== "string") throw new AdminValidationError(`${field} is required`);
  const result = value.trim();
  if (!result || result.length > maxLength) {
    throw new AdminValidationError(`${field} must be between 1 and ${maxLength} characters`);
  }
  return result;
}

export function optionalText(value: unknown, field: string, maxLength: number) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") throw new AdminValidationError(`${field} must be text`);
  const result = value.trim();
  if (result.length > maxLength) throw new AdminValidationError(`${field} is too long`);
  return result || null;
}

export function integerValue(
  value: unknown,
  field: string,
  options: { min?: number; max?: number; fallback?: number } = {},
) {
  const candidate = value === undefined || value === null || value === "" ? options.fallback : Number(value);
  if (!Number.isInteger(candidate)) throw new AdminValidationError(`${field} must be an integer`);
  if (options.min !== undefined && candidate! < options.min) throw new AdminValidationError(`${field} is too small`);
  if (options.max !== undefined && candidate! > options.max) throw new AdminValidationError(`${field} is too large`);
  return candidate!;
}

export function stringArray(value: unknown, field: string, maxItems = 50, itemLength = 160) {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.length > maxItems) {
    throw new AdminValidationError(`${field} must be an array with at most ${maxItems} items`);
  }
  return value.map((item) => requiredText(item, field, itemLength));
}

export function safeUrl(
  value: unknown,
  field: string,
  options: { required?: boolean; allowRelative?: boolean; maxLength?: number } = {},
) {
  const result = optionalText(value, field, options.maxLength ?? 1000);
  if (!result) {
    if (options.required) throw new AdminValidationError(`${field} is required`);
    return null;
  }

  if (options.allowRelative && result.startsWith("/") && !result.startsWith("//") && !/[\r\n\\]/.test(result)) {
    return result;
  }

  try {
    const parsed = new URL(result);
    if ((parsed.protocol === "http:" || parsed.protocol === "https:") && parsed.hostname) return result;
  } catch {
    // Fall through to the normalized validation error below.
  }
  throw new AdminValidationError(`${field} must be a safe HTTP(S) URL`);
}

export function safeEmail(value: unknown, field: string, required = false) {
  const result = optionalText(value, field, 254);
  if (!result) {
    if (required) throw new AdminValidationError(`${field} is required`);
    return null;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result)) {
    throw new AdminValidationError(`${field} must be a valid email address`);
  }
  return result.toLowerCase();
}

export function parsePositiveId(value: string) {
  if (!/^\d+$/.test(value)) throw new AdminValidationError("Invalid resource ID");
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) throw new AdminValidationError("Invalid resource ID");
  return id;
}

export function safeSlug(value: unknown, field = "Slug") {
  const result = requiredText(value, field, 160).toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(result)) {
    throw new AdminValidationError(`${field} may only contain lowercase letters, numbers, and hyphens`);
  }
  return result;
}

function inputRecord(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new AdminValidationError("Request body must be an object");
  }
  return value as Record<string, unknown>;
}

export function parseTeamMember(value: unknown) {
  const body = inputRecord(value);
  return {
    name: requiredText(body.name, "Name", 120),
    role: requiredText(body.role, "Role", 120),
    bio: optionalText(body.bio, "Bio", 2000),
    imageUrl: safeUrl(body.imageUrl, "Image URL", { allowRelative: true }),
    linkedinUrl: safeUrl(body.linkedinUrl, "LinkedIn URL"),
    email: safeEmail(body.email, "Email"),
    facebookUrl: safeUrl(body.facebookUrl, "Facebook URL"),
    order: integerValue(body.order, "Order", { min: 0, max: 10_000, fallback: 0 }),
  };
}

export function parseClientLogo(value: unknown) {
  const body = inputRecord(value);
  return {
    name: requiredText(body.name, "Name", 120),
    logoUrl: safeUrl(body.logoUrl, "Logo URL", { required: true, allowRelative: true })!,
    order: integerValue(body.order, "Order", { min: 0, max: 10_000, fallback: 0 }),
  };
}

export function parseTestimonial(value: unknown) {
  const body = inputRecord(value);
  const mediaType = optionalText(body.mediaType, "Media type", 20);
  if (mediaType && mediaType !== "image" && mediaType !== "video") {
    throw new AdminValidationError("Media type must be image or video");
  }
  return {
    name: requiredText(body.name, "Name", 120),
    company: optionalText(body.company, "Company", 160),
    review: requiredText(body.review, "Review", 5000),
    stars: integerValue(body.stars, "Stars", { min: 1, max: 5, fallback: 5 }),
    mediaUrl: safeUrl(body.mediaUrl, "Media URL", { allowRelative: true }),
    mediaType,
    order: integerValue(body.order, "Order", { min: 0, max: 10_000, fallback: 0 }),
  };
}

export function parseCareer(value: unknown) {
  const body = inputRecord(value);
  return {
    title: requiredText(body.title, "Title", 160),
    department: requiredText(body.department, "Department", 120),
    location: requiredText(body.location, "Location", 160),
    type: requiredText(body.type, "Employment type", 80),
    salary: optionalText(body.salary, "Salary", 160),
    description: requiredText(body.description, "Description", 5000),
    tags: stringArray(body.tags, "Tags", 30, 80),
    order: integerValue(body.order, "Order", { min: 0, max: 10_000, fallback: 0 }),
  };
}

export function parseFaq(value: unknown) {
  const body = inputRecord(value);
  return {
    question: requiredText(body.question, "Question", 500),
    answer: requiredText(body.answer, "Answer", 5000),
    order: integerValue(body.order, "Order", { min: 0, max: 10_000, fallback: 0 }),
  };
}

export function parseStat(value: unknown) {
  const body = inputRecord(value);
  return {
    label: requiredText(body.label, "Label", 120),
    value: integerValue(body.value, "Value", { min: 0, max: 1_000_000_000 }),
    suffix: optionalText(body.suffix, "Suffix", 20),
    order: integerValue(body.order, "Order", { min: 0, max: 10_000, fallback: 0 }),
  };
}

export function parseClientCategory(value: unknown) {
  const body = inputRecord(value);
  return {
    label: requiredText(body.label, "Label", 120),
    order: integerValue(body.order, "Order", { min: 0, max: 10_000, fallback: 0 }),
  };
}

function optionalInteger(value: unknown, field: string, min = 0, max = 1_000_000_000) {
  if (value === undefined || value === null || value === "") return null;
  return integerValue(value, field, { min, max });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseService(value: unknown) {
  const body = inputRecord(value);
  const title = requiredText(body.title, "Title", 160);
  const rawSubServices = body.subServices ?? [];
  if (!Array.isArray(rawSubServices) || rawSubServices.length > 50) {
    throw new AdminValidationError("Sub-services must contain at most 50 items");
  }

  const parsedSubServices = rawSubServices.map((raw, index) => {
    const item = inputRecord(raw);
    const name = requiredText(item.name, `Sub-service ${index + 1} name`, 160);
    return {
      slug: safeSlug(item.slug || slugify(name), `Sub-service ${index + 1} slug`),
      name,
      description: optionalText(item.description, `Sub-service ${index + 1} description`, 3000),
      pricePkr: optionalInteger(item.pricePkr, `Sub-service ${index + 1} PKR price`),
      priceUsd: optionalInteger(item.priceUsd, `Sub-service ${index + 1} USD price`),
      features: stringArray(item.features, `Sub-service ${index + 1} features`, 50, 200),
      order: index,
    };
  });

  return {
    service: {
      title,
      slug: safeSlug(body.slug || slugify(title)),
      description: requiredText(body.description, "Description", 5000),
      deliverables: stringArray(body.deliverables, "Deliverables", 50, 200),
      icon: optionalText(body.icon, "Icon", 120),
    },
    subServices: parsedSubServices,
  };
}
