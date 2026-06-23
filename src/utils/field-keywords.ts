/**
 * Field Intent Detection Keywords Configuration
 *
 * Used to detect field types from labels, placeholders, and text content.
 *
 * IMPORTANT: narrow patterns must be declared BEFORE broad ones. The detector
 * iterates `Object.entries(FIELD_KEYWORDS)` in declaration order and returns
 * on the first match — so `email` must be checked before `name` (which would
 * match any label containing the word "name"), `quantity` before `state`,
 * `currency` before `country`, etc.
 */

export interface FieldKeywords {
  email: RegExp[];
  password: RegExp[];
  telephone: RegExp[];
  phone: RegExp[];
  firstName: RegExp[];
  lastName: RegExp[];
  fullName: RegExp[];
  street: RegExp[];
  address2: RegExp[];
  city: RegExp[];
  zip: RegExp[];
  country: RegExp[];
  state: RegExp[];
  quantity: RegExp[];
  price: RegExp[];
  amount: RegExp[];
  date: RegExp[];
  dob: RegExp[];
  currency: RegExp[];
  language: RegExp[];
  gender: RegExp[];
  title: RegExp[];
  color: RegExp[];
  agree: RegExp[];
  subscribe: RegExp[];
  comments: RegExp[];
  company: RegExp[];
  searchQuery: RegExp[];
  username: RegExp[];
  url: RegExp[];
  creditCard: RegExp[];
  cvv: RegExp[];
  expiryDate: RegExp[];
}

/**
 * Keyword patterns for detecting field intent from label/placeholder/text.
 * Declaration order matters: narrow patterns first.
 */
