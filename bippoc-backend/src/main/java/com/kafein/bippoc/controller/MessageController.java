package com.kafein.bippoc.controller;

import com.kafein.bippoc.model.Message;
import com.kafein.bippoc.service.MessageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping(value = "api/message")
public class MessageController extends BaseController {

    @Autowired
    private MessageService messageService;

    @PostMapping("/send")
    public void send(@RequestBody Message message) {
        messageService.send(authUsername(), message);
    }

    @GetMapping("/thread/{contactUsername}")
    public List<Message> thread(@PathVariable String contactUsername) {
        return messageService.thread(authUsername(), contactUsername);
    }

    @GetMapping("/markSeen/{messageId}")
    public void markSeen(@PathVariable long messageId) {
        messageService.markSeen(authUsername(), messageId);
    }

}
