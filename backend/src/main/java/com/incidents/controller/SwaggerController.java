package com.incidents.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/swagger-ui")
public class SwaggerController {
    
    @GetMapping("")
    public String redirectToSwagger() {
        return "redirect:/swagger-ui/index.html";
    }
}
