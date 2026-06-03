import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [term, setTerm] = useState('');
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();
    const trimmed = term.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form className="search-bar" onSubmit={onSubmit}>
      <input
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Search posts"
        aria-label="Search posts"
      />
      <button type="submit">Search</button>
    </form>
  );
}
