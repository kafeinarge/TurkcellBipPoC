package com.kafein.bippoc.model;


import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Data
public class Message implements Serializable {

    private static final long serialVersionUID = 6247664777705119128L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(length = 1000)
    private String message;

    @ManyToOne
    private User sender;
    @ManyToOne
    private User receiver;

    private boolean seen;
    private boolean encrypted;      // e2e encrypted or plain text

    @CreationTimestamp
    private LocalDateTime created;
}
