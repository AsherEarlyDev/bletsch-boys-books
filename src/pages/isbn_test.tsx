//src/pages/isbn_test.tsx

const fetchBook = async () => {
    const res = await fetch(`api/googleBooks`); // notice the naming
    const data = await res.json();
    console.log(data)
    return data;
    
}

const Isbn = () => {
    return(
        <main>
            <h1>ISBN</h1>
            <button
                onClick={() => {
                    fetchBook();
                }}>Get The Odessey</button>
        </main>
    )
}

export default Isbn