# Xero Alternative - Complete Codebase Structure & Architecture Overview

## 1. PROJECT ARCHITECTURE

### Tech Stack
- **Framework**: React 19.2.0
- **Language**: TypeScript + JavaScript (mixed)
- **Build Tool**: Webpack 5 with dev server on port 8081
- **Styling**: SCSS + Bootstrap 4.6.2
- **UI Components**: Radix UI + Heroicons + custom components
- **State Management**: React Context (no Redux/Zustand visible)
- **Forms**: React Hook Form 7.66.0
- **Charting**: Victory 37.3.6 + Visx 3.12.0
- **Navigation**: Turbolinks 5.2.0 + Stimulus JS 3.2.2
- **Utilities**: Lodash, date-fns, Cleave.js (input masking)
- **Other**: Motion/Framer Motion, React Spring, Drag-n-drop kit

### Entry Point
- **Webpack Entry**: `src/application.js`
- **HTML Template**: `public/index.html` (with #root div)
- **React Mount**: Via `application.js` → mounts `<App />` component

## 2. COMPONENT FOLDER STRUCTURE (458 Total Component Files)

### A. ATOMIC DESIGN PATTERN

#### Design System (_atoms) - 19 Components
```
_atoms/
├── badge/           → Badge.tsx
├── button/          → Button.tsx, FakeInput.tsx  
├── checkbox/        → Checkbox.tsx
├── consent_checkbox/ → ConsentCheckbox.tsx
├── heading/         → Heading components
├── icons/           → Icon components
├── input/           → Input components
├── link/            → Link component
├── notification_button/
├── otp_input/       → OTP input (for 2FA)
├── pagination/      → Pagination component
├── paragraph/       → Typography
├── scrollable/      → Scrollable container
├── select/          → Select dropdown
├── slider/          → Range slider
├── subheading/      → Heading variants
├── switch/          → Toggle switch
├── textarea/        → Text area
└── tooltip/         → Tooltip component
```

#### Molecules (_molecules) - 25 Components
```
_molecules/
├── accordion/       → Accordion component
├── address_forms/   → Address input & form
├── alert/          → Alert messages
├── auto_complete/  → Autocomplete input
├── blocking_modal/ → Modal that blocks interaction
├── checkbox_group/ → Multiple checkboxes
├── combobox/       → Combobox/dropdown hybrid
├── copy_button/    → Button with copy-to-clipboard
├── dropdown/       → Dropdown menu
├── dropdowns/      → Multiple dropdowns
├── income_expense_module/ → Complex income/expense display (helpers.ts, 89 lines)
├── input_group/    → Input with label/addon
├── labeled_consent_checkbox/
├── modal/          → Modal dialog
├── multi_select_from_input/
├── popover/        → Popover component
├── progress_bar/   → Linear progress
├── radio_button_group/
├── radio_button_list/
├── radio_card_group/ → Radio cards with images
├── stepped_progress_bar/ → Multi-step progress
├── table/          → Data table
└── tabs/           → Tabbed interface
```

#### Organisms (_organisms) - 17 Components
```
_organisms/
├── address_autocomplete/  → Address lookup UI
├── banner/               → Banner component
├── cards_tncs/           → Card terms & conditions
├── cop/                  → Confirmation of Payee
├── filter_modal/         → Modal with filters
├── hui-banners/          → Custom banners
├── impersonate_alert_modal/ → Admin impersonation alert
├── invoice_quote_email/  → Email preview
├── invoice_tab_filters/  → Filter tabs
├── invoices/             → Invoice components
├── lists/                → List components
├── pay_lines_table_filters/
├── phone_number_prefix/  → Phone input with country
├── sca_confirm/          → Strong Customer Auth
├── secure_your_account/  → Security setup
└── table_filters/        → Table filtering UI
```

### B. FEATURE COMPONENTS (36 Directories)

```
Components by Feature Area:

1. HOME & DASHBOARD
   ├── home/              (18 files)
   │   ├── Xero linking flows (RelinkBanner, DelinkedBanner, DelinkFlow)
   │   ├── Modals (LinkedModal, SalesTaxLinkedModal, OffBoardUserModal)
   │   └── PAYE components (paye/PayeOffBoardingModal, PayeDroppingOffBanner)
   │
   └── dashboard/         (31 files)
       ├── CardMoreActions.tsx
       ├── ExpensesModule.tsx
       ├── OutstandingInvoices.tsx
       ├── account_details/ (AuAccountDetailsModule, NzAccountDetailsModule, UkAccountDetailsModule)
       ├── active_card_module/ (CardDetails, CardDetailsContent, AuthModal)
       ├── card/ (SetupAllocation, TopupFunds, WithdrawFunds, AddToWalletButton)
       ├── your_account_module/ (ManageFundsModal, SetAllocation)
       ├── data_visualisation/ (PieLegend, PieCenterLabel, expenses_graph.jsx)
       └── RecentPayments.tsx

2. INVOICES & QUOTES
   ├── invoices/          (22 files)
   │   ├── invoice_form.jsx (main form)
   │   ├── RecurrenceFields.tsx (recurring invoices)
   │   ├── select_client/ (CreateClientForm, SelectClientModal)
   │   ├── modals/ (InvoicePreviewModal)
   │   ├── DateInputs, ScheduleInputs, FooterButtons
   │   ├── AdditionalInputs, AdminOptions, Comments
   │   ├── Allocations (ManageAllocations, AllocationsToggleList, AllocationAlert)
   │   └── Helpers & filtering
   │
   ├── invoice_quote/     (8 files)
   │   ├── Email templates
   │   └── Message components
   │
   └── referral_friends/  (1 file)
       └── Referral/affiliate system

3. CLIENTS
   ├── client/            (14 files)
   │   ├── SelectClientForInvoiceQuote.tsx
   │   ├── ClientsTableFilters.tsx
   │   ├── TableMoreActions.tsx
   │   ├── upload/ (UploadFile, UploadFileInstruction)
   │   ├── deductions/ (Complex deductions form system)
   │   └── payment_request/ (Modal & Button)

4. EXPENSES
   ├── expenses/          (7 files)
   │   ├── ExpenseFormRender.tsx
   │   ├── ExpenseContext.tsx (state management)
   │   ├── ExpenseTabFilters.tsx
   │   ├── ExpenseMileageFields.tsx (mileage tracking)
   │   ├── ExpenseVehicleCreation.tsx
   │   └── creation/ (expense_creation_form.jsx)

5. SETTINGS
   ├── settings/          (13 files)
   │   ├── security/ (LoginSettings, Biometrics, TwoFactorSetupCode)
   │   ├── vehicles/ (VehicleRegister, VehicleRegisterForm)
   │   ├── branding/ (BrandingForm, DefaultDueDateForm)
   │   └── work_types.tsx

6. ONBOARDING
   ├── onboarding/        (23 files)
   │   ├── Tour/ (23 comprehensive onboarding forms)
   │   │   ├── PersonalDetailsForm
   │   │   ├── PersonalContactDetailsForm
   │   │   ├── IncomeDetailsForm
   │   │   ├── TaxDetailsForm
   │   │   ├── WorkDetailsForm
   │   │   ├── ConfirmYourIncomeForm
   │   │   ├── SelfEmployedEstimateForm
   │   │   ├── BusinessRegistrationForm
   │   │   ├── PersonalBankAccountForm
   │   │   ├── ChooseAnIdDocumentForm
   │   │   ├── VerifyIdentityBasicDetailsForm
   │   │   ├── VerifyIdentityExternalVerificationForm
   │   │   ├── AuthorityToVerifyIdentity
   │   │   ├── ProofOfAddressForm
   │   │   ├── CardOptInForm
   │   │   ├── PaymentConfirmed
   │   │   ├── AccountProvisionedForm
   │   │   ├── ResendConfirmationEmailForm
   │   │   └── OnboardingTourControls
   │   └── AccountDetailsEmailModal.tsx, BlockedButtons.tsx

7. SELF-RECONCILIATION (Payment Matching)
   ├── self_reconcile/    (20 files)
   │   ├── SelfReconcile.tsx (main component)
   │   ├── SelfReconcileModal.tsx
   │   ├── SelfReconcileBanner.tsx
   │   ├── SelfReconcileSuccess.tsx
   │   ├── SelfReconcileOptions.tsx
   │   ├── ReviewPaymentDetails.tsx
   │   ├── ReviewOverpaymentDetails.tsx
   │   ├── TransactionDetails.tsx
   │   ├── MoreInformation.tsx
   │   ├── select_client/ (SelectClient, SelectClientInvoice, CreateClientForm)
   │   ├── account_top_up/ (AccountTopUp, AccountTopUpConfirm)
   │   └── helpers/ (helpers.ts with utility functions)

8. CARDS & PAYMENTS
   ├── card/              (7 files)
   │   ├── overview/ (RevealCardDetails)
   │   ├── settings/ (CardBlock)
   │   └── manage_funds/ (WithdrawFunds, AllocationTopup, AddFunds, AllocationTable)

9. FINANCIAL & REPORTS
   ├── reports/           (2 files)
   │   ├── ReportModule.tsx
   │   └── StatementOfAccountReport.tsx
   │
   ├── financial/         (1 directory - details needed)
   │
   ├── filing_obligations/ (3 files)
   │   ├── au_deferred_loss.jsx
   │   ├── confetti.jsx
   │   └── au/ (SalaryArrearsPayments.tsx)
   │
   ├── income_sources/    (1 directory)
   │
   └── allocations/       (3 files)
       ├── SelectComponent.tsx
       ├── AdvancedOptions.tsx
       └── allocation_graph.jsx

10. UTILITIES
    ├── inputs/           (9 directories)
    │   ├── typedown/ (autocomplete dropdown)
    │   └── others (various input types)
    │
    ├── consents/         (consent management)
    │
    ├── icon/             (Icon.jsx)
    │
    ├── job_categories/   (job category selection)
    │
    ├── modal/            (modal utilities)
    │
    ├── progress_bar/     (progress indicators)
    │
    ├── toastr/           (toast notifications)
    │
    ├── tour/             (user tours/guides)
    │
    ├── utils/            (utility functions)
    │
    └── collapse/         (collapsible UI)

11. ADMIN FEATURES
    ├── admin/            (10 directories)
    │   ├── components/   (navigation & UI)
    │   ├── bank_transactions/ (admin transaction views)
    │   ├── expense_select/ (expense picker)
    │   ├── filing_obligations/ (admin filing tools)
    │   ├── navigation/ (admin sidebar, menu)
    │   ├── payor_client_reconciliations/
    │   ├── payors/ (ReturnPreviewModal)
    │   ├── remediations/ (remediation forms)
    │   └── self_reconcile/ (admin manual review)

12. DASHBOARD CUSTOMIZATION
    └── dashboard_settings/

13. MISC COMPONENTS
    ├── avatarTooltip.jsx
    ├── confetti.jsx
    ├── accordion.jsx
    ├── CopyButton.jsx
    ├── Tab.jsx
    ├── Tabs.jsx
    ├── tooltip.jsx
    ├── input_date.jsx
    ├── info_box.jsx
    └── ellipses/ (text truncation)
```

## 3. VIEWS FOLDER STRUCTURE (JavaScript Event Handlers)

```
views/                    (1,158 total lines of code)
├── index.js             (17 lines - imports all views)
├── home.ts              (37 lines - home page event listeners)
├── clients.ts           (143 lines - client form interactions)
├── invoices.js          (39 lines - invoice preview toggle)
├── onboardings.js       (75 lines - onboarding form logic)
├── activity_statements.js (97 lines - statement navigation)
├── tour.js              (184 lines - comprehensive onboarding tour)
├── transaction_reconciliations.js (215 lines - payment matching)
├── filing_obligation.js (128 lines - tax filing)
├── filing_obligation_pay_lines.js (38 lines)
├── filing_result.js     (59 lines - tax filing results)
├── jurisdiction_selection.js (40 lines)
├── expense_creation.js  (43 lines)
├── remediations.js      (15 lines)
├── earners_levy.js      (11 lines)
├── value_added_tax_filings.js (17 lines)
└── _sync__/            (sync marker directory)
```

**Note**: These are legacy Turbolinks view handlers, not React pages. They handle DOM events & legacy page interactions.

## 4. CURRENT ROUTING & PAGES SETUP

### Routes Defined in `application.js`
Currently there's a comprehensive `window.Routes` object mapping to API endpoints:

**Home/Events**
- `page_loaded_event_home_index_path` → `/home/index`
- `entered_self_reconcile_modal_event_home_index_path` → `/events/self_reconcile_modal`

**Core Features**
- Invoices API: `/api/invoices/*`
- Quotes API: `/api/quotes/*`
- Clients API: `/api/clients/*`
- Services API: `/api/services/*`
- Dashboard API: `/api/dashboard/modules`
- Expenses API: `/api/expenses/job_categories`
- Vehicles API: `/api/vehicles/*`
- Financial Income: `/api/financial_income_sources/*`
- Cards API: `/api/cards/*`
- Reports API: `/api/reports/income_expense`

**Onboarding**
- Personal details, contact details, income details, tax details, work details
- Income confirmation, self-employed estimates
- Business registration, bank accounts, ID documents
- Identity verification, proof of address, card opt-ins
- Payment confirmed, account provisioned

**Self-Reconciliation (Payment Matching)**
- Clients: `/api/self_reconcile/clients`
- Invoices: `/api/self_reconcile/invoices`
- Bank transactions: `/api/self_reconcile/bank_transactions`
- Transaction reconciliations: `/api/self_reconcile/transaction_reconciliations`

**Settings**
- Pay ID settings: `/api/settings/pay_id`
- Tax agency authorisation: `/api/tax_agency_authorisations/*`
- Dismissed notifications: `/api/dismissed_notifications`

**Other**
- Address autocomplete: `/api/addresses/autocomplete`
- Payment requests: `/api/payment_requests`
- Starting rates calculator: `/api/starting_rates_calculator/*`
- SCA challenges: `/api/challenges/*`
- Off-boarding: `/api/off_boardings`

### Missing: React Router
⚠️ **NO REACT ROUTER SETUP FOUND** - This is a critical missing piece!
- No react-router-dom in dependencies
- No route definitions for page navigation
- The app uses Turbolinks for navigation instead

## 5. COMPONENT USAGE ANALYSIS

### Well-Used Components (Integrated)
✅ **Dashboard**: OutstandingInvoices, ExpensesModule, Card modules heavily referenced
✅ **Invoices**: Complete form system, preview modal, allocation system
✅ **Onboarding**: All 23 forms appear to be wired into tour system
✅ **Self-Reconcile**: Full modal system with client/invoice selection
✅ **Settings**: Security, vehicles, branding forms implemented
✅ **Admin**: Navigation, filing obligations, payors system

### Potentially Unused Components
❓ **Reports Module** - 2 files, unclear if displayed on dashboard
❓ **Income Sources** - Directory exists but minimal usage visible
❓ **Job Categories** - Component exists but not widely integrated
❓ **Filing Obligations** - AU-specific features, may be region-locked
❓ **Allocations** - Graph component present but integration unclear

### Missing App Router
❌ **No App.tsx component** - Referenced in application.js but doesn't exist!
❌ **No routing layer** - Critical missing piece for SPA navigation
❌ **No page components** - Only feature components exist

## 6. API INTEGRATION LAYER

### API Files Structure (50+ API files)
```
API/
├── config/fetch.api.ts          # HTTP client setup
├── auth related APIs
├── dashboard.api.ts (67 lines)  # Dashboard data
├── invoices.api.ts (64 lines)   # Invoice CRUD
├── cards.api.ts (67 lines)      # Card operations
├── clients.api.ts               # Client management
├── expenses/
├── vehicles.api.ts              # Vehicle tracking
├── services.api.ts              # Service catalog
├── financial_income_source.api.ts (51 lines)
├── reports.api.ts               # Financial reports
├── users.api.ts                 # User management
├── settings.api.ts              # Settings
├── onboarding/                  # 20+ onboarding APIs
├── self_reconcile/              # Payment matching APIs
├── bank_account_validation.api.ts
├── cop.api.ts (126 lines)       # Confirmation of Payee
├── invoice_message.api.ts       # Invoice messaging
├── quote_message.api.ts         # Quote messaging
├── dismissedNotifications.api.ts
├── sca_challenge.api.ts         # Strong Customer Auth
├── tax_agency_authorisation.api.ts
├── off_boarding.api.ts
├── starting_rates_calculator.api.ts
└── utils/handleError.ts
```

**Observation**: Comprehensive API integration ready, just needs proper routing to display components.

## 7. TYPE DEFINITIONS

```
types/
├── index.js                      # PropTypes definitions
└── invoices/index.js             # Invoice-specific types
```

**Note**: Mostly using PropTypes (legacy), not TypeScript interfaces. This needs modernization.

## 8. UTILITIES & HELPERS

### Turbolinks Event Handlers
```
_turbo-links_event_handlers/
├── validate_income_estimate_field.ts (83 lines)
├── confirm_income_estimate.ts (59 lines)
├── format_currencies.ts (32 lines)
├── format_currencies_no_symbol.ts (41 lines)
└── bind_event_listener.ts
```

### ES Utilities
```
es_utilities/
├── ScheduleInputHelpers.ts (180 lines) - Complex scheduling logic
├── copy.ts (61 lines) - Copy to clipboard
├── cardPinValidator.ts (56 lines)
├── disabledFormSubmitUntilChange.ts
├── disableFormSubmitUntilValid.ts (53 lines)
├── addRequiredIfChecked.ts (51 lines)
├── unsavedChangesAlert.ts (68 lines)
├── loggedOutAnalyticsHelper.ts (40 lines)
└── index.ts (35 lines) - Main exports
```

### General Utilities
```
utilities/
├── user_attributes.ts (44 lines) - User context
├── bank_account_validation.ts (164 lines)
├── translations.ts (74 lines) - i18n helpers
├── income_forecast_rates.ts (92 lines)
├── dismissive.ts (89 lines)
```

## 9. CONTROLLERS & EVENT LISTENERS

```
controllers/                       # Stimulus.js controllers
├── admin/
│   ├── manual_verification_form_controller.js
│   └── users/cards_controller.js
├── form_controller.js
├── bank_account_number_fields_controller.js
├── transaction_status_filter_controller.js
└── _sync__/.js_
```

## 10. INTERNATIONALIZATION (i18n)

```
locales/
├── en.json          # English (default)
├── en-AU.json       # Australian English
├── en-GB.json       # British English
└── en-NZ.json       # New Zealand English

admin/locales/       # Admin-specific translations
├── en.json
├── en-AU.json
├── en-GB.json
└── en-NZ.json
```

## 11. STYLING

```
stylesheets/
└── application.scss # Main stylesheet
```

## 12. KEY MISSING IMPLEMENTATIONS

### Critical Issues
1. ❌ **No App.tsx component** - application.js tries to import it but it doesn't exist
2. ❌ **No React Router** - No page routing setup
3. ❌ **No page components** - Only feature/UI components, no page containers
4. ❌ **No layout wrapper** - No header/footer/sidebar layout system
5. ❌ **No context providers** - User auth context, theme provider not visible

### Medium Priority
6. ⚠️ **Legacy Stimulus controllers** - Should transition to React
7. ⚠️ **Mixed JS/TS** - Inconsistent language usage
8. ⚠️ **PropTypes** - Should use TypeScript interfaces
9. ⚠️ **Turbolinks** - Legacy navigation, should use React Router
10. ⚠️ **Admin component** - Located in both src/components and src/admin

## 13. SUMMARY OF FEATURE AREAS NEEDING IMPLEMENTATION

### Core Pages (Need to be created)
1. **HomePage/Dashboard** - Main app landing, displays modules
2. **InvoicesPage** - List & create invoices
3. **ClientsPage** - Manage clients
4. **ExpensesPage** - Track expenses
5. **ReportsPage** - View financial reports
6. **SettingsPage** - User settings
7. **OnboardingPage** - Multi-step onboarding flow
8. **AdminPage** - Admin dashboard

### What's Ready to Use
✅ 458 well-organized component files
✅ 50+ API endpoints pre-configured
✅ Comprehensive form components (invoices, expenses, clients)
✅ Full onboarding tour with 23 step components
✅ Self-reconciliation modal system
✅ Complex data visualizations (expenses, income graphs)
✅ Complete settings management
✅ Multi-jurisdiction support (AU, NZ, GB)

### What Needs to be Built
❌ App wrapper component (src/App.tsx)
❌ React Router setup with pages
❌ Layout system (header, sidebar, footer)
❌ User authentication context
❌ State management (Context or Redux)
❌ Page containers to use feature components
❌ Error boundaries
❌ Loading states & suspense
