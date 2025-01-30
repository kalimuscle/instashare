import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import classNames from 'classnames';
import FileUpload from '../upload/fileupload'
import {fileSizeFormattedString} from '../../utils/format';

 const initialValues = {
    name: '',
    file: null,
  }

const FormShareFile = (props) => {

  const ShareFileSchema = Yup.object().shape({
    name: Yup.string()
               .trim()
               .min(4, 'Demasiado corto!')
               .max(120, 'Demasiado largo!')
               .required('Requerido'),
   file: props.item ? Yup.mixed().optional(): 
              Yup.mixed()
               .required("A file is required")
               .test(
                 "fileSize",
                 "File size is too large (max 2MB)",
                 (value) => !value || (value && value.size <= 2 * 1024 * 1024) // 2MB
               )
               // .test(
               //   "fileType",
               //   "Unsupported file format",
               //   (value) =>
               //     !value ||
               //     (value && ["image/jpeg", "image/png", "application/pdf"].includes(value.type)) // Allowed types
               // ),
});

    const handleOnSubmit = async (
        values,
        formikHelpers,
      ) => {
        submitEnquiryForm({ ...values })
    
        //formikHelpers.resetForm()
      }
    
      const submitEnquiryForm = async (values) => {
        try {
          if (typeof props.onSubmit === 'function') {
            await props.onSubmit(values)
          }
        } catch (e) {
        }
      }

  return (
    <Formik
        initialValues={props.item ? {name: props.item.filename, file: props.item.data } : initialValues}
        validationSchema={ShareFileSchema}
        validateOnBlur={true}
        onSubmit={handleOnSubmit}
      >
        {({
          errors,
          touched,
          isSubmitting,
          isValid,
          values,
        }) => (
            <Form>
                <div className="mb-3">
                    <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-700"
                    >
                        File name
                    </label>
                    <div className="mt-1">
                         <Field
                            name="name"
                            className={classNames(
                            'block w-full rounded-lg border p-2.5 text-sm',
                            errors.name && touched.name
                                ? 'border-red-400 bg-red-100 text-red-800 focus:border-red-400 focus:ring-red-400 dark:border-red-600 dark:bg-red-700 dark:text-red-400 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
                                : 'block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900  focus:border-blue-500 focus:ring-blue-500 focus-visible:border-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                            )}
                        />
                        <ErrorMessage
                            name="name"
                            component="div"
                            className="mt-1 text-sm text-red-600 dark:text-red-500"
                        />
                    </div>
                </div>
                {
                  props.item ? (
                    <div className="mb-3">
                      <h4
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Mime type
                      </h4>
                      <div className="">
                        <p className="block w-full p-2.5 text-sm">
                          {props.item.mimetype}
                        </p>
                      </div>

                      <h4
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Size
                      </h4>
                      <div className="">
                        <p className="block w-full p-2.5 text-sm">
                          {fileSizeFormattedString(props.item.size)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-3">
                      <Field name="file">
                        {
                          (
                            {
                              field,
                              value,
                              form: { touched, errors, setFieldValue }, 
                              meta,
                            }
                          ) => (
                            <FileUpload 
                              onChange={(files) => setFieldValue(field.name, files[0])}
                              classNameContainer={
                                classNames(
                                  'flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg',
                                  errors.file && touched.file
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-green-500 bg-green-50',
                                )
                              }

                              classNameText={
                                classNames(
                                  'font-semibold',
                                  errors.file && touched.file
                                    ? 'text-red-600 '
                                    : 'text-green-600 ',
                                )
                              }

                              classNameButton={
                                classNames(
                                  'mt-4 px-4 py-2 text-white rounded ',
                                  errors.file && touched.file
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-green-500 hover:bg-green-600',
                                )
                              }
                            />               
                          )
                        }
                      </Field>
                      <ErrorMessage
                        name="file"
                        component="div"
                        className="my-1 mb-3 text-sm text-red-600 dark:text-red-500"
                      />
                  </div>
                  )
                }

                <div className="mt-3">
                    <button
                        type="submit"
                        className="max-w-xs text-center  rounded-md border border-transparent bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                       {props.item ? 'Update file name' : 'Share file'}
                    </button>
                </div>
            </Form>
        )}
      </Formik>
  );
};

export default FormShareFile;
