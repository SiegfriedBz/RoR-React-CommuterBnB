import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './layout/Layout'
import { AuthPage, AboutPage, MessagesPage} from './pages'

const App: React.FC = () => {

    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<h1>HomePage</h1>} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/messages" element={<MessagesPage />} />
                </Routes>
            </Layout>
        </Router>
    )
}

export default App
