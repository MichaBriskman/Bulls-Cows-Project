package hac.javareact.exceptions;

import java.util.Arrays;

public class MissingOperandException extends Exception{


    public MissingOperandException(String... missingOperands) {
        super(String.format("The following mandatory operands are missing or may be missing: %s", Arrays.toString(missingOperands)));
    }
}
