package com.kafein.bippoc.controller;

import com.kafein.bippoc.model.User;
import com.kafein.bippoc.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("api/user")
public class UserController extends BaseController {

    @Autowired
    private UserService userService;

    /* - - - - - - - PUBLIC - - - - - - - */

    // legacy user - supports only plain text messaging
    @PostMapping("/register")
    public void register(@RequestBody User user) {
        userService.registerUser(user);
    }

    // v2 is the type of user with e2e encryption
    @PostMapping("/registerV2")
    public void registerV2(@RequestBody User user) {
        userService.registerUserV2(user);
    }

    @GetMapping("/verify/{token}")
    public String verify(@PathVariable String token) {
        if (userService.verifyToken(token)) {
            return "Success";
        } else {
            return "Fail";
        }
    }

    /* - - - - - - - SECURED - - - - - - - */
    @GetMapping("/updateLastSeen")
    public void updateLastSeen() {
        userService.updateLastSeen(authUsername());
    }
}
