package com.kafein.bippoc.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;

@Service
@Slf4j
public class FcmService {

    @Value("${fcmFilePath}")
    private String fcmFilePath;
    @Value("${fcmServerName}")
    private String fcmServerName;


    @PostConstruct
    private void initialize() throws IOException {
        log.debug("Initializing firebase...");

        InputStream serviceAccount = getClass().getClassLoader().getResourceAsStream(fcmFilePath);
        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setDatabaseUrl(fcmServerName)
                .build();
        FirebaseApp.initializeApp(options);

        log.debug("Firebase initialized successfully");
    }

}
