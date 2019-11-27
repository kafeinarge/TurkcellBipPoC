package com.kafein.bippoc.service;

import com.kafein.bippoc.model.Contact;
import com.kafein.bippoc.model.Message;
import com.kafein.bippoc.model.User;
import com.kafein.bippoc.repository.MessageRepository;
import com.kafein.bippoc.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class MessageService {

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private MessageRepository messageRepo;


    private boolean existingContact(User user, User contactUser) {
        for (Contact contact : user.getContacts()) {
            if (contact.getUser().getId() == contactUser.getId()) {
                return true;
            }
        }
        return false;
    }

    public List<Message> thread(String username, String contactUsername) {
        List<Message> messageList = messageRepo.findAllBySender_UsernameAndReceiver_UsernameOrSender_UsernameAndReceiver_UsernameOrderByCreated(username, contactUsername, contactUsername, username);
        for (Message message : messageList) {
            message.getSender().setContacts(null);
            message.getReceiver().setContacts(null);
        }
        return messageList;
    }

    public long send(String username, Message message) {
        User user = userRepo.findByUsername(username);
        message.setSender(user);

        User receiver = message.getReceiver();
        if (receiver == null || !existingContact(user, receiver)) {
            return 0; // no such receiver or contact
        }
        return messageRepo.save(message).getId();
    }

    public void markSeen(String authUsername, long messageId) {
        Optional<Message> messageOptional = messageRepo.findById(messageId);

        if (messageOptional.isPresent()) {
            Message message = messageOptional.get();
            User user = userRepo.findByUsername(authUsername);

            if (message.getReceiver().equals(user)) {
                message.setSeen(true);
                messageRepo.save(message);
            }
        }
    }
}
