/**
 * Indian public-holiday data and lookup logic.
 *
 * This package ships a small, self-contained static dataset (no network, no
 * API key). It covers the three national (Central) holidays for 2024 and 2025
 * plus a representative set of state holidays for Maharashtra, Karnataka and
 * Tamil Nadu — including regional festivals such as Ganeshotsav, Pongal and
 * Ugadi.
 *
 * Every record is a plain object:
 *   { date, dayOfWeek, name, occasion, type, states }
 * where `type` is one of Central | Federal | State | Gazetted | Optional, and
 * `states` lists the states (and "central") the holiday applies to.
 */

const MONTHS = {
  January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
  July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
};

const DAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

// Central (national) holidays for 2024 and 2025.
const CENTRAL = [
  { date: "2024-01-26", dayOfWeek: "Friday",  name: "Republic Day",      occasion: "National",        type: "Central", states: ["central"] },
  { date: "2024-03-08", dayOfWeek: "Friday",  name: "Holi",              occasion: "Festival",        type: "Central", states: ["central"] },
  { date: "2024-04-11", dayOfWeek: "Thursday",name: "Id-ul-Fitr",        occasion: "Festival",        type: "Central", states: ["central"] },
  { date: "2024-05-01", dayOfWeek: "Wednesday",name: "Maharashtra Day",  occasion: "State Formation", type: "Central", states: ["central", "Maharashtra"] },
  { date: "2024-08-15", dayOfWeek: "Thursday",name: "Independence Day",  occasion: "National",        type: "Central", states: ["central"] },
  { date: "2024-10-02", dayOfWeek: "Wednesday",name: "Gandhi Jayanti",   occasion: "National",        type: "Central", states: ["central"] },
  { date: "2024-11-01", dayOfWeek: "Friday",  name: "Diwali",            occasion: "Festival",        type: "Central", states: ["central"] },
  { date: "2024-12-25", dayOfWeek: "Wednesday",name: "Christmas",        occasion: "Festival",        type: "Central", states: ["central"] },
  { date: "2025-01-26", dayOfWeek: "Sunday",  name: "Republic Day",      occasion: "National",        type: "Central", states: ["central"] },
  { date: "2025-01-29", dayOfWeek: "Wednesday",name: "Holi",            occasion: "Festival",        type: "Central", states: ["central"] },
  { date: "2025-03-03", dayOfWeek: "Monday",  name: "Mahashivratri",     occasion: "Festival",        type: "Central", states: ["central"] },
  { date: "2025-03-14", dayOfWeek: "Friday",  name: "Holi",            occasion: "Festival",        type: "Central", states: ["central"] },
  { date: "2025-04-10", dayOfWeek: "Thursday",name: "Id-ul-Fitr",        occasion: "Festival",        type: "Central", states: ["central"] },
  { date: "2025-05-01", dayOfWeek: "Thursday",name: "Maharashtra Day",  occasion: "State Formation", type: "Central", states: ["central", "Maharashtra"] },
  { date: "2025-08-15", dayOfWeek: "Friday",  name: "Independence Day",  occasion: "National",        type: "Central", states: ["central"] },
  { date: "2025-09-05", dayOfWeek: "Friday",  name: "Janmashtami",       occasion: "Festival",        type: "Central", states: ["central"] },
  { date: "2025-10-02", dayOfWeek: "Thursday",name: "Gandhi Jayanti",    occasion: "National",        type: "Central", states: ["central"] },
  { date: "2025-10-21", dayOfWeek: "Tuesday", name: "Diwali",            occasion: "Festival",        type: "Central", states: ["central"] },
  { date: "2025-11-14", dayOfWeek: "Friday",  name: "Children's Day",    occasion: "National",        type: "Central", states: ["central"] },
  { date: "2025-12-25", dayOfWeek: "Thursday",name: "Christmas",         occasion: "Festival",        type: "Central", states: ["central"] },
  { date: "2026-01-26", dayOfWeek: "Monday",  name: "Republic Day",      occasion: "National",        type: "Central", states: ["central"] },
  { date: "2026-02-17", dayOfWeek: "Tuesday", name: "Holi",              occasion: "Festival",        type: "Central", states: ["central"] },
  { date: "2026-03-24", dayOfWeek: "Tuesday", name: "Id-ul-Fitr",        occasion: "Festival",        type: "Central", states: ["central"] },
  { date: "2026-03-25", dayOfWeek: "Wednesday",name: "Holashtam",       occasion: "Festival",        type: "Central", states: ["central"] },
  { date: "2026-04-03", dayOfWeek: "Friday",  name: "Good Friday",       occasion: "Festival",        type: "Central", states: ["central"] },
  { date: "2026-05-01", dayOfWeek: "Friday",  name: "Maharashtra Day",   occasion: "State Formation", type: "Central", states: ["central", "Maharashtra"] },
  { date: "2026-06-06", dayOfWeek: "Saturday",name: "Buddha Purnima",    occasion: "Festival",        type: "Central", states: ["central"] },
  { date: "2026-08-15", dayOfWeek: "Saturday",name: "Independence Day",  occasion: "National",        type: "Central", states: ["central"] },
  { date: "2026-09-22", dayOfWeek: "Tuesday", name: "Gandhi Jayanti",    occasion: "National",        type: "Central", states: ["central"] },
  { date: "2026-10-02", dayOfWeek: "Friday",  name: "Maha Navratri",     occasion: "Festival",        type: "Central", states: ["central"] },
  { date: "2026-10-20", dayOfWeek: "Tuesday", name: "Diwali",            occasion: "Festival",        type: "Central", states: ["central"] },
  { date: "2026-11-15", dayOfWeek: "Sunday",  name: "Children's Day",    occasion: "National",        type: "Central", states: ["central"] },
  { date: "2026-12-25", dayOfWeek: "Friday",  name: "Christmas",         occasion: "Festival",        type: "Central", states: ["central"] },
];

