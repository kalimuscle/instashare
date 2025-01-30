import { AnimatePresence, motion } from 'framer-motion'
import {toast, Toaster} from 'react-hot-toast'
import classNames from 'classnames';
import FormShareFile from '../forms/formShareFile'
import api from '../../api'; 


export default function ModalShareFile(props) {

  const processUpdateFile = async (values) => {
      try {
          const response = await api.put(`/files/${props.fileUpdate.id}`, 
          { name: values.name }, {
              headers: {
                  "Authorization": `Bearer ${props.data.accessToken}`
              },
          });
  
          console.log(response.data.data)
        } catch (err) {
          console.error("Error fetching files:", err);
        }
    };

    const handleUpdateFile = async (values) => {
      try{
  
          toast.promise(
            async () => {
              await processUpdateFile(values)
            },
            {
              loading: 'Updating file name to Instashare...',
              success: 'File updated succesfully.',
              error: 'Error updating file to Instashare.',
            }
          );
          
      } catch (error) {
          console.log(error)
      }
    }
  

  const processRequest = async (values) => {

    const formData = new FormData();
    formData.append("file", values.file); // File blob
    formData.append("name", values.name); // File name

    const response = await api.post(`/files/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${props.data?.accessToken}`
      }
    });
    if(response.status === 200){
      console.log(response.data.data);
    }
  }

  const handleUploadFile = async (values) => {
    try{

        toast.promise(
          async () => {
            await processRequest(values)
          },
          {
            loading: 'uploading file to Instashare...',
            success: 'File uploaded succesfully.',
            error: 'Error uploading file to Instashare.',
          }
        );
        
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <AnimatePresence>
      {props.isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            id="staticModal"
            tabIndex={-1}
            aria-hidden="true"
            className="fixed left-0 right-0 top-0 z-50 mx-auto flex w-[700px] items-center overflow-y-auto overflow-x-hidden p-4 md:inset-0"
          >
            <div className="max-w-7xlxl relative mx-auto max-h-full w-[700px]">
              <div className="relative bg-white  shadow dark:bg-gray-700">
                <div className="flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {props.title}
                  </h3>
                  <button
                    id="modal-close-btn"
                    type="button"
                    onClick={() => props.onClose()}
                    className="ml-auto inline-flex h-8 w-8  items-center justify-center bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <svg
                      className="h-3 w-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>

                <div className={classNames('space-y-6 overflow-y-auto p-6',props.fileUpdate ? 'h-[330px]' : 'h-auto')}>
                  <FormShareFile 
                    item={props.fileUpdate || null} 
                    onSubmit={(values) => props.fileUpdate ? handleUpdateFile(values) : handleUploadFile(values)}
                  />

                </div>
              </div>
            </div>
          </div>
          <div
            modal-backdrop=""
            className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 dark:bg-opacity-80"
          ></div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}