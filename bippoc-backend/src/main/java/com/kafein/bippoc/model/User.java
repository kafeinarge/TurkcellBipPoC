package com.kafein.bippoc.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Data
public class User implements Serializable {

    private static final long serialVersionUID = 8294387753922329375L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String username;
    private String name;

    @CreationTimestamp
    private LocalDateTime created;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime lastSeen;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotNull
    @Size(min = 60, max = 60)
    @Column(length = 60, nullable = false)
    private String password;
    @JsonIgnore
    private String token;
    @JsonIgnore
    private boolean verified;       // for email verification

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private boolean legacy;         // true if user is still using old version (no encryption - just plain text messaging)

    private String publicKey;       // server will store public key of the user to share with other party

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @OneToMany
    private Set<Contact> contacts;
}
