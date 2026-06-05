# Hssabna

Hssabna is a modern demo web app for splitting and tracking shared expenses in MAD between friends, roommates, and groups.

It includes:

- A polished landing page inspired by the current Hssabna website
- A welcome flow for demo login
- A responsive app shell with mobile bottom navigation and desktop sidebar
- Groups, expenses, balances, settlements, members, and activity views
- Local demo persistence with `localStorage`

## Tech stack

- React
- Vite
- JavaScript
- React Router
- Lucide React
- CSS

## How to run

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview the production build:

```bash
npm run preview
```

## Main features

- Landing page with hero, features, steps, CTA, and footer
- Demo welcome screen that stores the active user locally
- Dashboard with total balance, owed/owes totals, active groups, recent expenses, and recent settlements
- Groups page with polished cards and quick create flow
- Group details page with balances, members, expenses, and suggested settlements
- Add expense flow with equal and custom split options
- Members page with paid, owed, and net balances
- Settlements page with minimized transfer suggestions
- Activity timeline for group creation, expenses, settlements, and member joins
- Reset demo data action

## Data model

### User

```js
{
  id,
  name,
  emailOrPhone,
  avatar
}
```

### Group

```js
{
  id,
  name,
  type,
  members: [userIds],
  createdAt
}
```

### Expense

```js
{
  id,
  groupId,
  title,
  amount,
  paidBy,
  participants: [userIds],
  splitType: "equal" | "custom",
  customSplits: {},
  category,
  date,
  createdAt
}
```

### Settlement

```js
{
  id,
  groupId,
  fromUserId,
  toUserId,
  amount,
  status: "pending" | "settled",
  createdAt,
  settledAt
}
```

## Balance logic

The app uses utility functions in `src/utils/balances.js`:

- `calculateGroupBalances(groupId, data)`
- `calculateUserGlobalBalance(userId, data)`
- `generateSuggestedSettlements(groupId, data)`
- `formatCurrency(amount)`

Rules:

- The payer is credited with the full expense amount
- Each participant owes either an equal share or a custom share
- Net balance = paid - owed
- Positive balances should receive money
- Negative balances owe money
- Suggested settlements are minimized by matching debtors against creditors
- All amounts are rounded to 2 decimals and displayed in MAD

## Project structure

```text
src/
  main.jsx
  App.jsx
  routes/
    AppRoutes.jsx
  layouts/
    PublicLayout.jsx
    AppLayout.jsx
  pages/
    LandingPage.jsx
    WelcomePage.jsx
    DashboardPage.jsx
    GroupsPage.jsx
    GroupDetailsPage.jsx
    AddExpensePage.jsx
    MembersPage.jsx
    SettlementsPage.jsx
    ActivityPage.jsx
  components/
    Logo.jsx
    Button.jsx
    Card.jsx
    Avatar.jsx
    BottomNav.jsx
    Sidebar.jsx
    BalanceCard.jsx
    GroupCard.jsx
    ExpenseCard.jsx
    MemberBalanceCard.jsx
    SettlementCard.jsx
    EmptyState.jsx
    Modal.jsx
  data/
    seedData.js
  hooks/
    useLocalStorage.js
    useHssabnaData.js
  utils/
    currency.js
    balances.js
    dates.js
  styles/
    global.css
    variables.css
```

## Persistence

- Demo data is seeded on first load
- App state is persisted in `localStorage`
- User profile, groups, expenses, settlements, and activity survive refreshes
- Resetting demo data restores the original seed state

## Future backend suggestions

- Add a real authentication layer with OTP or email login
- Move storage to PostgreSQL or MongoDB through a Node.js API
- Add group invitations and role-based permissions
- Sync settlements with payment providers used in Morocco
- Add notifications, receipts, and file uploads
- Add analytics and charts for spending insights
- Add automated tests for the balance engine and flows
