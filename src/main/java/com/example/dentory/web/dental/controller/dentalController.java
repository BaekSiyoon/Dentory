package com.example.dentory.web.dental.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class dentalController {
    //  @ApiOperation(value = "메인", notes = "메인")
    @GetMapping(value = "/test")
    public ResponseEntity<String> test() {
        System.out.println("test");
        return ResponseEntity.ok("API 호출 성공"); 
    }
   
}