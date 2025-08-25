package com.strive.app.controllers;


import com.strive.app.domain.dto.ErrorResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;


@RestController
@ControllerAdvice
@Slf4j
public class ErrorController {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDto> handleGenericException(Exception exception) {
        log.error("Caught an exception:", exception);
        ErrorResponseDto errorResponseDto = ErrorResponseDto.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message("Unexpected Error Occurred")
                .build();
        return new ResponseEntity<>(errorResponseDto, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponseDto> handleBadCredentialsException(BadCredentialsException exception){
        log.error("Caught an exception:", exception);
        ErrorResponseDto errorResponseDto = ErrorResponseDto.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message("incorrect email or password")
                .build();
        return new ResponseEntity<>(errorResponseDto, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleUsernameNotFoundException(UsernameNotFoundException exception){
        log.error("Caught an exception:", exception);

        ErrorResponseDto errorResponseDto = ErrorResponseDto.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message("No user found with that email")
                .build();
        return new ResponseEntity<>(errorResponseDto, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponseDto> handleRequestBodyNotReadable(HttpMessageNotReadableException exception){
        log.error("Caught an exception:", exception);

        ErrorResponseDto errorResponseDto = ErrorResponseDto.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message("Request body is not readable")
                .build();
        return new ResponseEntity<>(errorResponseDto, HttpStatus.BAD_REQUEST);
    }
}
