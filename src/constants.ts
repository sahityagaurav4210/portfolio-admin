export const AppPatterns = Object.freeze({
    phone: /^[\+\d]{10,15}$/,
    pwd: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[\W_]).{8,32}$/
});

export const AppUserAgent = "PortfolioAuthWebApp/v1";