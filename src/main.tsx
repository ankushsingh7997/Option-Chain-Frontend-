import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store'
import { ApolloProvider } from '@apollo/client'
import client from './apollo/client.ts'

createRoot(document.getElementById('root')!).render(
    <ApolloProvider client={client}>
    <Provider store={store}>
    <App />
    </Provider>
    </ApolloProvider>
)
