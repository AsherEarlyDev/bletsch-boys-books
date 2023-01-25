//src/pages/isbn_test.tsx
import { api } from "../utils/api";
const getExternalBook = api.googleBooks.getBookFromISBN;

const Isbn = () => {
    const data = getExternalBook.useQuery("0393356256");
    return(
        <main>
            <h1>ISBN</h1>
            <button
                >Get The Odessey</button>
        </main>
    )
}

export default Isbn