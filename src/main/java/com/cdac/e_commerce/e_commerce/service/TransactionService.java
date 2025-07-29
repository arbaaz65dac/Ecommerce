package com.cdac.e_commerce.e_commerce.service;


import com.cdac.e_commerce.e_commerce.ModelDto.TransactionDto;
import java.util.List;

public interface TransactionService {
    TransactionDto createTransaction(TransactionDto dto);
    List<TransactionDto> getAllTransactions();
    TransactionDto getTransactionById(Integer id);
    TransactionDto updateTransaction(Integer id, TransactionDto dto);
    void deleteTransaction(Integer id);
}

