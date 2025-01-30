import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import toast, { Toaster } from 'react-hot-toast';
import { AppContext } from '../context/app';
import ModalShareFile from '../components/modal/modalShareFile';
import Pagination from '../components/pagination';
import Loading from '../components/loading';
import {fileSizeFormattedString} from '../utils/format';
import api from '../api'; 

const DashboardPage = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [fileUpdate, setFileUpdate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalFiles, setTotalFiles] = useState(1);
    const [modalShareFile, setModalShareFile] = useState(false)
    const { data, setData  } = useContext(AppContext);
    const [loading, setLoading] = useState(false)

    const pageSize = 10;
      // Función para obtener los archivos
    const fetchFiles = async (page) => {
        try {
            const response = await api.get(`/files`, {
                headers: {
                    "Authorization": `Bearer ${data.accessToken}`
                },
                params: {
                    page,
                    limit: pageSize,
                },
            });
    
            const { files, total, totalPages, pageNumber } = response.data.data;
            setFiles(files);
            setTotalFiles(total);
            setTotalPages(totalPages);
            setCurrentPage(pageNumber);
        } catch (err) {
            console.error("Error fetching files:", err);
        }
    };

    // Cargar archivos al montar el componente
    useEffect(() => {
        const loadFiles = async () => {
            try {
            setLoading(true);
            await fetchFiles(currentPage);
            } catch (error) {
            console.log(error);
            } finally {
            setLoading(false);
            }
        };
        loadFiles();
    }, []);

    const processRequest = async (values) => {
        setData(null);
        navigate("/");
    }

    const handleSignOut = async (values) => {
        try{

            toast.promise(
            async () => {
                await processRequest(values)
            },
            {
                loading: 'Signing out your account...',
                success: 'Account signed out succesfully',
                error: 'Error signing out account',
            }
            );
            
        } catch (error) {
            console.log(error)
        }
    }

    const handleEditFile = (file) => {
        setModalShareFile(!modalShareFile)
        setFileUpdate(file)
    }

    const processFileDownloadRequest = async (file) => {
        const response = await api.get(`/files/download/${file.id}`,{
            headers: {
                "Authorization": `Bearer ${data.accessToken}`
            },
            responseType: 'blob' 
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;

        const sanitizedFilename = file.filename.replace(/\s+/g, '_');

        a.download = `${sanitizedFilename}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
    }

    const handleDownloadFile = (file) => {
        try{

            toast.promise(
            async () => {
                await processFileDownloadRequest(file)
            },
            {
                loading: `Downloading file ${file.filename}...`,
                success: `Downloaded file ${file.filename}.`,
                error: `Error downloading file ${file.filename}. Try again`,
            }
            );
            
        } catch (error) {
            console.log(error)
        }
        
    }

    const handleCloseModal = () => {
        setModalShareFile(false); 
        setFileUpdate(null)

        fetchFiles(currentPage);

    }

        return (
        <React.Fragment>
                <Toaster />
                {modalShareFile ? <ModalShareFile fileUpdate={fileUpdate} data={data} title="Share file" isModalOpen={modalShareFile} onClose={()=> handleCloseModal()}/> : null}
                <div className="min-h-full">
                        <nav className="bg-gray-800">
                                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="flex h-16 items-center justify-between">
                                        <div className="flex items-center">
                                        <div className="shrink-0">
                                                <img
                                                        alt="logo"
                                                        src={"/images/mark.svg"}
                                                        className="h-8 w-auto"
                                                />
                                        </div>
                                        
                                        </div>
                                        <div className="hidden md:block">
                                        <div className="ml-4 flex items-center md:ml-6">

                                                <div className="relative ml-3">
                                                <div>
                                                        <button id="signOut" onClick={()=> handleSignOut()} className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                                                Sign out
                                                        </button>
                                                </div>
                                                </div>
                                        </div>
                                        </div>
                                        <div className="-mr-2 flex md:hidden">
                                        
                                                <button onClick={()=> handleSignOut()} className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                                        Sign out
                                                </button>
                                        </div>
                                </div>
                                </div>
                        </nav>

                        <header className="bg-white shadow-sm">
                                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                                        <div className='flex justify-between w-full'>
                                                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{`Files of ${data.name}`}</h1>
                                                <button id="shareFileBtn" onClick={()=> setModalShareFile(!modalShareFile)} className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                                        Share File
                                                </button>
                                        </div>
                                        
                                </div>
                        </header>
                        <main>
                                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                                        {
                                                loading ? <Loading /> : 
                                                (
                                                        files.length > 0 ?
                                                                <div className="overflow-x-auto">
                                                                        <table className="table mb-4">
                                                                                {/* head */}
                                                                                <thead>
                                                                                <tr>
                                                                                        {/* <th>Thumb</th> */}
                                                                                        <th>File name</th>
                                                                                        <th>Mime</th>
                                                                                        <th>Size</th>
                                                                                        <th>Checksum</th>
                                                                                        <th> </th>
                                                                                        <th> </th>
                                                                                </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                        {
                                                                                                files.map((file, idx) => (
                                                                                                        <tr key={idx}>
                                                                                                                {/* <td>
                                                                                                                        <div className="flex items-center space-x-3">
                                                                                                                                <div className="avatar">
                                                                                                                                <div className="mask mask-squircle w-12 h-12">
                                                                                                                                        <img src={file.data} alt="Avatar Tailwind CSS Component" />
                                                                                                                                </div>
                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                </td> */}
                                                                                                                <td>
                                                                                                                        <div className="font-bold">{file.filename}</div>
                                                                                                                </td>
                                                                                                                <td>{file.mimetype}</td>
                                                                                                                <td>{fileSizeFormattedString(file.size)}</td>
                                                                                                                <td>{file.checksum}</td>
                                                                                                                <th>
                                                                                                                        <button value={file.id} onClick={()=>handleEditFile(file)} className=" edit btn btn-ghost btn-xs">Edit</button>
                                                                                                                </th>
                                                                                                                <th>
                                                                                                                        <button value={file.id}  onClick={()=>handleDownloadFile(file)} className=" download btn btn-ghost btn-xs">Download</button>
                                                                                                                </th>
                                                                                                        </tr>
                                                                                                ))
                                                                                        }
                                                                                
                                                                                
                                                                                </tbody>
                                                                        </table>

                                                                        <Pagination 
                                                                                currentPage={currentPage} 
                                                                                totalPages={totalPages} 
                                                                                totalFiles={totalFiles}  
                                                                                setPage={(page) => setCurrentPage(page)}
                                                                        />
                                                                </div>

                                                                :

                                                                <div className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
                                                                        There are no zipped files shared in the community by you. If you share files, refresh page because the system can be compressing your file. You shoud see only compressed files
                                                                </div>


                                                )
                                        }
                                </div>
                        </main>
                </div>
        </React.Fragment>
        );
};

export default DashboardPage;
