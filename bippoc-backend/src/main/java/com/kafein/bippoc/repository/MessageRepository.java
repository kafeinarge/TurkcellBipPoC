package com.kafein.bippoc.repository;

import com.kafein.bippoc.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findAllBySender_UsernameAndReceiver_UsernameOrSender_UsernameAndReceiver_UsernameOrderByCreated(String sender, String receiver, String senderOther, String receiverOther);

}
