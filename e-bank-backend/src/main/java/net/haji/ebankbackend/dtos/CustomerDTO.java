package net.haji.ebankbackend.dtos;

import lombok.*;

@Getter @Setter @Builder @ToString @AllArgsConstructor @NoArgsConstructor
public class CustomerDTO {
    private Long id;
    private String name;
    private String email;
}
