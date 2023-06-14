import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppContextProvider, UserContextProvider, FlatsContextProvider } from './contexts'
import Layout from './layout/Layout'
import { HomePage, AuthPage, CreateFlatPage, FlatDetailsPage, AboutPage, MessagesPage, NotFoundPage } from './pages'
import { ProtectedRoute } from './components'

const App: React.FC = () => {

    return (
        <Router>
            <AppContextProvider>
                <UserContextProvider>
                    <Layout>
                    <div className="container my-2">
                        <Routes>
                            <Route path="about" element={<AboutPage />} />
                            <Route path="auth" element={<AuthPage />} />
                            
                            <Route path="" element={
                                <FlatsContextProvider>
                                    <HomePage />
                                </FlatsContextProvider>
                                } 
                            />
                            <Route path="properties/:id" element={
                                <FlatsContextProvider>
                                    <FlatDetailsPage />
                                </FlatsContextProvider>
                                } 
                            />
                            <Route path="create-property" element={
                                <FlatsContextProvider>
                                    <ProtectedRoute>
                                        <CreateFlatPage />
                                    </ProtectedRoute>
                                </FlatsContextProvider>
                                } 
                            />

                            <Route path="messages" element={
                                <ProtectedRoute>
                                    <MessagesPage />
                                </ProtectedRoute>
                            } 
                            />

                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </div>
                    </Layout>
                </UserContextProvider>
            </AppContextProvider>
        </Router>
    )
}

export default App
