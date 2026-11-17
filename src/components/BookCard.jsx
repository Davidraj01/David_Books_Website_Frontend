import React from 'react';
import { Link } from 'react-router-dom';
import { trackBuy } from '../api.js';

export default function BookCard({ book }) {
  return (
    <article className="book" lang={book.language}>
      <Link to={`/books/${book.slug}`} className="cover" aria-label={book.title}>
        {book.cover ? <img src={book.cover} alt={`Front cover of ${book.title}`} loading="lazy" /> : <span className="nocover">{book.title}</span>}
      </Link>
      <div className="meta">
        <Link to={`/books/${book.slug}`} className="title">{book.title}</Link>
        {book.subtitle && <p className="sub">{book.subtitle}</p>}
        <a className="buy" href={book.amazonUrl} target="_blank" rel="noopener" onClick={() => trackBuy(book._id)}>Buy on Amazon →</a>
      </div>
    </article>
  );
}
