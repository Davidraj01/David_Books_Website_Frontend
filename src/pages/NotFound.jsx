import React from 'react';
import { Link } from 'react-router-dom';
export default function NotFound() {
  return <div className="wrap"><h1>Page not found</h1><p><Link to="/">Back to all books</Link></p></div>;
}
