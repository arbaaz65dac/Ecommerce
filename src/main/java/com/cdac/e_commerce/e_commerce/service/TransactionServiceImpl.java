package com.cdac.e_commerce.e_commerce.service;

import com.cdac.e_commerce.e_commerce.ModelDto.TransactionDto;
import com.cdac.e_commerce.e_commerce.model.Transaction;
import com.cdac.e_commerce.e_commerce.model.User;
import com.cdac.e_commerce.e_commerce.repository.TransactionRepository;
import com.cdac.e_commerce.e_commerce.repository.UserRepository;
import com.cdac.e_commerce.e_commerce.exception.TransactionNotFoundException; 
import com.cdac.e_commerce.e_commerce.exception.UserNotFoundException; 

import org.springframework.beans.BeanUtils; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository; 
    private final UserRepository userRepository; 

    @Autowired 
    public TransactionServiceImpl(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    private TransactionDto convertToDto(Transaction transaction) {
        if (transaction == null) {
            return null;
        }
        TransactionDto dto = new TransactionDto();
        BeanUtils.copyProperties(transaction, dto); 
        if (transaction.getUser() != null) {
            dto.setUserId(transaction.getUser().getId()); 
        }
        return dto;
    }

    private Transaction convertToEntity(TransactionDto dto) {
        if (dto == null) {
            return null;
        }
        Transaction transaction = new Transaction();
        BeanUtils.copyProperties(dto, transaction, "userId");
        return transaction;
    }

    @Override
    public TransactionDto createTransaction(TransactionDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User with ID " + dto.getUserId() + " not found."));

        Transaction transaction = convertToEntity(dto);
        transaction.setUser(user); 

        Transaction saved = transactionRepository.save(transaction);
        return convertToDto(saved); 
    }

    @Override
    public List<TransactionDto> getAllTransactions() {
        return transactionRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public TransactionDto getTransactionById(Integer id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new TransactionNotFoundException("Transaction with ID " + id + " not found."));
        return convertToDto(transaction); 
    }

    @Override
    public TransactionDto updateTransaction(Integer id, TransactionDto dto) {
        Transaction existingTransaction = transactionRepository.findById(id)
                .orElseThrow(() -> new TransactionNotFoundException("Transaction with ID " + id + " not found for update."));

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User with ID " + dto.getUserId() + " not found for transaction update."));

        BeanUtils.copyProperties(dto, existingTransaction, "id", "userId");

        existingTransaction.setUser(user);

        Transaction updated = transactionRepository.save(existingTransaction);
        return convertToDto(updated); 
    }

    @Override
    public void deleteTransaction(Integer id) {
        if (!transactionRepository.existsById(id)) {
            throw new TransactionNotFoundException("Transaction with ID " + id + " not found for deletion.");
        }
        transactionRepository.deleteById(id);
    }
}