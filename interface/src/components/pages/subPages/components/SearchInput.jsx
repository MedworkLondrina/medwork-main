import { useEffect, useState } from "react";

function SearchInput({ onSearch, placeholder, term }) {

  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  useEffect(() => {
    setSearchTerm(term);
  }, [term]);

  return (
    <>
      <div className="relative w-full">

        <input
          type="text"
          id="search"
          className="w-full p-4 ps-10 text-sm text-gray-900 rounded-full bg-gray-100 shadow-sm"
          placeholder={placeholder}
          onChange={handleInputChange}
          value={searchTerm}
        />
        <button
          type="button"
          className="text-gray-400 absolute end-2.5 bottom-2.5 focus:ring-4 focus:outline-none hover:text-gray-700 font-medium rounded-lg text-sm px-4 py-2">
          <svg
            className="h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
        </button>
      </div>
    </>
  )
}

export default SearchInput;