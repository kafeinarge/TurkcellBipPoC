package com.kafein.bippoc.controller;

import com.kafein.bippoc.model.Contact;
import com.kafein.bippoc.service.ContactService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@Slf4j
@RestController
@RequestMapping("api/contact")
public class ContactController extends BaseController {

    @Autowired
    private ContactService contactService;

    @GetMapping("/add/{username}")
    public long add(@PathVariable String username) {
        return contactService.addContact(authUsername(), username);
    }

    @GetMapping("/delete/{username}")
    public long delete(@PathVariable String username) {
        return contactService.removeContact(authUsername(), username);
    }

    @GetMapping
    public Set<Contact> list() {
        return contactService.listContacts(authUsername());
    }
}
