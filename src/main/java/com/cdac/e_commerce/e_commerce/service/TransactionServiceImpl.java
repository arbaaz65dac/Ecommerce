package com.cdac.e_commerce.e_commerce.service;

import com.cdac.e_commerce.e_commerce.ModelDto.TransactionDto;
import com.cdac.e_commerce.e_commerce.model.Transaction;
import com.cdac.e_commerce.e_commerce.model.User;
import com.cdac.e_commerce.e_commerce.repository.TransactionRepository;
import com.cdac.e_commerce.e_commerce.repository.UserRepository;
import com.cdac.e_commerce.e_commerce.exception.TransactionNotFoundException; // New exception
import com.cdac.e_commerce.e_commerce.exception.UserNotFoundException; // Existing exception

import org.springframework.beans.BeanUtils; // Import BeanUtils
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository; // Use final with constructor injection
    private final UserRepository userRepository; // Use final with constructor injection

    @Autowired // Constructor injection
    public TransactionServiceImpl(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    // Helper method to convert Entity (Transaction) to DTO (TransactionDto)
    private TransactionDto convertToDto(Transaction transaction) {
        if (transaction == null) {
            return null;
        }
        TransactionDto dto = new TransactionDto();
        BeanUtils.copyProperties(transaction, dto); // Copies id, transactionDate, amount, paymentStatus
        if (transaction.getUser() != null) {
            dto.setUserId(transaction.getUser().getId()); // Manually map user to userId
        }
        return dto;
    }

    // Helper method to convert DTO (TransactionDto) to Entity (Transaction)
    private Transaction convertToEntity(TransactionDto dto) {
        if (dto == null) {
            return null;
        }
        Transaction transaction = new Transaction();
        // Copy scalar fields, exclude 'userId' as it's for the User object
        BeanUtils.copyProperties(dto, transaction, "userId");
        return transaction;
    }

    @Override
    public TransactionDto createTransaction(TransactionDto dto) {
        // Find the user or throw UserNotFoundException
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User with ID " + dto.getUserId() + " not found."));

        // Create a new Transaction entity from DTO
        Transaction transaction = convertToEntity(dto);
        transaction.setUser(user); // Set the associated User entity

        Transaction saved = transactionRepository.save(transaction);
        return convertToDto(saved); // Convert saved entity back to DTO
    }

    @Override
    public List<TransactionDto> getAllTransactions() {
        // Fetch all entities and convert each to DTO using the helper method
        return transactionRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public TransactionDto getTransactionById(Integer id) {
        // Find transaction or throw TransactionNotFoundException
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new TransactionNotFoundException("Transaction with ID " + id + " not found."));
        return convertToDto(transaction); // Convert found entity to DTO
    }

    @Override
    public TransactionDto updateTransaction(Integer id, TransactionDto dto) {
        // Find existing transaction or throw TransactionNotFoundException
        Transaction existingTransaction = transactionRepository.findById(id)
                .orElseThrow(() -> new TransactionNotFoundException("Transaction with ID " + id + " not found for update."));

        // Find the user or throw UserNotFoundException
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User with ID " + dto.getUserId() + " not found for transaction update."));

        // Copy updated scalar properties from DTO to existing entity.
        // Exclude 'id' (as it's from @PathVariable) and 'userId' (as it maps to 'User' object).
        BeanUtils.copyProperties(dto, existingTransaction, "id", "userId");

        // Set the associated User entity explicitly
        existingTransaction.setUser(user);

        Transaction updated = transactionRepository.save(existingTransaction);
        return convertToDto(updated); // Convert updated entity back to DTO
    }

    @Override
    public void deleteTransaction(Integer id) {
        // Check if the transaction exists before deleting, or throw TransactionNotFoundException
        if (!transactionRepository.existsById(id)) {
            throw new TransactionNotFoundException("Transaction with ID " + id + " not found for deletion.");
        }
        transactionRepository.deleteById(id);
    }
}