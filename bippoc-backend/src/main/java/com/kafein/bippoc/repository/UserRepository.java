package com.kafein.bippoc.repository;

import com.kafein.bippoc.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findById(String id);

    User findByUsername(String username);

    User findByToken(String token);

}
