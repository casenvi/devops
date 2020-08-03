import { LocaleObject, setLocale } from 'yup';
const ptBR: LocaleObject = {
  mixed: {
    // eslint-disable-next-line
    required: '${path} é requerido!',
    notType: '${path} é inválido!'
  },
  string: {
    // eslint-disable-next-line
    max: '${path} precisa ter no máximo ${max} caracteres'
  },
  number: {
    // eslint-disable-next-line
    min: '${path} precisa ter no minimo ${max}'
  }
}

setLocale(ptBR);

export * from 'yup';