// State holidays (a representative selection). `type` is one of
// Gazetted (public holiday) or Optional (gazetted but optional to observe).
const STATE_HOLIDAYS = {
  Maharashtra: [
    { date: "2024-04-14", dayOfWeek: "Sunday",  name: "Dr. Ambedkar Jayanti", occasion: "Festival", type: "Gazetted", states: ["Maharashtra"] },
    { date: "2024-05-01", dayOfWeek: "Wednesday", name: "Maharashtra Day", occasion: "State Formation", type: "Gazetted", states: ["Maharashtra"] },
    { date: "2024-09-16", dayOfWeek: "Monday",  name: "Ganeshotsav (Prathamastami)", occasion: "Festival", type: "Gazetted", states: ["Maharashtra"] },
    { date: "2024-11-01", dayOfWeek: "Friday",  name: "Diwali", occasion: "Festival", type: "Gazetted", states: ["Maharashtra"] },
    { date: "2024-11-05", dayOfWeek: "Tuesday", name: "Bhauj", occasion: "Festival", type: "Optional", states: ["Maharashtra"] },
    { date: "2024-12-25", dayOfWeek: "Wednesday", name: "Christmas", occasion: "Festival", type: "Gazetted", states: ["Maharashtra"] },
    { date: "2025-04-14", dayOfWeek: "Monday",  name: "Dr. Ambedkar Jayanti", occasion: "Festival", type: "Gazetted", states: ["Maharashtra"] },
    { date: "2025-05-01", dayOfWeek: "Thursday", name: "Maharashtra Day", occasion: "State Formation", type: "Gazetted", states: ["Maharashtra"] },
    { date: "2025-09-05", dayOfWeek: "Friday",  name: "Ganeshotsav (Prathamastami)", occasion: "Festival", type: "Gazetted", states: ["Maharashtra"] },
    { date: "2025-10-21", dayOfWeek: "Tuesday", name: "Diwali", occasion: "Festival", type: "Gazetted", states: ["Maharashtra"] },
    { date: "2025-12-25", dayOfWeek: "Thursday", name: "Christmas", occasion: "Festival", type: "Gazetted", states: ["Maharashtra"] },
  ],
  Karnataka: [
    { date: "2024-04-14", dayOfWeek: "Sunday",  name: "Karnataka Rajyotsava", occasion: "State Formation", type: "Gazetted", states: ["Karnataka"] },
    { date: "2024-03-25", dayOfWeek: "Monday",  name: "Ugadi", occasion: "Festival", type: "Gazetted", states: ["Karnataka"] },
    { date: "2024-10-14", dayOfWeek: "Monday",  name: "Mysuru Dasara", occasion: "Festival", type: "Gazetted", states: ["Karnataka"] },
    { date: "2024-11-01", dayOfWeek: "Friday",  name: "Diwali", occasion: "Festival", type: "Gazetted", states: ["Karnataka"] },
    { date: "2024-12-25", dayOfWeek: "Wednesday", name: "Christmas", occasion: "Festival", type: "Gazetted", states: ["Karnataka"] },
    { date: "2025-04-14", dayOfWeek: "Monday",  name: "Karnataka Rajyotsava", occasion: "State Formation", type: "Gazetted", states: ["Karnataka"] },
    { date: "2025-03-14", dayOfWeek: "Friday",  name: "Ugadi", occasion: "Festival", type: "Gazetted", states: ["Karnataka"] },
    { date: "2025-10-14", dayOfWeek: "Tuesday", name: "Mysuru Dasara", occasion: "Festival", type: "Gazetted", states: ["Karnataka"] },
    { date: "2025-10-21", dayOfWeek: "Tuesday", name: "Diwali", occasion: "Festival", type: "Gazetted", states: ["Karnataka"] },
    { date: "2025-12-25", dayOfWeek: "Thursday", name: "Christmas", occasion: "Festival", type: "Gazetted", states: ["Karnataka"] },
  ],
  "Tamil Nadu": [
    { date: "2024-01-14", dayOfWeek: "Sunday",  name: "Pongal", occasion: "Festival", type: "Gazetted", states: ["Tamil Nadu"] },
    { date: "2024-05-01", dayOfWeek: "Wednesday", name: "Tamil New Year (Puthandu)", occasion: "Festival", type: "Gazetted", states: ["Tamil Nadu"] },
    { date: "2024-09-28", dayOfWeek: "Saturday", name: "Aippasi Deepavali", occasion: "Festival", type: "Gazetted", states: ["Tamil Nadu"] },
    { date: "2024-10-02", dayOfWeek: "Wednesday", name: "Gandhi Jayanti", occasion: "National", type: "Gazetted", states: ["Tamil Nadu"] },
    { date: "2024-12-25", dayOfWeek: "Wednesday", name: "Christmas", occasion: "Festival", type: "Gazetted", states: ["Tamil Nadu"] },
    { date: "2025-01-14", dayOfWeek: "Tuesday", name: "Pongal", occasion: "Festival", type: "Gazetted", states: ["Tamil Nadu"] },
    { date: "2025-05-01", dayOfWeek: "Thursday", name: "Tamil New Year (Puthandu)", occasion: "Festival", type: "Gazetted", states: ["Tamil Nadu"] },
    { date: "2025-10-02", dayOfWeek: "Thursday", name: "Gandhi Jayanti", occasion: "National", type: "Gazetted", states: ["Tamil Nadu"] },
    { date: "2025-12-25", dayOfWeek: "Thursday", name: "Christmas", occasion: "Festival", type: "Gazetted", states: ["Tamil Nadu"] },
  ],
};

