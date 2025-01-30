import React, { useEffect, useState, createRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaFileAlt } from 'react-icons/fa';

export default function FileUpload(props) {
  const dropzoneRef = createRef();
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    // accept: {
    //   'image/*': [],
    // },
    maxFiles:1,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );

      props.onChange(
        acceptedFiles.map(
          (file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            }
          )
        )
      )
    },
  });

  const openDialog = () => {
    if (dropzoneRef.current) {
      dropzoneRef.current.open();
    }
  };

  const thumbs = files.map((file) => (
    <div
      key={file.name}
      className="grid grid-cols-12 border border-gray-300 rounded-md w-full h-24 m-2 p-1"
    >
      <div className="col-span-3 flex items-center justify-center">
        {file.type.startsWith('image/') ? (
          <img
            src={file.preview}
            alt={file.name}
            className="w-auto h-16"
            onLoad={() => {
              URL.revokeObjectURL(file.preview);
            }}
          />
        ) : (
          <FaFileAlt className="w-auto h-16" />
        )}
      </div>
      <div className="col-span-9 mx-2 flex flex-col justify-center text-xs">
        <p>{file.name}</p>
        <p>{file.type}</p>
        <p>{(file.size / 1024).toFixed(2)} KB</p>
      </div>
    </div>
  ));

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section className="container mx-auto mt-8">
      <div
        {...getRootProps({ className: 'dropzone' })}
        className={props.classNameContainer}
      >
        <input {...getInputProps()} />
        <p className={props.classNameText}>
          Drag 'n' drop some files here, or click to select files
        </p>
        <button
          type="button"
          className={props.classNameButton}
          onClick={openDialog}
        >
          Open File Dialog
        </button>

        {/* Thumbnails displayed within the dropzone */}
        <aside className="flex flex-wrap justify-center mt-4">
          {thumbs}
        </aside>
      </div>
    </section>
  );
}
