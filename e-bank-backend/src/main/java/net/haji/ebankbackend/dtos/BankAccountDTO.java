package net.haji.ebankbackend.dtos;

import lombok.*;
import lombok.experimental.SuperBuilder;
import net.haji.ebankbackend.enums.AccountStatus;

import java.util.Date;

@Getter @Setter @SuperBuilder
@ToString @AllArgsConstructor
@NoArgsConstructor
public class BankAccountDTO {
    private String id;
    private double balance;
    private Date createdAt;
    private AccountStatus status;
    private CustomerDTO customer;
    private String type;
}
