package com.cdac.e_commerce.e_commerce.controller;

import com.cdac.e_commerce.e_commerce.ModelDto.TransactionDto;
import com.cdac.e_commerce.e_commerce.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; // For ResponseEntity
import org.springframework.http.ResponseEntity; // For explicit HTTP status
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid; // Keep for DTO validation

import java.util.List;

@RestController
@RequestMapping("/tricto/transactions")
public class TransactionController {

    private final TransactionService transactionService; // Use final with constructor injection

    @Autowired // Constructor injection is preferred
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<TransactionDto> createTransaction(@RequestBody @Valid TransactionDto dto) {
        // Service now directly takes and returns TransactionDto
        TransactionDto createdTransactionDto = transactionService.createTransaction(dto);
        return new ResponseEntity<>(createdTransactionDto, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TransactionDto>> getAll() {
        // Service now directly returns List<TransactionDto>
        List<TransactionDto> transactionDtos = transactionService.getAllTransactions();
        return new ResponseEntity<>(transactionDtos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionDto> getById(@PathVariable Integer id) {
        // Service now returns TransactionDto or throws TransactionNotFoundException
        TransactionDto transactionDto = transactionService.getTransactionById(id);
        return new ResponseEntity<>(transactionDto, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionDto> updateTransaction(@PathVariable Integer id, @RequestBody @Valid TransactionDto dto) {
        // Service now directly takes and returns TransactionDto
        TransactionDto updatedTransactionDto = transactionService.updateTransaction(id, dto);
        return new ResponseEntity<>(updatedTransactionDto, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        // Service now deletes or throws TransactionNotFoundException
        transactionService.deleteTransaction(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content for successful deletion
    }
}