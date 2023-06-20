import React from 'react'
import { 
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
    Route, 
} from 'react-router-dom'
import { 
    AppUserContextLayout,
    FlatsContextLayout,
    ProtectedRouteLayout,
    BookingRequestsLayout
 } from './layout'
import { 
    HomePage,
    FlatDetailsPage,
    AuthPage,
    AboutPage,
    UserPage,
    CreateFlatPage,
    RequestFormsPage,
    BookingRequestListPage,
    MessagesPage,
    PaymentsPage,
    NotFoundPage
   } from './pages'
import { BookingForm } from './components/requests'
import { MessageForm } from './components/messages'

const App: React.FC = () => {

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<AppUserContextLayout />}>
                <Route path="" element={<FlatsContextLayout />}>
                    <Route path="" element={<HomePage />} />
                    <Route path="properties/:id" element={<FlatDetailsPage />} />
                    <Route path="auth" element={<AuthPage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="" element={<ProtectedRouteLayout />} >
                        <Route path="my-profile" element={ <UserPage /> } />
                        <Route path="add-property" element={ <CreateFlatPage /> } />
                        {/* TO FIX */}
                        <Route path="edit-property/:id" element={ <CreateFlatPage /> } />
                        {/*  */}
                        {/* TO FIX */}
                        <Route path="" element={ <BookingRequestsLayout /> }>
                        {/*  */}
                            <Route path="properties/:id/requests" element={ <RequestFormsPage /> }>
                                <Route path="booking" element={ <BookingForm /> } />
                                <Route path="message" element={ <MessageForm /> } />
                            </Route>
                            <Route path="my-booking-requests" element={ <BookingRequestListPage /> } />
                        </Route>
                        <Route path="my-messages" element={ <MessagesPage /> } />
                        <Route path="my-payments" element={ <PaymentsPage /> } />
                    </Route>
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        )
    )

    return (
        <RouterProvider router={router} /> 
    )
}

export default App