// The complete holiday universe: central + all state holidays.
const HOLIDAYS = [...CENTRAL, ...flattenStateHolidays()];

function flattenStateHolidays() {
  const out = [];
  for (const states of Object.values(STATE_HOLIDAYS)) {
    out.push(...states);
  }
  return out;
}

/**
 * Return the list of state names the package knows about.
 */
export function availableStates() {
  return ["central", ...Object.keys(STATE_HOLIDAYS)];
}

/**
 * Return all holidays that apply to a given year and/or set of states.
 *
 * @param {number} year
 * @param {string} state  "central" or a state name. Defaults to "central".
 * @returns {Array<object>}
 */
export function holidaysFor(year, state = "central") {
  const y = String(year);
  const s = normalizeState(state);
  if (!Object.prototype.hasOwnProperty.call(STATE_HOLIDAYS, s) && s !== "central") {
    return { error: `Unknown state "${state}". Available: ${availableStates().join(", ")}` };
  }
  if (!/^\d{4}$/.test(y)) {
    return { error: `Invalid year "${year}". Provide a 4-digit year, e.g. 2025.` };
  }
  const matches = HOLIDAYS.filter((h) =>
    h.date.startsWith(y) &&
    (s === "central"
      ? h.states.includes("central")
      : h.states.includes(s) || h.states.includes("central"))
  );
  return sortHolidays(matches);
}

