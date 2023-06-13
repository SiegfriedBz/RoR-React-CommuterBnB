import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './layout/Layout'
import { HomePage, AuthPage, CreateFlatPage, FlatDetailsPage, AboutPage, MessagesPage } from './pages'
import ProtectedRoute from './components/ProtectedRoute'

const App: React.FC = () => {

    return (
        <Router>
            <Layout>
            <div className="container my-2">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/properties/:id" element={<FlatDetailsPage />} />
                    <Route path="/create-property" element={
                        <ProtectedRoute>
                            <CreateFlatPage />
                        </ProtectedRoute>
                    } 
                    />
                    <Route path="/messages" element={
                        <ProtectedRoute>
                            <MessagesPage />
                        </ProtectedRoute>
                    } 
                    />
                </Routes>
            </div>
            </Layout>
        </Router>
    )
}

export default App
