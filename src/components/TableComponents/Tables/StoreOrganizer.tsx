import { useState } from 'react';
import { api } from "../../../utils/api";
import { Genre } from '@prisma/client';
import GenreTableRow from '../TableRows/GenreTableRow';
import Table from './Table';
import AddGenreModal from '../Modals/GenreModals/AddGenreModal';
import TableDetails from '../TableDetails';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShelfCalculatorModal from '../Modals/OrganizerModals/ShelfCalculatorModal';

export default function StoreOrganizer() {

    return (
        <>
        <ShelfCalculatorModal isStandAlone={true} buttonText="Shelf Calulator" submitText="Close"></ShelfCalculatorModal>
        </>
    )
}
