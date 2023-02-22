export default function convertISBN10ToISBN13(isbn: string){
    if (isbn.length === 13){
        return isbn
    }
    
    if (isbn.length != 10){
        throw new Error(`ISBN must be of length 10 but is of length ${isbn.length}`)
    }


    let new_isbn: string = '978'+isbn.substring(0,9)
    let running_total = 0
    for (let i = 0; i < new_isbn.length; i++){
        if (i % 2 === 0){
            running_total += parseInt(new_isbn.charAt(i))
        }
        else{
            running_total += parseInt(new_isbn.charAt(i)) * 3
        }
    }
    let checksum = running_total % 10
    
    if (checksum != 0){
        checksum = 10 - checksum
    }

    return new_isbn + checksum.toString()

}