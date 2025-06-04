package net.haji.ebankbackend.dtos;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter @Setter @SuperBuilder
@ToString @AllArgsConstructor
@NoArgsConstructor
public class CurrentBankAccountDTO extends BankAccountDTO {
    private double overDraft;
}
