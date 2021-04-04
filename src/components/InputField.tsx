import React, { InputHTMLAttributes } from 'react'
import { useField } from "formik";
import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from "@chakra-ui/react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    name: string;
    textarea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = ({label, textarea, size: _, ...props}) => {
    const [field, {error}] = useField(props);
    let InputOrTextarea = textarea ? Textarea : Input;
    return (    
        <FormControl isInvalid={!!error}>
            <FormLabel color="snowStorm.0" htmlFor={field.name}>{label}</FormLabel>
            <InputOrTextarea color="snowStorm.0" {...field} {...props} id={field.name} />
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    );
}