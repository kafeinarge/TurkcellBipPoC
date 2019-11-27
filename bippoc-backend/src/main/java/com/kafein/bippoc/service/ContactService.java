package com.kafein.bippoc.service;

import com.kafein.bippoc.model.Contact;
import com.kafein.bippoc.model.User;
import com.kafein.bippoc.repository.ContactRepository;
import com.kafein.bippoc.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;

@Slf4j
@Service
public class ContactService {

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private ContactRepository contactRepo;

    public long addContact(String username, String contactUsername) {
        User user = userRepo.findByUsername(username);

        Contact existingContact = existingContact(user, contactUsername);
        if (existingContact != null) {
            // contact already exists
            return existingContact.getUser().getId();
        }

        User contactUser = userRepo.findByUsername(contactUsername);
        if (contactUser != null) {
            Contact contact = new Contact();
            contact.setUser(contactUser);
            contact = contactRepo.save(contact);

            user.getContacts().add(contact);
            userRepo.save(user);
            return contactUser.getId();
        } else {
            // no such user
            return 0;
        }
    }

    private Contact existingContact(User user, String contactUsername) {
        Contact existing = null;
        for (Contact contact : user.getContacts()) {
            if (contact.getUser().getUsername().equals(contactUsername)) {
                existing = contact;
                break;
            }
        }
        return existing;
    }

    public long removeContact(String username, String contactUsername) {
        User user = userRepo.findByUsername(username);

        Contact toBeRemoved = existingContact(user, contactUsername);
        if (toBeRemoved != null) {
            user.getContacts().remove(toBeRemoved);
            userRepo.save(user);
            contactRepo.delete(toBeRemoved);
            return toBeRemoved.getUser().getId();
        } else {
            return 0;
        }
    }

    public Set<Contact> listContacts(String username) {
        Set<Contact> contactList = userRepo.findByUsername(username).getContacts();
        for (Contact contact : contactList) {
            contact.getUser().setContacts(null);
        }
        return contactList;
    }
}
