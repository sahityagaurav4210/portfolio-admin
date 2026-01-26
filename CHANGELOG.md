# Changelog

All notable changes to this project will be documented in this file.

The format is based on **Keep a Changelog**, and this project adheres to **Semantic Versioning**.

---

## [0.2.0]

### Summary

- In this, I have implemented the captcha functionality on the login page of the admin panel.

### Added

- Captcha on the login page.
- Added `.prettierrc` file.
- Added `CHANGELOG.md` file.
- Added `ContactActions` component.
- Added the `ContactController` class for api handling of contact page.
- Added `getApiBaseUrl` helper function for returning the base url of the backend service based on the environment.
- Added `HomeController` class for api handling of `dashboard` page.
- Added `LayoutController` class for api handling of `menus` present in the header of the application.
- Added `CWPBApiController` core utility class for making the api request to backend services.
- Added `SkillController` class for api handling of `skills` page.
- Added `ToolsController` class for api handling of `portal tools` section of the `dashboard` page.
- Added `ViewsController` class for api handling of `views` page.

### Changed

- Changed the allowed characters limit of address in `user.model.ts`.
- Changed the app start-up console message.
- Added app environment in `webpack` configuration file.
- CI/CD pipeline of this project.

### Deprecated

- There are no deprecated changes in this change.

### Removed

- ApiController has been removed
- route.helpers.ts has been removed
- Logout.tsx view has been removed

### Fixed

- Configured the `cookie` for local, development and production environments.
- Old password check in `/user/edit-profile` api.
- Network request of all pages except Resume updator tool.

### Security

- There are no security related changes, fixes, add-ons in this change.
