/* eslint-disable no-template-curly-in-string */
import { LocaleObject, setLocale } from 'yup';
const ptBR: LocaleObject = {
  mixed: {
    required: '${path} é requerido!',
    notType: '${path} é inválido!'
  },
  string: {
     max: '${path} precisa ter no máximo ${max} caracteres'
  },
  number: {
    min: '${path} precisa ter no minimo ${max}'
  }
}

setLocale(ptBR);

export * from 'yup';