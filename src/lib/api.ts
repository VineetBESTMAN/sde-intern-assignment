// Remove the hardcoded API_URL since we're using proxy
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
}

export async function getContacts(): Promise<Contact[]> {
  const response = await fetch('/api/contacts');
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch contacts');
  }
  return response.json();
}

export async function createContact(contact: Omit<Contact, 'id'>): Promise<Contact> {
  const response = await fetch('/api/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contact),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create contact');
  }
  return response.json();
}

export async function updateContact(id: string, contact: Omit<Contact, 'id'>): Promise<Contact> {
  const response = await fetch(`/api/contacts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contact),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update contact');
  }
  return response.json();
}

export async function deleteContact(id: string): Promise<void> {
  const response = await fetch(`/api/contacts/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete contact');
  }
}