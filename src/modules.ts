import { registerModules } from './helpers/register-modules'

import dashboard from './modules/dashboard'
import accounts from './modules/accounts'
import documents from './modules/documents'
import history from './modules/history'
import login from './modules/login'

registerModules({
  dashboard: dashboard,
  accounts: accounts,
  documents: documents,
  history: history,
  login: login
})
