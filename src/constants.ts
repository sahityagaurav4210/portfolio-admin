export const AppPatterns = Object.freeze({
  phone: /^[+\d]{10,15}$/,
  pwd: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[\W_]).{8,32}$/,
  skillName: /^[A-Za-z0-9+#.\s]*$/,
  skillUrl: /^(?:https?:\/\/[^\s$.?#].[^\s]*|)$/,
  skillExp: /^\d+$/,
  skillDesc: /^.{10,}$/s,
});

export const AppUserAgent = "PortfolioAuthWebApp/v1";

export interface IProjectPriorityOption {
  label: string;
  value: number;
}

export const PROJECT_PRIORITY_OPTIONS: IProjectPriorityOption[] = [
  { label: "Low", value: 0 },
  { label: "Lowest", value: 5 },
  { label: "Moderate", value: 10 },
  { label: "Moderatest", value: 15 },
  { label: "High", value: 20 },
  { label: "Highest", value: 25 },
  { label: "Important", value: 30 },
  { label: "Most Important", value: 35 },
];

export function getProjectPriorityLabel(value: number | undefined | null): string {
  if (value === undefined || value === null) return "—";
  const found = PROJECT_PRIORITY_OPTIONS.find((opt) => opt.value === Number(value));
  return found ? found.label : String(value);
}

