package net.haji.ebankbackend.dtos;

import lombok.*;

import java.util.Date;

@Getter @Setter @Builder @ToString @AllArgsConstructor
@NoArgsConstructor
public class CurrentBankAccountDTO {
    private String id;
    private double balance;
    private Date createdAt;
    private CustomerDTO customerDTO;
    private double overDraft;
}