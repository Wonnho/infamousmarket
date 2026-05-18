package com.infamousmarket.controller;

import com.infamousmarket.service.AuthService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/vi/auth")
public class AuthController {

    private AuthService authService;

}
