package net.haji.ebankbackend.dtos;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter @Setter @SuperBuilder
@ToString @AllArgsConstructor
@NoArgsConstructor
public class BankAccountDTO {
    private String type;
}
