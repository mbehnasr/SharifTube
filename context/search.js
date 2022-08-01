import {createContext, useState} from "react";

const SearchContext = createContext(
    {
        q: '',
        setQ: q => {},
    }
);

export function SearchProvider({children}) {

    const [q, setQ] = useState('');

    const context = {
        q,
        setQ,
    };

    return <SearchContext.Provider value={context}>
        {children}
    </SearchContext.Provider>
}

export default SearchContext;