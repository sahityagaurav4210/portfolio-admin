export const AppStrings = {
  LOGIN: {
    ERR_MSGS: {
      INV_PHONE: "Invalid phone, please fill it properly.",
      INV_PWD: "Invalid password, please fill it properly.",
      FIELD_REQ: "All fields are mandatory"
    },
    SUCCESS_MSGS: {
      LOGIN_PASS: "Login successful",
    }
  },
  HOME: {
    CLIENT_TOKEN_DIALOG: {
      COPIED_BTN: "COPIED",
      COPY_BTN: "COPY",
      FOOTER_NOTE: `For security purposes, we will not provide you a further chance to copy your client token, so please copy this right away and store in a safe and secure place and never share this to anyone except client.`,
      COPIED_BTN_TTL: 1000
    },
  },
  ROUTES: {
    UNDER_MAINTAINANCE: '/under-maintainance',
    HOME: '/',
    HIRINGS: "hirings",
    CONTACTS: "contacts",
    VIEW_DETAILS: 'today-views-details',
    SKILLS: 'skills',
    FORGET_PWD: 'forgot-pwd',
    LOGIN: 'login',
    LOGOUT: "logout"
  }
};

export const AppModalStrings = {
  SKILL_MODAL: {
    VALIDATION: {
      DESC: {
        MAX: `Description can't be more than 1000 characters`,
        MIN: 'Description should be atleast 5 characters long'
      },
      URL: {
        MAX: `Skill url can't be more than 200 characters`,
        MIN: 'Skill url should be atleast 5 characters long'
      },
      NAME: {
        MAX: `Skill name can't be more than 32 characters`,
        MIN: 'Skill name should be atleast 2 characters long'
      }
    }
  }
};