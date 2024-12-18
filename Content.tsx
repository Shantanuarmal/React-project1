import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FaChevronDown } from 'react-icons/fa';  

import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface Artwork {
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string;
    date_start: number;
    date_end: number;
}

const Content = () => {
    const { pageNumber } = useParams<{ pageNumber: string }>(); // Fetch the page number from the URL
    const navigate = useNavigate();  

    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [showInput, setShowInput] = useState(false);
    const [inputRows, setInputRows] = useState('');
    const [selectedRows, setSelectedRows] = useState<any[]>([]); // For row selection

    // Convert pageNumber from string to number, default to 1 if not valid
    const currentPage = parseInt(pageNumber || '1', 10);

    // Fetch data from the API based on currentPage and rowsPerPage
    const fetchData = () => {
        axios.get(`https://api.artic.edu/api/v1/artworks?page=${currentPage}&limit=${rowsPerPage}`)
            .then((response) => {
                setArtworks(response.data.data || []);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, rowsPerPage]);

    // Handle Next and Previous page buttons
    const handleNextPage = () => {
        const nextPage = currentPage + 1;
        navigate(`/page/${nextPage}`);  // Update URL to reflect current page
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            const prevPage = currentPage - 1;
            navigate(`/page/${prevPage}`);
        }
    };

    const handleRowsChange = () => {
        if (inputRows && !isNaN(Number(inputRows)) && Number(inputRows) > 0) {
            setRowsPerPage(Number(inputRows));
            setShowInput(false); // Hide input after submission
        }
    };

    // Handle page number submission
    const handlePageChange = () => {
        const page = parseInt(inputRows, 10);
        if (page && page > 0) {
            navigate(`/page/${page}`);
        }
    };

    // Handle row selection
    const handleRowSelect = (e: any, rowData: any) => {
        const selected = [...selectedRows];
        if (e.checked) {
            selected.push(rowData);
        } else {
            const index = selected.indexOf(rowData);
            if (index !== -1) {
                selected.splice(index, 1);
            }
        }
        setSelectedRows(selected);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
            <div className="card w-full max-w-7xl bg-white shadow-lg rounded-lg p-4">
                <DataTable
                    value={artworks}
                    paginator
                    rows={rowsPerPage}
                    rowsPerPageOptions={[10, 20, 30]}
                    tableStyle={{ minWidth: '50rem' }}
                    className="w-full overflow-auto"
                    selection={selectedRows}  // Bind the selected rows to the DataTable
                    onSelectionChange={(e) => setSelectedRows(e.value)}  // Update selected rows on selection change
                >
                    <Column
                        selectionMode="multiple" // Enable multiple row selection
                        style={{ width: '3rem', backgroundColor: '#f0f0f0' }} // Adjust width of the checkbox column
                    />
                    <Column
                        header={<><span>Title</span>
                        <FaChevronDown
                            className="ml-2 cursor-pointer"
                            onClick={() => setShowInput(!showInput)}
                        />
                       
                        
                        {showInput && (
                            <div className="flex items-center space-x-2 mt-4">
                                <input
                                    type="number"
                                    value={inputRows}
                                    onChange={(e) => setInputRows(e.target.value)}
                                    placeholder="Enter page number"
                                    className="border p-2 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500"
                                />
                                <button onClick={handlePageChange} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                                    Submit
                                </button>
                            </div>
                        )}</>}
                        field="title"
                        style={{ width: '20%' }}
                    />
                    <Column field="place_of_origin" header="Place of Origin" style={{ width: '20%' }}></Column>
                    <Column field="artist_display" header="Artist" style={{ width: '20%' }}></Column>
                    <Column field="inscriptions" header="Inscriptions" style={{ width: '20%' }}></Column>
                    <Column field="date_start" header="Start Date" style={{ width: '10%' }}></Column>
                    <Column field="date_end" header="End Date" style={{ width: '10%' }}></Column>
                </DataTable>

                <div className="flex items-center justify-center fixed bottom-4 w-full px-9">
                    <div className="flex space-x-4">
                        <button
                            onClick={handlePreviousPage}
                            className="p-button p-button-outlined p-button-sm rounded-lg hover:bg-gray-200 transition duration-300"
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNextPage}
                            className="p-button p-button-outlined p-button-sm rounded-lg hover:bg-gray-200 transition duration-300"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Content;
