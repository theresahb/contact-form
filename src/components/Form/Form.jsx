import { nanoid } from 'nanoid'
import React, { useState, useEffect } from 'react'
import './form.css'
import Header from '../Header/Header';
import Loader from '../Loader/Loader';

const INITIAL_STATE = { name: '', email: '', subject: '', message: '' }

const VALIDATION = {
    name: [
        {
            isValid: (value) => !!value,
            display: 'Name is required!',
        },
    ],

    email: [
        {
            isValid: (value) => !!value,
            display: 'Email is required!',
        },
        {
            isValid: (value) => /\S+@\S+\.\S+/.test(value),
            display: 'Needs to be an email!',
        },
    ],

    message: [
        {
            isValid: (value) => !!value,
            display: 'Message is required!',
        },
    ],
};


const getErrorFields = (form) =>
Object.keys(form).reduce((acc, key) => {
    if (!VALIDATION[key]) return acc;

    const errorsPerField = VALIDATION[key]
        .map((validation) => ({
            isValid: validation.isValid(form[key]),
            display: validation.display,
        }))
        .filter((errorPerField) => !errorPerField.isValid);

    return { ...acc, [key]: errorsPerField };
}, {});


const Form = () => {
    const [form, setForm] = useState(INITIAL_STATE);
    const [errorFields, setErrorFields] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setErrorFields(getErrorFields(form));
    }, [form]);

    const handleChange = (event) => {
        setSuccessMessage('');
        setErrorMessage('');

        const { id, value } = event.target;

        if (id === 'name' || id === 'email' || id === 'subject' || id === 'message') {
            setForm(prevState => ({
                ...prevState,
                [id]: value
            }));
        }
        
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const hasErrors = Object.values(errorFields).flat().length > 0;
        if (hasErrors) return;

        let id = nanoid()
        const userData = {
            "id": id,
            "name": form.name,
            "email": form.email,
            "subject": form.subject,
            "message": form.message,
        };

        setIsLoading(true);

        fetch('https://my-json-server.typicode.com/tundeojediran/contacts-api-server/inquiries', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("We're sorry, but your submission was not successful.");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            const success = 'Your entry has been received.';
            setSuccessMessage(`${success}`);
            setForm(INITIAL_STATE);
        })
        .catch((error) => {
            console.error(error);
            setErrorMessage(error.message);
        })
        
        .finally(() => {
            setIsLoading(false);
        });
    }


  return ( 
    <div className="form-container">
        <Header errorMessage={errorMessage} successMessage={successMessage} />

        <form action="post" className='form' onSubmit={handleSubmit}>
            <div className="input">
                <label htmlFor="name">Name</label>
                <input type="text" name="name" id="name" value={form.name} onChange={handleChange} />
                {errorFields.name?.length ? (
                    <span>
                        {errorFields.name[0].display}
                    </span>
                ) : null}
            </div>

            <div className="input">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" value={form.email} onChange={handleChange} />
                {errorFields.email?.length ? (
                    <span>
                        {errorFields.email[0].display}
                    </span>
                ) : null}
            </div>

            <div className="input">
                <label htmlFor="subject">Subject</label>
                <input type="text" name="subject" id="subject" value={form.subject} onChange={handleChange} />
            </div>

            <div className="input">
                <label htmlFor="message">Message</label>
                <textarea name="message" id="message" cols={30} rows={5} value={form.message} onChange={handleChange} />
                {errorFields.message?.length ? (
                    <span>
                        {errorFields.message[0].display}
                    </span>
                ) : null}
            </div>
            
            <button type="submit" disabled={isLoading} >{isLoading ? <Loader /> : "Submit"}</button>
        </form>
    </div>
  )
}

export default Form