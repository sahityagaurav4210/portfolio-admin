# Changelog

All notable changes to this project will be documented in this file.

The format is based on **Keep a Changelog**, and this project adheres to **Semantic Versioning**.

---

## [0.4.0]

### Summary

- Modernized the UI aesthetics with a new two-column Login page and a redesigned View Skill modal. Refactored the architecture to solve Redux state persistence issues during navigation and significantly enhanced security by moving token-based auth entirely out of local storage. 

### Added

- A generic Drag-and-Drop `FileUpload.tsx` component with validation, size limits, and `isReady` state-gating.
- Delete functionality for the Contacts module (via `ContactActions.tsx` and `Contact.tsx`), complete with an integrated `ConfirmationDialog` for accidental deletion protection.
- Enhanced `ViewModal.tsx` in Skills with a completely fresh and elegant design featuring stat cards and branded UI themes.
- Rich-text editor formatting options (text color, highlight bounds, alignment) to `ReactQuill` in the Skills Modals.
- `ModalHeading` and `ModalCloseButton` styled components for unified headers and clear exit actions across `IPLocModal.tsx`, `Contact.tsx`, etc.
- Added `logo.jpeg` integration to present sophisticated organizational branding on the Login screen and header.

### Changed

- Transitioned the entire Login page (`Login.tsx`) to a modern, fully-responsive layout. On Desktop, it features a split-pane with a full-bleed overlay of the logo; on mobile, it transitions gracefully into a stacked layout featuring a circular avatar.
- Switched the Sidebar (`ProtectedLayout.tsx`) menu items from using HTML `href` to `react-router-dom`'s `<Link>` component to enforce client-side routing.
- Hoisted `ProtectedView.tsx` from wrapping individual child routes to the top-level parent route in `router/index.tsx`, preventing multiple unmounts and solving the Redux state loss bug contextually.
- Updated Add and Edit Skill modals to utilize `multipart/form-data` and consume the new `<FileUpload />` component instead of basic `url` fields.

### Removed

- Deleted `src/controllers/token.controller.ts`.

### Fixed

- Resolved the critical Redux State `user` loss issue where the application would wipe state during navigation hooks.
- Fixed the CSS padding and sizing bug on the Login page ensuring form input alignment is proportional on tablet/laptop screens.
- Avoided the `maxWidth` boundary issues across flexbox columns during UI resizing.

### Security

- Migrated sensitive token handling mechanisms. Cleaned-up and purged the use of explicitly storing API Auth tokens (`token`, `authorization`), `userId`, and `email` inside `localStorage`.
- Handled refresh-token regeneration inherently inside `getSafeReply` checking mechanisms and `ftp.controller.ts` relying exclusively on HttpOny Cookies rather than localStorage tokens.

---

## [0.3.0]

### Summary

- Fixed various mobile UI layout issues and setup a global state layer using Redux Toolkit to present the logged-in User's profile name in the headers. 

### Added

- Brought in `@reduxjs/toolkit` and `react-redux` libraries.
- Implemented `auth.slice` state and integrated `Store` provider for tracking the authenticated User.
- Rendering the logged in profile's name directly in `ProtectedLayout.tsx` header section.

### Changed

- Renamed `src/store` architecture to `src/redux`.
- Centralized the `Support` link view from `ProtectedLayout` down to the `Footer` component.
- Display "Portfolio CMS" branding on the sidebar drawer top section instead of next to the hamburger icon.
- `AuthUserPayload` interface and Redux payloads introduced.

### Fixed

- Handled responsive layout bugs for `SkillsPage.tsx` where tables overflowed beyond screen bounds.
- Resolved spacing margins related to the `Toolbar` overlapping in the mobile sidebar.
- Hide the text separator dot on mobile views inside `Footer.tsx`.

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