export const FIELD_KEYWORDS: FieldKeywords = {
  // ---------- narrow patterns first ----------
  email: [
    /e[\s-]?mail/i,
    /user\s*email/i,
    /contact\s*email/i,
    /your\s*email/i,
    /enter\s*email/i,
    /user@/i,
  ],
  password: [
    /password/i,
    /\bpwd\b/i,
    /pass\s*word/i,
    /pass\s*code/i,
    /\bsecret\b/i,
    /enter\s*password/i,
    /your\s*password/i,
  ],
  // "telephone" checked before "phone" so we can branch on the longer keyword.
  telephone: [/telephone/i, /\btel\b/i, /contact\s*phone/i],
  phone: [/phone/i, /phonenumber/i, /phone\s*number/i, /cellular/i, /mobile/i],
  quantity: [/\bqty\b/i, /quantity/i, /how\s*many/i],
  price: [/unit\s*price/i, /\bprice\b/i, /\bcost\b/i],
  amount: [/\bamount\b/i, /\btotal\b/i, /\bsum\b/i, /grand\s*total/i, /subtotal/i],
  dob: [/date\s*of\s*birth/i, /\bdob\b/i, /birthday/i, /birth\s*date/i],
  date: [/\bdate\b/i, /expiration\s*date/i, /issue\s*date/i, /valid\s*from/i],
  currency: [/currency/i, /\bcur\b\.?\s/i, /select\s*currency/i],
  language: [/language/i, /\blang\b/i, /locale/i],
  gender: [/gender/i, /\bsex\b/i],
  title: [/^title$/i, /salutation/i, /\bprefix\b/i],
  color: [/^color$/i, /colour/i],
  creditCard: [
    /credit\s*card/i,
    /card\s*number/i,
    /cardnumber/i,
    /\bvisa\b/i,
    /mastercard/i,
    /\bamex\b/i,
    /card\s*details/i,
  ],
  cvv: [/\bcvv\b/i, /\bcvc\b/i, /security\s*code/i, /card\s*code/i, /verification\s*code/i],
  expiryDate: [
    /expiry/i,
    /expiration/i,
    /exp\s*date/i,
    /expire/i,
    /valid\s*until/i,
    /exp\s*month/i,
    /exp\s*year/i,
    /mm\s*\/\s*yy/i,
  ],
  // "comments" / "subscribe" / "agree" must come before generic "name" and "address".
  comments: [/\bcomment(s)?\b/i, /your\s*message/i, /\bnote(s)?\b/i, /remark(s)?/i, /additional\s*info/i, /enquir(y|ies)/i, /message/i, /feedback/i],
  subscribe: [/subscribe/i, /newsletter/i],
  agree: [
    /\bagree\b/i,
    /accept/i,
    /consent/i,
    /\bterms\b/i,
    /privacy/i,
    /\bpolicy\b/i,
  ],
  url: [
    /website/i,
    /web\s*address/i,
    /web\s*site/i,
    /\burl\b/i,
    /\bdomain\b/i,
    /^https?:\/\//i,
  ],
  username: [/username/i, /user\s*name/i, /login\s*name/i, /user\s*id/i, /account\s*name/i],
  searchQuery: [/search/i, /search\s*query/i, /search\s*term/i, /search\s*box/i, /\bquery\b/i, /\bkeyword\b/i],
  // ---------- personal info (narrow before broad) ----------
  firstName: [
    /first\s*name/i,
    /given\s*name/i,
    /\bfname\b/i,
    /\bf\s*name\b/i,
  ],
  lastName: [
    /last\s*name/i,
    /family\s*name/i,
    /surname/i,
    /\blname\b/i,
    /\bl\s*name\b/i,
  ],
  company: [
    /^company$/i,
    /company\s*name/i,
    /organization/i,
    /\borg(anization)?\b/i,
    /business\s*name/i,
    /employer/i,
  ],
  // "full name" must be checked before the broad /name/i pattern below.
  fullName: [
    /full\s*name/i,
    /your\s*name/i,
    /enter\s*name/i,
    /customer\s*name/i,
  ],
  // ---------- address (narrow before broad) ----------
  // Address2 / Address Line 2 must come before address1.
  address2: [/address\s*(2|line\s*2|two)/i, /\bapt\b/i, /\bsuite\b/i, /\bunit\b/i],
  street: [/street/i, /address\s*(1|line\s*1|one)/i, /street\s*address/i, /street\s*line/i],
  city: [/\bcity\b/i, /city\s*name/i, /\btown\b/i, /municipality/i],
  zip: [/\bzip\b/i, /postal/i, /postal\s*code/i, /zipcode/i, /zip\s*code/i, /post\s*code/i, /postcode/i],
  // ---------- country / state ----------
  country: [/\bcountry\b/i, /country\s*name/i, /\bnation\b/i, /select\s*country/i],
  // "state" / "region" checked last because they are common words.
  state: [
    /region/i,
    /\bstate\b/i,
    /\bprovince\b/i,
    /state\s*province/i,
    /select\s*state/i,
    /county/i,
  ],
};

/** Last-chance broad `/name/` pattern. Fires only after every entry in
 *  `FIELD_KEYWORDS` has been checked and missed — used so labels that just
 *  say "Name" (e.g. contact_us "Your Name") still resolve to `fullName`. */
const FULLNAME_FALLBACK = [/\bname\b/i];

/**
 * Detect field intent from text patterns.
 * Returns the field type if a match is found, otherwise returns 'generic'.
 */
export function detectFieldIntent(
  label?: string,
  placeholder?: string,
  text?: string,
): keyof FieldKeywords | "generic" {
  // Trim and collapse whitespace so patterns like /^company$/i match a
  // single-word label even though the template below appends a space when
  // any of label/placeholder/text is empty.
  const combined =
    `${label || ""} ${placeholder || ""} ${text || ""}`
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

  for (const [fieldType, patterns] of Object.entries(FIELD_KEYWORDS)) {
    for (const pattern of patterns) {
      if (pattern.test(combined)) {
        return fieldType as keyof FieldKeywords;
      }
    }
  }

  if (FULLNAME_FALLBACK[0].test(combined)) {
    return "fullName";
  }

  return "generic";
}
