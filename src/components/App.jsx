import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import ContactForm from './ContactForm/ContactForm';
import { Filter } from './Filter/Filter';
import { ContactList } from './ContactList/ContactList';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useLocalStorage = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    return JSON.parse(window.localStorage.getItem(key)) ?? defaultValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
};

export function App() {
  const [filter, setFilter] = useState('');
  const [contacts, setContacts] = useLocalStorage('contacts', []);

  const formSubmit = data => {
    const contact = {
      id: nanoid(5),
      name: data.name,
      number: data.number,
    };

    const includesContact = contacts.find(c =>
      c.name.toLowerCase().includes(data.name.toLowerCase())
    );

    if (includesContact !== undefined) {
      toast.warn(`${data.name} is already in contacts`);
      return;
    }

    setContacts([contact, ...contacts]);
    toast.success(`${contact.name} contact added`);

    data.propTypes = {
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
    };
  };
  const changeFilter = e => {
    setFilter(e.currentTarget.value);
  };

  const onDeleteContact = data => {
    setContacts(contacts.filter(c => c.id !== data));
    toast.info(
      `Сontact ${contacts.filter(c => c.id === data)[0].name} deleted`
    );
  };

  const normalizeFilter = filter.toLowerCase();
  const visibleContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(normalizeFilter)
  );

  return (
    <div>
      <h1>Phonebook</h1>
      <ContactForm onSubmit={formSubmit} />
      <h2>Contacts</h2>
      <Filter value={filter} onChange={changeFilter} />
      <ContactList data={visibleContacts} onDeleteContact={onDeleteContact} />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
