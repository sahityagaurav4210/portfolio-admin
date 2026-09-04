export const AppCommonStrings = {
  ERROR: "Something went wrong at our end, please try again!!!",
};

export const AppStrings = {
  LOGIN: {
    ERR_MSGS: {
      INV_PHONE: "Invalid phone, please fill it properly.",
      INV_PWD: "Invalid password, please fill it properly.",
      FIELD_REQ: "All fields are mandatory",
    },
    SUCCESS_MSGS: {
      LOGIN_PASS: "Login successful",
    },
  },
  HOME: {
    CLIENT_TOKEN_DIALOG: {
      COPIED_BTN: "COPIED",
      COPY_BTN: "COPY",
      FOOTER_NOTE: `For security purposes, we will not provide you a further chance to copy your client token, so please copy this right away and store in a safe and secure place and never share this to anyone except client.`,
      COPIED_BTN_TTL: 1000,
    },
  },
  ROUTES: {
    UNDER_MAINTAINANCE: "/under-maintainance",
    HOME: "/",
    HIRINGS: "hirings",
    DASHBOARD: "dashboard",
    CONTACTS: "contacts",
    VIEW_DETAILS: "today-views-details",
    SKILLS: "skills",
    HERO: "home",
    PROJECTS: "projects",
    FORGET_PWD: "auth/forgot-pwd",
    LOGIN: "auth/login",
    LOGOUT: "logout",
    CHANGE_PWD: "auth/change-pwd",
    UPDATED_PROFILE: "public/updated-profile",
  },
};

export const AppModalStrings = {
  SKILL_MODAL: {
    VALIDATION: {
      DESC: {
        MAX: `Description can't be more than 1000 characters`,
        MIN: "Description should be atleast 5 characters long",
      },
      URL: {
        MAX: `Skill url can't be more than 200 characters`,
        MIN: "Skill url should be atleast 5 characters long",
      },
      NAME: {
        MAX: `Skill name can't be more than 32 characters`,
        MIN: "Skill name should be atleast 2 characters long",
      },
    },
  },
  PROFILE_MODAL: {
    ALERT_MSG: {
      EDIT_MODE: "This form is in now edit mode. You can now edit your profile.",
      READ_ONLY_MODE: "This form is in read-only mode. Please toggle the edit mode in order to edit your profile.",
    },
    PROFILE_UPDATED: "Profile updated successfully",
    FORM_VALIDATION: {
      NAME: "Only alphabets, digits and a space is allowed.",
      EMAIL: "Please enter the email in an email format.",
      PHONE: "Due to some technical reasons this field is non-editable.",
      ADDRESS: "Please enter your detailed address here. It can be of atmost 512 characters.",
      WEBSITES: "Please separate your multiple website url with a comma. Your url must start with http or https.",
    },
    SUBMIT_BTN_TXT: "Save Changes",
  },
};
