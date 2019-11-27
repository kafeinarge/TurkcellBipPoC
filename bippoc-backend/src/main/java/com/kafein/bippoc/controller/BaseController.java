package com.kafein.bippoc.controller;

import org.springframework.security.core.context.SecurityContextHolder;

public abstract class BaseController {

    String authUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
