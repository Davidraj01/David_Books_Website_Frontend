import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import BookPage from './pages/BookPage.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminLayout from './admin/AdminLayout.jsx';
import Login from './admin/Login.jsx';
import Books from './admin/Books.jsx';
import BookForm from './admin/BookForm.jsx';
import AuthorForm from './admin/AuthorForm.jsx';
import SeoSettings from './admin/SeoSettings.jsx';
import Messages from './admin/Messages.jsx';
import Account from './admin/Account.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/books/:slug" element={<BookPage />} />
      </Route>
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="books" replace />} />
        <Route path="books" element={<Books />} />
        <Route path="books/new" element={<BookForm />} />
        <Route path="books/:id" element={<BookForm />} />
        <Route path="author" element={<AuthorForm />} />
        <Route path="seo" element={<SeoSettings />} />
        <Route path="messages" element={<Messages />} />
        <Route path="account" element={<Account />} />
      </Route>
      <Route path="*" element={<Layout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