/**
 * Search holidays by keyword (name/occasion) or by month (1-12).
 *
 * @param {string} q  Keyword (e.g. "Diwali", "Republic Day") or a month (1-12).
 * @param {string} [state]  Optional state filter.
 * @returns {Array<object>}
 */
export function searchHolidays(q, state = "central") {
  if (typeof q !== "string") {
    return { error: "query must be a string" };
  }
  const needle = q.trim().toLowerCase();
  if (!needle) {
    return { error: "query must not be empty" };
  }

  const monthNum = parseInt(needle, 10);
  if (Number.isInteger(monthNum) && monthNum >= 1 && monthNum <= 12) {
    return holidaysByMonth(monthNum, state);
  }

  const s = normalizeState(state);
  const matches = HOLIDAYS.filter((h) => {
    const hay = `${h.name} ${h.occasion} ${h.states.join(", ")}`.toLowerCase();
    const hit = hay.includes(needle);
    const inState = s === "central"
      ? h.states.includes("central")
      : h.states.includes(s) || h.states.includes("central");
    return hit && inState;
  });
  return sortHolidays(matches);
}

/**
 * Find the next `count` holidays (from today) for a state.
 *
 * @param {string} state
 * @param {number} [count=5]
 * @param {Date} [now=new Date()]  Injectable for testing.
 * @returns {Array<object>|{error:string}}
 */
export function nextHolidays(state = "central", count = 5, now = new Date()) {
  const s = normalizeState(state);
  if (!Object.prototype.hasOwnProperty.call(STATE_HOLIDAYS, s) && s !== "central") {
    return { error: `Unknown state "${state}". Available: ${availableStates().join(", ")}` };
  }
  if (!Number.isInteger(count) || count < 0) {
    return { error: "count must be a non-negative integer" };
  }

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const future = HOLIDAYS.filter((h) => {
    const d = new Date(`${h.date}T00:00:00`);
    const after = d >= today;
    const inState = s === "central"
      ? h.states.includes("central")
      : h.states.includes(s) || h.states.includes("central");
    return after && inState;
  });
  sortHolidays(future);
  return future.slice(0, count);
}

/**
 * Return all holidays for a given month (1-12) across all states/years present.
 */
function holidaysByMonth(month, state) {
  const s = normalizeState(state);
  const matches = HOLIDAYS.filter((h) => {
    const m = Number(h.date.slice(5, 7));
    const inState = s === "central"
      ? h.states.includes("central")
      : h.states.includes(s) || h.states.includes("central");
    return m === month && inState;
  });
  return sortHolidays(matches);
}

/**
 * Normalise a state name (case-insensitive, trim).
 */
export function normalizeState(state) {
  if (typeof state !== "string") return "central";
  const s = state.trim().toLowerCase();
  if (s === "central" || s === "federal") return "central";
  const match = Object.keys(STATE_HOLIDAYS).find((k) => k.toLowerCase() === s);
  return match || s;
}

/**
 * Sort holidays chronologically, then by name for ties.
 */
function sortHolidays(list) {
  return [...list].sort((a, b) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return a.name.localeCompare(b.name);
  });
}

export { DAYS, MONTHS };
