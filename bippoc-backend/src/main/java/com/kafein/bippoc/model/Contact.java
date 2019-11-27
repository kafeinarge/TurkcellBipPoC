package com.kafein.bippoc.model;


import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Data
public class Contact implements Serializable {

    private static final long serialVersionUID = -4675115590870578988L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToOne
    private User user;

    @CreationTimestamp
    private LocalDateTime added;

}
