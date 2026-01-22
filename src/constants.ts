export const AppPatterns = Object.freeze({
  phone: /^[+\d]{10,15}$/,
  pwd: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[\W_]).{8,32}$/,
  skillName: /^[A-Za-z0-9+#.\s]*$/,
  skillUrl: /^(?:https?:\/\/[^\s$.?#].[^\s]*|)$/,
  skillExp: /^\d+$/,
  skillDesc: /^.{10,1000}$/s,
});

export const AppUserAgent = "PortfolioAuthWebApp/v1";
