import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/pages/Home'
import Courses from './components/pages/Courses'
import Detail from './components/pages/Detail'
import Login from './components/pages/Login'
import Register from './components/pages/Register'
import MyCourses from './components/pages/account/MyCourses'
import MyLearning from './components/pages/account/MyLearning'
import WatchCourse from './components/pages/account/WatchCourse'
import ChangePassword from './components/pages/account/ChangePassword'
import Dashboard from './components/pages/account/Dashboard'
import { Toaster } from 'react-hot-toast'
import { RequiredAuth } from './components/common/RequiredAuth'
import CreateCourse from './components/pages/account/courses/CreateCourse'
import EditCourse from './components/pages/account/courses/EditCourse'
import EditLesson from './components/pages/account/courses/EditLesson'
import Checkout from './components/pages/Checkout'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account/login" element={<Login />} />
          <Route path="/account/register" element={<Register />} />
          <Route path="/account/my-courses" element={<MyCourses />} />
          <Route path="/account/courses-enrolled" element={<MyLearning />} />
          <Route path="/account/watch-course" element={<WatchCourse />} />
          <Route path="/account/change-password" element={<ChangePassword />} />


          <Route path="/account/dashboard" element={
            <RequiredAuth>
              <Dashboard />
            </RequiredAuth>
          } />

          <Route path="/account/courses/create" element={
            <RequiredAuth>
              <CreateCourse />
            </RequiredAuth>
          } />

          <Route path="/account/courses/edit/:id" element={
            <RequiredAuth>
              <EditCourse />
            </RequiredAuth>
          } />

          <Route path="/account/courses/edit-lesson/:id/:courseId" element={
            <RequiredAuth>
              <EditLesson />
            </RequiredAuth>
          } />

        </Routes>
      </BrowserRouter >


      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </>
  )
}

export default App
