//src/pages/isbn_test.tsx
import { completeBook } from "../types/bookTypes";
import { api } from "../utils/api";
const getBooks = api.googleBooks.findBooks;


const Isbn = () => {
    const data = getBooks.useQuery(["9780140449112", "2934857392"]);
    const saveBook = api.googleBooks.saveBook.useMutation();
    const editBook = api.googleBooks.editBook.useMutation();
    const deleteBook = api.googleBooks.deleteBookByISBN.useMutation();
    async function  saveBookFunct () {
        saveBook.mutate({
            isbn: "2934857392",
            title: "test  save title",
            publisher: "bletsch boys books",
            author: ['rob cranston1'],
            publicationYear: 2032,
            dimensions: [],
            genre: "action",
            retailPrice: 12.75
        })
    }
    async function  changeBookFunct () {
        editBook.mutate({
            isbn: "2934857392",
            title: "test change book",
            publisher: "rob books",
            author: ['rob c'],
            publicationYear: 2019,
            dimensions: [12,22,44],
            genre: "fantasy",
            retailPrice: 12.75
        })
    }
    async function  deleteBookFunct () {
        deleteBook.mutate("2934857392")
    }

    return(
        <main>
            <h1>ISBN</h1>
            <button onClick={saveBookFunct}>Save Book</button>
            <button onClick={changeBookFunct}>Change Book</button>
            <button onClick={deleteBookFunct}>Delete Book</button>
        </main>
    )
}

export default Isbn