import { useState } from 'react';
import { useAppDispatch, useAppSelector } from './hooks/useRedux';
import {
  useAddContactMutation,
  useContactQuery,
  useContactsQuery,
  useDeleteContactMutation,
  useUpdateContactMutation,
} from './service/contactsApi';
import { decrement, increment, incrementByValue } from './service/counterSlice';

export function App() {
  const dispatch = useAppDispatch();
  const { value } = useAppSelector(state => state.counter);
  const {
    data: contacts,
    isLoading,
    error,
    isFetching,
    isSuccess,
  } = useContactsQuery();

  const [valueToAdd, setValueToAdd] = useState(0);

  return (
    <div className="main">
      <div>
        <h1>Counter</h1>
        <button onClick={() => dispatch(increment())}>+</button>
        <span>{value}</span>
        <button onClick={() => dispatch(decrement())}>-</button>
        <input
          type="number"
          value={valueToAdd}
          onChange={event => setValueToAdd(event.target.valueAsNumber)}
        />
        <button
          onClick={() => {
            dispatch(incrementByValue(valueToAdd));
            setValueToAdd(0);
          }}
        >
          Add {valueToAdd}
        </button>
      </div>

      <h1>Hello RTK Query Tutorial</h1>
      <AddContact />
      {isLoading && <h2>Loading....</h2>}
      {isFetching && <h2>Fetching...</h2>}
      {error && <h2>Error....</h2>}
      {isSuccess && (
        <div>
          {contacts?.map(contact => (
            <div className="data" key={contact.id}>
              <span>{contact.name}</span>
              <br />
              <span>
                <ContactDetail id={contact.id} />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ContactDetail({ id }: { id: string }) {
  const { data: contact } = useContactQuery(id);

  return <pre>{JSON.stringify(contact, undefined, 2)}</pre>;
}

export function AddContact() {
  const [addContact] = useAddContactMutation();
  const [updateContact] = useUpdateContactMutation();
  const [deleteContact] = useDeleteContactMutation();
  const contact = {
    id: '7',
    name: 'Test3',
    email: 'test@test.com3',
  };

  const contactUpdated = {
    id: '7',
    name: 'test updated',
    email: 'test@test.comUpdated',
  };

  async function handleAddContact() {
    await addContact(contact);
  }

  async function handleUpdateContact() {
    await updateContact(contactUpdated);
  }

  async function handleDeleteContact() {
    await deleteContact(contact.id);
  }
  return (
    <>
      <button onClick={handleAddContact}>Add contact</button>
      <button onClick={handleUpdateContact}>Update contact</button>
      <button onClick={handleDeleteContact}>Delete contact</button>
    </>
  );
}
