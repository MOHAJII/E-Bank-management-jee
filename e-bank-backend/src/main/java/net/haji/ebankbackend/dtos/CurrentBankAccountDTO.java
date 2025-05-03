package net.haji.ebankbackend.dtos;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Date;

@Getter @Setter @SuperBuilder
@ToString @AllArgsConstructor
@NoArgsConstructor
public class CurrentBankAccountDTO extends BankAccountDTO{
    private String id;
    private double balance;
    private Date createdAt;
    private CustomerDTO customerDTO;
    private double overDraft;
}