import axios from 'axios';
import { FormEvent, FormEventHandler } from 'react';
import { MutationFn } from 'react-apollo';

// add each field's values to accumulator by field's name attribute
// accumulator[field name] = field value
const formReducer = (ac: any, field: any): any => {
    if (!field || !field.name) return ac;

    const { type, name } = field;

    if (type === 'checkbox') {
        ac[name] = field.checked;
        return ac;
    }

    ac[name] = field.value;
    return ac;
}

// handle form submit event, reduce form's fields into object of k/v pairs where:
// key = field name attribute, value = field value
const submitForm = (e: any) => {
    e.preventDefault();

    const result = Array.from(e.target.elements)
        .reduce(formReducer, {});

    e.target.reset();
    return result;
}

// exports
// -------------------------------------------------------------------------------------------------

// call mutation function and pass the variables object to it.
// our variables object is the combination of all the variables returned by the form submit call and
// any extra variables we optionally pass.
export const submitFormMutationWithVars =
    (mutation: MutationFn, extraVariables: any): FormEventHandler =>
    (e: FormEvent) =>
{
    if (mutation == null) {
        throw new Error('No mutation provided to submitFormMutationWithVars (or submitFormMutation)');
    }

    const variables: any = {
        ...extraVariables,
        ...submitForm(e),
    };

    mutation({ variables });
}

// call the form submit mutation function without having to specify any extra variables.
export const submitFormMutation = (mutation: MutationFn) =>
    submitFormMutationWithVars(mutation, {});

// special handler for signup as it's a REST request.
export const submitFormSignup = (e: FormEvent) => {
    const variables: any = submitForm(e);
    return axios.post('/auth/register', variables);
}

// special handler for login as it's a REST request.
export const submitFormLogin = (e: FormEvent) => {
    const variables: any = submitForm(e);
    return axios.post('/auth/login', variables);
}
