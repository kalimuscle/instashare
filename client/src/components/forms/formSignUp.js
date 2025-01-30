import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import classNames from 'classnames';

const SignUpSchema = Yup.object().shape({
    email: Yup.string().email().required("Email is required"),
  
    username: Yup.string()
            .trim()
            .min(8, 'Too short!')
            .max(20, 'Too long!')
            .required('User name required'),
    password: Yup.string()
        .required('Please enter a password')
        // check minimum characters
        .min(8, 'Password must have at least 8 characters')
        // different error messages for different requirements
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
        .matches(/\d/, 'Password must contain at least one number.')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character.'),
    confirmPassword: Yup.string().test(
        'passwords-match',
        'Not the same as password',
        function (value) {
            return this.parent.password === value
        },
    ),
 });

 const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  }

const FormSignUp = (props) => {
    const [email, setEmail] = useState("");

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
        initialValues={initialValues}
        validationSchema={SignUpSchema}
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
                        htmlFor="username"
                        className="block mb-2 text-sm font-medium text-gray-700"
                    >
                        Username
                    </label>
                    <div className="mt-1">
                        <Field
                            name="username"
                            placeholder="Type username"
                            className={classNames(
                            'block w-full rounded-lg border p-2.5 text-sm',
                            errors.username && touched.username
                                ? 'border-red-400 bg-red-100 text-red-800 focus:border-red-400 focus:ring-red-400 dark:border-red-600 dark:bg-red-700 dark:text-red-400 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
                                : 'block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900  focus:border-blue-500 focus:ring-blue-500 focus-visible:border-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                            )}
                        />
                        <ErrorMessage
                            name="username"
                            component="div"
                            className="mt-1 text-sm text-red-600 dark:text-red-500"
                        />
                    </div>
                </div>
                <div className="mb-3">
                    <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-700"
                    >
                        Email address
                    </label>
                    <div className="mt-1">
                         <Field
                            name="email"
                            placeholder="Type email address"
                            className={classNames(
                            'block w-full rounded-lg border p-2.5 text-sm',
                            errors.email && touched.email
                                ? 'border-red-400 bg-red-100 text-red-800 focus:border-red-400 focus:ring-red-400 dark:border-red-600 dark:bg-red-700 dark:text-red-400 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
                                : 'block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900  focus:border-blue-500 focus:ring-blue-500 focus-visible:border-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                            )}
                        />
                        <ErrorMessage
                            name="email"
                            component="div"
                            className="mt-1 text-sm text-red-600 dark:text-red-500"
                        />
                    </div>
                </div>
                <div className="mb-3">
                    <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>
                    <div className="mt-1">
                        <Field name="password">
                        {({
                            field, // { name, value, onChange, onBlur }
                            value,
                            form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                            meta,
                        }) => (
                            <input
                            {...field}
                            type="password"
                            value={values['password']}
                            placeholder="Type password"
                            onChange={(evt) =>
                                setFieldValue(field.name, evt.target.value)
                            }
                            className={classNames(
                                'block w-full rounded-lg border p-2.5 text-sm',
                                errors.password && touched.password
                                ? 'border-red-400 bg-red-100 text-red-800 focus:border-red-400 focus:ring-red-400 dark:border-red-600 dark:bg-red-700 dark:text-red-400 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
                                : 'border-gray-300 bg-white text-gray-900 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                            )}
                            />
                        )}
                        </Field>
                        <ErrorMessage
                            name="password"
                            component="div"
                            className="my-1 text-sm text-red-600 dark:text-red-500"
                        />
                    </div>
                </div>
                <div className="mb-3">
                    <label
                        htmlFor="confirmPassword"
                        className="block mb-2 text-sm font-medium text-gray-700"
                    >
                        Confirm password
                    </label>
                    <div className="mt-1">
                        <Field name="confirmPassword">
                        {({
                            field, // { name, value, onChange, onBlur }
                            value,
                            form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                            meta,
                        }) => (
                            <input
                            {...field}
                            type="password"
                            value={values['confirmPassword']}
                            placeholder="Type password to confirm"
                            onChange={(evt) =>
                                setFieldValue(field.name, evt.target.value)
                            }
                            className={classNames(
                                'block w-full rounded-lg border p-2.5 text-sm',
                                errors.confirmPassword && touched.confirmPassword
                                ? 'border-red-400 bg-red-100 text-red-800 focus:border-red-400 focus:ring-red-400 dark:border-red-600 dark:bg-red-700 dark:text-red-400 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
                                : 'border-gray-300 bg-white text-gray-900 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                            )}
                            />
                        )}
                        </Field>
                        <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            className="my-1 text-sm text-red-600 dark:text-red-500"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full max-w-xs text-center  rounded-md border border-transparent bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Create account now
                    </button>
                </div>
            </Form>
        )}
      </Formik>
  );
};

export default FormSignUp;
