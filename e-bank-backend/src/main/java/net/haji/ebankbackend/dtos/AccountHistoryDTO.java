package net.haji.ebankbackend.dtos;

import lombok.*;

import java.util.List;

@Getter @Setter @Builder @ToString @AllArgsConstructor
@NoArgsConstructor
public class AccountHistoryDTO {
    private String accountId;
    private double balance;
    private int currentPage;
    private int totalPages;
    private int pageSize;
    private List<AccountOperationDTO> accountOperationDTOs;
}