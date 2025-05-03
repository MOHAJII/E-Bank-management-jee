package net.haji.ebankbackend.dtos;

import lombok.*;
import net.haji.ebankbackend.enums.AccountStatus;

import java.util.Date;

@Getter
@Setter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class SavingBankAccountDTO {
    private String id;
    private double balance;
    private Date createdAt;
    private AccountStatus status;
    private CustomerDTO customerDTO;
    private double interestRate;
}
