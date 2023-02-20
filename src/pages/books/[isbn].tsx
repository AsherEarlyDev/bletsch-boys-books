import {Book, Genre, Author} from '@prisma/client';
import { useRouter } from 'next/router';
import React, {useContext, useEffect, useState} from 'react'
import PrimaryButton from '../../components/BasicComponents/PrimaryButton';
import SecondaryButton from '../../components/BasicComponents/SecondaryButton';
import CardGrid from '../../components/CardComponents/CardGrid';
import CardTitle from '../../components/CardComponents/CardTitle';
import ImmutableCardProp from '../../components/CardComponents/ImmutableCardProp';
import { api } from '../../utils/api';
import {books} from '../../components/TableComponents/Tables/BookTable'
interface BookModalProp {
  bookInfo: Book & {
    genre: Genre;
    author: Author[];
  },
  closeOut: () => void
  openEdit: (isbn: string) => void
}

export default function ViewBookModal(props: BookModalProp) {
  const [open, setOpen] = useState(true);
  const router = useRouter()

  useEffect(() => {
    router.prefetch('/records')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  function closeModal() {
    setOpen(false)
    props.closeOut()
  }

  async function openEdit() {
    props.openEdit(props.bookInfo.isbn)
    props.closeOut()
  }

  return (
      <div><p>Hi</p></div>
  )
}

export function getStaticProps({ params: { isbn } }) {
    return { props: { isbn: isbn } }
  }
  
  export async function getStaticPaths() {
    const data = api.books.getAllInternalBooks.useQuery().data
    return {
      paths: (data).map((book) => ({
        params: { isbn: book.isbn },
      })),
      fallback: false,
    }
  }
